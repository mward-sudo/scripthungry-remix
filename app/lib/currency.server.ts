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
  const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${value}`
  const request = new Request(url)
  try {
    const response = await fetch(request)
    const data: ConvertApiResponse = await response.json()
    return {
      from: data.query.from,
      to: data.query.to,
      fromAmount: convertToCurrencyString(data.query.amount),
      toAmount: convertToCurrencyString(data.result),
    }
  } catch (error) {
    throw new Error(`Failed to fetch currency conversion. ${error}`)
  }
}

const convertToCurrencyString = (value: string, locale = 'en-GB') => {
  const valueAsNumber = Number(value)
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
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
  try {
    const response = await fetch(request)
    const data: CurrencySymbolsApiResponse = await response.json()

    return data.symbols
  } catch (error) {
    throw new Error(`Failed to fetch currency symbols. ${error}`)
  }
}

type RateSeries = Record<string, Record<string, number>>

type CurrencyTimeSeriesResult = {
  motd: {
    msg: string
    url: string
  }
  success: boolean
  timeseries: boolean
  base: string
  start_date: string
  end_date: string
  rates: RateSeries
}

type GetCurrencyTimeSeriesParams = {
  startDate: string
  endDate: string
  from: string
  to: string
}

interface GetCurrencyTimeSeries {
  ({ startDate, endDate, from, to }: GetCurrencyTimeSeriesParams): Promise<
    CurrencyHistoryData[]
  >
}

export type CurrencyHistoryData = { date: string; value: number }

export const getCurrencyTimeSeries: GetCurrencyTimeSeries = async ({
  startDate,
  endDate,
  from,
  to,
}) => {
  const url = `https://api.exchangerate.host/timeseries?start_date=${startDate}&end_date=${endDate}&base=${from}&symbols=${to}`
  const request = new Request(url)

  try {
    const response = await fetch(request)
    const data: CurrencyTimeSeriesResult = await response.json()

    const ratesChartData: CurrencyHistoryData[] = Object.entries(
      data.rates,
    ).map(([date, value]) => ({
      // Date string to Date object
      date: date,
      value: value[to],
    }))

    return ratesChartData
  } catch (error) {
    throw new Error(`Failed to fetch currency time series. ${error}`)
  }
}
