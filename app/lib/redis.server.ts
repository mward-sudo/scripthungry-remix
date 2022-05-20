import { Redis } from '@upstash/redis'

import { env } from '~/config.server'

const redisOptions = {
  url: env.UPSTASH_URL,
  token: env.UPSTASH_TOKEN,
}

export const redisClient: Redis = new Redis(redisOptions)
