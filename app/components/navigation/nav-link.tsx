import { NavLink as RemixNavLink } from '@remix-run/react'
import type { ReactNode } from 'react'
import { HiOutlineExternalLink } from 'react-icons/hi'

export const NavLink = ({
  to,
  onClick,
  children,
}: {
  to: string
  onClick?: () => void
  children: ReactNode
}) => {
  return (
    <li>
      {to.startsWith('http') ? (
        <a href={to} target='_blank' rel='noopener noreferrer'>
          {children} <HiOutlineExternalLink />
        </a>
      ) : (
        <RemixNavLink to={to} prefetch='intent' onClick={onClick}>
          {children}
        </RemixNavLink>
      )}
    </li>
  )
}
