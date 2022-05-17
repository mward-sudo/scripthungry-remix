import { GraphQLClient } from 'graphql-request'

import { getSdk } from '~/generated/graphql.server'

export const sdk = getSdk(
  new GraphQLClient(Deno.env.get('HASURA_ENDPOINT') ?? '', {
    headers: {
      'content-type': 'application/json',
      'x-hasura-admin-secret': `${Deno.env.get('HASURA_TOKEN') || ''}`,
    },
    fetch: fetch,
  }),
)
