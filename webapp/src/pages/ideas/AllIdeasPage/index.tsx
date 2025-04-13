import { zGetIdeasTrpcInput } from '@brightideas/backend/src/router/ideas/getIdeas/input'
import { Stack, Box } from '@mantine/core'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
import { useDebounceValue } from 'usehooks-ts'
import { Alert } from '../../../components/Alert'
import { Input } from '../../../components/Input'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getViewIdeaRoute } from '../../../lib/routes'
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
    <Segment title="All Ideas" size={1}>
      <Box mb="lg">
        <Input maxWidth={'70%'} label="Search" name="search" formik={formik} />
      </Box>
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : !data.pages[0].ideas.length ? (
        <Alert color="orange">Nothing found by search</Alert>
      ) : (
        <InfiniteScroll
          pageStart={0}
          threshold={250}
          loadMore={() => {
            if (!isFetchingNextPage && hasNextPage) {
              void fetchNextPage()
            }
          }}
          hasMore={hasNextPage}
          loader={<Loader key="loader" type="section" />}
        >
          <Stack gap="lg">
            {data.pages
              .flatMap((page) => page.ideas)
              .map((idea) => (
                <Segment
                  key={idea.nick}
                  size={2}
                  title={
                    <Link to={getViewIdeaRoute({ ideaNick: idea.nick })}>
                      {idea.name}
                    </Link>
                  }
                  description={idea.description}
                >
                  Likes: {idea.likesCount}
                </Segment>
              ))}
          </Stack>
        </InfiniteScroll>
      )}
    </Segment>
  )
})

export default AllIdeasPage
