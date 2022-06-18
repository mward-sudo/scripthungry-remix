// Convert JS Date object to 'YYYY-MM-DD' string
export const convertDateToIsoString = (date: Date): string => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}-${month}-${day}`
}
