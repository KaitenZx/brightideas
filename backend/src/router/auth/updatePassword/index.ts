import { zUpdatePasswordTrpcInput } from '@brightideas/shared'
import { ExpectedError } from '../../../lib/error.js'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'
import { comparePassword, hashPassword } from '../../../utils/passwordUtils.js'

export const updatePasswordTrpcRoute = trpcLoggedProcedure
  .input(zUpdatePasswordTrpcInput)
  .mutation(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED')
    }

    const isOldPasswordValid = await comparePassword(input.oldPassword, ctx.me.password)
    if (!isOldPasswordValid) {
      throw new ExpectedError('Wrong old password')
    }

    if (input.oldPassword === input.newPassword) {
      throw new ExpectedError('New password cannot be the same as the old password.')
    }

    const newPasswordHash = await hashPassword(input.newPassword)

    const updatedMe = await ctx.prisma.user.update({
      where: {
        id: ctx.me.id,
      },
      data: {
        password: newPasswordHash, // Сохраняем новый хеш
      },
    })

    ctx.me = updatedMe // Обновляем данные в контексте

    // 7. (Опционально) Инвалидировать другие сессии/токены этого пользователя.
    // С простыми JWT это сложно, но стоит помнить как возможное улучшение.

    return true // Возвращаем успех
  })
