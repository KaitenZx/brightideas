// webapp/src/components/CommentItem.tsx
import type { TrpcRouterOutput } from '@brightideas/backend/src/router' // Используем тип прямо из бэкенда
import { Group, Avatar, Text, Stack, Paper } from '@mantine/core'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { getAvatarUrl } from '../../lib/cloudinary' // Убедись, что путь правильный

// Определяем тип для одного комментария, используя вывод tRPC роутера
type Comment = TrpcRouterOutput['getComments']['comments'][number]

type CommentItemProps = {
  comment: Comment
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    // Используем Paper для визуального отделения каждого комментария
    <Paper withBorder p="md" radius="md" shadow="xs">
      {/* Group для аватара и основного контента */}
      <Group wrap="nowrap" align="flex-start" gap="sm">
        {/* Аватар автора */}
        <Avatar
          src={getAvatarUrl(comment.author.avatar, 'small')}
          radius="xl"
          size="md" // Можно сделать 'sm', если нужно компактнее
        >
          {/* Фоллбэк для аватара */}
          {comment.author.nick?.slice(0, 1).toUpperCase() ?? '?'}
        </Avatar>
        {/* Stack для вертикального расположения имени/даты и текста */}
        <Stack gap={2} style={{ flex: 1 }}>
          {' '}
          {/* flex: 1 чтобы текст занимал доступную ширину */}
          {/* Group для имени автора и даты */}
          <Group gap="xs" align="baseline">
            <Text size="sm" fw={500}>
              {comment.author.nick ?? 'Unknown User'}
            </Text>
            <Text size="xs" c="dimmed">
              {/* Форматируем дату как "X minutes/hours/days ago" */}
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </Text>
          </Group>
          {/* Текст комментария */}
          <Text size="sm" style={{ wordBreak: 'break-word' }}>
            {' '}
            {/* Позволяет переносить длинные слова */}
            {comment.text}
          </Text>
        </Stack>
      </Group>
    </Paper>
  )
}
