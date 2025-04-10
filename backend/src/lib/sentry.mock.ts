import { vi } from 'vitest' // <-- Импортируем vi

vi.mock('./sentry', () => ({
  initSentry: vi.fn(),
  sentryCaptureException: vi.fn(),
}))
