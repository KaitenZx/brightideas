import { TRPCError } from '@trpc/server'
import { ideas } from '../../lib/ideas'
import { trpc } from '../../lib/trpc'
import { zCreateIdeaTrpcInput } from './input'

export const createIdeaTrpcRoute = trpc.procedure.input(zCreateIdeaTrpcInput).mutation(({ input }) => {
  if (ideas.find((idea) => idea.nick === input.nick)) {
    throw new TRPCError({
      code: 'CONFLICT', // HTTP 409 Conflict
      message: 'Idea with this nick already exists',
    })
  }

  ideas.unshift(input)
  return true
})
