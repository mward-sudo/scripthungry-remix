export const env = {
  HASURA_ENPOINT: Deno.env.get('HASURA_ENDPOINT'),
  HASURA_TOKEN: Deno.env.get('HASURA_TOKEN'),
  UPSTASH_URL: Deno.env.get('UPSTASH_URL') || '',
  UPSTASH_TOKEN: Deno.env.get('UPSTASH_TOKEN') || '',
  WEBHOOK_SECRET_GRAPHCMS: Deno.env.get('WEBHOOK_SECRET_GRAPHCMS') || '',
}
