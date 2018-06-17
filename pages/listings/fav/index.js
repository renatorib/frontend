import url from 'url'
import _ from 'lodash'
import {Component, Fragment} from 'react'
import Head from 'next/head'
import Router from 'next/router'
import {Query} from 'react-apollo'
import {GET_FAVORITE_LISTINGS} from 'graphql/user/queries'

import {treatParams} from 'utils/filter-params.js'
import {mainListingImage} from 'utils/image_url'
import {
  isAuthenticated,
  isAdmin,
  getCurrentUserId,
  redirectIfNotAuthenticated
} from 'lib/auth'
import {getNeighborhoods} from 'services/neighborhood-api'
import InfiniteScroll from 'components/shared/InfiniteScroll'
import MapContainer from 'components/listings/index/Map'
import Listing from 'components/listings/index/Listing'
import ListingsNotFound from 'components/listings/index/NotFound'
import Filter from 'components/listings/index/Search'
import Container, {MapButton} from '../styles'
const splitParam = (param) => (param ? param.split('|') : [])

const getDerivedParams = (query) => ({
  price: {
    min: query.preco_minimo,
    max: query.preco_maximo
  },
  area: {
    min: query.area_minima,
    max: query.area_maxima
  },
  rooms: {
    min: query.quartos_minimo,
    max: query.quartos_maximo
  },
  neighborhoods: splitParam(query.bairros)
})

class ListingsFav extends Component {
  state = {
    query: {},
    framedListings: []
  }
  static async getInitialProps(context) {
    if (redirectIfNotAuthenticated(context)) {
      return {}
    }
    const neighborhoods = await getNeighborhoods().then(
      ({data}) => data.neighborhoods
    )

    return {
      neighborhoods,
      currentUser: {
        id: getCurrentUserId(context),
        admin: isAdmin(context),
        authenticated: isAuthenticated(context)
      },
      renderFooter: false,
      query: context.query
    }
  }

  componentDidMount() {
    require('utils/polyfills/smooth-scroll').load()
  }

  onSelectListing = (id, position) => {
    if (!position) {
      const element = document.getElementById(`listing-${id}`)
      element.scrollIntoView({
        behavior: 'smooth'
      })
    } else {
      this.setState({highlight: {...position}})
    }
  }

  onChangeFilter = (name, value) => {
    const params = treatParams({
      ...this.params,
      [name]: value
    })

    if (params) {
      Router.push(`/listings/fav?${params}`, `/imoveis/favoritos?${params}`)
    } else {
      Router.push('/listings/fav', '/imoveis/favoritos')
    }
  }

  onResetFilter = () => Router.push('/listings/fav', '/imoveis/favoritos')

  get params() {
    return getDerivedParams(this.props.query)
  }

  filteredListings = (serverListings) => {
    const {
      preco_minimo,
      preco_maximo,
      area_minima,
      area_maxima,
      quartos_minimo,
      quartos_maximo,
      bairros
    } = this.props.query
    return serverListings.filter(
      ({price, rooms, area, address: {neighborhood}}) => {
        let returnListing = true
        if (preco_minimo && price < parseInt(preco_minimo))
          returnListing = false

        if (preco_maximo && price > parseInt(preco_maximo))
          returnListing = false

        if (area_minima && area < parseInt(area_minima)) returnListing = false
        if (area_maxima && area > parseInt(area_maxima)) returnListing = false

        if (quartos_minimo && rooms < parseInt(quartos_minimo))
          returnListing = false
        if (quartos_maximo && rooms > parseInt(quartos_maximo))
          returnListing = false

        if (bairros && bairros.split('|').indexOf(neighborhood) === -1)
          returnListing = false

        return returnListing
      }
    )
  }

  onHoverListing = (listing) => {
    const {address: {lat, lng}} = listing
    this.setState({highlight: {lat, lng}})
  }

  onLeaveListing = () => {
    this.setState({highlight: {}})
  }

  onHoverListing = (listing) => {
    const {address: {lat, lng}} = listing
    this.setState({highlight: {lat, lng}})
  }

  onLeaveListing = () => {
    this.setState({highlight: {}})
  }

  onChangeMap = (listings, framedListings) => {
    const framed = listings.filter((listing) =>
      _.includes(framedListings, listing.id)
    )
    this.setState({framedListings: framed})
  }

  handleMap = () => {
    const {mapOpened} = this.state
    this.setState({mapOpened: !mapOpened})
  }

  render() {
    const {params, filteredListings} = this
    const {highlight, framedListings, mapOpened} = this.state
    const {neighborhoods, currentUser, query, url} = this.props
    const seoImgSrc = this.seoImage

    return (
      <Fragment>
        <Query query={GET_FAVORITE_LISTINGS} skip={!currentUser.authenticated}>
          {({data, loading, error}) => {
            if (loading) return ''
            if (error) return `Erro: ${error.message}`

            const listings = filteredListings(data.favoritedListings || [])

            return (
              <Fragment>
                <Head>
                  <title>Imóveis favoritos | EmCasa</title>
                  <meta name="description" content="Meus imóveis favoritos" />
                  <meta
                    property="og:description"
                    content="Meus imóveis favoritos"
                  />
                  <meta
                    property="og:image"
                    content={
                      listings[0] && mainListingImage(listings[0].images)
                    }
                  />
                  <meta name="twitter:card" content="summary_large_image" />
                  <meta
                    name="twitter:title"
                    content="Meus imóveis favoritos | EmCasa"
                  />
                  <meta
                    name="twitter:description"
                    content="Meus imóveis favoritos"
                  />
                  <meta name="twitter:image" content={seoImgSrc} />
                </Head>
                <Filter
                  params={params}
                  neighborhoods={neighborhoods}
                  onChange={this.onChangeFilter}
                  onReset={this.onResetFilter}
                />
                <Container opened={mapOpened}>
                  <MapButton opened={mapOpened} onClick={this.handleMap} />
                  <div className="map">
                    <MapContainer
                      zoom={13}
                      onSelect={this.onSelectListing}
                      listings={listings}
                      highlight={highlight}
                      onChange={this.onChangeMap.bind(this, listings)}
                    />
                  </div>

                  <div className="entries-container">
                    {listings.length == 0 ? (
                      <ListingsNotFound
                        filtered={!_.isEmpty(url.query)}
                        resetAllParams={this.onResetFilter}
                        messages={[
                          'Você ainda não favoritou nenhum imóvel.',
                          'Clique aqui para ver os imóveis disponíveis.'
                        ]}
                        href="/listings"
                        as="/imoveis"
                      />
                    ) : (
                      <InfiniteScroll
                        title="Meus imóveis favoritos"
                        currentPage={1}
                        totalPages={1}
                        entries={
                          framedListings.length > 0 ? framedListings : listings
                        }
                        to={{pathname: '/imoveis/favoritos', query}}
                        mapOpenedOnMobile={mapOpened}
                      >
                        {(listing) => (
                          <Listing
                            key={listing.id}
                            onMouseEnter={this.onHoverListing}
                            onMouseLeave={this.onLeaveListing}
                            highlight={highlight}
                            id={`listing-${listing.id}`}
                            mapOpenedOnMobile={mapOpened}
                            listing={listing}
                            currentUser={currentUser}
                            loading={loading}
                            favorited={listings}
                          />
                        )}
                      </InfiniteScroll>
                    )}
                  </div>
                </Container>
              </Fragment>
            )
          }}
        </Query>
      </Fragment>
    )
  }
}

export default ListingsFav
