import { omit, zGetIdeasTrpcInput } from '@brightideas/shared'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'

export const getIdeasTrpcRoute = trpcLoggedProcedure.input(zGetIdeasTrpcInput).query(async ({ ctx, input }) => {
  const preparedSearchQuery = input.search
    ? input.search
        .trim() // Убрать пробелы с краев
        .split(/[\s\n\t]+/) // Разбить на слова по пробелам
        .filter((term) => term.length > 0) // Убрать пустые слова
        .map((term) => term + ':*') // Добавить суффикс префикса к каждому слову
        .join(' & ') // Соединить через AND
    : undefined

  const searchQuery = preparedSearchQuery && preparedSearchQuery.length > 0 ? preparedSearchQuery : undefined

  const rawIdeas = await ctx.prisma.idea.findMany({
    select: {
      id: true,
      nick: true,
      name: true,
      description: true,
      serialNumber: true,
      _count: {
        select: {
          ideasLikes: true,
        },
      },
    },
    where: {
      blockedAt: null,
      ...(!searchQuery
        ? {}
        : {
            OR: [
              {
                name: {
                  search: searchQuery,
                },
              },
              {
                description: {
                  search: searchQuery,
                },
              },
              {
                text: {
                  search: searchQuery,
                },
              },
            ],
          }),
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
      {
        serialNumber: 'desc',
      },
    ],
    cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
    take: input.limit + 1,
  })

  const nextIdea = rawIdeas.at(input.limit)
  const nextCursor = nextIdea?.serialNumber
  const rawIdeasExceptNext = rawIdeas.slice(0, input.limit)
  const ideasExceptNext = rawIdeasExceptNext.map((idea) => ({
    ...omit(idea, ['_count']),
    likesCount: idea._count.ideasLikes,
  }))

  return { ideas: ideasExceptNext, nextCursor }
})
