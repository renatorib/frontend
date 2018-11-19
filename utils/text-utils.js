import createNumberMask from 'text-mask-addons/dist/createNumberMask'

const getParagraphs = (text) => {
  if (text) {
    return text.match(/^.*((\r\n|\n|\r)|$)/gm)
  }
}

const getUrlVars = (url) => {
  const vars = {}
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    vars[key] = value
  })
  return vars
}

const currencyToInt = (displayPrice) => {
  const cleanPrice = displayPrice.replace(PREFIX, '').replace(THOUSANDS_SEPARATOR_SYMBOL, '')
  const intPrice = parseInt(cleanPrice)
  return intPrice
}

const intToCurrency = (value) => {
  const currencyValue = value.toLocaleString('pt-BR', currencyStyle)
  return currencyValue
}

const currencyStyle = {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
}

const PREFIX = 'R$ '
const THOUSANDS_SEPARATOR_SYMBOL = '.'

const currencyInputMask = createNumberMask({
  prefix: PREFIX,
  thousandsSeparatorSymbol: THOUSANDS_SEPARATOR_SYMBOL,
  integerLimit: 12
})

export {
  getParagraphs,
  getUrlVars,
  currencyStyle,
  currencyInputMask,
  currencyToInt,
  intToCurrency,

  PREFIX,
  THOUSANDS_SEPARATOR_SYMBOL
}
