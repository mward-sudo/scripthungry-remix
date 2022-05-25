import type { IconType } from 'react-icons'
import {
  BsArrowUpCircle,
  BsCoin,
  BsGlobe,
  BsHandThumbsUp,
  BsLightning,
  BsPhone,
} from 'react-icons/bs'

import { Card } from '~/components/home/card'

import { Hero } from './../components/home/hero'

export type CardData = {
  title: string
  description: string
  icon: IconType
  iconColor: string
  link: string
}

export const headers = () => ({
  Link: '<https://res.cloudinary.com>; rel=preconnect',
})

export default function Index() {
  const cards: CardData[] = [
    {
      title: 'Super fast',
      description:
        'Your users love fast web sites, and Google ranks faster sites higher',
      icon: BsLightning,
      iconColor: 'rgb(96, 165, 250)',
      link: '#',
    },
    {
      title: 'Easy to use',
      description: 'We make it easy to use, and we make it easy to build',
      icon: BsHandThumbsUp,
      iconColor: 'rgb(251, 146, 60)',
      link: '#',
    },
    {
      title: 'Cost effective',
      description: 'Low cost, low complexity, low maintenance',
      icon: BsCoin,
      iconColor: 'rgb(22, 163, 74)',
      link: '#',
    },
    {
      title: 'Mobile friendly',
      description: 'Works across all devices, from phones to tablets',
      icon: BsPhone,
      iconColor: 'rgb(168, 85, 247)',
      link: '#',
    },
    {
      title: 'Global servers',
      description:
        'We use an enterprise grade network of servers across the world, close to your users',
      icon: BsGlobe,
      iconColor: 'rgb(96, 165, 250)',
      link: '#',
    },
    {
      title: 'High availability',
      description: 'We guarantee high uptime and availability',
      icon: BsArrowUpCircle,
      iconColor: 'rgb(251, 146, 60)',
      link: '#',
    },
  ]

  return (
    <>
      <Hero />
      <div className='mt-24 text-center'>
        <h2 className='mb-8 text-4xl'>
          Why a web site from us will put you ahead
        </h2>
        <div className='flex flex-col flex-wrap justify-center gap-4 no-underline md:flex-row'>
          {cards.map((card, i) => (
            <Card key={`home-card-${i}`} card={card} />
          ))}
        </div>
      </div>
    </>
  )
}
