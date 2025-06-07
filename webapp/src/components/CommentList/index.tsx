import type { TrpcRouterOutput } from '@brightideas/backend/src/router'
import { Stack, Center, Text, Alert as MantineAlert } from '@mantine/core'
import type { UseTRPCInfiniteQueryResult } from '@trpc/react-query/shared'
import InfiniteScroll from 'react-infinite-scroller'
import { CommentItem } from '../CommentItem/Index'
import { Loader } from '../Loader'

type GetCommentsInfiniteQueryResult = UseTRPCInfiniteQueryResult<
  TrpcRouterOutput['getComments'],
  any
>

type CommentListProps = {
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
      useWindow={true}
    >
      <Stack gap="md">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </Stack>
    </InfiniteScroll>
  )
}
