/* eslint-disable node/no-process-env */
import { EOL } from 'os'
import { omit } from '@brightideas/shared'
import { TRPCError } from '@trpc/server'
import debug from 'debug'
import pc from 'picocolors'
import { serializeError, type ErrorObject } from 'serialize-error'
import { MESSAGE } from 'triple-beam'
import winston from 'winston'
import * as yaml from 'yaml'
import { deepMap } from '../utils/deepMap.js'
import { env } from './env.js'
import { ExpectedError } from './error.js'
import { sentryCaptureException } from './sentry.js'

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json() // Форматируем в JSON
)

const localConsoleFormat = winston.format.printf((info) => {
  const { level, message, timestamp, logType, stack, ...meta } = info

  const setColor =
    {
      info: pc.blue,
      error: pc.red,
      warn: pc.yellow,
      debug: pc.cyan,
    }[level] ?? ((str: string) => str)

  const type = logType ? `:${logType}` : ''
  const levelAndType = `${level}${type}`

  const time = pc.green(String(timestamp))

  const metaToPrint = omit(meta, ['service', 'ddsource', 'ddtags', 'hostname', 'hostEnv', MESSAGE])

  const metaString =
    Object.keys(metaToPrint).length > 0
      ? `${EOL}${yaml.stringify(metaToPrint, null, {
          singleQuote: true,
          defaultKeyType: 'PLAIN',
          defaultStringType: 'QUOTE_SINGLE',
        })}`
      : ''

  const stackString = stack ? `${EOL}${pc.red(String(stack))}` : ''

  return `${setColor(levelAndType)} ${time}${EOL}${message}${metaString}${stackString}${EOL}`
})

// --- Маскирование данных ---
export type LoggerMetaData = Record<string, any> | undefined

const keysToMask = new Set([
  'email',
  'password',
  'newPassword',
  'oldPassword',
  'token',
  // 'text', // Оставляем, т.к. текст идеи/описания может быть важен в логах
  // 'description', // Тоже оставляем
  'apiKey',
  'apiSecret',
  'secretKey',
  'authorization', // Часто содержит 'Bearer token'
  'cookie', // Может содержать сессионные куки
])

const prettifyMeta = (meta: LoggerMetaData): LoggerMetaData => {
  if (!meta) return undefined
  return deepMap(meta, ({ key, value }) => {
    if (typeof key === 'string' && keysToMask.has(key)) {
      return '🙈'
    }
    return value
  })
}

export const winstonLogger = winston.createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: jsonFormat,
  defaultMeta: {
    service: env.DD_SERVICE || 'brightideas-backend',
    ddsource: 'node.js',
    ddtags: `env:${env.DD_ENV || env.NODE_ENV},region:${process.env.FLY_REGION || 'unknown'}`,
    hostname: process.env.FLY_ALLOC_ID || 'local',
    hostEnv: env.HOST_ENV,
  },
  transports: [
    new winston.transports.Console({
      format: env.HOST_ENV === 'local' ? localConsoleFormat : jsonFormat,
      level: env.HOST_ENV === 'local' ? 'debug' : 'info',
    }),

    ...(env.DATADOG_API_KEY && env.HOST_ENV !== 'local'
      ? [
          new winston.transports.Http({
            host: `http-intake.logs.${env.DATADOG_SITE || 'datadoghq.eu'}`,
            path: '/api/v2/logs',
            ssl: true,
            port: 443,
            headers: {
              'DD-API-KEY': env.DATADOG_API_KEY,
              'Content-Type': 'application/json',
            },
            format: jsonFormat, // Обязательно JSON
            level: 'info', // Отправляем info и выше в Datadog
            batch: true,
            silent: env.NODE_ENV === 'test', // Если нужно заглушить в тестах
          }),
        ]
      : []),
  ],
  exitOnError: false,
})

export const logger = {
  debug: (logType: string, message: string, meta?: LoggerMetaData) => {
    if (debug.enabled(`brightideas:${logType}`)) {
      const maskedMeta = prettifyMeta(meta)
      winstonLogger.debug(message, { logType, ...maskedMeta })
    }
  },
  info: (logType: string, message: string, meta?: LoggerMetaData) => {
    if (env.HOST_ENV !== 'local' || debug.enabled(`brightideas:${logType}`)) {
      const maskedMeta = prettifyMeta(meta)
      winstonLogger.info(message, { logType, ...maskedMeta })
    }
  },
  warn: (logType: string, message: string, meta?: LoggerMetaData) => {
    if (env.HOST_ENV !== 'local' || debug.enabled(`brightideas:${logType}`)) {
      const maskedMeta = prettifyMeta(meta)
      winstonLogger.warn(message, { logType, ...maskedMeta })
    }
  },
  error: (logType: string, error: any, meta?: LoggerMetaData) => {
    const isExpected =
      error instanceof ExpectedError || (error instanceof TRPCError && error.cause instanceof ExpectedError)
    const maskedMeta = prettifyMeta(meta)
    if (!isExpected) {
      sentryCaptureException(error, maskedMeta)
    }
    const serializedError: ErrorObject = serializeError(error)
    winstonLogger.error(serializedError.message || 'Unknown error', {
      logType,
      error: serializedError,
      ...maskedMeta,
    })
  },
}

process.on('uncaughtException', (error: Error) => {
  logger.error('uncaught', error, { fatal: true }) // Добавляем метаданные
  winstonLogger.on('finish', () => process.exit(1))
  winstonLogger.end()
  setTimeout(() => process.exit(1), 5000)
})

process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  const error = reason instanceof Error ? reason : new Error(`Unhandled Rejection: ${String(reason)}`)
  logger.error('unhandledRejection', error, { promise }) // Логируем как ошибку
})
