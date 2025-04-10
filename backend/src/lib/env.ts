/* eslint-disable no-console */
/* eslint-disable node/no-process-env */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { zEnvHost, zEnvNonemptyTrimmed, zEnvNonemptyTrimmedRequiredOnNotLocal } from '@brightideas/shared'
import * as dotenv from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV !== 'test') {
  console.log('NODE_ENV is not "test", attempting to load .env files...') // Добавим лог

  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  const findEnvFileInProjectRoot = (targetPath: string): string | null => {
    let currentDir = __dirname
    while (!fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml')) && currentDir !== path.parse(currentDir).root) {
      currentDir = path.dirname(currentDir)
    }

    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      const projectRootDir = currentDir
      const fullTargetPath = path.resolve(projectRootDir, targetPath)
      console.log(`Checking for env file at: ${fullTargetPath}`)
      if (fs.existsSync(fullTargetPath)) {
        console.log(`Found env file: ${fullTargetPath}`)
        return fullTargetPath
      } else {
        console.warn(`Env file not found at expected location: ${fullTargetPath}`)
      }
    } else {
      console.warn('Could not find project root (marker: pnpm-workspace.yaml) starting from:', __dirname)
    }
    return null
  }

  const webappEnvFilePath = findEnvFileInProjectRoot('webapp/.env')
  if (webappEnvFilePath) {
    dotenv.config({ path: webappEnvFilePath, override: true })
    const nodeEnvWebappPath = `${webappEnvFilePath}.${process.env.NODE_ENV}`
    if (fs.existsSync(nodeEnvWebappPath)) {
      console.log(`Loading node-env specific webapp env from: ${nodeEnvWebappPath}`)
      dotenv.config({ path: nodeEnvWebappPath, override: true })
    }
  }

  const backendEnvFilePath = findEnvFileInProjectRoot('backend/.env')
  if (backendEnvFilePath) {
    dotenv.config({ path: backendEnvFilePath, override: true })
    const nodeEnvBackendPath = `${backendEnvFilePath}.${process.env.NODE_ENV}`
    if (fs.existsSync(nodeEnvBackendPath)) {
      console.log(`Loading node-env specific backend env from: ${nodeEnvBackendPath}`)
      dotenv.config({ path: nodeEnvBackendPath, override: true })
    }
  }
} else {
  console.log('NODE_ENV is "test", skipping .env file loading in backend/src/lib/env.ts.')
}

const zEnv = z.object({
  NODE_ENV: z.enum(['test', 'development', 'production']),
  PORT: zEnvNonemptyTrimmed,
  HOST_ENV: zEnvHost,
  DATABASE_URL: zEnvNonemptyTrimmed.refine((val) => {
    if (process.env.NODE_ENV !== 'test') {
      return true
    }
    const [databaseUrl] = val.split('?')
    const [databaseName] = databaseUrl.split('/').reverse()
    return databaseName.endsWith('-test')
  }, `Data base name should ends with "-test" on test environment`),
  JWT_SECRET: zEnvNonemptyTrimmed,
  PASSWORD_SALT: zEnvNonemptyTrimmed,
  WEBAPP_URL: zEnvNonemptyTrimmed,
  INITIAL_ADMIN_PASSWORD: zEnvNonemptyTrimmed,
  //BREVO_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  //FROM_EMAIL_NAME: zEnvNonemptyTrimmed,
  //FROM_EMAIL_ADDRESS: zEnvNonemptyTrimmed,
  DEBUG: z
    .string()
    .optional()
    .refine(
      (val) => process.env.HOST_ENV === 'local' || process.env.NODE_ENV !== 'production' || (!!val && val.length > 0),
      'Required on not local host on production'
    ),
  BACKEND_SENTRY_DSN: zEnvNonemptyTrimmedRequiredOnNotLocal,
  SOURCE_VERSION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_API_SECRET: zEnvNonemptyTrimmedRequiredOnNotLocal,
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
  S3_ACCESS_KEY_ID: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_SECRET_ACCESS_KEY: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_BUCKET_NAME: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_REGION: zEnvNonemptyTrimmedRequiredOnNotLocal,
  S3_URL: zEnvNonemptyTrimmed,
})

let validatedEnv
try {
  validatedEnv = zEnv.parse(process.env)
  console.log('Backend environment variables validated successfully.')
} catch (error) {
  console.error('Failed to validate backend environment variables!', error)
  throw new Error('FATAL: Invalid or missing backend environment variables.')
}

export const env = validatedEnv
