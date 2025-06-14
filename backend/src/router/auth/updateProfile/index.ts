import { zUpdateProfileTrpcInput } from '@brightideas/shared'
import { ExpectedError } from '../../../lib/error.js'
import { toClientMe } from '../../../lib/models.js'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'

export const updateProfileTrpcRoute = trpcLoggedProcedure
  .input(zUpdateProfileTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED')
    }
    if (ctx.me.nick !== input.nick) {
      const exUser = await ctx.prisma.user.findUnique({
        where: {
          nick: input.nick,
        },
      })
      if (exUser) {
        throw new ExpectedError('User with this nick already exists')
      }
    }
    const updatedMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: input,
    })
    ctx.me = updatedMe
    return toClientMe(updatedMe)
  })
