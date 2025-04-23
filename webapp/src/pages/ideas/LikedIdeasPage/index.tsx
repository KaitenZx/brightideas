import { Container, Title, SimpleGrid, Stack, Alert as MantineAlert, Center, Text } from '@mantine/core'
import InfiniteScroll from 'react-infinite-scroller'
import { IdeaCard } from '../../../components/IdeaCard'
import { Loader } from '../../../components/Loader'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

// Убираем определение пропсов

const LikedIdeasPage = withPageWrapper({
  // Конфигурация pageWrapper без useQuery и setProps
  title: 'Liked Ideas',
  authorizedOnly: true,
})(() => {
  // Компонент не принимает пропсы от pageWrapper для данных запроса
  // --- Вызываем хук запроса ВНУТРИ компонента ---
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } =
    trpc.getLikedIdeas.useInfiniteQuery(
      { limit: 9 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialCursor: undefined,
      }
    )
  // -------------------------------------------

  const ideas = data?.pages.flatMap((page) => page.ideas) ?? []

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1} mb="lg">
          Liked Ideas
        </Title>

        {/* --- Логика отображения состояний как в AllIdeasPage --- */}
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
            <Text>You haven&apos;t liked any ideas yet.</Text>
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

export default LikedIdeasPage
