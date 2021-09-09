import api from './config/api'
import getStorageKey from './config/storage'

const getRep = async (code, country) => {
  try {
    const req = await fetch(`${api}/representatives/${country}?code=${code}`)

    let { payload } = await req.json()
    if (payload) {
      payload = { ...payload, hasOrder: await hasOrder(payload.id) }
      sessionStorage.setItem(getStorageKey('rep'), JSON.stringify(payload))
    }
    return payload
  } catch (e) {
    console.warn(e)
  }
}
const hasOrder = async (id) => {
  try {
    const req = await fetch(`${api}/reporders/${id}`)
    const { payload } = await req.json()
    return payload
  } catch (e) {
    console.warn(e)
  }
}

const addOrder = async (id) => {
  try {
    const req = await fetch(`${api}/reporders/${id}`, {
      method: 'POST'
    })
    const { payload } = await req.json()
    return payload
  } catch (e) {
    console.warn(e)
  }
}

const setOrder = async () => {
  const user = JSON.parse(sessionStorage.getItem(getStorageKey('rep')))
  if (user) {
    await addOrder(user.id)
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
  getLocalRep,
  setOrder
}
