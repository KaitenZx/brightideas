import { cloudinaryUploadTypes } from '@brightideas/shared/src/cloudinary'
import { getKeysAsArray } from '@brightideas/shared/src/getKeysAsArray'
import { z } from 'zod'

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})
