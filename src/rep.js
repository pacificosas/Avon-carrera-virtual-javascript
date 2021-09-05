import api from './config/api'
import getStorageKey from './config/storage'

const getRep = async (code, country) => {
  try {
    const req = await fetch(`${api}/representatives/${country}?code=${code}`)

    const { payload } = await req.json()
    if (payload) {
      sessionStorage.setItem(getStorageKey('rep'), payload)
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

export default {
  getRep,
  getRepOnForm
}
