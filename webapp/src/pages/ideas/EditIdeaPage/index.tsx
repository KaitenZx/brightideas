import { pick, zBaseUpdateIdeaInput } from '@brightideas/shared'
import { Container, Stack, Title } from '@mantine/core'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'

import { Input } from '../../../components/Input'
import { RichTextEditorInput } from '../../../components/RichTextEditorInput'
import { UploadToS3 } from '../../../components/UploadToS3'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { UploadsToS3 } from '../../../components/UploadsToS3'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getEditIdeaRoute, getViewIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

const EditIdeaPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { ideaNick } = getEditIdeaRoute.useParams()
    return trpc.getIdea.useQuery({
      ideaNick,
    })
  },
  checkExists: ({ queryResult }) => !!queryResult.data.idea,
  checkExistsMessage: 'Idea not found',
  checkAccess: ({ queryResult, ctx }) => !!ctx.me && ctx.me.id === queryResult.data.idea?.authorId,
  checkAccessMessage: 'An idea can only be edited by the author',
  setProps: ({ queryResult, checkExists }) => {
    const idea = checkExists(queryResult.data.idea, 'Idea not found')
    return {
      idea,
    }
  },
  title: ({ idea }) => `Edit Idea: ${idea.nick}`, // Обновил формат заголовка
})(({ idea }) => {
  const navigate = useNavigate()
  const updateIdea = trpc.updateIdea.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: pick(idea, ['name', 'nick', 'description', 'text', 'images', 'certificate', 'documents']),
    validationSchema: zBaseUpdateIdeaInput.omit({ ideaId: true }),
    onSubmit: async (values) => {
      await updateIdea.mutateAsync({ ideaId: idea.id, ...values })
      navigate(getViewIdeaRoute({ ideaNick: values.nick as string }))
    },
  })

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1} mb="lg">
          {`Edit Idea: ${idea.nick}`}
        </Title>

        <form onSubmit={formik.handleSubmit}>
          <Stack gap="md">
            {' '}
            <Input label="Name" name="name" formik={formik} />
            <Input label="Nick" name="nick" formik={formik} />
            <Input label="Description" name="description" formik={formik} />
            <RichTextEditorInput name="text" label="Text" required formik={formik} />
            <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />
            <UploadToS3 label="Certificate" name="certificate" formik={formik} />
            <UploadsToS3 label="Documents" name="documents" formik={formik} />
            <Alert {...alertProps} />
            <Button {...buttonProps}>Update Idea</Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
})

export default EditIdeaPage
