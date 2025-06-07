import { omit, zGetLikedIdeasTrpcInput } from '@brightideas/shared' // Используем твой omit
import { trpcLoggedProcedure } from '../../../lib/trpc.js'

export const getLikedIdeasTrpcRoute = trpcLoggedProcedure
  .input(zGetLikedIdeasTrpcInput)
  .query(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED')
    }

    const currentUserId = ctx.me.id

    const ideasQuery = await ctx.prisma.idea.findMany({
      where: {
        blockedAt: null,
        ideasLikes: {
          some: {
            userId: currentUserId,
          },
        },
      },
      select: {
        id: true,
        nick: true,
        name: true,
        description: true,
        serialNumber: true,
        _count: {
          select: { ideasLikes: true },
        },
      },
      orderBy: {
        serialNumber: 'desc',
      },
      cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
      take: input.limit + 1,
    })

    const nextIdea = ideasQuery.at(input.limit)
    const nextCursor = nextIdea?.serialNumber
    const ideasData = ideasQuery.slice(0, input.limit)

    const ideas = ideasData.map((idea) => {
      const likesCount = idea._count?.ideasLikes ?? 0

      const ideaWithoutCount = omit(idea, ['_count'])

      return {
        ...ideaWithoutCount,
        likesCount: likesCount,
        isLikedByMe: true,
      }
    })

    return { ideas, nextCursor }
  })
