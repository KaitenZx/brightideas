import { zSignUpTrpcInput } from '@brightideas/shared'
import { sendWelcomeEmail } from '../../../lib/emails.js'
import { ExpectedError } from '../../../lib/error.js'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'
import { hashPassword } from '../../../utils/passwordUtils.js'
import { signJWT } from '../../../utils/signJWT.js'

export const signUpTrpcRoute = trpcLoggedProcedure.input(zSignUpTrpcInput).mutation(async ({ ctx, input }) => {
  const exUserWithNick = await ctx.prisma.user.findUnique({
    where: {
      nick: input.nick,
    },
  })
  if (exUserWithNick) {
    throw new ExpectedError('User with this nick already exists')
  }
  const exUserWithEmail = await ctx.prisma.user.findUnique({
    where: {
      email: input.email,
    },
  })
  if (exUserWithEmail) {
    throw new ExpectedError('User with this email already exists')
  }
  const user = await ctx.prisma.user.create({
    data: {
      nick: input.nick,
      email: input.email,
      password: await hashPassword(input.password),
    },
  })
  void sendWelcomeEmail({ user })
  const token = signJWT(user.id)
  return { token, userId: user.id }
})
