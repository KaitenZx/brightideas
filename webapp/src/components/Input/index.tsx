import { TextInput, PasswordInput } from '@mantine/core'
import type { FormikProps } from 'formik'

export const Input = <TValues extends Record<string, any>>({
  name,
  label,
  formik,
  maxWidth,
  type = 'text',
}: {
  name: string
  label: string
  formik: FormikProps<TValues>
  maxWidth?: number | string
  type?: 'text' | 'password'
}) => {
  const value = formik.values[name] ?? '' // Ensure value is not undefined/null
  const error = formik.touched[name] && formik.errors[name] ? (formik.errors[name] as string) : undefined
  const disabled = formik.isSubmitting

  const commonProps = {
    label,
    name,
    value,
    error,
    disabled,
    style: { maxWidth },
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue(name, event.currentTarget.value)
    },
    onBlur: () => {
      formik.setFieldTouched(name, true)
    },
  }

  if (type === 'password') {
    return <PasswordInput {...commonProps} />
  }

  return <TextInput {...commonProps} />
}
