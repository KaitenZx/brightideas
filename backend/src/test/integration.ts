import '../lib/sentry.mock'

import { omit } from '@brightideas/shared'
import { type Idea, type User } from '@prisma/client'
import { entries, isArray, isObject } from 'lodash'
import { afterAll, afterEach, beforeEach } from 'vitest'
import { createAppContext } from '../lib/ctx.js'
import { env } from '../lib/env.js'
import { getTrpcContext } from '../lib/trpc.js'
import { trpcRouter } from '../router/index.js'
import { deepMap } from '../utils/deepMap.js'
import { getPasswordHash } from '../utils/getPasswordHash.js'
import { type ExpressRequest } from '../utils/types.js'

if (env.NODE_ENV !== 'test') {
  throw new Error('Run integration tests only with NODE_ENV=test')
}

export const appContext = createAppContext()

afterAll(appContext.stop)

beforeEach(async () => {
  await appContext.prisma.ideaLike.deleteMany()
  await appContext.prisma.idea.deleteMany()
  await appContext.prisma.user.deleteMany()
})

afterEach(async () => {
  await appContext.prisma.ideaLike.deleteMany()
  await appContext.prisma.idea.deleteMany()
  await appContext.prisma.user.deleteMany()
})

export const getTrpcCaller = (user?: User) => {
  const req = { user } as ExpressRequest
  return trpcRouter.createCaller(getTrpcContext({ appContext, req }))
}

export const withoutNoize = (input: any): any => {
  return deepMap(input, ({ value }) => {
    if (isObject(value) && !isArray(value)) {
      return entries(value).reduce((acc, [objectKey, objectValue]: [string, any]) => {
        if ([/^id$/, /Id$/, /At$/, /^url$/].some((regex) => regex.test(objectKey))) {
          return acc
        }
        return {
          ...acc,
          [objectKey]: objectValue,
        }
      }, {})
    }
    return value
  })
}

export const createUser = async ({ user = {}, number = 1 }: { user?: Partial<User>; number?: number } = {}) => {
  return await appContext.prisma.user.create({
    data: {
      nick: `user${number}`,
      email: `user${number}@example.com`,
      password: getPasswordHash(user.password || '1234'),
      ...omit(user, ['password']),
    },
  })
}

export const createIdea = async ({
  idea = {},
  author,
  number = 1,
}: {
  idea?: Partial<Idea>
  author: Pick<User, 'id'>
  number?: number
}) => {
  return await appContext.prisma.idea.create({
    data: {
      nick: `idea${number}`,
      authorId: author.id,
      name: `Idea ${number}`,
      description: `Idea ${number} description`,
      text: `Idea ${number} text text text text text text text text text text text text text text text text text text text text text`,
      ...idea,
    },
  })
}

export const createIdeaWithAuthor = async ({
  author,
  idea,
  number,
}: {
  author?: Partial<User>
  idea?: Partial<Idea>
  number?: number
} = {}) => {
  const createdUser = await createUser({ user: author, number })
  const createdIdea = await createIdea({ idea, author: createdUser, number })
  return {
    author: createdUser,
    idea: createdIdea,
  }
}

export const createIdeaLike = async ({
  idea,
  liker,
  createdAt,
}: {
  idea: Pick<Idea, 'id'>
  liker: Pick<User, 'id'>
  createdAt?: Date
}) => {
  return await appContext.prisma.ideaLike.create({
    data: {
      ideaId: idea.id,
      userId: liker.id,
      createdAt,
    },
  })
}
