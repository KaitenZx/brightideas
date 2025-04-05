//const cloudinaryUrl = `https://res.cloudinary.com/${sharedEnvInstance.CLOUDINARY_CLOUD_NAME}/image/upload`

import {
  CloudinaryUploadPresetName,
  CloudinaryUploadType,
  CloudinaryUploadTypeName,
  cloudinaryUploadTypes,
  CloudinaryUploadTypes,
} from '@brightideas/shared'
import { getWebAppEnv } from './env'

const getBaseCloudinaryUrl = (): string => {
  // Получаем env ТОЛЬКО когда функция вызвана
  const cloudName = getWebAppEnv().VITE_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload`
}

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
