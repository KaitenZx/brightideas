import type { TrpcRouterOutput } from '@brightideas/backend/src/router';
import { canBlockIdeas, canEditIdea } from '@brightideas/backend/src/utils/can';
import {
  Avatar,
  Box,
  Group,
  Stack,
  Text,
  ActionIcon,
  Anchor,
  Container,
  Title,
  TypographyStylesProvider,
  Divider,
} from '@mantine/core';
import { IconFile, IconCertificate, IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { format } from 'date-fns/format';
import ImageGallery, { ReactImageGalleryProps } from 'react-image-gallery';
// --- Используем ТВОИ компоненты ---
import { Alert } from '../../../components/Alert';
import { Button, LinkButton } from '../../../components/Button';
// -----------------------------------
import { Icon } from '../../../components/Icon'; // Оставляем, если используется для лайка
import { getAvatarUrl, getCloudinaryUploadUrl } from '../../../lib/cloudinary';
import { useForm } from '../../../lib/form';
import { mixpanelSetIdeaLike } from '../../../lib/mixpanel';
import { withPageWrapper } from '../../../lib/pageWrapper';
import { getEditIdeaRoute, getViewIdeaRoute } from '../../../lib/routes';
import { getS3UploadName, getS3UploadUrl } from '../../../lib/s3';
import { trpc } from '../../../lib/trpc';
import classes from './index.module.scss';

// --- Компонент LikeButton (без изменений, использует ActionIcon) ---
const LikeButton = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const trpcUtils = trpc.useUtils();
  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcUtils.getIdea.getData({ ideaNick: idea.nick });
      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: oldGetIdeaData.idea.likesCount + (isLikedByMe ? 1 : -1),
          },
        };
        trpcUtils.getIdea.setData({ ideaNick: idea.nick }, newGetIdeaData);
      }
    },
    onSuccess: () => {
      void trpcUtils.getIdea.invalidate({ ideaNick: idea.nick });
    },
  });
  return (
    <ActionIcon
      variant="subtle"
      color="red" // Можно оставить или убрать для цвета по умолчанию
      onClick={() => {
        void setIdeaLike
          .mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
          .then(({ idea: { isLikedByMe } }) => {
            if (isLikedByMe) {
              mixpanelSetIdeaLike(idea);
            }
          });
      }}
      aria-label={idea.isLikedByMe ? 'Unlike idea' : 'Like idea'}
    >
      <Icon size={24} name={idea.isLikedByMe ? 'likeFilled' : 'likeEmpty'} />
    </ActionIcon>
  );
};

// --- Компонент BlockIdea (используем ТВОИ Alert и Button) ---
const BlockIdea = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const blockIdea = trpc.blockIdea.useMutation();
  const trpcUtils = trpc.useUtils();
  // alertProps и buttonProps из useForm предназначены для твоих кастомных компонентов
  const { formik, alertProps, buttonProps } = useForm({
    onSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id });
      await trpcUtils.getIdea.refetch({ ideaNick: idea.nick });
    },
  });

  return (
    // form теперь не нужен style={{ width: '100%' }}, т.к. кнопка будет в Group
    <form onSubmit={formik.handleSubmit}>
      {/* Используем твой Alert */}
      <Alert {...alertProps} />
      {/* Добавляем отступ снизу для Alert, если он отображается */}
      {!alertProps.hidden && <Box mb="sm" />}
      {/* Используем твой Button */}
      <Button
        {...buttonProps} // Передаем loading, disabled из useForm
        color="red"      // Явно указываем цвет для этой кнопки
        variant="light"  // Указываем вариант
        type="submit"
      >
        Block Idea
      </Button>
    </form>
  );
};

