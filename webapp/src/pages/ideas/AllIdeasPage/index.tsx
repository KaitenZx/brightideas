import { zGetIdeasTrpcInput } from '@brightideas/shared'
import { Stack, Box, Title, SimpleGrid, Container } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import InfiniteScroll from 'react-infinite-scroller'
import { useDebounceValue } from 'usehooks-ts'
import { Alert } from '../../../components/Alert'
import { IdeaCard } from '../../../components/IdeaCard'
import { Input } from '../../../components/Input'
import { Loader } from '../../../components/Loader'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

const AllIdeasPage = withPageWrapper({
  title: 'BrightIdeas',
  isTitleExact: true,
})(() => {
  const { formik } = useForm({
    initialValues: { search: '' },
    validationSchema: zGetIdeasTrpcInput.pick({ search: true }),
  })

  const [search] = useDebounceValue(formik.values.search, 500)

  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getIdeas.useInfiniteQuery(
      {
        search,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.nextCursor
        },
      }
    )

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        <Title order={1} mb="lg">
          All Ideas
        </Title>

        <Box mb="md">
          <Input icon={<IconSearch size="1rem" />} name="search" formik={formik} />
        </Box>

        {isLoading || isRefetching ? (
          <Loader type="page" />
        ) : isError ? (
          <Alert color="red">{error.message}</Alert>
        ) : !data || !data.pages[0] || !data.pages[0].ideas.length ? (
          <Alert color="orange">Nothing found by search</Alert>
        ) : (
          <InfiniteScroll
            pageStart={0}
            threshold={500}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage()
              }
            }}
            hasMore={hasNextPage}
            loader={<Loader key="loader" type="section" />}
          >
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
              {data.pages
                .flatMap((page) => page.ideas)
                .map((idea) => (
                  <IdeaCard key={idea.nick} idea={idea} />
                ))}
            </SimpleGrid>
          </InfiniteScroll>
        )}
      </Stack>
    </Container>
  )
})

export default AllIdeasPage
