import { zSignInTrpcInput } from '@brightideas/backend/src/router/auth/signIn/input';
// --- Импорты Mantine для лэйаута ---
import { Container, Paper, Stack, Title, Anchor, Text } from '@mantine/core'; // Добавлены Anchor, Text, Center
// -----------------------------------
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom'; // Импортируем Link для регистрации
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';
import { Input } from '../../../components/Input';
import { useForm } from '../../../lib/form';
import { mixpanelIdentify, mixpanelTrackSignIn } from '../../../lib/mixpanel';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { getAllIdeasRoute, getSignUpRoute } from '../../../lib/routes'; // Добавлен getSignUpRoute
import { trpc } from '../../../lib/trpc';

const SignInPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign In',
})(() => {
  const navigate = useNavigate();
  const trpcUtils = trpc.useUtils();
  const signIn = trpc.signIn.useMutation();
  const { formik, buttonProps, alertProps } = useForm({
    initialValues: {
      nick: '',
      password: '',
    },
    validationSchema: zSignInTrpcInput,
    onSubmit: async (values) => {
      const { token, userId } = await signIn.mutateAsync(values);
      mixpanelIdentify(userId);
      mixpanelTrackSignIn();
      Cookies.set('token', token, { expires: 99999 });
      void trpcUtils.invalidate();
      navigate(getAllIdeasRoute());
    },
  });

  return (
    // Добавляем верхний отступ к контейнеру
    <Container size="xs" my="xl" mt="5rem"> {/* Увеличил верхний отступ */}
      <Stack align="center" gap="lg"> {/* Центрируем весь контент */}

        {/* Опционально: Логотип */}
        {/* <Image src="/path/to/your/logo.svg" alt="BrightIdeas Logo" w={80} mb="lg" /> */}

        <Title order={1} ta="center">
          Sign In
        </Title>

        <Paper withBorder shadow="md" p="xl" radius="md" w="100%"> {/* Задаем ширину 100% от контейнера */}
          <form onSubmit={formik.handleSubmit}>
            <Stack gap="md">
              <Input label="Nick" name="nick" formik={formik} />
              <Input label="Password" name="password" type="password" formik={formik} />
              <Alert {...alertProps} />
              <Button {...buttonProps} >
                Sign In
              </Button>
            </Stack>
          </form>
        </Paper>

        {/* Ссылки под формой */}
        <Text ta="center" size="sm">
          {/* Опционально: ссылка "Забыли пароль?" */}
          {/* <Anchor href="/forgot-password" size="sm" mr="sm">
                    Forgot password?
                </Anchor> */}
          Don&apos;t have an account?{' '}
          <Anchor component={Link} to={getSignUpRoute()} size="sm" fw={500}>
            Sign Up
          </Anchor>
        </Text>
      </Stack>
    </Container>
  );
});

export default SignInPage;