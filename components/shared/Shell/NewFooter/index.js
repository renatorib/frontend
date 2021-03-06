import {ThemeProvider} from 'styled-components'
import theme from '@emcasa/ui'
import Link from 'next/link'
import Col from '@emcasa/ui-dom/components/Col'
import Text from '@emcasa/ui-dom/components/Text'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faPhone from '@fortawesome/fontawesome-pro-light/faPhone'
import faMail from '@fortawesome/fontawesome-pro-light/faEnvelope'
import {
  faFacebook,
  faInstagram,
  faLinkedin,
  faTwitter,
  faWhatsapp
} from '@fortawesome/fontawesome-free-brands'

import {
  Container,
  TextLink,
  AboutText,
  AboutLogo,
  LinkGroup
} from './styles'

const titleText = {
  fontWeight: 'bold'
}

const Footer = () => (
  <ThemeProvider theme={theme}>
    <Container flexDirection={['column', 'row']}>
      <Col width={[1, 6 / 12]} ml={[0, '5vw']} mt="1.5em">
        <AboutLogo />
        <AboutText fontSize="small">
          A EmCasa é uma imobiliária digital tem como objetivo transformar a maneira que o brasileiro compra ou vende imóvel.
        </AboutText>
        <Text fontSize="16px"> CRECI-RJ J-7712</Text>
      </Col>
      <Col width={[1, 2 / 12]}>
        <Text {...titleText}>EmCasa</Text>
        <LinkGroup>
          <Link href="/listings" as="/imoveis">
            <TextLink>Compre</TextLink>
          </Link>
          <Link href="/listings/sell" as="/vender">
            <TextLink>Venda</TextLink>
          </Link>
          <a href="http://blog.emcasa.com" target="_blank">
            <TextLink>Blog</TextLink>
          </a>
          <a href="https://jobs.emcasa.com/" target="_blank">
            <TextLink>Trabalhe Conosco</TextLink>
          </a>
          <Link href="/sitemap">
            <TextLink>Mapa do Site</TextLink>
          </Link>
        </LinkGroup>
      </Col>
      <Col width={[1, 2 / 12]}>
        <Text {...titleText}>Suporte</Text>
        <LinkGroup>
          <div>
            <a href="tel:+5521994771868">
              <TextLink>
                <FontAwesomeIcon icon={faPhone} />
                (21) 99477-1868
              </TextLink>
            </a>
          </div>
          <div>
            <a href="https://wa.me/5521994771868">
              <TextLink>
                <FontAwesomeIcon icon={faWhatsapp} />
                WhatsApp
              </TextLink>
            </a>
          </div>
          <div>
            <a href="mailto:contato@emcasa.com">
              <TextLink>
                <FontAwesomeIcon icon={faMail} />
                Fale com a gente
              </TextLink>
            </a>
          </div>
        </LinkGroup>
      </Col>
      <Col width={[1, 2 / 12]}>
        <Text {...titleText}>Redes Sociais</Text>
        <LinkGroup>
          <div>
            <a href="https://www.facebook.com/EmCasa" target="_blank">
              <TextLink>
                <FontAwesomeIcon icon={faFacebook} />
                Facebook
              </TextLink>
            </a>
          </div>
          <div>
            <a href="https://www.instagram.com/emcasaimoveis/" target="_blank">
              <TextLink>
                <FontAwesomeIcon icon={faInstagram} />
                Instagram
              </TextLink>
            </a>
          </div>
          <div>
            <a href="https://www.linkedin.com/company/emcasa/" target="_blank">
              <TextLink>
                <FontAwesomeIcon icon={faLinkedin} />
                LinkedIn
              </TextLink>
            </a>
          </div>
          <div>
            <a href="https://twitter.com/EmCasaTech" target="_blank">
              <TextLink>
                <FontAwesomeIcon icon={faTwitter} />
                Twitter
              </TextLink>
            </a>
          </div>
        </LinkGroup>
      </Col>
    </Container>
  </ThemeProvider>
)

export default Footer
