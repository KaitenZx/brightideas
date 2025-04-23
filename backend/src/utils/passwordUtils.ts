/* eslint-disable no-console */
// backend/src/utils/passwordUtils.ts
import crypto from 'node:crypto'
// import { promisify } from 'node:util' // promisify не нужен

// Параметры для scrypt. Могут требовать настройки в зависимости от железа.
const scryptOptions = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }
const keylen = 64 // Длина выходного ключа (хеша) в байтах
const saltlen = 16 // Длина соли в байтах

/**
 * Хеширует пароль с использованием scrypt.
 * Генерирует соль автоматически и сохраняет её вместе с хешем.
 * @param password - Пароль в чистом виде.
 * @returns Промис, который разрешается строкой вида "salt:hash".
 */
export const hashPassword = async (password: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 1. Генерируем соль
    crypto.randomBytes(saltlen, (err, salt) => {
      if (err) {
        return reject(err)
      }
      const saltHex = salt.toString('hex')

      // 2. Хешируем пароль с солью
      crypto.scrypt(password, saltHex, keylen, scryptOptions, (err, derivedKey) => {
        if (err) {
          return reject(err)
        }
        // 3. Комбинируем соль и хеш
        resolve(`${saltHex}:${derivedKey.toString('hex')}`)
      })
    })
  })
}

/**
 * Сравнивает пароль в чистом виде с хешем (формат "salt:hash").
 * @param plainPassword - Пароль, введенный пользователем.
 * @param storedPassword - Строка "salt:hash" из базы данных.
 * @returns Промис, который разрешается булевым значением.
 */
export const comparePassword = async (plainPassword: string, storedPassword: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const [salt, storedHash] = storedPassword.split(':')
      if (!salt || !storedHash) {
        console.error('Invalid stored password format')
        return resolve(false) // Возвращаем false, если формат некорректен
      }

      const storedHashBuffer = Buffer.from(storedHash, 'hex')

      // Хешируем введенный пароль с ИЗВЛЕЧЕННОЙ солью
      crypto.scrypt(plainPassword, salt, keylen, scryptOptions, (err, derivedKey) => {
        if (err) {
          // Если произошла ошибка при хешировании (например, нехватка памяти), считаем пароль неверным
          console.error('Error deriving key during password comparison:', err)
          return resolve(false)
        }

        // Проверяем совпадение длины перед безопасным сравнением
        if (derivedKey.length !== storedHashBuffer.length) {
          return resolve(false)
        }

        // Сравниваем полученный хеш с сохраненным хешем БЕЗОПАСНО
        const passwordsMatch = crypto.timingSafeEqual(derivedKey, storedHashBuffer)
        resolve(passwordsMatch)
      })
    } catch (error) {
      // Ловим синхронные ошибки (например, в split или Buffer.from)
      console.error('Synchronous error comparing password:', error)
      reject(error) // Или resolve(false) в зависимости от желаемого поведения
    }
  })
}
