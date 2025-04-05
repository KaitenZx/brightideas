export type CloudinaryUploadType = {
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

export type CloudinaryUploadTypes = typeof cloudinaryUploadTypes
export type CloudinaryUploadTypeName = keyof CloudinaryUploadTypes
export type CloudinaryUploadPresetName<TTypeName extends CloudinaryUploadTypeName> =
  keyof CloudinaryUploadTypes[TTypeName]['presets']
