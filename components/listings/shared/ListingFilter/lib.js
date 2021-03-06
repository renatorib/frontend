import numeral from 'numeral'
import FilterButton from './components/FilterButton'
import {
  FILTERS
} from './constants'

/**
 * Returns an array with all selected filters.
 *
 * @param userFilters user selected filters object (ListingFilter's state.values).
 */
function getActiveFilters(userFilters) {
  const { types, price, neighborhoods, rooms, garageSpots, area } = userFilters

  const propertyTypes = types && types.join(', ')

  const rangePrice = price && `R$${numeral(price.min).format('0.00a')} - R$${numeral(price.max).format('0.00a')}`

  const rangeArea = area && `${area.min} - ${area.max} m²`

  let rangeRooms = ''
  if (rooms && rooms.min !== null) {
    rangeRooms = `${rooms.min} quarto${rooms.min > 1 ? 's' : ''} ou mais`
  }

  let rangeGarageSpots = ''
  if (garageSpots && garageSpots.min !== null) {
    if (garageSpots.min === 0) {
      rangeGarageSpots = 'Sem vagas'
    } else {
      rangeGarageSpots = `${garageSpots.min} vaga${garageSpots.min > 1 ? 's' : ''} ou mais`
    }
  }

  const rangeNeighborhoods =
    neighborhoods &&
    neighborhoods.length > 0 &&
    `${neighborhoods[0].value}${
      neighborhoods.length > 1 ? ` e mais ${neighborhoods.length - 1}` : ''
    }`

  const filters = [
    {filter: FILTERS.TYPES.code, value: propertyTypes},
    {filter: FILTERS.NEIGHBORHOODS.code, value: rangeNeighborhoods},
    {filter: FILTERS.PRICE.code, value: rangePrice},
    {filter: FILTERS.ROOMS.code, value: rangeRooms},
    {filter: FILTERS.GARAGE_SPOTS.code, value: rangeGarageSpots},
    {filter: FILTERS.AREA.code, value: rangeArea}
  ].filter((filter) => filter.value)

  return filters.map(({filter, value}) => (
    {filter: filter, value: value}
  ))
}

/**
 * Returns the text to be shown on the filter button.
 *
 * @param userFilters user selected filters object (ListingFilter's state.values).
 * @param filter name of the filter.
 */
function getFilterLabel(userFilters, filter) {
  const selectedFilter = getActiveFilters(userFilters).find((item) => item.filter === filter)
  if (selectedFilter) {
    return selectedFilter.value
  }
  switch (filter) {
    case FILTERS.TYPES.code: return FILTERS.TYPES.label
    case FILTERS.AREA.code: return FILTERS.AREA.label
    case FILTERS.PRICE.code: return FILTERS.PRICE.label
    case FILTERS.ROOMS.code: return FILTERS.ROOMS.label
    case FILTERS.GARAGE_SPOTS.code: return FILTERS.GARAGE_SPOTS.label
    default:
  }
  return ''
}

/**
 * Returns true when the given home type has been selected.
 *
 * @param {object} userFilters user selected filters object (ListingFilter's state.values).
 * @param {string} homeType string with the home type. 'Apartamento', 'Casa', etc.
 */
function userHasSelectedType(userFilters, homeType) {
  if (!userFilters || !homeType || userFilters.length === 0) {
    return false
  }
  const activeUserFilters = getActiveFilters(userFilters)
  const activeUserFilterCodes = activeUserFilters.map((item) => item.filter)
  return activeUserFilterCodes.includes('types') && userFilters.types.includes(homeType)
}

/**
 * Returns a list of FilterButton components to be rendered. Selected filters come first in the array, so
 * they are rendered first. Inactive filters are rendered last.
 *
 * @param {object} filters selected filters.
 * @param {function} showFilter function that is called when user clicks the filter button.
 * @param {function} getOpenButton function that is called to check if button is open
 */
function getFilterButtons(filters, showFilter, getOpenButton) {
  const selectedFilters = getActiveFilters(filters)
  const selectedFiltersArray = selectedFilters.map((item) => item.filter)

  let activeFilterButtons = []
  let inactiveFilterButtons = []

  Object.keys(FILTERS).forEach((item) => {
    const filterItem = FILTERS[item]
    if (filterItem.code === 'neighborhoods') {
      return
    }

    if (selectedFiltersArray.includes(filterItem.code)) {
      activeFilterButtons.push(
        <FilterButton
          key={item.code}
          active={true}
          open={getOpenButton(filterItem.code)}
          onClick={(e) => { showFilter(filterItem.code, e) }}
        >
          {getFilterLabel(filters, filterItem.code)}
        </FilterButton>
      )
    } else {
      inactiveFilterButtons.push(
        <FilterButton
          key={item.code}
          active={false}
          open={getOpenButton(filterItem.code)}
          onClick={(e) => { showFilter(filterItem.code, e) }}
        >
          {getFilterLabel(filters, filterItem.code)}
        </FilterButton>
      )
    }
  })

  return (
    <>
      {activeFilterButtons}
      {inactiveFilterButtons}
    </>
  )
}

export {
  getActiveFilters,
  getFilterLabel,
  getFilterButtons,
  userHasSelectedType
}
