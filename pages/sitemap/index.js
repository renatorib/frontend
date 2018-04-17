import {Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import {getNeighborhoods} from 'services/neighborhood-api'
import {isAuthenticated, isAdmin} from 'lib/auth'
import Layout from 'components/shared/Shell'
import Container from './styles'

export default class MyPage extends Component {
  static async getInitialProps(context) {
    const search = await getNeighborhoods().then(({data}) => data)

    return {
      search,
      authenticated: isAuthenticated(context),
      isAdmin: isAdmin(context)
    }
  }

  render() {
    const {authenticated, search, isAdmin} = this.props
    const seoImg =
      'https://res.cloudinary.com/emcasa/image/upload/f_auto/v1513818385/home-2018-04-03_cozxd9.jpg'
    const seoTitle = 'EmCasa | Mapa do Site'
    const seoDescription = 'EmCasa | Mapa do Site'
    return (
      <Layout
        authenticated={authenticated}
        isAdmin={isAdmin}
        renderFooter={true}
      >
        <Head>
          <title>{seoTitle}</title>
          <meta name="description" content={seoDescription} />
          <meta property="og:description" content={seoDescription} />
          <meta property="og:image" content={seoImg} />
          <meta property="og:image:height" content="838" />
          <meta property="og:image:width" content="1476" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={seoTitle} />
          <meta name="twitter:description" content={seoDescription} />
          <meta name="twitter:image" content={seoImg} />
        </Head>
        <Container>
          <h1>Mapa do site</h1>
          <ul>
            <li>
              <Link href="/">
                <a title="EmCasa">EmCasa</a>
              </Link>
            </li>
            <li>
              <Link href="/listings" as="/imoveis">
                <a title="Compre seu imóvel">Compre seu imóvel</a>
              </Link>
              <ul>
                {search.neighborhoods.map((neighborhood) => (
                  <li key={neighborhood}>
                    <Link
                      href={`/listings/?bairros=${neighborhood}`}
                      as={`/imoveis?bairros=${neighborhood}`}
                    >
                      <a title={`Comprar imóvel: ${neighborhood}`}>
                        {neighborhood}
                      </a>
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href="/listings/new" as="/imoveis/adicionar">
                <a title="Venda seu imóvel">Venda seu imóvel</a>
              </Link>
              <ul>
                <li>
                  <Link
                    href="/listings/sell/know-more"
                    as="/saiba-mais-para-vender"
                  >
                    <a title="Saiba mais para vender">Saiba mais para vender</a>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link href="/indique">
                <a title="Indique e Ganhe">Indique e Ganhe</a>
              </Link>
            </li>
            <li>
              <Link href="http://blog.emcasa.com">
                <a title="Blog">Blog</a>
              </Link>
            </li>
            <li>
              <Link href="/jobs">
                <a title="Trabalhe Conosco">Trabalhe Conosco</a>
              </Link>
            </li>
          </ul>
        </Container>
      </Layout>
    )
  }
}