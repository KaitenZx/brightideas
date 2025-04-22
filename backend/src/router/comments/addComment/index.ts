import { zAddCommentTrpcInput } from '@brightideas/shared'
import { TRPCError } from '@trpc/server'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'

export const addCommentTrpcRoute = trpcLoggedProcedure.input(zAddCommentTrpcInput).mutation(async ({ ctx, input }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }
  const { ideaId, text } = input
  const authorId = ctx.me.id

  const idea = await ctx.prisma.idea.findUnique({
    where: { id: ideaId, blockedAt: null },
    select: { id: true },
  })

  if (!idea) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Idea not found or has been blocked.',
    })
  }

  const newComment = await ctx.prisma.comment.create({
    data: { text, ideaId, authorId },
    include: {
      author: {
        select: { id: true, nick: true, name: true, avatar: true },
      },
    },
  })

  return newComment
})
