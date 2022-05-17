import { GraphQLClient } from 'graphql-request'

import { getSdk } from '~/generated/graphql.server'

export const sdk = getSdk(
  new GraphQLClient(HASURA_ENDPOINT || '', {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${HASURA_TOKEN || ''}`,
    },
    fetch: fetch.bind(globalThis),
  }),
)
