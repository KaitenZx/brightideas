import { zUpdateIdeaTrpcInput } from '@brightideas/backend/src/router/ideas/updateIdea/input';
import { canEditIdea } from '@brightideas/backend/src/utils/can';
import { pick } from '@brightideas/shared';
import { Container, Stack, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../../components/Alert';
import { Button } from '../../../components/Button';

import { Input } from '../../../components/Input';
import { RichTextEditorInput } from '../../../components/RichTextEditorInput';
import { UploadToS3 } from '../../../components/UploadToS3';
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary';
import { UploadsToS3 } from '../../../components/UploadsToS3';
import { useForm } from '../../../lib/form';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { getEditIdeaRoute, getViewIdeaRoute } from '../../../lib/routes';
import { trpc } from '../../../lib/trpc';

const EditIdeaPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { ideaNick } = getEditIdeaRoute.useParams();
    return trpc.getIdea.useQuery({
      ideaNick,
    });
  },
  // Оставляем проверки доступа и получение данных
  checkExists: ({ queryResult }) => !!queryResult.data.idea,
  checkExistsMessage: 'Idea not found',
  checkAccess: ({ queryResult, ctx }) => !!ctx.me && ctx.me.id === queryResult.data.idea?.authorId,
  checkAccessMessage: 'An idea can only be edited by the author',
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const idea = checkExists(queryResult.data.idea, 'Idea not found');
    checkAccess(canEditIdea(ctx.me, idea), 'An idea can only be edited by the author');
    return {
      idea,
    };
  },
  // Используем данные для заголовка страницы
  title: ({ idea }) => `Edit Idea: ${idea.nick}`, // Обновил формат заголовка
})(({ idea }) => {
  const navigate = useNavigate();
  const updateIdea = trpc.updateIdea.useMutation();
  const { formik, alertProps, buttonProps } = useForm({
    // Оставляем инициализацию формы
    initialValues: pick(idea, ['name', 'nick', 'description', 'text', 'images', 'certificate', 'documents']),
    validationSchema: zUpdateIdeaTrpcInput.omit({ ideaId: true }),
    onSubmit: async (values) => {
      await updateIdea.mutateAsync({ ideaId: idea.id, ...values });
      navigate(getViewIdeaRoute({ ideaNick: values.nick as string }));
    },
  });

  return (
    // Используем Container и Stack как в NewIdeaPage
    <Container size="md" py="xl">
      <Stack gap="lg">
        {/* Заголовок страницы */}
        <Title order={1} mb="lg">
          {`Edit Idea: ${idea.nick}`}
        </Title>

        {/* Форма */}
        <form onSubmit={formik.handleSubmit}>
          {/* Используем Stack для полей формы */}
          <Stack gap="md"> {/* Можно использовать 'md' для меньших отступов между полями */}
            <Input label="Name" name="name" formik={formik} />
            <Input label="Nick" name="nick" formik={formik} />
            {/* Убрал maxWidth из Description, пусть Container управляет */}
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
  );
});

export default EditIdeaPage;