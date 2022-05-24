import type { GetNavigationQuery } from '~/generated/graphql.server'

import { sdk } from './graphql.server'
import { redisClient } from './redis.server'

export const getNavLinks = async (refreshCache = false) => {
  const cacheKey = 'navLinks'
  const cachedNavLinks = await redisClient.get<GetNavigationQuery>(cacheKey)

  const navLinks =
    !cachedNavLinks || refreshCache
      ? await fetchNavLinks(cacheKey)
      : cachedNavLinks

  return navLinks
}

export const fetchNavLinks = async (cacheKey: string) => {
  const navLinks = await sdk.GetNavigation().catch((error) => {
    throw new Response('Failed to fetch navigation data', { status: 500 })
  })

  await redisClient.set(cacheKey, navLinks, { ex: 60 * 60 * 24 })

  return navLinks
}
