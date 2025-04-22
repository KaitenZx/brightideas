// webapp/src/components/CommentList.tsx
import type { TrpcRouterOutput } from '@brightideas/backend/src/router' // Импортируем основной тип вывода
import { Stack, Center, Text, Alert as MantineAlert } from '@mantine/core'
import type { UseTRPCInfiniteQueryResult } from '@trpc/react-query/shared'
import InfiniteScroll from 'react-infinite-scroller'
import { CommentItem } from '../CommentItem/Index'
import { Loader } from '../Loader'
// Используем ReturnType для получения типа возвращаемого значения хука

// Определяем тип для данных одного комментария
type Comment = TrpcRouterOutput['getComments']['comments'][number]
// Определяем тип для возвращаемого значения useInfiniteQuery для getComments
type GetCommentsInfiniteQueryResult = UseTRPCInfiniteQueryResult<
  TrpcRouterOutput['getComments'], // Тип успешного ответа процедуры
  any // Тип ошибки (можно уточнить, если нужно)
>

// Используем тип результата хука для пропсов
type CommentListProps = {
  // Используем поля из типа результата useInfiniteQuery
  data: GetCommentsInfiniteQueryResult['data']
  fetchNextPage: GetCommentsInfiniteQueryResult['fetchNextPage']
  hasNextPage: GetCommentsInfiniteQueryResult['hasNextPage']
  isFetchingNextPage: GetCommentsInfiniteQueryResult['isFetchingNextPage']
  isError: GetCommentsInfiniteQueryResult['isError']
  error: GetCommentsInfiniteQueryResult['error']
  isLoading: GetCommentsInfiniteQueryResult['isLoading']
}

export const CommentList = ({
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isError,
  error,
  isLoading,
}: CommentListProps) => {
  const comments = data?.pages.flatMap((page) => page.comments) ?? []

  if (isLoading) {
    return <Loader type="section" />
  }

  if (isError) {
    // Используем Mantine Alert для отображения ошибки запроса
    return (
      <MantineAlert color="red" title="Error loading comments" mt="md">
        {error?.message}
      </MantineAlert>
    )
  }

  if (!comments.length) {
    return (
      <Center mt="md">
        <Text c="dimmed">No comments yet.</Text>
      </Center>
    )
  }

  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={() => {
        if (!isFetchingNextPage && hasNextPage) {
          void fetchNextPage()
        }
      }}
      hasMore={!!hasNextPage}
      loader={<Loader type="section" key="comment-loader" />}
      // useWindow={false} // Раскомментируй один из вариантов
      // useWindow={true}
    >
      <Stack gap="md">
        {comments.map((comment) => (
          // Убедимся, что тип comment соответствует ожидаемому в CommentItem
          <CommentItem key={comment.id} comment={comment as Comment} />
        ))}
      </Stack>
    </InfiniteScroll>
  )
}
