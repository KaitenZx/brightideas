import { zSignInTrpcInput } from '@brightideas/shared'
import { ExpectedError } from '../../../lib/error.js'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'
// Импортируем обе функции!
import { comparePassword } from '../../../utils/passwordUtils.js'
import { signJWT } from '../../../utils/signJWT.js'

export const signInTrpcRoute = trpcLoggedProcedure.input(zSignInTrpcInput).mutation(async ({ ctx, input }) => {
  // 1. Найти пользователя по нику
  const user = await ctx.prisma.user.findUnique({
    // Используем findUnique для уникального поля nick
    where: {
      nick: input.nick,
    },
  })

  // 2. Если пользователь не найден ИЛИ пароль не совпадает -> ошибка
  // Используем comparePassword для сравнения введенного пароля с хешем из БД
  if (!user || !(await comparePassword(input.password, user.password))) {
    // Безопасное сообщение об ошибке (не уточняем, что именно не так - ник или пароль)
    throw new ExpectedError('Wrong nick or password')
  }

  // 3. Если все ок - генерируем токен
  const token = signJWT(user.id)
  return { token, userId: user.id }
})
