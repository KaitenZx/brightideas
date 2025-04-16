import {
  Container,
  Title,
  SimpleGrid,
  Stack,
  Alert as MantineAlert,
  Center,
  Loader as MantineLoader,
  Text,
} from '@mantine/core'
import InfiniteScroll from 'react-infinite-scroller'
import { IdeaCard } from '../../../components/IdeaCard'
import { Loader } from '../../../components/Loader'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

const MyIdeasPage = withPageWrapper({
  // Конфигурация pageWrapper без useQuery и setProps
  title: 'My Ideas',
  authorizedOnly: true,
})(() => {
  // Компонент не принимает пропсы от pageWrapper для данных запроса
  const {
    data,
    error,
    isLoading, // Используем isLoading для начальной загрузки
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage, // Используем для лоадера в InfiniteScroll и проверки hasMore
    // isRefetching может быть полезен, если есть ручной refetch
  } = trpc.getMyIdeas.useInfiniteQuery(
    { limit: 9 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: undefined, // Убрано, т.к. tRPC 10 handle'ит это сам
    }
  )
  // -----------------------------------------------------------------

  // Логика извлечения идей
  const ideas = data?.pages.flatMap((page) => page.ideas) ?? []

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1} mb="lg">
          My Ideas
        </Title>

        {/* --- Логика отображения состояний как в AllIdeasPage --- */}
        {isLoading ? ( // Показываем лоадер только при САМОЙ ПЕРВОЙ загрузке
          <Center>
            <Loader type="section" />
          </Center>
        ) : isError ? ( // Показываем ошибку, если она есть
          <MantineAlert color="red" title="Error loading ideas">
            {error.message}
          </MantineAlert>
        ) : !ideas.length ? ( // Показываем сообщение, если идей нет (после загрузки)
          <Center>
            <Text>You haven&apos;t created any ideas yet.</Text>
          </Center>
        ) : (
          // Если есть идеи, рендерим InfiniteScroll
          <InfiniteScroll
            pageStart={0}
            // threshold={500} // Можно добавить, если нужно
            loadMore={() => {
              // Проверяем, что не идет загрузка и есть следующая страница
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage()
              }
            }}
            hasMore={!!hasNextPage} // !! для явного boolean
            loader={
              <Center mt="xl" key={0}>
                <MantineLoader size="sm" />
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
