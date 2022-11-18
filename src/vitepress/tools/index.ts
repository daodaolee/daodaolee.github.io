const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export function utcToString(utc: string) {
  const date = new Date(utc.split('T')[0])
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return `${MONTH_EN[month]} ${day}, ${year}`
}
export function formatDate(string: string) {
  const date = new Date(string)
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return `${MONTH_EN[month]} ${day}, ${year}`
}