import type { TrpcRouterOutput } from '@brightideas/backend/src/router'
import { zUpdatePasswordTrpcInput } from '@brightideas/backend/src/router/auth/updatePassword/input'
import { zUpdateProfileTrpcInput } from '@brightideas/backend/src/router/auth/updateProfile/input'
import { zPasswordsMustBeTheSame, zStringRequired } from '@brightideas/shared'
import { Container, Title, Stack, Paper, TextInput } from '@mantine/core'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { Input } from '../../../components/Input'
import { UploadToCloudinary } from '../../../components/UploadToCloudinary'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

const General = ({ me }: { me: NonNullable<TrpcRouterOutput['getMe']['me']> }) => {
  const trpcUtils = trpc.useUtils()
  const updateProfile = trpc.updateProfile.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      nick: me.nick,
      name: me.name,
      avatar: me.avatar,
    },
    validationSchema: zUpdateProfileTrpcInput,
    onSubmit: async (values) => {
      const updatedMe = await updateProfile.mutateAsync(values)
      trpcUtils.getMe.setData(undefined, { me: updatedMe })
    },
    successMessage: 'Profile updated',
    resetOnSuccess: false,
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap="md">
        <TextInput label="Nick" value={formik.values.nick} readOnly variant="filled" />
        <Input label="Name" name="name" formik={formik} />
        <UploadToCloudinary label="Avatar" name="avatar" type="avatar" preset="big" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Update Profile</Button>
      </Stack>
    </form>
  )
}

const Password = () => {
  const updatePassword = trpc.updatePassword.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      newPasswordAgain: '',
    },
    validationSchema: zUpdatePasswordTrpcInput
      .extend({
        newPasswordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('newPassword', 'newPasswordAgain')),
    onSubmit: async ({ newPassword, oldPassword }) => {
      await updatePassword.mutateAsync({ newPassword, oldPassword })
    },
    successMessage: 'Password updated',
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack gap="md">
        <Input label="Old password" name="oldPassword" type="password" formik={formik} />
        <Input label="New password" name="newPassword" type="password" formik={formik} />
        <Input label="New password again" name="newPasswordAgain" type="password" formik={formik} />
        <Alert {...alertProps} />
        <Button {...buttonProps}>Update Password</Button>
      </Stack>
    </form>
  )
}

const EditProfilePage = withPageWrapper({
  authorizedOnly: true,
  setProps: ({ getAuthorizedMe }) => ({
    me: getAuthorizedMe(),
  }),
  title: 'Edit Profile',
})(({ me }) => {
  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Title order={1} mb="lg">Edit Profile</Title>

        <Paper shadow="xs" p="lg" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>General</Title>
            <General me={me} />
          </Stack>
        </Paper>

        <Paper shadow="xs" p="lg" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>Password</Title>
            <Password />
          </Stack>
        </Paper>
      </Stack>
    </Container>
  )
})

export default EditProfilePage
