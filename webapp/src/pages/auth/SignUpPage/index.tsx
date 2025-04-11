import { zSignUpTrpcInput } from '@brightideas/backend/src/router/auth/signUp/input'
import { zPasswordsMustBeTheSame, zStringRequired } from '@brightideas/shared'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { mixpanelAlias, mixpanelTrackSignUp } from '../../../lib/mixpanel'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getAllIdeasRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'

const SignUpPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign Up',
})(() => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()
  const signUp = trpc.signUp.useMutation()
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      email: '',
      password: '',
      passwordAgain: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        passwordAgain: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('password', 'passwordAgain')),
    onSubmit: async (values) => {
      const { token, userId } = await signUp.mutateAsync(values)
      mixpanelAlias(userId)
      mixpanelTrackSignUp()
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate()
      navigate(getAllIdeasRoute())
    },
  })

  return (
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="E-mail" name="email" formik={formik} />
          <Input label="Password" name="password" type="password" formik={formik} />
          <Input label="Password again" name="passwordAgain" type="password" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
})

export default SignUpPage
