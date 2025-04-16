import { Card, Title, Text } from '@mantine/core'

export const Segment = ({
  title,
  size = 1,
  description,
  children,
}: {
  title: React.ReactNode
  size?: 1 | 2
  description?: string
  children?: React.ReactNode
}) => {
  return (
    <Card mb="xl" padding="0">
      <Title order={size}>{title}</Title>
      {description && (
        <Text size="lg" mt="xs">
          {description}
        </Text>
      )}
      {children && <div style={{ marginTop: title || description ? 12 : 0 }}>{children}</div>}
    </Card>
  )
}
