import { zBaseIdeaInput } from '@brightideas/shared'
import { TRPCError } from '@trpc/server'
import sanitizeHtml from 'sanitize-html'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'

const sanitizeConfig: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'br', 'a'],
  allowedAttributes: {
    a: ['href'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  allowedSchemesByTag: {},
  allowedSchemesAppliedToAttributes: ['href', 'src', 'cite'],
  allowProtocolRelative: false,
  enforceHtmlBoundary: true,
}

export const createIdeaTrpcRoute = trpcLoggedProcedure.input(zBaseIdeaInput).mutation(async ({ input, ctx }) => {
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

  const sanitizedText = sanitizeHtml(input.text, sanitizeConfig)

  // Создание новой записи
  await ctx.prisma.idea.create({
    data: {
      ...input,
      text: sanitizedText,
      authorId: ctx.me.id,
    },
  })

  return true
})
