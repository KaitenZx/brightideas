import { zGetCommentsTrpcInput } from '@brightideas/shared'
import { trpcLoggedProcedure } from '../../../lib/trpc.js'

export const getCommentsTrpcRoute = trpcLoggedProcedure.input(zGetCommentsTrpcInput).query(async ({ ctx, input }) => {
  const { ideaId, limit, cursor } = input

  const comments = await ctx.prisma.comment.findMany({
    where: { ideaId: ideaId },
    include: {
      author: {
        select: { id: true, nick: true, name: true, avatar: true },
      },
    },
    orderBy: { createdAt: 'asc' },
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
  })

  let nextCursor: typeof cursor | undefined = undefined
  if (comments.length > limit) {
    const nextItem = comments.pop()
    nextCursor = nextItem!.id
  }

  const commentsWithSelectedAuthor = comments.map((comment) => ({
    ...comment,
    author: comment.author,
  }))

  return {
    comments: commentsWithSelectedAuthor,
    nextCursor,
  }
})
