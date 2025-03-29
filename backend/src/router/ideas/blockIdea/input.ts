import { zStringRequired } from '@brightideas/shared'
import { z } from 'zod'

export const zBlockIdeaTrpcInput = z.object({
  ideaId: zStringRequired,
})
