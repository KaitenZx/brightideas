import { Button as MantineButton, type MantineColor, type ButtonProps as MantineButtonProps } from '@mantine/core'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  color?: MantineColor
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  variant?: MantineButtonProps['variant']
  style?: CSSProperties
}

export const Button = ({
  children,
  loading = false,
  color,
  type = 'submit',
  disabled,
  onClick,
  variant,
  style,
}: ButtonProps) => {
  return (
    <MantineButton
      color={color}
      loading={loading}
      type={type}
      disabled={disabled}
      onClick={onClick}
      variant={variant}
      style={style}
    >
      {children}
    </MantineButton>
  )
}

export const LinkButton = ({
  children,
  to,
  color,
  variant,
  style,
}: {
  children: React.ReactNode
  to: string
  color?: MantineColor
  variant?: MantineButtonProps['variant']
  style?: CSSProperties
}) => {
  return (
    <MantineButton component={Link} to={to} color={color} variant={variant} style={style}>
      {children}
    </MantineButton>
  )
}
