import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { logger } from '../lib/logger.js'

const randomBytesAsync = promisify(randomBytes)

const scryptOptions = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }
const keylen = 64
const saltlen = 16

/**
 * @param password - Пароль в чистом виде.
 * @returns Промис, который разрешается строкой вида "salt:hash".
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await randomBytesAsync(saltlen)
  const saltHex = salt.toString('hex')
  const derivedKey = (await new Promise((resolve, reject) => {
    scrypt(password, saltHex, keylen, scryptOptions, (err, derivedKey) => {
      if (err) return reject(err)
      resolve(derivedKey)
    })
  })) as Buffer
  return `${saltHex}:${derivedKey.toString('hex')}`
}

/**
 * @param plainPassword - Пароль, введенный пользователем.
 * @param storedPassword - Строка "salt:hash" из базы данных.
 * @returns Промис, который разрешается булевым значением.
 */
export const comparePassword = async (plainPassword: string, storedPassword: string): Promise<boolean> => {
  try {
    const [salt, storedHash] = storedPassword.split(':')
    if (!salt || !storedHash) {
      logger.error('password-compare', new Error('Invalid stored password format'), { storedPassword })
      return false
    }

    const storedHashBuffer = Buffer.from(storedHash, 'hex')
    const derivedKey = (await new Promise((resolve, reject) => {
      scrypt(plainPassword, salt, keylen, scryptOptions, (err, derivedKey) => {
        if (err) return reject(err)
        resolve(derivedKey)
      })
    })) as Buffer

    if (derivedKey.length !== storedHashBuffer.length) {
      // Этого никогда не должно случиться с одинаковыми параметрами scrypt, но это проверка на всякий случай.
      logger.error('password-compare', new Error('Derived key length does not match stored hash length'), {
        derivedKeyLength: derivedKey.length,
        storedHashBufferLength: storedHashBuffer.length,
      })
      return false
    }

    return timingSafeEqual(derivedKey, storedHashBuffer)
  } catch (error) {
    logger.error('password-compare', error, {
      message: 'Unexpected error during password comparison',
    })
    return false
  }
}
