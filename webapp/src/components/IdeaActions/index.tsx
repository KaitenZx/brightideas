import type { TrpcRouterOutput } from '@brightideas/backend/src/router'
import { canBlockIdeas, canEditIdea } from '@brightideas/backend/src/utils/can'
import { Group, Text, ActionIcon } from '@mantine/core'
import { mixpanelSetIdeaLike } from '../../lib/mixpanel'
import { getEditIdeaRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import { Button, LinkButton } from '../Button'
import { Icon } from '../Icon'

type Idea = NonNullable<TrpcRouterOutput['getIdea']['idea']>
type User = TrpcRouterOutput['getMe']['me']

type IdeaActionsProps = {
  idea: Idea
  me: User
}

const LikeButton = ({ idea }: { idea: Idea }) => {
  const trpcUtils = trpc.useUtils()
  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: async ({ isLikedByMe }) => {
      const ideaNick = idea.nick
      await trpcUtils.getIdea.cancel({ ideaNick })

      const previousIdeaData = trpcUtils.getIdea.getData({ ideaNick })

      trpcUtils.getIdea.setData({ ideaNick }, (oldData) => {
        if (!oldData?.idea) return oldData
        const currentLikes = oldData.idea.likesCount
        const currentIsLiked = oldData.idea.isLikedByMe
        let newLikesCount = currentLikes

        if (isLikedByMe && !currentIsLiked) {
          newLikesCount = currentLikes + 1
        }
        else if (!isLikedByMe && currentIsLiked) {
          newLikesCount = currentLikes - 1
        }
        return {
          ...oldData,
          idea: {
            ...(oldData.idea as Idea),
            isLikedByMe,
            likesCount: newLikesCount,
          },
        }
      })
      return { previousIdeaData }
    },
    onError: (err, _variables, context) => {
      if (context?.previousIdeaData) {
        trpcUtils.getIdea.setData({ ideaNick: idea.nick }, context.previousIdeaData)
      }
      console.error('Failed to set like:', err)
    },
    onSettled: () => {
      void trpcUtils.getIdea.invalidate({ ideaNick: idea.nick })
    },
  })

  return (
    <ActionIcon
      variant="subtle"
      color="red"
      onClick={() => {
        if (setIdeaLike.isLoading) return
        setIdeaLike.mutate(
          { ideaId: idea.id, isLikedByMe: !idea.isLikedByMe },
          {
            onSuccess: (data) => {
              if (data.idea.isLikedByMe) {
                mixpanelSetIdeaLike(idea)
              }
            },
          }
        )
      }}
      aria-label={idea.isLikedByMe ? 'Unlike idea' : 'Like idea'}
    >
      <Icon size={24} name={idea.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </ActionIcon>
  )
}

const BlockIdea = ({ idea }: { idea: Idea }) => {
  const blockIdea = trpc.blockIdea.useMutation()
  const trpcUtils = trpc.useUtils()

  const handleBlock = async () => {
    try {
      await blockIdea.mutateAsync({ ideaId: idea.id })
      await Promise.all([
        trpcUtils.getIdea.invalidate({ ideaNick: idea.nick }),
        trpcUtils.getIdeas.invalidate(),
        trpcUtils.getMyIdeas.invalidate(),
        trpcUtils.getLikedIdeas.invalidate(),
      ])
    } catch (error) {
      // Здесь можно добавить обработку ошибок, например, всплывающее уведомление
      console.error('Failed to block idea:', error)
    }
  }

  if (idea.blockedAt) {
    return (
      <Text c="red" size="sm" fw={500}>
        Blocked
      </Text>
    )
  }

  return (
    <Button color="red" variant="light" onClick={handleBlock} loading={blockIdea.isLoading}>
      Block Idea
    </Button>
  )
}

export const IdeaActions = ({ idea, me }: IdeaActionsProps) => {
  const showEditButton = canEditIdea(me, idea)
  const showBlockButton = canBlockIdeas(me)

  return (
    <Group justify="space-between" align="center">
      <Group align="center">
        <Text fw={500} size="lg">
          Likes: {idea.likesCount}
        </Text>
        {me && <LikeButton idea={idea} />}
      </Group>

      <Group gap="sm">
        {showEditButton && (
          <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })} variant="light">
            Edit Idea
          </LinkButton>
        )}
        {showBlockButton && <BlockIdea idea={idea} />}
      </Group>
    </Group>
  )
}
