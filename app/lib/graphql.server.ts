import { GraphQLClient } from 'graphql-request'

import { getSdk } from '~/generated/graphql.server'

declare var HASURA_ENDPOINT: string | undefined
declare var HASURA_TOKEN: string | undefined

export const sdk = getSdk(
  new GraphQLClient(HASURA_ENDPOINT || '', {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${HASURA_TOKEN || ''}`,
    },
    fetch: fetch,
  }),
)
