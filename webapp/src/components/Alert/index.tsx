import { Alert as MantineAlert } from '@mantine/core'

export type AlertProps = { color: 'red' | 'green' | 'orange'; hidden?: boolean; children: React.ReactNode }
export const Alert = ({ color, hidden, children }: AlertProps) => {
  if (hidden) {
    return null
  }
  return <MantineAlert color={color}>{children}</MantineAlert>
}
