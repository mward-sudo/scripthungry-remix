type ConvertApiResponse = {
  motd: {
    msg: string
    url: string
  }
  success: boolean
  query: {
    from: string
    to: string
    amount: string
  }
  info: { rate: string }
  historical: boolean
  date: string
  result: string
}

export type CurrencyConversionResult = {
  from: string
  to: string
  fromAmount: string
  toAmount: string
}

export const convertCurrency = async (
  value: string,
  from: string,
  to: string,
): Promise<CurrencyConversionResult> => {
  const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${value}&places=2`
  const request = new Request(url)
  const response = await fetch(request)
  const data: ConvertApiResponse = await response.json()

  return {
    from: data.query.from,
    to: data.query.to,
    fromAmount: convertToCurrencyString(data.query.amount),
    toAmount: convertToCurrencyString(data.result),
  }
}

const convertToCurrencyString = (value: string, locale = 'en-GB') => {
  const valueAsNumber = Number(value)
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valueAsNumber)
}

export type CurrencySymbols = {
  [key: string]: {
    description: string
    code: string
  }
}

type CurrencySymbolsApiResponse = {
  motd: {
    msg: string
    url: string
  }
  success: boolean
  symbols: CurrencySymbols
}

export const getCurrencySymbols = async (): Promise<CurrencySymbols> => {
  const url = 'https://api.exchangerate.host/symbols'
  const request = new Request(url)
  const response = await fetch(request)
  const data: CurrencySymbolsApiResponse = await response.json()

  return data.symbols
}
