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
      return await refreshAllBlogCaches()
    } else {
      return json({ status: 'Unauthorized' }, 401)
    }
  } catch (error) {
    console.log(error)
    return json({ status: 'Error' }, 500)
  }
}

const refreshAllBlogCaches = async () => {
  const [postSlugs, postExcerpts, categories] = await Promise.all([
    await getPostSlugs(true),
    await getAllPostExcerptData(true),
    await getCategoriesData(true),
  ])
  const [categoryPages, allBlogPosts] = await Promise.all([
    await getAllCategoryPostExcerpts(categories, true),
    await getAllBlogPosts(postSlugs, true),
  ])
  return json(
    {
      refreshPostExcerpts: postExcerpts,
      refreshCategories: categories,
      refreshCategoriesPages: categoryPages,
      refreshAllBlogPosts: allBlogPosts,
    },
    200,
  )
}
