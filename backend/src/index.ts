import * as trpcExpress from '@trpc/server/adapters/express'
import cors from 'cors' // Импорт CORS
import express from 'express'
import { trpcRouter } from './trpc'

const port = 3000

const expressApp = express()

// Настройка CORS
expressApp.use(
  cors({
    origin: 'http://localhost:5173', // Замените на ваш URL фронтенда
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  })
)

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
  console.info(`Listening at http://localhost:${port}`)
})
