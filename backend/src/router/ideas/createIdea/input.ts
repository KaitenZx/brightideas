import { zNickRequired, zStringMin, zStringRequired } from '@brightideas/shared'
import { z } from 'zod'

export const zCreateIdeaTrpcInput = z.object({
  name: zStringRequired,
  nick: zNickRequired,
  description: zStringRequired,
  text: zStringMin(100),
  images: z.array(zStringRequired),
  certificate: z.string().nullable(),
  documents: z.array(zStringRequired),
})
