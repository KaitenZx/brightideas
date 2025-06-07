import { z } from 'zod'
import { cloudinaryUploadTypes } from './cloudinaryTypes.js'
import { getKeysAsArray } from './getKeysAsArray.js'

export const zEnvNonemptyTrimmed = z.string().trim().min(1)
export const zEnvNonemptyTrimmedRequiredOnNotLocal = zEnvNonemptyTrimmed.optional().refine(
  // eslint-disable-next-line node/no-process-env
  (val) => `${process.env.HOST_ENV}` === 'local' || !!val,
  'Required on not local host'
)
export const zEnvHost = z.enum(['local', 'production'])

export const zStringRequired = z.string({ required_error: 'Please, fill it' }).min(1, 'Please, fill it')
export const zStringOptional = z.string().optional()
export const zEmailRequired = zStringRequired.email()
export const zNickRequired = zStringRequired.regex(
  /^[a-z0-9-]+$/,
  'Nick may contain only lowercase letters, numbers and dashes'
)
export const zStringMin = (min: number) => zStringRequired.min(min, `Text should be at least ${min} characters long`)
export const zPasswordsMustBeTheSame =
  (passwordFieldName: string, passwordAgainFieldName: string) => (val: any, ctx: z.RefinementCtx) => {
    if (val[passwordFieldName] !== val[passwordAgainFieldName]) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords must be the same',
        path: [passwordAgainFieldName],
      })
    }
  }

export const zBaseIdeaInput = z.object({
  name: zStringRequired,
  nick: zNickRequired,
  description: zStringRequired,
  text: zStringMin(100),
  images: z.array(zStringRequired),
  certificate: z.string().nullable(),
  documents: z.array(zStringRequired),
})

export type BaseIdeaInput = z.infer<typeof zBaseIdeaInput>

export const zBaseUpdateIdeaInput = zBaseIdeaInput.partial().extend({
  ideaId: zStringRequired,
  nick: zNickRequired.optional(),
})
export type BaseUpdateIdeaInput = z.infer<typeof zBaseUpdateIdeaInput>

export const zSignInTrpcInput = z.object({
  nick: zStringRequired,
  password: zStringRequired,
})

export const zSignUpTrpcInput = z.object({
  nick: zNickRequired,
  email: zEmailRequired,
  password: zStringRequired,
})

export const zUpdatePasswordTrpcInput = z.object({
  oldPassword: zStringRequired,
  newPassword: zStringRequired,
})

export const zUpdateProfileTrpcInput = z.object({
  nick: zNickRequired,
  name: z.string().max(50).default(''),
  avatar: z.string().nullable(),
})

export const zAddCommentTrpcInput = z.object({
  ideaId: z.string().uuid(),
  text: z
    .string({ required_error: 'Comment text cannot be empty.' })
    .max(1000, 'Comment cannot exceed 1000 characters.'),
})

export const zGetCommentsTrpcInput = z.object({
  ideaId: z.string().uuid(),
  limit: z.number().min(1).max(50).default(10),
  cursor: z.string().uuid().optional(),
})

export const zBlockIdeaTrpcInput = z.object({
  ideaId: zStringRequired,
})

export const zGetIdeaTrpcInput = z.object({
  ideaNick: zStringRequired,
})

export const zGetIdeasTrpcInput = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.number().min(1).max(100).default(10),
  search: zStringOptional,
})

export const zGetLikedIdeasTrpcInput = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.number().min(1).max(100).default(10),
})

export const zGetMyIdeasTrpcInput = z.object({
  cursor: z.coerce.number().optional(),
  limit: z.number().min(1).max(100).default(10),
})

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})

export const zPrepareS3UploadTrpcInput = z.object({
  fileName: zStringRequired,
  fileType: zStringRequired,
  fileSize: z.number().int().positive(),
})
