import { toClientMe } from '../../../lib/models.js'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'

export const getMeTrpcRoute = trpcLoggedProcedure.query(({ ctx }) => {
  return { me: toClientMe(ctx.me) }
})
