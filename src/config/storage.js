const storage = {
  prefix: 'pacifica__',
  sufix: ''
}
const getStorageKey = id => {
  return `${storage.prefix}${id}${storage.sufix}`
}
export default getStorageKey
