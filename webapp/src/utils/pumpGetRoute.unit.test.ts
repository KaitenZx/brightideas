import { webAppEnvSchema } from '../lib/env'
import { pgr } from './pumpGetRoute'

const mockEnvRaw = {
  NODE_ENV: 'development',
  HOST_ENV: 'local',
  VITE_BACKEND_TRPC_URL: 'http://localhost:3000/trpc',
  VITE_WEBAPP_URL: 'https://test.example.com', // <-- Важно для теста abs
  VITE_CLOUDINARY_CLOUD_NAME: 'mock-cloud',
  VITE_S3_URL: 'https://mock.s3.amazonaws.com',
  // Остальные опциональны при HOST_ENV=local
}

// 3. Валидируем моковые данные ОДИН РАЗ перед тестами
//    Это гарантирует, что наш мок соответствует контракту схемы
let validMockEnv: ReturnType<typeof webAppEnvSchema.parse>
try {
  validMockEnv = webAppEnvSchema.parse(mockEnvRaw)
} catch (error) {
  console.error('FATAL: Mock environment data failed validation!', error)
  // Прерываем тесты, если мок невалиден
  throw new Error('Invalid mock environment data for tests.')
}

// 4. Мокируем модуль ../config/env ЦЕЛИКОМ
jest.mock('../config/env', () => ({
  // Мокируем ТОЛЬКО функцию getWebAppEnv
  // Мы не хотим вызывать настоящую initializeWebAppEnv в тестах
  getWebAppEnv: () => validMockEnv, // Возвращаем УЖЕ провалидированные моковые данные
  // initializeWebAppEnv здесь не мокируем, она не должна вызываться
}))

describe('pgr', () => {
  // beforeAll и beforeEach для инициализации больше не нужны, т.к. мы используем jest.mock

  it('return simple route', () => {
    const getSimpleRoute = pgr(() => '/simple')
    expect(getSimpleRoute()).toBe('/simple')
  })

  it('return route with params', () => {
    const getWithParamsRoute = pgr({ param1: true, param2: true }, ({ param1, param2 }) => `/a/${param1}/b/${param2}/c`)
    expect(getWithParamsRoute({ param1: 'xxx', param2: 'yyy' })).toBe('/a/xxx/b/yyy/c')
  })

  it('return route definition', () => {
    const getWithParamsRoute = pgr({ param1: true, param2: true }, ({ param1, param2 }) => `/a/${param1}/b/${param2}/c`)
    expect(getWithParamsRoute.definition).toBe('/a/:param1/b/:param2/c')
  })

  it('return route placeholders', () => {
    const getWithParamsRoute = pgr({ param1: true, param2: true }, ({ param1, param2 }) => `/a/${param1}/b/${param2}/c`)
    expect(getWithParamsRoute.placeholders).toMatchObject({ param1: ':param1', param2: ':param2' })
  })

  it('return absolute route', () => {
    const getSimpleRoute = pgr(() => '/simple')
    // Проверяем, что используется VITE_WEBAPP_URL из мока (validMockEnv)
    expect(getSimpleRoute({ abs: true })).toBe('https://test.example.com/simple')
  })

  it('return absolute route with params', () => {
    const getWithParamsRoute = pgr({ id: true }, ({ id }) => `/items/${id}`)
    expect(getWithParamsRoute({ id: '123', abs: true })).toBe('https://test.example.com/items/123')
  })
})
