import { ExpectedError } from '../../../lib/error.js'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'
import { getPasswordHash } from '../../../utils/getPasswordHash.js'
import { signJWT } from '../../../utils/signJWT.js'
import { zSignInTrpcInput } from './input.js'

export const signInTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  const user = await ctx.prisma.user.findFirst({
    where: {
      nick: input.nick,
      password: getPasswordHash(input.password),
    },
  })
  if (!user) {
    throw new ExpectedError('Wrong nick or password')
  }
  const token = signJWT(user.id)
  return { token, userId: user.id }
})
