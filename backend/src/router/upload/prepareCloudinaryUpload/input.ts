import { cloudinaryUploadTypes } from '@brightideas/shared'
import { getKeysAsArray } from '@brightideas/shared'
import { z } from 'zod'

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})
