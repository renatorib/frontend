import styled from 'styled-components'
import { themeGet } from 'styled-system'

import View from '@emcasa/ui-dom/components/View'
import Text from '@emcasa/ui-dom/components/Text'
import Row from '@emcasa/ui-dom/components/Row'
import Icon from '@emcasa/ui-dom/components/Icon'
import Bullet from 'components/listings/new-listing/shared/Bullet'

const StyledCustomTime = styled(Row)`
  display: flex;
  align-items: center;
  border: 1px solid ${({selected}) => selected ? themeGet('colors.pink') : themeGet('colors.lightGrey')};
  border-radius: ${themeGet('space.1')}px;
  cursor: pointer;
  padding-left: ${themeGet('space.2')}px;
  padding-right: ${themeGet('space.2')}px;
  min-height: 60px;
`

const StyledCustomTimeItem = styled(View)`
  margin-bottom: ${themeGet('space.2')}px;
`

const Title = styled(Row)`
  display: flex;
  align-items: center;
  margin-top: ${themeGet('space.2')}px;
  margin-bottom: ${themeGet('space.2')}px;
`

const StyledBullet = styled(Bullet)`
  position: relative;
  display: flex;
  margin: 0;
  width: 18px;
  height: 18px;
`

const SelectedIcon = styled(Icon)`
  display: flex;
`

const CustomTimeText = styled(Text)`
  font-size: 16px;
`

export {
  Title,
  SelectedIcon,
  StyledBullet,
  CustomTimeText,
  StyledCustomTime,
  StyledCustomTimeItem
}
