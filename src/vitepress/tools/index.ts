const MONTH_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

export function utcToString(utc: string) {
  const date = new Date(utc.split('T')[0])
  const year = date.getFullYear()
  const month = date.getMonth()
  const day = date.getDate()
  return `${MONTH_EN[month]} ${day}, ${year}`
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readFileSync } = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { resolve } = require('path')

export function getFile(name: any) {
  readFileSync(resolve(__dirname, name), 'utf-8')
}