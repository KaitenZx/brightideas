import { getWebAppEnv } from './env'

export const getS3UploadName = (path: string) => {
  const filename = path.replace(/^.*[\\/]/, '')
  const parts = filename.split('-')
  parts.shift()
  return parts.join('-')
}

export const getS3UploadUrl = (s3Key: string) => {
  const sharedEnvInstance = getWebAppEnv()
  return `${sharedEnvInstance.VITE_S3_URL}/${s3Key}`
}
