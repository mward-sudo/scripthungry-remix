import type { ActionFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import { checkGraphCmsAuth } from '~/lib/graphcms-auth.server'
import { getNavLinks } from '~/lib/navigation.server'

export const action: ActionFunction = async ({ request }) => {
  try {
    if (checkGraphCmsAuth({ request })) {
      const refreshCacheResult = await getNavLinks(true)
      return json(refreshCacheResult, 200)
    } else {
      return json({ status: 'Unauthorized' }, 401)
    }
  } catch (error) {
    console.log(error)
    return json({ status: 'Error' }, 500)
  }
}
