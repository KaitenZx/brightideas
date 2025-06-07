import { Container, Title, SimpleGrid, Stack, Alert as MantineAlert, Center, Text } from '@mantine/core'
import InfiniteScroll from 'react-infinite-scroller'
import { IdeaCard } from '../../../components/IdeaCard'
import { Loader } from '../../../components/Loader'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

const MyIdeasPage = withPageWrapper({
  title: 'My Ideas',
  authorizedOnly: true,
})(() => {
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.getMyIdeas.useInfiniteQuery(
      { limit: 9 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: undefined,
      }
    )

  const ideas = data?.pages.flatMap((page) => page.ideas) ?? []

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1} mb="lg">
          My Ideas
        </Title>

        {isLoading ? (
          <Center>
            <Loader type="page" />
          </Center>
        ) : isError ? (
          <MantineAlert color="red" title="Error loading ideas">
            {error.message}
          </MantineAlert>
        ) : !ideas.length ? (
          <Center>
            <Text>You haven&apos;t created any ideas yet.</Text>
          </Center>
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage()
              }
            }}
            hasMore={!!hasNextPage}
            loader={
              <Center mt="xl" key={0}>
                <Loader type="section" />
              </Center>
            }
            useWindow={true}
          >
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {ideas.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </SimpleGrid>
          </InfiniteScroll>
        )}
      </Stack>
    </Container>
  )
})

export default MyIdeasPage
