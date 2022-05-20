import invariant from 'tiny-invariant'

import { site } from '~/config'
import type { GithubUserFragment } from '~/generated/graphql.server'

import type { GitHubUserQuery } from './../generated/graphql.server'
import { sdk } from './graphql.server'
import { redisClient } from './redis.server'

type GitHubErrorResponse = {
  response: {
    errors: Array<{
      type: string
      message: string
    }>
  }
}

export const getGithubPageTitle = ({ user }: { user: GithubUserFragment }) => {
  const title: Record<number, string>[] = []
  title.push(user.name ?? user.login)
  title.push(`Github Profile | ${site.name}`)

  return title.join(' | ')
}

type GetGithubUser = {
  (username: string, refreshCache: boolean): Promise<GithubUserFragment>
}

export const getGithubUser: GetGithubUser = async (username) => {
  const redisKey = `github-${username}`
  // Using redisClient, check if the user is cached, if so, return it.
  const cachedUser = await redisClient.get<GitHubUserQuery>(redisKey)

  if (!cachedUser) {
    // Fetch user data
    const githubUser = await sdk
      .gitHubUser({ username })
      .catch((e: GitHubErrorResponse) => {
        throw new Response(`${e.response.errors[0].message}`, { status: 404 })
      })
    invariant(githubUser?.github?.user, 'githubUser.data.user is undefined')

    // Cache user data
    redisClient.set(redisKey, githubUser, { ex: 60 * 60 * 24 }) // Cache for 4 weeks

    // Return user data
    return githubUser.github.user
  }

  invariant(cachedUser?.github?.user, 'githubUser.data.user is undefined')
  // return cachedUser
  return cachedUser.github.user
}
