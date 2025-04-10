import { describe, it, expect } from 'vitest'
import { appContext, createIdeaWithAuthor, createUser, getTrpcCaller } from '../../../test/integration.js'

describe('setIdeaLike', () => {
  it('create like', async () => {
    const { idea } = await createIdeaWithAuthor({ number: 1 })
    const liker = await createUser({ number: 2 })
    const trpcCallerForLiker = getTrpcCaller(liker)
    const result = await trpcCallerForLiker.setIdeaLike({
      ideaId: idea.id,
      isLikedByMe: true,
    })
    expect(result).toMatchObject({
      idea: {
        isLikedByMe: true,
        likesCount: 1,
      },
    })
    const ideaLikes = await appContext.prisma.ideaLike.findMany()
    expect(ideaLikes).toHaveLength(1)
    expect(ideaLikes[0]).toMatchObject({
      ideaId: idea.id,
      userId: liker.id,
    })
  })

  it('remove like', async () => {
    const { idea } = await createIdeaWithAuthor({ number: 3 })
    const liker = await createUser({ number: 4 })
    const trpcCallerForLiker = getTrpcCaller(liker)
    const result1 = await trpcCallerForLiker.setIdeaLike({
      ideaId: idea.id,
      isLikedByMe: true,
    })
    expect(result1).toMatchObject({
      idea: {
        isLikedByMe: true,
        likesCount: 1,
      },
    })
    const result2 = await trpcCallerForLiker.setIdeaLike({
      ideaId: idea.id,
      isLikedByMe: false,
    })
    expect(result2).toMatchObject({
      idea: {
        isLikedByMe: false,
        likesCount: 0,
      },
    })

    const specificLike = await appContext.prisma.ideaLike.findUnique({
      where: {
        ideaId_userId: {
          ideaId: idea.id, // Идея из ЭТОГО теста
          userId: liker.id, // Пользователь из ЭТОГО теста
        },
      },
    })
    // Ожидаем, что findUnique не найдет запись (вернет null)
    expect(specificLike).toBeNull()
  })
})
