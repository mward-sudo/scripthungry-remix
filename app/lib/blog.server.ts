import invariant from 'tiny-invariant'

import { blog } from '~/config'
import type {
  CategoriesQuery,
  CategoryQuery,
  PostsExcerptsQuery,
  PostSlugsQuery,
} from '~/generated/graphql.server'

import type { PostBySlugQuery } from './../generated/graphql.server'
import { getTotalPages } from './blog-utils.server'
import { sdk } from './graphql.server'
import { redisClient } from './redis.server'
import { range } from './utils'

export const getPostData = async (
  { postSlug }: { postSlug: string },
  refreshCache = false,
) => {
  const cacheKey = `post-${postSlug}`
  const cachedPost = await redisClient.get<PostBySlugQuery>(cacheKey)

  return cachedPost && !refreshCache
    ? cachedPost
    : await fetchPostData(postSlug, cacheKey)
}

const fetchPostData = async (postSlug: string, cacheKey: string) => {
  const postData = await sdk.PostBySlug({ slug: postSlug }).catch(() => {
    throw new Error('Error retreiving post')
  })
  if (!postData?.graphcms?.post) {
    throw new Response('No post found', { status: 404 })
  }
  redisClient.set(cacheKey, postData, { ex: 60 * 60 * 24 * 30 }) // Cache for 30 days
  return postData
}

export const getCategoriesData = async (refreshCache = false) => {
  const cacheKey = 'categories'
  const cachedCategories = await redisClient.get<CategoriesQuery>(cacheKey)

  return cachedCategories && !refreshCache
    ? cachedCategories
    : await fetchCategoriesData(cacheKey)
}

const fetchCategoriesData = async (cacheKey: string) => {
  const categoriesData = await sdk.Categories().catch(() => {
    throw new Error('Error getting categories data')
  })
  redisClient.set(cacheKey, categoriesData, { ex: 60 * 60 * 24 * 30 }) // Cache for 30 days
  return categoriesData
}

export const getCategoryData = async (
  categorySlug: string,
  refreshCache = false,
) => {
  const cacheKey = `category-${categorySlug}`
  const cachedCategory = await redisClient.get<CategoryQuery>(cacheKey)

  return cachedCategory && !refreshCache
    ? cachedCategory
    : await fetchCategoryData(categorySlug, cacheKey)
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

  redisClient.set(cacheKey, category, { ex: 60 * 60 * 24 * 30 }) // Cache for 30 days

  return category
}

export const getPostExcerptData = async (
  pageNo: number,
  categorySlug: string,
  refreshCache = false,
) => {
  const cacheKey = `posts-excerpts-${categorySlug}-${pageNo}`
  const cachedPostsExcerpts = await redisClient.get<PostsExcerptsQuery>(
    cacheKey,
  )

  return cachedPostsExcerpts && !refreshCache
    ? cachedPostsExcerpts
    : await fetchPostExcerptData(pageNo, categorySlug, cacheKey)
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

  redisClient.set(cacheKey, posts, { ex: 60 * 60 * 24 * 30 }) // Cache for 30 days

  return posts
}

export const getPostSlugs = async (refreshCache = false) => {
  const cacheKey = 'postSlugs'
  const cachedPostSlugs = await redisClient.get<PostSlugsQuery>(cacheKey)

  return cachedPostSlugs && !refreshCache
    ? cachedPostSlugs
    : await fetchPostSlugs(cacheKey)
}

const fetchPostSlugs = async (cacheKey: string) => {
  const postSlugs = await sdk.PostSlugs()
  redisClient.set(cacheKey, postSlugs, { ex: 60 * 60 * 24 * 30 }) // Cache for 30 days

  return postSlugs
}

export const getAllPostExcerptData = async (refreshCache = false) => {
  const postExcerptData = await getPostExcerptData(1, '', true)
  const totalPages = getTotalPages(postExcerptData)
  return Promise.all(
    range(2, totalPages + 1).map(async (pageNo) => {
      return await getPostExcerptData(pageNo, '', true)
    }),
  )
}

export const getAllCategoryPostExcerpts = async (
  categories: CategoriesQuery,
  refreshCache = false,
) => {
  invariant(categories.graphcms?.blogCategories, 'No categories')
  return await Promise.all(
    categories.graphcms?.blogCategories.map(async (category) => {
      const blogCategoryData = await getPostExcerptData(
        1,
        category.slug,
        refreshCache,
      )
      const totalCategoryPages = getTotalPages(blogCategoryData)
      return Promise.all(
        range(2, totalCategoryPages).map(async (pageNo) => {
          return getPostExcerptData(pageNo, category.slug, refreshCache)
        }),
      )
    }),
  )
}

export const getAllBlogPosts = async (
  postSlugs: PostSlugsQuery,
  refreshCache = false,
) => {
  invariant(postSlugs.graphcms?.posts, 'No post slugs')
  return await Promise.all(
    postSlugs.graphcms.posts.map(async (post) => {
      return getPostData({ postSlug: post.slug }, refreshCache)
    }),
  )
}
