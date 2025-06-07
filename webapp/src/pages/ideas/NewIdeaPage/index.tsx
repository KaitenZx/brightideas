import { zBaseIdeaInput } from '@brightideas/shared'
import { Container, Title, Stack } from '@mantine/core'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { RichTextEditorInput } from '../../../components/RichTextEditorInput'
import { UploadToS3 } from '../../../components/UploadToS3'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { UploadsToS3 } from '../../../components/UploadsToS3'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

const NewIdeaPage = withPageWrapper({
  title: 'New Idea',
  authorizedOnly: true,
})(() => {
  const createIdea = trpc.createIdea.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      name: '',
      nick: '',
      description: '',
      text: '<p></p>',
      images: [],
      certificate: '',
      documents: [],
    },
    validationSchema: zBaseIdeaInput,
    onSubmit: async (values) => {
      await createIdea.mutateAsync(values)
      formik.resetForm()
    },
  })

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
        <Title order={1} mb="lg">
          New Idea
        </Title>

        <form onSubmit={formik.handleSubmit}>
          <Stack gap="lg">
            <Input name="name" label="Name" formik={formik} />
            <Input name="nick" label="Nick" formik={formik} />
            <Input name="description" label="Description" formik={formik} />
            <RichTextEditorInput name="text" label="Text" required formik={formik} />
            <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />
            <UploadToS3 label="Certificate" name="certificate" formik={formik} />
            <UploadsToS3 label="Documents" name="documents" formik={formik} />
            <Alert {...alertProps} />
            <Button {...buttonProps}>Create Idea</Button>
          </Stack>
        </form>
      </Stack>
    </Container>
  )
})

export default NewIdeaPage
