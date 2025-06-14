import {
  Avatar,
  Box,
  Group,
  Stack,
  Text,
  Anchor,
  Container,
  Title,
  TypographyStylesProvider,
  Divider,
} from '@mantine/core'
import { IconFile, IconCertificate } from '@tabler/icons-react'
import { format } from 'date-fns/format'
import { AddCommentForm } from '../../../components/AddCommentForm'
import { CommentList } from '../../../components/CommentList'
import { IdeaActions } from '../../../components/IdeaActions'
import { IdeaGallery } from '../../../components/IdeaGallery'
import { getAvatarUrl } from '../../../lib/cloudinary'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getViewIdeaRoute } from '../../../lib/routes'
import { getS3UploadName, getS3UploadUrl } from '../../../lib/s3'
import { trpc } from '../../../lib/trpc'
import classes from './ViewIdeaPage.module.css'

const ViewIdeaPage = withPageWrapper({
  useQuery: () => {
    const { ideaNick } = getViewIdeaRoute.useParams()
    return trpc.getIdea.useQuery({ ideaNick })
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    idea: checkExists(queryResult.data.idea, 'Idea not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
  title: ({ idea }) => idea.name,
})(({ idea, me }) => {
  const hasAttachments = !!idea.certificate || !!idea.documents.length

  const {
    data: commentsData,
    fetchNextPage: fetchNextCommentsPage,
    hasNextPage: hasNextCommentsPage,
    isFetchingNextPage: isFetchingNextCommentsPage,
    isLoading: isLoadingComments,
    isError: isCommentsError,
    error: commentsError,
  } = trpc.getComments.useInfiniteQuery(
    { ideaId: idea.id, limit: 10 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Stack gap="sm">
          <Title order={1}>{idea.name}</Title>
          {idea.description && <Text c="dimmed">{idea.description}</Text>}
          <Group justify="space-between">
            <Group gap="sm" wrap="nowrap">
              <Avatar src={getAvatarUrl(idea.author.avatar, 'small')} size="md" radius="xl" />
              <Stack gap={0}>
                <Text size="sm" fw={500}>
                  Author:
                </Text>
                <Text size="xs">
                  {idea.author.nick}
                  {idea.author.name ? ` (${idea.author.name})` : ''}
                </Text>
              </Stack>
            </Group>
            <Text size="xs" c="dimmed">
              Created At: {format(idea.createdAt, 'yyyy-MM-dd')}
            </Text>
          </Group>
        </Stack>

        <TypographyStylesProvider>
          <Box dangerouslySetInnerHTML={{ __html: idea.text }} />
        </TypographyStylesProvider>

        <IdeaGallery images={idea.images} />

        {hasAttachments && (
          <>
            <Divider />
            <Stack gap="md">
              {/* ... как было ... */}
              {idea.certificate && (
                <Group wrap="nowrap" gap="xs">
                  <IconCertificate size="1.1rem" stroke={1.5} />
                  <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>
                    Certificate:
                  </Text>
                  <Anchor
                    href={getS3UploadUrl(idea.certificate)}
                    target="_blank"
                    size="xs"
                    className={classes.attachmentLink}
                  >
                    {getS3UploadName(idea.certificate)}
                  </Anchor>
                </Group>
              )}
              {!!idea.documents.length && (
                <Stack gap="xs">
                  <Group wrap="nowrap" gap="xs">
                    <IconFile size="1.1rem" stroke={1.5} />
                    <Text size="sm" fw={500}>
                      Documents:
                    </Text>
                  </Group>
                  <Stack gap="xs" pl="lg">
                    {idea.documents.map((document) => (
                      <Anchor
                        key={document}
                        href={getS3UploadUrl(document)}
                        target="_blank"
                        size="xs"
                        className={classes.attachmentLink}
                      >
                        {getS3UploadName(document)}
                      </Anchor>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </>
        )}

        <Divider />
        <IdeaActions idea={idea} me={me} />

        <Divider />
        <Stack gap="lg">
          {' '}
          <Title order={3}>Comments</Title>
          {me && <AddCommentForm ideaId={idea.id} />}
          <CommentList
            data={commentsData}
            fetchNextPage={fetchNextCommentsPage}
            hasNextPage={hasNextCommentsPage}
            isFetchingNextPage={isFetchingNextCommentsPage}
            isLoading={isLoadingComments}
            isError={isCommentsError}
            error={commentsError}
          />
        </Stack>
      </Stack>
    </Container>
  )
})

export default ViewIdeaPage
