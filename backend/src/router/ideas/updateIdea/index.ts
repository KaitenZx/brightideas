import { zBaseUpdateIdeaInput } from '@brightideas/shared'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'
import { canEditIdea } from '../../../utils/can.js'

export const updateIdeaTrpcRoute = trpcLoggedProcedure.input(zBaseUpdateIdeaInput).mutation(async ({ ctx, input }) => {
  const { ideaId, ...ideaInput } = input
  if (!ctx.me) {
    throw new Error('UNAUTHORIZED')
  }
  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
  })
  if (!idea) {
    throw new Error('NOT_FOUND')
  }
  if (!canEditIdea(ctx.me, idea)) {
    throw new Error('NOT_YOUR_IDEA')
  }
  if (idea.nick !== input.nick) {
    const exIdea = await ctx.prisma.idea.findUnique({
      where: {
        nick: input.nick,
      },
    })
    if (exIdea) {
      throw new Error('Idea with this nick already exists')
    }
  }
  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      ...ideaInput,
    },
  })
  return true
})
