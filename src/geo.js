import api from './config/api'
import { dsc, sortMatrix } from './sort'

const onSelectClick = callback => ({ target }) => {
  const selected = Array.from(target.querySelectorAll('option')).find(opt => opt.value === target.value)
  callback(selected.getAttribute('data-id') || '', selected)
}

const addDefaultOption = (name) => {
  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.innerHTML = name
  return defaultOption
}

const addGeoOptionsByScale = async (select, scale, { fromId, country, defaultLabel } = {}) => {
  try {
    const sortByName = sortMatrix(x => x.name)(dsc)
    const query = fromId ? `fromId=${fromId}&country=${country}` : `country=${country}`
    const req = await fetch(`${api}geography/${scale}?${query}`)
    const res = await req.json()

    const options = sortByName(res.payload)

    const htmlOptions = options.map(opt => {
      const el = document.createElement('option')
      el.value = opt.name
      el.innerHTML = opt.name
      el.setAttribute('data-id', opt.id)
      return el
    })
    resetSelectOptions(select, defaultLabel)
    htmlOptions.forEach(el => select.append(el))
  } catch (e) {
    console.warm(e)
  }
}

const resetSelectOptions = (select, label) => {
  select.innerHTML = ''
  select.append(addDefaultOption(label))
}

const cleanTree = levels => {
  levels.forEach(l => resetSelectOptions(l.element, l.defaultLabel))
}

const main = ({ country, levels } = {}) => {
  if (levels.length === 0) {
    throw new Error('pacifica_geo: should specified at leat 1 scale level')
  }
  if (levels.length > 3) {
    throw new Error('pacifica_geo: should specified max 3 scale levels')
  }

  const fillDeptos = async (level) => {
    const deptos = await addGeoOptionsByScale(level.element, 'departments', {
      country,
      defaultLabel: level.defaultLabel
    })
    if (country === 'pe') {
      deptos.filter(d => d.name === 'LIMA' || d.name === 'CALLAO')
    }
  }

  const fillCities = (level, tree) => (fromId) => {
    if (!fromId) {
      return cleanTree(tree)
    }
    addGeoOptionsByScale(level.element, 'cities', {
      fromId,
      country,
      defaultLabel: level.defaultLabel
    })
  }

  const fillTowns = (level, tree) => (fromId) => {
    if (!fromId) {
      return cleanTree(tree)
    }
    addGeoOptionsByScale(level.element, 'towns', {
      fromId,
      country,
      defaultLabel: level.defaultLabel
    })
  }

  levels.forEach = l => {
    l.select.append(addDefaultOption(l.defaultLabel))
  }

  if (country !== 'pe') {
    fillDeptos(levels[0])
  }
  // manual fill departments on peru
  if (country === 'pe') {
    const data = [
      document.createElement('option'),
      document.createElement('option')
    ]
    data[0].innerHTML = 'LIMA'
    data[0].setAttribute('values', 'LIMA')
    data[0].setAttribute('data-id', '44')

    data[1].innerHTML = 'CALLAO'
    data[1].setAttribute('values', 'CALLAO')
    data[1].setAttribute('data-id', '46')

    levels[0].element.append(addDefaultOption(levels[0].defaultLabel))
    data.forEach(opt => levels[0].element.append(opt))
  }

  if (levels[1]) {
    levels[0].element.addEventListener('change', onSelectClick(fillCities(levels[1], levels.slice(1))))
    levels[1].element.append(addDefaultOption(levels[1].defaultLabel))
  }

  if (levels[2]) {
    levels[1].element.addEventListener('change', onSelectClick(fillTowns(levels[2], levels.slice(2))))
    levels[2].element.append(addDefaultOption(levels[2].defaultLabel))
  }
}

export default main
