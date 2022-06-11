import { Form, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import { BsCashCoin } from 'react-icons/bs'
import { HiSwitchHorizontal } from 'react-icons/hi'

import type { CurrencyConversionResult } from '~/lib/currency.server'
import { convertCurrency } from '~/lib/currency.server'

type LoaderData = {
  currencyConversion: CurrencyConversionResult
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const from = url.searchParams.get('from') ?? 'GBP'
  const to = url.searchParams.get('to') ?? 'USD'
  const fromAmount = url.searchParams.get('fromAmount') ?? '1.00'

  const currencyConversion = await convertCurrency(fromAmount, from, to)

  const data: LoaderData = {
    currencyConversion,
  }

  return json(data)
}

const CurrencyConverterRoute = () => {
  const { currencyConversion } = useLoaderData<LoaderData>()
  const { from, to, fromAmount, toAmount } = currencyConversion

  return (
    <div>
      <div className='text-center text-7xl mt-8 hidden md:block'>
        <BsCashCoin className='inline-block' />
      </div>
      <Form className='form-control w-full not-prose items-center mt-8 flex-col md:flex-row gap-2 justify-center'>
        <label className='input-group input-group-lg w-fit'>
          <span>Amount</span>
          <input
            type='text'
            name='fromAmount'
            defaultValue={fromAmount}
            className='input input-bordered focus:outline-none'
          />
        </label>
        <label className='input-group input-group-lg w-fit'>
          <span>from</span>
          <select
            name='from'
            defaultValue={from}
            className='select select-bordered focus:outline-none'
          >
            <option value='GBP'>GBP</option>
            <option value='USD'>USD</option>
            <option value='EUR'>EUR</option>
          </select>
        </label>
        <label className='input-group input-group-lg w-fit'>
          <span>to</span>
          <select
            name='to'
            defaultValue={to}
            className='select select-bordered focus:outline-none'
          >
            <option value='GBP'>GBP</option>
            <option value='USD'>USD</option>
            <option value='EUR'>EUR</option>
          </select>
        </label>
        <button type='submit' className='btn btn-primary ml-4'>
          <HiSwitchHorizontal className='mr-2' /> Convert
        </button>
      </Form>
      <p className='text-5xl md:text-7xl text-center'>
        <span className='text-purple-400 font-bold'>
          {fromAmount} {from}
        </span>{' '}
        ={' '}
        <span className='text-green-500 font-bold'>
          {toAmount} {to}
        </span>
      </p>
    </div>
  )
}

export default CurrencyConverterRoute
