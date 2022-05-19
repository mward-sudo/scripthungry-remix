import { GraphQLClient } from 'graphql-request'

import { env } from '~/config.server'
import { getSdk } from '~/generated/graphql.server'

export const sdk = getSdk(
  new GraphQLClient(env.HASURA_ENPOINT ?? '', {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${env.HASURA_TOKEN || ''}`,
    },
    fetch: fetch,
  }),
)
