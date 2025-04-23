import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { applyCron } from './lib/cron.js'
import { type AppContext, createAppContext } from './lib/ctx.js'
import { env } from './lib/env.js'
import { logger } from './lib/logger.js'
import { applyPassportToExpressApp } from './lib/passport.js'
import { initSentry } from './lib/sentry.js'
import { applyServeWebApp } from './lib/serveWebApp.js'
import { applyTrpcToExpressApp } from './lib/trpc.js'
import { trpcRouter } from './router/index.js'
import { presetDb } from './scripts/presetDb.js'

void (async () => {
  let ctx: AppContext | null = null
  try {
    initSentry()
    ctx = createAppContext()
    await presetDb(ctx)
    const expressApp = express()
    expressApp.set('trust proxy', 1)
    const corsOptions = {
      origin: env.HOST_ENV === 'local' ? '*' : env.WEBAPP_URL,
      optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    expressApp.use(cors(corsOptions))

    const globalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 минут
      max: 200, // Лимит: 200 запросов с одного IP за 15 минут
      message: 'Too many requests from this IP, please try again after 15 minutes',
      standardHeaders: true, // Возвращать информацию о лимите в заголовках `RateLimit-*`
      legacyHeaders: false, // Отключить устаревшие заголовки `X-RateLimit-*`
      handler: (req, res, next, options) => {
        logger.warn('rate-limit', `Global rate limit exceeded for IP: ${req.ip}`, { path: req.path })
        res.status(options.statusCode).send(options.message)
      },
    })
    expressApp.use(globalLimiter)

    const signInLimiter = rateLimit({
      windowMs: 10 * 60 * 1000, // 10 минут
      max: 5, // Лимит: 5 попыток входа с одного IP за 10 минут
      message: { message: 'Too many login attempts from this IP, please try again after 10 minutes' }, // Можно вернуть объект
      standardHeaders: true,
      legacyHeaders: false,
      skipSuccessfulRequests: false, // Считать и успешные попытки (чтобы не дать спамить даже с верным паролем)
      handler: (req, res, next, options) => {
        logger.warn('rate-limit', `Sign-in rate limit exceeded for IP: ${req.ip}`, { path: req.path })
        res.status(options.statusCode).send(options.message)
      },
    })
    expressApp.use('/trpc/sign-in', signInLimiter)

    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })
    applyPassportToExpressApp(expressApp, ctx)
    applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    await applyServeWebApp(expressApp)
    applyCron(ctx)
    expressApp.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('express', error)
      if (res.headersSent) {
        next(error)
        return
      }
      res.status(500).send('Internal server error')
    })
    expressApp.listen(env.PORT, () => {
      logger.info('express', `Listening at http://localhost:${env.PORT}`)
    })
  } catch (error) {
    logger.error('app', error)
    await ctx?.stop()
  }
})()
