import { pick } from '@brightideas/shared/src/pick'
import type { User } from '@prisma/client'

export const toClientMe = (user: User | null) => {
  return user && pick(user, ['id', 'nick', 'name', 'permissions', 'email', 'avatar'])
}
