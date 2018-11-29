import '@emcasa/ui-dom/components/global-styles'
import {Component} from 'react'
import {ThemeProvider} from 'styled-components'
import theme from '@emcasa/ui'
import {Query} from 'react-apollo'
import {GET_USER_LISTINGS_ACTIONS} from 'graphql/user/queries'
import {
  GET_LISTINGS,
  GET_LISTING,
  GET_LISTINGS_COORDINATES
} from 'graphql/listings/queries'
import differenceBy from 'lodash/differenceBy'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import ListingInfiniteScroll from 'components/shared/ListingInfiniteScroll'
import ListingCard from 'components/listings/shared/ListingCard'
import Map from 'components/listings/shared/Map'
import ListingsNotFound from 'components/listings/shared/NotFound'
import Neighborhood from 'components/listings/shared/Neighborhood'
import Row from '@emcasa/ui-dom/components/Row'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import {
  MapContainer,
  Loading
} from './styles'

const MIN_WIDTH_FOR_MAP_RENDER = 1080

class ListingList extends Component {
  constructor(props) {
    super(props)
    this.onResize = this.onResize.bind(this)

    this.pagination = {
      pageSize: 10,
      excludedListingIds: []
    }

    this.state = {
      mapOpened: false,
      renderMap: true
    }
  }

  componentWillMount() {
    if (process.browser) {
      window.onresize = this.onResize
    }
  }

  onResize() {
    if (!process.browser) {
      return
    }

    this.setState({
      renderMap: window.innerWidth >= MIN_WIDTH_FOR_MAP_RENDER
    })
  }

  getListings = (result, fetchMore) => {
    const {
      user,
      query,
      resetFilters,
      filters,
      onHoverListing,
      onLeaveListing,
      highlight,
      neighborhoodListener
    } = this.props
    const {mapOpened} = this.state

    if (result && result.listings.length > 0) {
      return (
        <Query query={GET_USER_LISTINGS_ACTIONS} skip={!user.authenticated}>
          {({data: {userProfile}, loading}) => {
            const favorites = userProfile ? userProfile.favorites : []
            const filteredListings = differenceBy(
              result.listings,
              'id'
            )
            return (
              <ListingInfiniteScroll
                titleComponent={
                  query.neighborhoodSlug && (
                    <Neighborhood
                      neighborhood={query.neighborhoodSlug}
                      state={query.state}
                      city={query.city}
                      neighborhoodListener={neighborhoodListener}
                    />
                  )
                }
                entries={filteredListings}
                remaining_count={result.remainingCount}
                onLoad={async () => {
                  const loadedListings = await fetchMore({
                    variables: {
                      pagination: {
                        ...this.pagination,
                        excludedListingIds: map(result.listings, 'id')
                      }
                    },
                    updateQuery: (
                      prev,
                      {fetchMoreResult, variables: {pagination}}
                    ) => {
                      if (!fetchMoreResult) return prev
                      this.pagination = pagination
                      const result = {
                        ...prev,
                        listings: {
                          ...prev.listings,
                          remainingCount:
                            fetchMoreResult.listings.remainingCount,
                          listings: [
                            ...prev.listings.listings,
                            ...fetchMoreResult.listings.listings
                          ]
                        }
                      }
                      return result
                    }
                  })
                  return loadedListings
                }}
              >
                {(listing) =>
                  <ListingCard
                    onMouseEnter={onHoverListing}
                    onMouseLeave={onLeaveListing}
                    highlight={highlight}
                    key={listing.id}
                    listing={listing}
                    currentUser={user}
                    loading={loading}
                    resumedInfo={mapOpened}
                    favorited={favorites || []}
                  />
                }
              </ListingInfiniteScroll>
            )
          }}
        </Query>
      )
    } else {
      return (
        <ListingsNotFound
          filtered={!isEmpty(filters)}
          resetAllParams={resetFilters}
        />
      )
    }
  }

  loadListing = async (id) => {
    const {apolloClient, filters} = this.props
    const footer = document.querySelector('.infinite-scroll-footer')
    footer.scrollIntoView({block: 'end', behavior: 'smooth'})

    const loadedListings = apolloClient.readQuery({
      query: GET_LISTINGS,
      variables: {pagination: this.pagination, filters}
    })

    const {data} = await apolloClient.query({
      query: GET_LISTING,
      variables: {
        id
      }
    })

    const updatedQueryResult = {
      ...loadedListings,
      listings: {
        ...loadedListings.listings,
        remainingCount: loadedListings.listings.remainingCount - 1,
        listings: [...loadedListings.listings.listings, data.listing]
      }
    }

    apolloClient.writeQuery({
      query: GET_LISTINGS,
      variables: {pagination: this.pagination, filters},
      data: updatedQueryResult
    })
    const element = document.querySelector(
      `[aria-label=listing-${data.listing.id}]`
    )
    element.scrollIntoView({block: 'end', behavior: 'smooth'})
  }

  onSelectListing = (id, position) => {
    if (!position) {
      const element = document.querySelector(`[aria-label=listing-${id}]`)

      if (!element) {
        this.loadListing(id)
        return
      }

      element.scrollIntoView({block: 'end', behavior: 'smooth'})
    }
  }

  onHoverListing = (listing) => {
    const {address: {lat, lng}} = listing
    this.setState({highlight: {lat, lng}})
  }

  onLeaveListing = () => {
    this.setState({highlight: {}})
  }

  onChangeMap = (framedListings, {sw, ne}) => {
    const filters = {
      ...this.state.filters,
      minLat: sw.lat,
      minLng: sw.lng,
      maxLat: ne.lat,
      maxLng: ne.lng
    }

    this.setState({filters})
  }

  handleMap = () => {
    const {mapOpened} = this.state
    this.setState({mapOpened: !mapOpened})
  }

  getMap = () => {
    const {highlight, mapOpened} = this.state
    const {filters} = this.props

    return (
      <Query query={GET_LISTINGS_COORDINATES} variables={{filters}}>
        {({data: {listings: mapListings}}) => (
          <MapContainer opened={mapOpened}>
            {process.browser ? (
              <Map
                zoom={13}
                onSelect={this.onSelectListing}
                listings={mapListings.listings}
                highlight={highlight}
                onChange={this.onChangeMap}
                updateAfterApiCall
              />
            ) : (
              <Loading>Carregando mapa...</Loading>
            )}
          </MapContainer>
        )}
      </Query>
    )
  }

  render() {
    const {filters} = this.props
    const h1Content = 'Apartamentos e Casas à venda na Zona Sul do Rio de Janeiro'
    return (
      <ThemeProvider theme={theme}>
        <Query
          query={GET_LISTINGS}
          variables={{pagination: this.pagination, filters}}
          fetchPolicy="cache-and-network"
        >
          {({data: {listings}, fetchMore}) => {
            return (
              <>
                <Row px={4}>
                  <Text>{h1Content}</Text>
                </Row>
                <Row justifyContent="center">
                  {this.getListings(listings, fetchMore)}
                  {this.state.renderMap && this.getMap()}
                </Row>
              </>
            )
          }}
        </Query>
      </ThemeProvider>
    )
  }
}

export default ListingList
