import cors from 'cors'
import express from 'express'
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
    expressApp.use(cors())
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
