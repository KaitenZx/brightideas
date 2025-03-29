import { getSharedEnv } from './env.js'

export const getS3UploadName = (path: string) => {
  const filename = path.replace(/^.*[\\/]/, '')
  const parts = filename.split('-')
  parts.shift()
  return parts.join('-')
}

export const getS3UploadUrl = (s3Key: string) => {
  const sharedEnvInstance = getSharedEnv()
  return `${sharedEnvInstance.S3_URL}/${s3Key}`
}
