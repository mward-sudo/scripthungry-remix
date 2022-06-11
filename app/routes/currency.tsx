import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import type { LoaderFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import type { CurrencySymbols } from '~/lib/currency.server'
import { getCurrencySymbols } from '~/lib/currency.server'

type MenuLink = {
  text: string
  to: string
}

type LoaderData = {
  menuLinks: MenuLink[]
  currencySymbols: CurrencySymbols
}

export const loader: LoaderFunction = async () => {
  const menuLinks: MenuLink[] = [
    {
      text: 'Convert Currency',
      to: '/currency',
    },
    {
      text: 'Currency History',
      to: '/currency/history',
    },
  ]

  const currencySymbols = await getCurrencySymbols()

  const data: LoaderData = {
    menuLinks,
    currencySymbols,
  }

  return json(data)
}

const CurrenyRoute = () => {
  const { menuLinks, currencySymbols } = useLoaderData<LoaderData>()

  return (
    <div>
      <h1>Currency Tools</h1>
      <div className='flex flex-col gap-4'>
        <ul className='menu menu-horizontal bg-base-200 rounded-box self-center not-prose pl-0'>
          {menuLinks.map(({ text, to }) => (
            <li key={to}>
              <NavLink to={to} end prefetch='intent'>
                {text}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className='flex-1'>
          <Outlet context={{ currencySymbols }} />
        </div>
      </div>
    </div>
  )
}

export default CurrenyRoute
