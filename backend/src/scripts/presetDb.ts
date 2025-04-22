import type { AppContext } from '../lib/ctx.js'
import { env } from '../lib/env.js'
import { hashPassword } from '../utils/passwordUtils.js'

export const presetDb = async (ctx: AppContext) => {
  await ctx.prisma.user.upsert({
    where: {
      nick: 'admin',
    },
    create: {
      nick: 'admin',
      email: 'admin@example.com',
      password: await hashPassword(env.INITIAL_ADMIN_PASSWORD),
      permissions: ['ALL'],
    },
    update: {
      permissions: ['ALL'],
    },
  })
}
