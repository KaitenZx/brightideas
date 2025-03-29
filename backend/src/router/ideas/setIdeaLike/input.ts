import { zStringRequired } from '@brightideas/shared'
import { z } from 'zod'

export const zSetIdeaLikeIdeaTrpcInput = z.object({
  ideaId: zStringRequired,
  isLikedByMe: z.boolean(),
})
