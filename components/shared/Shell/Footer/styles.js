import * as colors from 'constants/colors'
import {headerMobileMedia, footerMobileMedia} from 'constants/media'
import styled from 'styled-components'

export default styled.footer`
  align-items: center;
  background: ${colors.offWhite};
  border-top: 1px solid ${colors.lightGray};
  display: flex;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;

  a {
    color: ${colors.mediumDarkGray};
    text-decoration: none;
  }

  img {
    width: 110px;
  }

  @media ${headerMobileMedia} {
    img {
      width: 100px;
    }
  }

  @media ${footerMobileMedia} {
    flex-direction: column;
  }
`

export const EmCasaInfo = styled.div`
  display: flex;
  img {
    margin-right: 20px;
  }

  > a {
    align-self: center;
  }
`

export const EmCasaContact = styled.div`
  display: flex;
  a {
    align-self: center;
    margin-left: 30px;
    &.icon {
      color: ${colors.blue.medium};
      font-size: 20px;
      top: 0;
    }
  }

  @media ${headerMobileMedia} {
    flex-direction: column;

    .icons {
      display: flex;
      justify-content: space-evenly;
    }

    a {
      order: 2;
      margin-left: 0px;
    }

    a[href='/jobs'] {
      display: none;
    }
  }

  @media ${footerMobileMedia} {
    &.icon {
      background-color: white;
      margin-left: 0px;
    }
  }
`
