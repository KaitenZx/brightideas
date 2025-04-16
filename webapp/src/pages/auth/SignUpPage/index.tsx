import { zSignUpTrpcInput } from '@brightideas/backend/src/router/auth/signUp/input';
import { zPasswordsMustBeTheSame, zStringRequired } from '@brightideas/shared';
import { Container, Paper, Stack, Title, Anchor, Text } from '@mantine/core';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useForm } from '../../../lib/form';
import { mixpanelAlias, mixpanelTrackSignUp } from '../../../lib/mixpanel';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { getAllIdeasRoute, getSignInRoute } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';

const SignUpPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign Up',
})(() => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useUtils();
  const signUp = trpc.signUp.useMutation();
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
      const { token, userId } = await signUp.mutateAsync(values);
      mixpanelAlias(userId);
      mixpanelTrackSignUp();
      Cookies.set('token', token, { expires: 99999 });
      void trpcUtils.invalidate();
      navigate(getAllIdeasRoute());
    },
  });

  return (
    <Container size="xs" my="xl" mt="5rem">
      <Stack align="center" gap="lg">

        <Title order={1} ta="center">
          Sign Up
        </Title>

        <Paper withBorder shadow="md" p="xl" radius="md" w="100%">
          <form onSubmit={formik.handleSubmit}>
            <Stack gap="md">
              <Input label="Nick" name="nick" formik={formik} />
              <Input label="E-mail" name="email" formik={formik} />
              <Input label="Password" name="password" type="password" formik={formik} />
              <Input label="Password again" name="passwordAgain" type="password" formik={formik} />
              <Alert {...alertProps} />
              <Button {...buttonProps} >
                Sign Up
              </Button>
            </Stack>
          </form>
        </Paper>

        <Text ta="center" size="sm">
          Already have an account?{' '}
          <Anchor component={Link} to={getSignInRoute()} size="sm" fw={500}>
            Sign In
          </Anchor>
        </Text>
      </Stack>
    </Container>
  );
});

export default SignUpPage;