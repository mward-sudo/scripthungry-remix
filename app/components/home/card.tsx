import { Link } from '@remix-run/react'
import Tilt from 'react-parallax-tilt'

import type { CardData } from '~/routes/index'

export const Card = ({ card }: { card: CardData }) => {
  const { title, description, icon: Icon, link, iconColor } = card

  return (
    <Tilt className='w-[15rem] rounded-2xl p-1 transition-all transition-all hover:bg-gradient-to-bl hover:from-yellow-700 hover:via-yellow-300 hover:to-yellow-700 hover:drop-shadow-lg'>
      <Link to={link} className='no-underline'>
        <div className='h-full rounded-xl bg-base-200 p-4'>
          <Icon
            size={64}
            className={`orag mx-auto mt-4`}
            style={{ color: iconColor }}
          />
          <h3
            className={`m-0 mt-4 mb-2 text-2xl underline`}
            style={{ textDecorationColor: iconColor }}
          >
            {title}
          </h3>
          <p>{description}</p>
        </div>
      </Link>
    </Tilt>
  )
}
