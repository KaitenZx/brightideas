import type { TrpcRouterOutput } from '@brightideas/backend/src/router'
import { Group, Avatar, Text, Stack, Paper } from '@mantine/core'
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'
import { getAvatarUrl } from '../../lib/cloudinary'

type Comment = TrpcRouterOutput['getComments']['comments'][number]

type CommentItemProps = {
  comment: Comment
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  return (
    <Paper withBorder p="md" radius="md" shadow="xs">
      <Group wrap="nowrap" align="flex-start" gap="sm">
        <Avatar
          src={getAvatarUrl(comment.author.avatar, 'small')}
          radius="xl"
          size="md"
        >
          {comment.author.nick?.slice(0, 1).toUpperCase() ?? '?'}
        </Avatar>
        <Stack gap={2} style={{ flex: 1 }}>
          {' '}
          <Group gap="xs" align="baseline">
            <Text size="sm" fw={500}>
              {comment.author.nick ?? 'Unknown User'}
            </Text>
            <Text size="xs" c="dimmed">
              {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
            </Text>
          </Group>
          <Text size="sm" style={{ wordBreak: 'break-word' }}>
            {' '}
            {comment.text}
          </Text>
        </Stack>
      </Group>
    </Paper>
  )
}
