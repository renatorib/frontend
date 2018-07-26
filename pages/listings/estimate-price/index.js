import {Component, Fragment} from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faGlobe from '@fortawesome/fontawesome-pro-light/faGlobe'
import faGift from '@fortawesome/fontawesome-pro-light/faGift'
import faBolt from '@fortawesome/fontawesome-pro-light/faBolt'
import faCoin from '@fortawesome/fontawesome-pro-light/faUsdCircle'
import faPaste from '@fortawesome/fontawesome-pro-light/faPaste'
import faGavel from '@fortawesome/fontawesome-pro-light/faGavel'
import Link from 'next/link'
import Head from 'next/head'
import {imageUrl} from 'utils/image_url'
import EmCasaButton from 'components/shared/Common/Buttons'
import Topics from 'components/shared/Common/Topics'
import Container, {Header, BenefitsContainer, Benefit} from './styles'

import Calculator from 'components/shared/Calculator'
import PriceEstimate from 'components/shared/PriceEstimate'

export default class EstimatePrice extends Component {
  render() {
    const seoImg = imageUrl(
      'emcasa-saiba-mais-para-vender-share-centered-2.jpg'
    )
    const seoTitle = 'Avalie seu imóvel no Rio de Janeiro | EmCasa'
    const seoDescription =
      'Avalie seu imóvel no Rio de Janeiro de forma simples e transparente com a EmCasa que tem sistema exclusivo de Tour Virtual 3D para aumentar suas chances de venda'

    return (
      <Fragment>
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
        <Fragment>
          <Header>
            <img
              src={imageUrl('listings_new_header.png')}
              alt="Avalie seu imóvel na EmCasa"
            />
            <h1>Avalie seu imóvel no Rio de Janeiro com a EmCasa</h1>
          </Header>

          <Container id="precificador">
            <PriceEstimate />
          </Container>
          <Container>
            <Calculator />
          </Container>
        </Fragment>
      </Fragment>
    )
  }
}
