import { Button as MantineButton, Group } from '@mantine/core'
import { Link } from 'react-router-dom'

// Keep the custom ButtonColor for now, map it to Mantine colors
type ButtonColor = 'red' | 'green'

export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  color?: ButtonColor
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

export const Button = ({
  children,
  loading = false,
  color = 'green',
  type = 'submit',
  disabled,
  onClick,
}: ButtonProps) => {
  return (
    <MantineButton color={color} loading={loading} type={type} disabled={disabled} onClick={onClick}>
      {children}
    </MantineButton>
  )
}

export const LinkButton = ({
  children,
  to,
  color = 'green',
}: {
  children: React.ReactNode
  to: string
  color?: ButtonColor
}) => {
  return (
    <MantineButton component={Link} to={to} color={color}>
      {children}
    </MantineButton>
  )
}

export const Buttons = ({ children }: { children: React.ReactNode }) => {
  return <Group>{children}</Group>
}
