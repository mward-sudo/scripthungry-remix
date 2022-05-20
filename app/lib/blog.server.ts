import { blog } from '~/config'
import type {
  CategoriesQuery,
  CategoryQuery,
  PostsExcerptsQuery,
  PostSlugsQuery,
} from '~/generated/graphql.server'

import type { PostBySlugQuery } from './../generated/graphql.server'
import { sdk } from './graphql.server'
import { redisClient } from './redis.server'

export const getPostData = async ({ postSlug }: { postSlug: string }) => {
  const cacheKey = `post-${postSlug}`
  const cachedPost = await redisClient.get<PostBySlugQuery>(cacheKey)

  return cachedPost || (await fetchPostData(postSlug, cacheKey))
}

const fetchPostData = async (postSlug: string, cacheKey: string) => {
  const postData = await sdk.PostBySlug({ slug: postSlug }).catch(() => {
    throw new Error('Error retreiving post')
  })
  if (!postData?.graphcms?.post) {
    throw new Response('No post found', { status: 404 })
  }
  redisClient.set(cacheKey, postData, { ex: 60 * 60 * 24 }) // Cache for 1 day
  return postData
}

export const getCategoriesData = async () => {
  const cacheKey = 'categories'
  const cachedCategories = await redisClient.get<CategoriesQuery>(cacheKey)

  return cachedCategories || (await fetchCategoriesData(cacheKey))
}

const fetchCategoriesData = async (cacheKey: string) => {
  const categoriesData = await sdk.Categories().catch(() => {
    throw new Error('Error getting categories data')
  })
  redisClient.set(cacheKey, categoriesData, { ex: 60 * 60 * 24 }) // Cache for 1 day
  return categoriesData
}

export const getCategoryData = async (categorySlug: string) => {
  const cacheKey = `category-${categorySlug}`
  const cachedCategory = await redisClient.get<CategoryQuery>(cacheKey)

  return cachedCategory || fetchCategoryData(categorySlug, cacheKey)
}

const fetchCategoryData = async (categorySlug: string, cacheKey: string) => {
  const category = categorySlug
    ? await sdk.Category({ category: categorySlug }).catch(() => {
        throw new Error('Error getting category info')
      })
    : null

  if (categorySlug !== '' && category?.graphcms?.blogCategory === null) {
    throw new Response(`The category '${categorySlug}' not found`, {
      status: 404,
    })
  }

  redisClient.set(cacheKey, category, { ex: 60 * 60 * 24 }) // Cache for 1 day

  return category
}

export const getPostExcerptData = async (
  pageNo: number,
  categorySlug: string,
) => {
  const cacheKey = `posts-excerpts-${categorySlug}-${pageNo}`
  const cachedPostsExcerpts = await redisClient.get<PostsExcerptsQuery>(
    cacheKey,
  )

  return (
    cachedPostsExcerpts ||
    (await fetchPostExcerptData(pageNo, categorySlug, cacheKey))
  )
}

const fetchPostExcerptData = async (
  pageNo: number,
  categorySlug: string,
  cacheKey: string,
) => {
  const posts = await sdk
    .PostsExcerpts({
      postsPerPage: blog.postsPerPage,
      skip: blog.postsPerPage * (pageNo - 1),
      category: categorySlug ?? '',
    })
    .catch(() => {
      throw new Error('Error getting posts')
    })

  if (posts.graphcms?.posts.length === 0) {
    const message =
      categorySlug !== ''
        ? 'No posts found'
        : `No posts in category '${categorySlug}'`
    throw new Response(message, { status: 404 })
  }

  redisClient.set(cacheKey, posts, { ex: 60 * 60 * 24 }) // Cache for 1 day

  return posts
}

export const getPostSlugs = async () => {
  const cacheKey = 'postSlugs'
  const cachedPostSlugs = await redisClient.get<PostSlugsQuery>(cacheKey)

  return cachedPostSlugs || (await fetchPostSlugs(cacheKey))
}

const fetchPostSlugs = async (cacheKey: string) => {
  const postSlugs = await sdk.PostSlugs()
  redisClient.set(cacheKey, postSlugs, { ex: 60 * 60 * 24 }) // Cache for 1 day

  return postSlugs
}
