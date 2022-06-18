import { Form } from '@remix-run/react'
import { BsCashCoin } from 'react-icons/bs'
import { HiSwitchHorizontal } from 'react-icons/hi'

import type { CurrencySymbols } from '~/lib/currency.server'

type CurrencyConversionFormParams = {
  fromAmount: string
  from: string
  currencySymbols: CurrencySymbols
  to: string
}

export const CurrencyConversionForm = ({
  fromAmount,
  from,
  currencySymbols,
  to,
}: CurrencyConversionFormParams) => {
  return (
    <>
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
            className='input input-bordered focus:outline-none w-40'
          />
        </label>
        <label className='input-group input-group-lg w-fit'>
          <span>from</span>
          <select
            name='from'
            defaultValue={from}
            className='select select-bordered focus:outline-none w-48'
          >
            {Object.entries(currencySymbols).map(([key, symbol]) => (
              <option key={key} value={key}>
                ({key}) {symbol.description}
              </option>
            ))}
          </select>
        </label>
        <label className='input-group input-group-lg w-fit'>
          <span>to</span>
          <select
            name='to'
            defaultValue={to}
            className='select select-bordered focus:outline-none w-48'
          >
            {Object.entries(currencySymbols).map(([key, symbol]) => (
              <option key={key} value={key}>
                ({key}) {symbol.description}
              </option>
            ))}
          </select>
        </label>
        <button type='submit' className='btn btn-primary ml-4'>
          <HiSwitchHorizontal className='mr-2' /> Convert
        </button>
      </Form>
    </>
  )
}
