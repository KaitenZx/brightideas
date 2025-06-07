import { Container, Title, Text, Stack, ThemeIcon, Center } from '@mantine/core'
import { IconBulbOff } from '@tabler/icons-react'
import { getAllIdeasRoute } from '../../lib/routes'
import { LinkButton } from '../Button'

export const ErrorPageComponent = ({
  title = 'Oops, something went wrong!',
  message = "We couldn't process your request. Please try again later or return home.",
  children,
}: {
  title?: string
  message?: string
  children?: React.ReactNode
}) => {
  return (
    <Container size="md" my="xl">
      {' '}
      <Stack align="center" gap="l">
        <ThemeIcon size={80} radius="xl" color="red" variant="light">
          <IconBulbOff style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ThemeIcon>

        <Title order={2} ta="center" c="red.6">
          {title}
        </Title>

        <Text c="dimmed" ta="center">
          {message}
        </Text>

        <LinkButton to={getAllIdeasRoute()} variant="outline">
          Go back to All Ideas
        </LinkButton>

        {children && <Center mt="lg"> {children}</Center>}
      </Stack>
    </Container>
  )
}
