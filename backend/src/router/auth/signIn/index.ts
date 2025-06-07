import { zSignInTrpcInput } from '@brightideas/shared'
import { ExpectedError } from '../../../lib/error.js'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'
import { comparePassword } from '../../../utils/passwordUtils.js'
import { signJWT } from '../../../utils/signJWT.js'

export const signInTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (!user || !(await comparePassword(input.password, user.password))) {
    throw new ExpectedError('Wrong nick or password')
  }

  const token = signJWT(user.id)
  return { token, userId: user.id }
})
