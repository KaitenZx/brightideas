import { TRPCError } from '@trpc/server'
import { trpc } from '../../lib/trpc'
import { zCreateIdeaTrpcInput } from './input'

export const createIdeaTrpcRoute = trpc.procedure.input(zCreateIdeaTrpcInput).mutation(async ({ input, ctx }) => {
  if (!ctx.me) {
    throw Error('UNAUTHORIZED')
  }
  const existingIdea = await ctx.prisma.idea.findUnique({
    where: {
      nick: input.nick,
    },
  })

  if (existingIdea) {
    throw new TRPCError({
      code: 'CONFLICT', // HTTP 409 Conflict
      message: 'Idea with this nick already exists',
    })
  }

  // Создание новой записи
  await ctx.prisma.idea.create({
    data: { ...input, authorId: ctx.me.id },
  })

  return true
})
