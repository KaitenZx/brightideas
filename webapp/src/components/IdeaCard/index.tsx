import { Card, Stack, Anchor, Text, Group, useMantineTheme, useMantineColorScheme, Box } from '@mantine/core' // Добавлен Box
import { Link } from 'react-router-dom'
import { getViewIdeaRoute } from '../../lib/routes'
import { Icon } from '../Icon'
import classes from './index.module.scss'

type Idea = {
  likesCount: number
  id: string
  nick: string
  name: string
  serialNumber: number
  description: string
}

type IdeaCardProps = {
  idea: Idea
}

export const IdeaCard = ({ idea }: IdeaCardProps) => {
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      style={{ height: '100%' }}
      bg={colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}
      className={classes.cardRoot}
    >
      <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack gap="sm" style={{ flexGrow: 1 }}>
          <Anchor
            component={Link}
            to={getViewIdeaRoute({ ideaNick: idea.nick })}
            td="none"
            c="teal.6"
            fw={600}
            fz="xl"
            lineClamp={2}
          >
            {idea.name}
          </Anchor>

          {idea.description && (
            <Text size="sm" c="dimmed" lineClamp={3}>
              {idea.description}
            </Text>
          )}
        </Stack>

        <Group gap="xs" justify="flex-end" mt="sm">
          <Icon size={16} name="likeFilled" />
          <Text size="sm" fw={500}>
            {idea.likesCount}
          </Text>
        </Group>
      </Box>
    </Card>
  )
}
