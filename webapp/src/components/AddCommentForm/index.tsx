// webapp/src/components/AddCommentForm.tsx
import { zAddCommentTrpcInput } from '@brightideas/shared'
import { Stack, Group } from '@mantine/core'
import { useForm } from '../../lib/form' // Используем твой хук useForm
import { trpc } from '../../lib/trpc'
import { Alert } from '../Alert'
import { Button } from '../Button'
import { Textarea } from '../Textarea'

type AddCommentFormProps = {
  ideaId: string
}

export const AddCommentForm = ({ ideaId }: AddCommentFormProps) => {
  const trpcUtils = trpc.useUtils()
  const addComment = trpc.addComment.useMutation({
    // Используем правильный путь к мутации
    onSuccess: () => {
      formik.resetForm()
      void trpcUtils.getComments.invalidate({ ideaId })
    },
  })

  const { formik, alertProps, buttonProps } = useForm({
    initialValues: { text: '' },
    validationSchema: zAddCommentTrpcInput.pick({ text: true }),
    onSubmit: async (values) => {
      await addComment.mutateAsync({
        ideaId: ideaId,
        text: values.text,
      })
    },
  })

  return (
    // Используем form onSubmit напрямую с formik.handleSubmit
    <form onSubmit={formik.handleSubmit}>
      <Stack gap="sm">
        <Textarea
          label="Your comment"
          name="text" // Передаем name
          formik={formik} // Передаем formik
        />
        {/* Отображаем алерт с ошибкой или сообщением об успехе */}
        <Alert {...alertProps} />
        <Group justify="flex-end">
          <Button type="submit" loading={buttonProps.loading || addComment.isLoading} disabled={buttonProps.disabled}>
            Add Comment
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
