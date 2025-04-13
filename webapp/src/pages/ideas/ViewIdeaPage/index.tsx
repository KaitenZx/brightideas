import type { TrpcRouterOutput } from '@brightideas/backend/src/router'
import { canBlockIdeas, canEditIdea } from '@brightideas/backend/src/utils/can'
import { Avatar, Box, Group, Stack, Text, ActionIcon, Anchor } from '@mantine/core'
import { format } from 'date-fns/format'
import ImageGallery from 'react-image-gallery'
import { Alert } from '../../../components/Alert'
import { Button, LinkButton } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Icon } from '../../../components/Icon'
import { Segment } from '../../../components/Segment'
import { getAvatarUrl, getCloudinaryUploadUrl } from '../../../lib/cloudinary'
import { useForm } from '../../../lib/form'
import { mixpanelSetIdeaLike } from '../../../lib/mixpanel'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditIdeaRoute, getViewIdeaRoute } from '../../../lib/routes'
import { getS3UploadName, getS3UploadUrl } from '../../../lib/s3'
import { trpc } from '../../../lib/trpc'

const LikeButton = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const trpcUtils = trpc.useUtils()
  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcUtils.getIdea.getData({ ideaNick: idea.nick })
      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: oldGetIdeaData.idea.likesCount + (isLikedByMe ? 1 : -1),
          },
        }
        trpcUtils.getIdea.setData({ ideaNick: idea.nick }, newGetIdeaData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getIdea.invalidate({ ideaNick: idea.nick })
    },
  })
  return (
    <ActionIcon
      variant="subtle"
      onClick={() => {
        void setIdeaLike
          .mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
          .then(({ idea: { isLikedByMe } }) => {
            if (isLikedByMe) {
              mixpanelSetIdeaLike(idea)
            }
          })
      }}
      aria-label={idea.isLikedByMe ? 'Unlike idea' : 'Like idea'}
    >
      <Icon size={32} name={idea.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </ActionIcon>
  )
}

const BlockIdea = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const blockIdea = trpc.blockIdea.useMutation()
  const trpcUtils = trpc.useUtils()
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id })
      await trpcUtils.getIdea.refetch({ ideaNick: idea.nick })
    },
  })
  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Block Idea
        </Button>
      </FormItems>
    </form>
  )
}

const ViewIdeaPage = withPageWrapper({
  useQuery: () => {
    const { ideaNick } = getViewIdeaRoute.useParams()
    return trpc.getIdea.useQuery({
      ideaNick,
    })
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    idea: checkExists(queryResult.data.idea, 'Idea not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
  title: ({ idea }) => idea.name,
})(({ idea, me }) => (
  <Segment title={idea.name} description={idea.description}>
    <Stack gap="md">
      <Text size="xs">Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</Text>

      <Group align="center">
        <Avatar src={getAvatarUrl(idea.author.avatar, 'small')} size="lg" radius="xl" />
        <Stack gap={0}>
          <Text fw={500}>Author:</Text>
          <Text size="sm">
            {idea.author.nick}
            {idea.author.name ? ` (${idea.author.name})` : ''}
          </Text>
        </Stack>
      </Group>

      {!!idea.images.length && (
        <Box my="md">
          <ImageGallery
            showPlayButton={false}
            showFullscreenButton={false}
            items={idea.images.map((image) => ({
              original: getCloudinaryUploadUrl(image, 'image', 'large'),
              thumbnail: getCloudinaryUploadUrl(image, 'image', 'preview'),
            }))}
          />
        </Box>
      )}

      {idea.certificate && (
        <Box my="md">
          <Text component="span">Certificate: </Text>
          <Anchor href={getS3UploadUrl(idea.certificate)} target="_blank" size="sm">
            {getS3UploadName(idea.certificate)}
          </Anchor>
        </Box>
      )}

      {!!idea.documents.length && (
        <Box my="md">
          <Text>Documents:</Text>
          <Stack gap="xs" mt={5}>
            {idea.documents.map((document) => (
              <Anchor key={document} href={getS3UploadUrl(document)} target="_blank" size="sm">
                {getS3UploadName(document)}
              </Anchor>
            ))}
          </Stack>
        </Box>
      )}

      <Box maw={800} dangerouslySetInnerHTML={{ __html: idea.text }} />

      <Group align="center">
        <Text>Likes: {idea.likesCount}</Text>
        {me && <LikeButton idea={idea} />}
      </Group>

      {canEditIdea(me, idea) && (
        <Box mt="lg">
          <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })}>Edit Idea</LinkButton>
        </Box>
      )}

      {canBlockIdeas(me) && (
        <Box mt="lg">
          <BlockIdea idea={idea} />
        </Box>
      )}
    </Stack>
  </Segment>
))

export default ViewIdeaPage
