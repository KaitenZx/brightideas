import { Loader as MantineLoader, Center } from '@mantine/core'

export const Loader = ({ type }: { type: 'page' | 'section' }) => {
  const height = type === 'page' ? '100%' : 80

  return (
    <Center h={height}>
      <MantineLoader size="xl" />
    </Center>
  )
}
