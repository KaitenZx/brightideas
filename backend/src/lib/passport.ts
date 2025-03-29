import type { Express, RequestHandler } from 'express'
import { Passport } from 'passport'
import { ExtractJwt, Strategy as JWTStrategy } from 'passport-jwt'
import type { AppContext } from './ctx.js'
import { env } from './env.js'

export const applyPassportToExpressApp = (expressApp: Express, ctx: AppContext): void => {
  const passport = new Passport()

  passport.use(
    new JWTStrategy(
      {
        secretOrKey: env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      },
      (jwtPayload: string, done) => {
        ctx.prisma.user
          .findUnique({
            where: { id: jwtPayload },
          })
          .then((user) => {
            if (!user) {
              done(null, false)
              return
            }
            done(null, user)
          })
          .catch((error: unknown) => {
            done(error, false)
          })
      }
    )
  )

  expressApp.use((req, res, next) => {
    if (!req.headers.authorization) {
      next()
      return
    }
    const middleware = passport.authenticate(
      'jwt',
      { session: false },
      (_error: unknown, user?: Express.User | false) => {
        req.user = user || undefined
        next()
      }
    ) as RequestHandler

    middleware(req, res, next)
  })
}
