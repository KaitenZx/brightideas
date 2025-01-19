import * as trpcExpress from '@trpc/server/adapters/express'
import express from 'express'
import { trpcRouter } from './trpc'

const port = 3000

const expressApp = express()
expressApp.get('/ping', (req, res) => {
  res.send('pong')
})
expressApp.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: trpcRouter,
  })
)
expressApp.listen(port, () => {
  console.info('Listening at http://localhost:3000')
})
