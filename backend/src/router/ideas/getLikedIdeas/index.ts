import { omit } from '@brightideas/shared' // Используем твой omit
import { trpcLoggedProcedure } from '../../../lib/trpc.js'
import { zGetLikedIdeasTrpcInput } from './input.js' // Убедись, что input.ts определяет cursor как number

export const getLikedIdeasTrpcRoute = trpcLoggedProcedure
  .input(zGetLikedIdeasTrpcInput)
  .query(async ({ ctx, input }) => {
    if (!ctx.me) {
      throw new Error('UNAUTHORIZED')
    }

    const currentUserId = ctx.me.id

    // Запрашиваем идеи, которые лайкнул пользователь и которые не заблокированы
    const ideasQuery = await ctx.prisma.idea.findMany({
      where: {
        // Идея не заблокирована
        blockedAt: null,
        // И у идеи есть лайк от текущего пользователя
        ideasLikes: {
          some: {
            userId: currentUserId,
          },
        },
      },
      select: {
        // Выбираем поля, нужные для карточки + serialNumber для курсора
        id: true,
        nick: true,
        name: true,
        description: true,
        serialNumber: true, // Важно для курсора
        _count: {
          select: { ideasLikes: true }, // Получаем общее количество лайков
        },
        // Нам больше не нужно выбирать сам лайк, так как isLikedByMe будет true
      },
      orderBy: {
        // Сортируем по serialNumber для пагинации по курсору
        serialNumber: 'desc',
      },
      // Используем serialNumber идеи в качестве курсора
      cursor: input.cursor ? { serialNumber: input.cursor } : undefined,
      take: input.limit + 1, // Берем на один больше для определения следующей страницы
    })

    // Определяем наличие следующей страницы и курсор для нее
    const nextIdea = ideasQuery.at(input.limit)
    const nextCursor = nextIdea?.serialNumber // Курсор теперь serialNumber
    const ideasData = ideasQuery.slice(0, input.limit) // Данные для текущей страницы

    // Преобразуем данные для фронтенда
    const ideas = ideasData.map((idea) => {
      // Проверка на случай, если _count почему-то отсутствует (маловероятно)
      const likesCount = idea._count?.ideasLikes ?? 0

      // Используем твою функцию omit для удаления _count
      const ideaWithoutCount = omit(idea, ['_count'])

      return {
        ...ideaWithoutCount,
        likesCount: likesCount,
        isLikedByMe: true, // Мы знаем, что пользователь лайкнул эти идеи
      }
    })

    return { ideas, nextCursor }
  })
