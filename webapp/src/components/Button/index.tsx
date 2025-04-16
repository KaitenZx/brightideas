import { Button as MantineButton, type MantineColor, type ButtonProps as MantineButtonProps } from '@mantine/core'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

export type ButtonProps = {
  children: React.ReactNode
  loading?: boolean
  // Use MantineColor type
  color?: MantineColor
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  // Add variant prop
  variant?: MantineButtonProps['variant']
  // Add style prop
  style?: CSSProperties
}

export const Button = ({
  children,
  loading = false,
  // Use theme's primary color by default (by not setting a default value)
  color,
  type = 'submit',
  disabled,
  onClick,
  variant, // Accept variant
  style, // Accept style
}: ButtonProps) => {
  return (
    // Pass color prop directly. If undefined, Mantine uses theme.primaryColor
    <MantineButton color={color} loading={loading} type={type} disabled={disabled} onClick={onClick} variant={variant} style={style}>
      {children}
    </MantineButton>
  )
}

export const LinkButton = ({
  children,
  to,
  // Use theme's primary color by default
  color,
  variant, // Accept variant
  style, // Accept style
}: {
  children: React.ReactNode
  to: string
  // Use MantineColor type
  color?: MantineColor
  // Add variant prop
  variant?: MantineButtonProps['variant']
  // Add style prop
  style?: CSSProperties
}) => {
  return (
    <MantineButton component={Link} to={to} color={color} variant={variant} style={style}>
      {children}
    </MantineButton>
  )
}


