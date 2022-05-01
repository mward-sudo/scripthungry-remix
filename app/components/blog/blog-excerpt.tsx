import { Link } from '@remix-run/react'

import type { PostsExcerptsQuery } from '~/generated/graphql.server'
import type { CloudinaryImageProps } from '~/lib/cloudinary'

import { CloudinaryImage } from '../cloudinary-image'

export const BlogExcerpt = ({
  posts,
  blogImages,
}: {
  posts: PostsExcerptsQuery
  blogImages: (CloudinaryImageProps | undefined)[]
}) => {
  return (
    <>
      {posts.graphcms?.posts.map((post, index) => (
        <div key={`blog-excerpt-${post.slug}`} className='mb-20 text-xl'>
          <Link
            to={`/blog/${post.slug}`}
            prefetch='intent'
            className='no-underline'
          >
            <h2 className='mt-0 text-3xl'>{post.title}</h2>
            <CloudinaryImage imgProps={blogImages[index]} />
          </Link>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </>
  )
}
