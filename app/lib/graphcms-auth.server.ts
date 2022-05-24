import { env } from '~/config.server'

export const checkGraphCmsAuth = ({ request }: { request: Request }) =>
  env.WEBHOOK_SECRET_GRAPHCMS === request.headers.get('Key')
