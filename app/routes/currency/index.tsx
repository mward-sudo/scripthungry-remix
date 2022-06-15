import {
  Outlet,
  useCatch,
  useLoaderData,
  useOutletContext,
} from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'
import type { CatchBoundaryComponent } from '@remix-run/server-runtime/routeModules'
import { motion } from 'framer-motion'
import { HiSwitchHorizontal } from 'react-icons/hi'

import { CurrencyConversionForm } from '~/components/currency/conversion-form'
import { fadeInLeft, fadeInRight } from '~/lib/animations'
import type {
  CurrencyConversionResult,
  CurrencySymbols,
} from '~/lib/currency.server'
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

  if (currencyConversion.toAmount === '0.00') {
    throw new Response(
      'Your conversion resulted in 0.00, there has probably been an error',
      { status: 400 },
    )
  }

  const data: LoaderData = {
    currencyConversion,
  }

  return json(data)
}

const CurrencyConverterRoute = () => {
  const { currencyConversion } = useLoaderData<LoaderData>()
  const { from, to, fromAmount, toAmount } = currencyConversion

  const { currencySymbols } = useOutletContext<{
    currencySymbols: CurrencySymbols
  }>()

  return (
    <div>
      <CurrencyConversionForm
        fromAmount={fromAmount}
        from={from}
        currencySymbols={currencySymbols}
        to={to}
      />
      <Outlet />
      <p className='text-5xl md:text-7xl text-center'>
        <motion.span
          className='inline-block text-purple-400 font-bold'
          variants={fadeInRight}
        >
          {fromAmount} {from}
        </motion.span>{' '}
        <HiSwitchHorizontal
          alignmentBaseline='text-before-edge'
          className='inline-block'
        />{' '}
        <span className='sr-only'>equals</span>{' '}
        <motion.span
          className='inline-block text-green-500 font-bold'
          variants={fadeInLeft}
        >
          {toAmount} {to}
        </motion.span>
      </p>
    </div>
  )
}

export const CatchBoundary: CatchBoundaryComponent = () => {
  const caught = useCatch()
  const { currencySymbols } = useOutletContext<{
    currencySymbols: CurrencySymbols
  }>()

  return (
    <>
      <CurrencyConversionForm
        fromAmount='1.00'
        from='GBP'
        currencySymbols={currencySymbols}
        to='USD'
      />
      <div className='alert alert-error mt-8 justify-center text-2xl shadow-lg'>
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 flex-shrink-0 stroke-current'
            fill='none'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'
            />
          </svg>
          <p className='m-4 my-0'>{caught.data}</p>
        </div>
      </div>
    </>
  )
}

export default CurrencyConverterRoute
