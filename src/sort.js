export const dsc = (a, b) => {
  if (a < b) {
    return -1
  }
  if (b < a) {
    return 1
  }
  return 0
}

export const sortMatrix = valueGetter => comparator => matrix => matrix.sort(
  (a, b) => comparator(valueGetter(a), valueGetter(b))
)
