import type { GetNavigationQuery } from '~/generated/graphql.server'

import { sdk } from './graphql.server'
import { redisClient } from './redis.server'

export const getNavLinks = async () => {
  const cacheKey = 'navLinks'
  const cachedNavLinks = await redisClient.get<GetNavigationQuery>(cacheKey)

  return cachedNavLinks || (await fetchNavLinks())
}

export const fetchNavLinks = async () => {
  const navLinks = await sdk.GetNavigation().catch((error) => {
    throw new Response('Failed to fetch navigation data', { status: 500 })
  })

  await redisClient.set('navLinks', navLinks, { ex: 60 * 60 * 24 })

  return navLinks
}
