const createQuantity = (label, classes) => {
  const html = `
<div class="quantity">
  <label class="${classes}">${label}</label>
  <input type="button" value="-" class="minus">
  <input type="number" class="input-text qty text" step="1" min="0" max="" value="0" >
  <input type="button" value="+" class="plus">
</div>
  `

  const container = document.createElement('DIV')
  container.innerHTML = html
  return container
}

const createSection = (title, labels, classes) => {
  const container = document.createElement('div')
  container.setAttribute('class', classes.sectionContainer)

  const titleElement = document.createElement('label')
  titleElement.setAttribute('class', classes.title)
  titleElement.innerHTML = title

  const inputsContainer = document.createElement('div')
  inputsContainer.setAttribute('class', classes.inputsContainer)

  const inputs = labels.map(label => createQuantity(label, classes.inputLabel))
  inputs.forEach(input => inputsContainer.append(input))

  container.append(titleElement)
  container.append(inputsContainer)

  return { section: container, inputs }
}

const getInputsTotal = (inputs) => {
  return inputs.reduce((acc, input) => {
    return acc + parseInt(input.querySelector('[type=number]').value)
  }, 0)
}

const parseInput = (input) => {
  const size = input.querySelector('label').innerText
  const quantity = input.querySelector('input[type=number]').value
  return { [size]: quantity }
}

const parseSection = ({ section, inputs }) => {
  const type = section.querySelector('label').innerText
  const values = inputs.reduce((acc, input) => ({ ...acc, ...parseInput(input) }), { })
  return {
    [type]: values
  }
}

const parseSections = sections => {
  return sections.reduce((acc, section) => ({ ...acc, ...parseSection(section) }), { })
}

const writeOnInput = (input, sections, currentQuantity, max) => {
  if (currentQuantity === max) {
    input.value = JSON.stringify(parseSections(sections))
    return true
  } else {
    input.value = null
    return false
  }
}
const sizeForm = ({ form, sizes, classes, max, formInput, errCb }) => {
  const container = document.createElement('div')
  container.setAttribute('class', classes.container)

  const sections = sizes.sections.map(section => createSection(section, sizes.sizes, classes))

  const inputs = sections.reduce((acc, section) => [...acc, ...section.inputs], [])

  inputs.forEach(input => {
    const plusBtn = input.querySelector("input[value='+']")
    const minusBtn = input.querySelector("input[value='-']")
    const valStorage = input.querySelector('input[type=number]')

    minusBtn.addEventListener('click', (e) => {
      let total = getInputsTotal(inputs)
      if (parseInt(valStorage.value) > 0) {
        valStorage.value = parseInt(valStorage.value) - 1
        total -= 1
      }
      const write = writeOnInput(formInput, sections, total, max)
      if (typeof errCb === 'function') {
        errCb(!write, container)
      }
    })

    plusBtn.onclick = (e) => {
      e.stopPropagation()
      const tempTotal = getInputsTotal(inputs) + 1

      if (tempTotal > max) { return null }
      valStorage.value = parseInt(valStorage.value) + 1
      const write = writeOnInput(formInput, sections, tempTotal, max)
      if (typeof errCb === 'function') {
        errCb(!write, container)
      }
    }
  })

  sections.forEach(section => container.append(section.section))
  return container
}

export default {
  sizeForm
}
