import { z } from 'zod'

export const zGetLikedIdeasTrpcInput = z.object({
  cursor: z.coerce.number().optional(), // Теперь cursor - это number (serialNumber)
  limit: z.number().min(1).max(100).default(10),
})
