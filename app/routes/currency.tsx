import { Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import type { CurrencySymbols } from '~/lib/currency.server'
import { getCurrencySymbols } from '~/lib/currency.server'

type LoaderData = {
  currencySymbols: CurrencySymbols
}

export const loader: LoaderFunction = async () => {
  const currencySymbols = await getCurrencySymbols()

  const data: LoaderData = {
    currencySymbols,
  }

  return json(data)
}

const CurrenyRoute = () => {
  const { currencySymbols } = useLoaderData<LoaderData>()

  return (
    <div>
      <h1 className='text-center'>Currency Converter</h1>

      <Outlet context={{ currencySymbols }} />
    </div>
  )
}

export default CurrenyRoute
