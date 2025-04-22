// backend/src/router/ideas/getMyIdeas/index.ts
import { omit, zGetMyIdeasTrpcInput } from '@brightideas/shared'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'

export const getMyIdeasTrpcRoute = trpcLoggedProcedure.input(zGetMyIdeasTrpcInput).query(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  const currentUserId = ctx.me.id

  const rawIdeas = await ctx.prisma.idea.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
      serialNumber: true,
      _count: {
        select: {
          ideasLikes: true,
        },
      },
      ideasLikes: {
        where: {
          userId: currentUserId,
        },
        select: {
          id: true, // Достаточно одного поля для проверки существования лайка
        },
      },
    },
    where: {
      authorId: currentUserId,
      blockedAt: null,
    },
    orderBy: [{ createdAt: 'desc' }, { serialNumber: 'desc' }],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })

  const nextIdea = rawIdeas.at(input.limit)
  const nextCursor = nextIdea?.serialNumber
  const rawIdeasExceptNext = rawIdeas.slice(0, input.limit)

  const ideasExceptNext = rawIdeasExceptNext.map((idea) => ({
    ...omit(idea, ['_count', 'ideasLikes']),
    likesCount: idea._count.ideasLikes,
    isLikedByMe: idea.ideasLikes.length > 0,
  }))

  return { ideas: ideasExceptNext, nextCursor }
})