// --- Основной компонент страницы ---
const ViewIdeaPage = withPageWrapper({
  useQuery: () => {
    const { ideaNick } = getViewIdeaRoute.useParams();
    return trpc.getIdea.useQuery({
      ideaNick,
    });
  },
  setProps: ({ queryResult, checkExists, ctx }) => ({
    idea: checkExists(queryResult.data.idea, 'Idea not found'),
    me: ctx.me,
  }),
  showLoaderOnFetching: false,
  title: ({ idea }) => idea.name,
})(({ idea, me }) => {
  // --- Функции рендера навигации галереи (без изменений) ---
  const renderLeftNav: ReactImageGalleryProps['renderLeftNav'] = (onClick, disabled) => {
    return (
      <ActionIcon
        className={`${classes.navButton} ${classes.leftNav}`}
        variant="default"
        onClick={onClick}
        disabled={disabled}
        aria-label="Previous Slide"
        size="lg"
      >
        <IconChevronLeft />
      </ActionIcon>
    );
  };

  const renderRightNav: ReactImageGalleryProps['renderRightNav'] = (onClick, disabled) => {
    return (
      <ActionIcon
        className={`${classes.navButton} ${classes.rightNav}`}
        variant="default"
        onClick={onClick}
        disabled={disabled}
        aria-label="Next Slide"
        size="lg"
      >
        <IconChevronRight />
      </ActionIcon>
    );
  };

  const hasAttachments = !!idea.certificate || !!idea.documents.length;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Блок 1: Заголовок, описание, автор (без изменений) */}
        <Stack gap="sm">
          <Title order={1}>{idea.name}</Title>
          {idea.description && <Text c="dimmed">{idea.description}</Text>}
          <Group justify="space-between">
            <Group gap="sm" wrap="nowrap">
              <Avatar src={getAvatarUrl(idea.author.avatar, 'small')} size="md" radius="xl" />
              <Stack gap={0}>
                <Text size="sm" fw={500}>Author:</Text>
                <Text size="xs">
                  {idea.author.nick}
                  {idea.author.name ? ` (${idea.author.name})` : ''}
                </Text>
              </Stack>
            </Group>
            <Text size="xs" c="dimmed">Created At: {format(idea.createdAt, 'yyyy-MM-dd')}</Text>
          </Group>
        </Stack>

        {/* Блок 2: Основной текст идеи (без изменений) */}
        <TypographyStylesProvider>
          <Box dangerouslySetInnerHTML={{ __html: idea.text }} />
        </TypographyStylesProvider>

        {/* Блок 3: Галерея изображений (без изменений) */}
        {!!idea.images.length && (
          <Box className={classes.imageGalleryWrapper}>
            <ImageGallery
              showPlayButton={false}
              showFullscreenButton={false}
              items={idea.images.map((image) => ({
                original: getCloudinaryUploadUrl(image, 'image', 'large'),
                thumbnail: getCloudinaryUploadUrl(image, 'image', 'preview'),
              }))}
              renderLeftNav={renderLeftNav}
              renderRightNav={renderRightNav}
            />
          </Box>
        )}

        {/* Блок 4: Документы и Сертификат (без изменений) */}
        {hasAttachments && (
          <>
            <Divider />
            <Stack gap="md">
              {idea.certificate && (
                <Group wrap="nowrap" gap="xs">
                  <IconCertificate size="1.1rem" stroke={1.5} />
                  <Text size="sm" fw={500} style={{ whiteSpace: 'nowrap' }}>Certificate:</Text>
                  <Anchor href={getS3UploadUrl(idea.certificate)} target="_blank" size="xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {getS3UploadName(idea.certificate)}
                  </Anchor>
                </Group>
              )}

              {!!idea.documents.length && (
                <Stack gap="xs">
                  <Group wrap="nowrap" gap="xs">
                    <IconFile size="1.1rem" stroke={1.5} />
                    <Text size="sm" fw={500}>Documents:</Text>
                  </Group>
                  <Stack gap="xs" pl="lg">
                    {idea.documents.map((document) => (
                      <Anchor key={document} href={getS3UploadUrl(document)} target="_blank" size="xs" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {getS3UploadName(document)}
                      </Anchor>
                    ))}
                  </Stack>
                </Stack>
              )}
            </Stack>
          </>
        )}

        {/* Блок 5: Лайки и Действия */}
        <Divider />
        <Group justify="space-between" align="center">
          {/* Лайки (без изменений) */}
          <Group align="center">
            <Text fw={500} size="lg">Likes: {idea.likesCount}</Text>
            {me && <LikeButton idea={idea} />}
          </Group>

          {/* Кнопки действий (Используем ТВОИ компоненты) */}
          <Group gap="sm">
            {canEditIdea(me, idea) && (
              // Используем твой LinkButton
              <LinkButton
                to={getEditIdeaRoute({ ideaNick: idea.nick })}
                variant="light" // Указываем вариант (цвет будет teal из темы по умолчанию)
              // style можно убрать, если не нужен кастомный стиль
              >
                Edit Idea
              </LinkButton>
            )}
            {canBlockIdeas(me) && (
              // Рендерим компонент BlockIdea, который внутри использует твой Button
              <BlockIdea idea={idea} />
            )}
          </Group>
        </Group>

      </Stack>
    </Container>
  );
});

export default ViewIdeaPage;