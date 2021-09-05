import api from './config/api'
import getStorageKey from './config/storage'

const getRep = async (code, country) => {
  try {
    const req = await fetch(`${api}/representatives/${country}?code=${code}`)

    const { payload } = await req.json()
    if (payload) {
      sessionStorage.setItem(getStorageKey('rep'), JSON.stringify(payload))
    }
    return payload
  } catch (e) {
    console.warn(e)
  }
}

const getRepOnForm = (
  {
    loading, err,
    country, form, input
  } = {}
  , fn
) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const value = input.value
    if (!value) { return }
    if (loading) { loading.style.display = 'block' }
    if (err) { err.style.display = 'none' }
    const rep = await getRep(value, country)
    if (loading) { loading.style.display = 'none' }
    if (err && !rep) { err.style.display = 'block' }
    fn(rep)
  })
}

const formAutoComplete = (
  form,
  fields = {}
) => {
  const rep = JSON.parse(sessionStorage.getItem(getStorageKey('rep')))
  if (!rep) { return null }
  for (const key in fields) {
    const input = form.querySelector(`[name=${key}]`)
    const filedTargetValue = fields[key]
    const fieldValue = rep[filedTargetValue]
    if (input && filedTargetValue && fieldValue) {
      input.value = fieldValue
    }
  }
}

const getLocalRep = () => {
  return JSON.parse(sessionStorage.getItem(getStorageKey('rep')))
}
export default {
  getRep,
  getRepOnForm,
  formAutoComplete,
  getLocalRep
}
