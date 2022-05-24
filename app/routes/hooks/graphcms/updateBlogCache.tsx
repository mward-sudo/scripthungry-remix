import type { ActionFunction } from '@remix-run/server-runtime'
import { json } from '@remix-run/server-runtime'

import {
  getAllBlogPosts,
  getAllCategoryPostExcerpts,
  getAllPostExcerptData,
  getCategoriesData,
  getPostSlugs,
} from '~/lib/blog.server'
import { checkGraphCmsAuth } from '~/lib/graphcms-auth.server'

export const action: ActionFunction = async ({ request }) => {
  try {
    if (checkGraphCmsAuth({ request })) {
      const [refreshPostSlugs, refreshPostExcerpts, refreshCategories] =
        await Promise.all([
          await getPostSlugs(true),
          await getAllPostExcerptData(true),
          await getCategoriesData(true),
        ])
      const [refreshCategoriesPages, refreshAllBlogPosts] = await Promise.all([
        await getAllCategoryPostExcerpts(refreshCategories, true),
        await getAllBlogPosts(refreshPostSlugs, true),
      ])
      return json(
        {
          refreshPostExcerpts,
          refreshCategories,
          refreshCategoriesPages,
          refreshAllBlogPosts,
        },
        200,
      )
    } else {
      return json({ status: 'Unauthorized' }, 401)
    }
  } catch (error) {
    console.log(error)
    return json({ status: 'Error' }, 500)
  }
}
