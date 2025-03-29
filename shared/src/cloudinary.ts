import { getSharedEnv } from './env.js'

//const cloudinaryUrl = `https://res.cloudinary.com/${sharedEnvInstance.CLOUDINARY_CLOUD_NAME}/image/upload`

const getBaseCloudinaryUrl = (): string => {
  // Получаем env ТОЛЬКО когда функция вызвана
  const cloudName = getSharedEnv().CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload`
}

type CloudinaryUploadType = {
  folder: string
  transformation: string
  format: string
  presets: Record<string, string>
}

export const cloudinaryUploadTypes = {
  avatar: {
    folder: 'avatars',
    transformation: 'w_400,h_400,c_fill',
    format: 'png',
    presets: {
      small: 'w_200,h_200,c_fill',
      big: 'w_400,h_400,c_fill',
    },
  },
  image: {
    folder: 'images',
    transformation: 'w_1000,h_1000,c_limit',
    format: 'jpg',
    presets: {
      preview: 'w_200,h_200,c_fit,q_80',
      large: 'w_1000,h_1000,c_limit,q_80',
    },
  },
} satisfies Record<string, CloudinaryUploadType>

type CloudinaryUploadTypes = typeof cloudinaryUploadTypes
export type CloudinaryUploadTypeName = keyof CloudinaryUploadTypes
export type CloudinaryUploadPresetName<TTypeName extends CloudinaryUploadTypeName> =
  keyof CloudinaryUploadTypes[TTypeName]['presets']

export const getCloudinaryUploadUrl = <TTypeName extends CloudinaryUploadTypeName>(
  publicId: string,
  typeName: TTypeName,
  presetName: CloudinaryUploadPresetName<TTypeName>
) => {
  const type = cloudinaryUploadTypes[typeName] as CloudinaryUploadType
  const preset = type.presets[presetName as string]
  const cloudinaryUrl = getBaseCloudinaryUrl()
  return `${cloudinaryUrl}/${preset}/${publicId}`
}

export const getAvatarUrl = (
  publicId: string | null | undefined,
  preset: keyof CloudinaryUploadTypes['avatar']['presets']
) =>
  publicId
    ? getCloudinaryUploadUrl(publicId, 'avatar', preset)
    : getCloudinaryUploadUrl('v1743279658/avatar-placeholder_nkldza.png', 'avatar', preset)
