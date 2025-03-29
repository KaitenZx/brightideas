import { zEmailRequired, zNickRequired, zStringRequired } from '@brightideas/shared'
import { z } from 'zod'

export const zSignUpTrpcInput = z.object({
  nick: zNickRequired,
  email: zEmailRequired,
  password: zStringRequired,
})
