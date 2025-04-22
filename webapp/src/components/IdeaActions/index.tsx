import type { TrpcRouterOutput } from '@brightideas/backend/src/router'
import { canBlockIdeas, canEditIdea } from '@brightideas/backend/src/utils/can'
import { Group, Text, ActionIcon, Box } from '@mantine/core'
import { useForm } from '../../lib/form'
import { mixpanelSetIdeaLike } from '../../lib/mixpanel'
import { getEditIdeaRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import { Alert } from '../Alert'
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
        // Если мы снимаем лайк (isLikedByMe=false) и он стоял
        else if (!isLikedByMe && currentIsLiked) {
          newLikesCount = currentLikes - 1
        }
        return {
          ...oldData,
          idea: {
            ...(oldData.idea as Idea), // Утверждаем тип Idea
            isLikedByMe,
            likesCount: newLikesCount,
          },
        }
      })
      // Возвращаем предыдущие данные для возможного отката
      return { previousIdeaData }
    },
    onError: (err, _variables, context) => {
      // Откатываемся к предыдущему состоянию в случае ошибки
      if (context?.previousIdeaData) {
        trpcUtils.getIdea.setData({ ideaNick: idea.nick }, context.previousIdeaData)
      }
      // Можно добавить показ ошибки пользователю (например, через toast)
      console.error('Failed to set like:', err)
    },
    onSettled: () => {
      // Инвалидируем запрос в любом случае
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
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id })
      await Promise.all([
        trpcUtils.getIdea.invalidate({ ideaNick: idea.nick }),
        trpcUtils.getIdeas.invalidate(),
        trpcUtils.getMyIdeas.invalidate(),
        trpcUtils.getLikedIdeas.invalidate(),
      ])
    },
  })

  if (idea.blockedAt) {
    return (
      <Text c="red" size="sm" fw={500}>
        Idea is blocked
      </Text>
    )
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <Alert {...alertProps} />
      {!alertProps.hidden && <Box mb="sm" />}
      <Button {...buttonProps} color="red" variant="light" type="submit" loading={blockIdea.isLoading}>
        Block Idea
      </Button>
    </form>
  )
}

export const IdeaActions = ({ idea, me }: IdeaActionsProps) => {
  const showEditButton = canEditIdea(me, idea)
  const showBlockButton = canBlockIdeas(me) // Не зависит от конкретной idea, только от прав me

  return (
    <Group justify="space-between" align="center">
      {/* Лайки */}
      <Group align="center">
        <Text fw={500} size="lg">
          Likes: {idea.likesCount}
        </Text>
        {/* Кнопка лайка показывается только если пользователь авторизован */}
        {me && <LikeButton idea={idea} />}
      </Group>

      {/* Кнопки действий */}
      <Group gap="sm">
        {showEditButton && (
          <LinkButton to={getEditIdeaRoute({ ideaNick: idea.nick })} variant="light">
            Edit Idea
          </LinkButton>
        )}
        {/* Показываем кнопку блокировки если есть права и идея еще не заблокирована */}
        {showBlockButton && !idea.blockedAt && <BlockIdea idea={idea} />}
        {/* Можно добавить индикатор, если идея заблокирована и пользователь админ */}
        {showBlockButton && idea.blockedAt && (
          <Text c="red" size="sm" fw={500}>
            Blocked
          </Text>
        )}
      </Group>
    </Group>
  )
}
