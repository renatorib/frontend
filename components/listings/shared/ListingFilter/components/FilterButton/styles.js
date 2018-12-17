import styled from 'styled-components'
import theme from '@emcasa/ui'
import Button from '@emcasa/ui-dom/components/Button'

const StyledFilterButton = styled(Button)`
  border: 1px solid ${theme.colors.pink};
  color: ${({active}) => active ? theme.colors.white : theme.colors.pink};
  font-size: ${theme.fontSizes[1]}px;
  margin: 0 ${theme.space[2]}px ${theme.space[1]}px 0;
  height: 32px;
`

export {
  StyledFilterButton
}
