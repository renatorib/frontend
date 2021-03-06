import styled from 'styled-components'
import theme from '@emcasa/ui'
import View from '@emcasa/ui-dom/components/View'
import {imageUrl} from 'utils/image_url'

export const Container = styled(View)`
  display: flex;
  width: 100%;
`

export const Content = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export const Header = styled(View)`
  .title {
    margin-bottom: 0;
  }
  
  @media (max-width: ${theme.breakpoints[0]}) {
    padding: 20px;
  }
`

export const Cities = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${theme.breakpoints[0]}) {
    align-items: unset;
  }
`


export const City = styled(View)`
  @media (max-width: ${theme.breakpoints[0]}) {
    margin-left: 20px;
  }
`

export const CityTitle = styled(View)`
`

export const CityInfo = styled(View)`
  @media (max-width: ${theme.breakpoints[0]}) {
    display: none;
  }
`

export const NeighborhoodContainer = styled(View)`
  position: relative;
  
  @media (max-width: ${theme.breakpoints[0]}) {
    &:after {
      background: linear-gradient(
        to left,
        white, 
        rgba(255, 255, 255, 0)
      );
      content: ' ';
      position: absolute;
      top: 0;
      right: 0;
      width: 20%;
      height: 100%;
      pointer-events: none;
    }
  }
`

export const NeighborhoodsLinks = styled(View)`
  display: flex;
  flex-wrap: wrap;
  max-width: 1000px;
  max-height: 130px;
  margin-top: 10px;
  margin-bottom: 10px;
  flex-direction: column;
  
  a {
    font-family: FaktSoftPro-Normal;
    color: ${theme.colors.grey};
    font-size: 14px;
    text-decoration: none;
    width: 345px;
    margin-right: 12px;
  }
  
  @media (max-width: ${theme.breakpoints[0]}) {
    max-height: 70px;
    a { 
      width: 130px;
      font-size: 8px;
      margin-right: 10px;
    }
  }
`

export const NeighborhoodItems = styled(View)`
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  @media (max-width: ${theme.breakpoints[0]}) {
    overflow-y: hidden;
    overflow-x: auto;
    padding-bottom: 10px;
  }
`

export const Neighborhood = styled(View)`
  position: relative;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 345px;
  height: 185px;
  max-width: 100%;
  cursor: pointer;
  background: url(https://res.cloudinary.com/emcasa/image/upload/v1543531007/bairros/${
    props => props.thumb + (props.soon ? '-em-breve' : '')}.png) ${theme.colors.pink};
  background-size: cover;
  border-radius: 4px;
  box-shadow: 1px 2px 4px 0 rgba(0,0,0,0.3);
  margin-right: 10px;

  p {
    color: white;
    font-size: 20px;
  }

  @media (max-width: ${theme.breakpoints[0]}) {
    width: auto;
    min-width: 130px;
    min-height: 70px;
    height: auto;

    p {
      font-size: 100%;
    }
  }
`

export const Soon = styled(View)`
  position: absolute;
  right: 10px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.pink};
  width: 95px;
  height: 32px;
  border-radius: 4px;

  font-family: 'FaktSoftPro-Normal';
  color: white;
  font-size: 90%;

  &:after {
    content: 'Em breve';
  }

  @media (max-width: ${theme.breakpoints[0]}) {
    top: 5px;
    right: 5px;

    max-width: 46px;
    max-height: 17px;
    font-size: 8px;
  }
`

export const Spacer = styled(View)`
  display: none;
  @media (max-width: ${theme.breakpoints[0]}) {
    display: flex;
    max-height: 70px;
    &:after {
      display: flex;
      width: 20px;
      height: 30px;
      content: ' ';
    }
  }
`
