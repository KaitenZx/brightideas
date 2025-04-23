import { zBlockIdeaTrpcInput } from '@brightideas/shared'
import { sendIdeaBlockedEmail } from '../../../lib/emails.js'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'
import { canBlockIdeas } from '../../../utils/can.js'

export const blockIdeaTrpcRoute = trpcLoggedProcedure.input(zBlockIdeaTrpcInput).mutation(async ({ ctx, input }) => {
  const { ideaId } = input
  if (!canBlockIdeas(ctx.me)) {
    throw new Error('PERMISSION_DENIED')
  }
  const idea = await ctx.prisma.idea.findUnique({
    where: {
      id: ideaId,
    },
    include: {
      author: true,
    },
  })
  if (!idea) {
    throw new Error('NOT_FOUND')
  }
  await ctx.prisma.idea.update({
    where: {
      id: ideaId,
    },
    data: {
      blockedAt: new Date(),
    },
  })
  void sendIdeaBlockedEmail({ user: idea.author, idea })
  return true
})
