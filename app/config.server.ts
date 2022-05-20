export const env = {
  HASURA_ENPOINT: Deno.env.get('HASURA_ENDPOINT'),
  HASURA_TOKEN: Deno.env.get('HASURA_TOKEN'),
  UPSTASH_URL: Deno.env.get('UPSTASH_URL') || '',
  UPSTASH_TOKEN: Deno.env.get('UPSTASH_TOKEN') || '',
  WORKER_HOST: Deno.env.get('WORKER_HOST') || '',
}
