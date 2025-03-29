/* eslint-disable node/no-process-env */
import { z } from 'zod'
import { zEnvNonemptyTrimmed } from './zod.js' // Импортируем твой кастомный валидатор

// 1. Определяем схему для общих переменных, используемых в shared
//    Убедись, что все переменные, которые реально используются в shared (cloudinary, s3, webapp utils), здесь перечислены.
const sharedEnvSchema = z.object({
  WEBAPP_URL: zEnvNonemptyTrimmed.url(), // Добавим .url() для валидации формата URL
  CLOUDINARY_CLOUD_NAME: zEnvNonemptyTrimmed,
  S3_URL: zEnvNonemptyTrimmed.url(), // Добавим .url() для валидации формата URL
})

// 2. Определяем тип на основе схемы
type SharedEnv = z.infer<typeof sharedEnvSchema>

// 3. Внутренняя переменная для хранения загруженных и провалидированных переменных
//    Изначально null, чтобы показать, что загрузка еще не произошла.
let loadedSharedEnv: SharedEnv | null = null

// 4. Функция для явной ЗАГРУЗКИ и ВАЛИДАЦИИ общих переменных.
//    Принимает необязательный аргумент - источник переменных (объект).
//    Если источник не передан, пытается использовать `process.env`.
export function loadAndValidateSharedEnv(envSource?: Record<string, any>): SharedEnv {
  // Если переменные уже были успешно загружены, просто возвращаем их.
  if (loadedSharedEnv) {
    return loadedSharedEnv
  }

  console.log('Attempting to load and validate shared environment variables...') // Лог для отладки

  // Определяем источник: переданный объект или process.env по умолчанию
  const source = envSource || process.env
  if (!source) {
    throw new Error('Environment variable source is undefined.')
  }

  // Собираем "сырые" значения из ИСТОЧНИКА (source).
  // Используем правильные имена переменных как в .env файлах (с VITE_ или без).
  const sharedEnvRaw = {
    // Приоритет у VITE_ (для фронтенда), затем обычное имя (для бэкенда)
    WEBAPP_URL: source['VITE_WEBAPP_URL'] || source['WEBAPP_URL'],
    CLOUDINARY_CLOUD_NAME: source['VITE_CLOUDINARY_CLOUD_NAME'] || source['CLOUDINARY_CLOUD_NAME'],
    S3_URL: source['VITE_S3_URL'] || source['S3_URL'],
  }

  // Логгируем сырые значения перед парсингом для отладки
  console.log('Raw shared env values before parsing:', sharedEnvRaw)

  try {
    // Валидируем собранные "сырые" значения с помощью Zod-схемы
    loadedSharedEnv = sharedEnvSchema.parse(sharedEnvRaw)
    console.log('Shared environment variables loaded and validated successfully.') // Успешный лог
    return loadedSharedEnv
  } catch (error) {
    console.error('Failed to parse shared environment variables!')
    console.error('Source:', source) // Показываем источник
    console.error('Raw values used:', sharedEnvRaw) // Показываем что пытались парсить
    console.error('Validation errors:', error) // Показываем ошибку Zod
    // Выбрасываем новую ошибку, чтобы приложение не продолжило работу с невалидным env
    throw new Error('FATAL: Invalid or missing shared environment variables.')
  }
}

// 5. Функция для ПОЛУЧЕНИЯ уже загруженных и провалидированных переменных.
//    Все модули, которым нужны эти переменные, должны вызывать эту функцию.
export function getSharedEnv(): SharedEnv {
  if (!loadedSharedEnv) {
    // Если переменные пытаются получить до их загрузки, выбрасываем ошибку.
    // Это помогает выявить проблемы на ранней стадии.
    // Альтернатива: попытаться загрузить здесь (`return loadAndValidateSharedEnv();`), но это менее предсказуемо.
    throw new Error(
      'Shared environment variables were accessed before calling loadAndValidateSharedEnv(). ' +
        'Make sure to call loadAndValidateSharedEnv() at the application entry point.'
    )
  }
  // Возвращаем ранее загруженные и провалидированные переменные.
  return loadedSharedEnv
}

// 6. Экспортируем схему, если она нужна для валидации в других местах (опционально)
export { sharedEnvSchema }
