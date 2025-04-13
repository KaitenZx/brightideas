import { Textarea as MantineTextarea } from '@mantine/core'
import type { FormikProps } from 'formik'

export const Textarea = <TValues extends Record<string, any>>({
  name,
  label,
  formik,
}: {
  name: string
  label: string
  formik: FormikProps<TValues>
}) => {
  const value = formik.values[name] ?? ''
  const error = formik.touched[name] && formik.errors[name] ? (formik.errors[name] as string) : undefined
  const disabled = formik.isSubmitting

  // Map props to Mantine Textarea
  return (
    <MantineTextarea
      label={label}
      name={name}
      value={value}
      error={error}
      disabled={disabled}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
        formik.setFieldValue(name, event.currentTarget.value)
      }}
      onBlur={() => {
        formik.setFieldTouched(name, true)
      }}
      autosize // Enable autosize by default, can be overridden via props if needed later
      minRows={4} // Set a reasonable default minRows
    />
  )
}
