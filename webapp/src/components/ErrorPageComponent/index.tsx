import { Container, Title, Text, Stack, ThemeIcon, Center } from '@mantine/core'
import { IconBulbOff } from '@tabler/icons-react'
import { getAllIdeasRoute } from '../../lib/routes'
import { LinkButton } from '../Button'

export const ErrorPageComponent = ({
  title = 'Oops, something went wrong!',
  message = "We couldn't process your request. Please try again later or return home.",
  children, // Возвращаем проп children
}: {
  title?: string
  message?: string
  children?: React.ReactNode // Добавляем тип React.ReactNode
}) => {
  return (
    // Контейнер для центрирования и ограничения ширины
    <Container size="md" my="xl">
      {' '}
      {/* Можно сделать 'md', чтобы было место для картинки */}
      <Stack align="center" gap="l">
        {/* Иконка */}
        <ThemeIcon size={80} radius="xl" color="red" variant="light">
          <IconBulbOff style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ThemeIcon>

        {/* Заголовок */}
        <Title order={2} ta="center" c="red.6">
          {title}
        </Title>

        {/* Сообщение */}
        <Text c="dimmed" ta="center">
          {message}
        </Text>

        <LinkButton to={getAllIdeasRoute()} variant="outline">
          Go back to All Ideas
        </LinkButton>

        {/* Дочерние элементы (например, картинка 404) */}
        {children && (
          <Center mt="lg">
            {' '}
            {/* Центрируем дочерний элемент */}
            {children}
          </Center>
        )}

        {/* Кнопка */}
      </Stack>
    </Container>
  )
}
