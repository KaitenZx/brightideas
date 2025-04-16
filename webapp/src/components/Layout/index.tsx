// /Users/kaiten/prgmStuff/BrightIdeas/webapp/src/components/Layout/index.tsx
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  UnstyledButton,
  Menu,
  Avatar,
  Text,
  rem,
  ActionIcon,
  useMantineColorScheme,
  useMantineTheme,
  Divider,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLogout, // Нужен для UserMenu
  IconSettings, // Нужен для UserMenu
  IconChevronDown, // Нужен для UserMenu
  IconSun,
  IconMoon,
  IconHome,
  IconPlus,
  IconLogin,
  IconUserPlus,
  IconUserCircle, // Иконка для "My Ideas"
  IconHeart, // Иконка для "Liked Ideas"
} from '@tabler/icons-react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/logo.svg?react';

import { LinkButton } from '../../components/Button'; // Нужен для UserMenu (Sign In)
import { getAvatarUrl } from '../../lib/cloudinary';
import { useMe } from '../../lib/ctx';
import {
  getAllIdeasRoute,
  getEditProfileRoute, // Нужен для UserMenu
  getNewIdeaRoute,
  getSignInRoute,
  getSignOutRoute, // Нужен для UserMenu
  getSignUpRoute,
  getMyIdeasRoute, // Новый роут
  getLikedIdeasRoute, // Новый роут
} from '../../lib/routes';

// --- UserMenu остается без изменений ---
const UserMenu = () => {
  const me = useMe();

  if (!me) {
    return (
      <LinkButton to={getSignInRoute()} >
        Sign In
      </LinkButton>
    );
  }

  return (
    <Menu shadow="md" width={200} withArrow position="bottom-end">
      <Menu.Target>
        <UnstyledButton
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 'var(--mantine-spacing-xs) var(--mantine-spacing-sm)',
            borderRadius: 'var(--mantine-radius-sm)',
            transition: 'background-color 150ms ease',
          }}
          // Добавим hover эффект
          // @ts-ignore Mantine v6 style prop (TODO: use styles api in v7)
          sx={(theme) => ({
            '&:hover': {
              backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            },
          })}
        >
          <Group gap="xs">
            <Avatar
              src={getAvatarUrl(me.avatar, 'small')}
              color="teal"
              radius="xl"
            >
              {me.nick ? me.nick.slice(0, 1).toUpperCase() : 'U'}
            </Avatar>
            <Text size="sm" fw={500} style={{ lineHeight: 1, marginRight: rem(3) }}>
              {me.nick ?? 'User'}
            </Text>
            <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item
          leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
          component={Link}
          to={getEditProfileRoute()}
        >
          Edit Profile
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
          component={Link}
          to={getSignOutRoute()}
        >
          Log Out
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

// --- ThemeToggle остается без изменений ---
const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <ActionIcon
      onClick={() => toggleColorScheme()}
      variant="light" // Сделаем чуть заметнее
      size="lg"
      aria-label="Toggle color scheme"
    >
      {colorScheme === 'dark' ? (
        <IconSun style={{ width: '70%', height: '70%' }} stroke={1.5} />
      ) : (
        <IconMoon style={{ width: '70%', height: '70%' }} stroke={1.5} />
      )}
    </ActionIcon>
  );
};


// --- Основной компонент Layout ---
export const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  const me = useMe();
  const location = useLocation();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // --- Переменные для стилей остаются ---
  const headerBg = colorScheme === 'dark' ? theme.colors.dark[7] : theme.white;
  const navbarBg = colorScheme === 'dark' ? theme.colors.dark[7] : theme.white; // Сделаем навбар белым/темным как хедер
  const logoColor = colorScheme === 'dark' ? theme.colors.teal[4] : theme.primaryColor; // Лого в primary цвете

  // --- Определение активной ссылки ---
  const isActive = (path: string) => location.pathname === path;

  // --- Формирование ссылок навигации ---
  const navLinks = (
    <>
      {/* Общие ссылки */}
      <NavLink
        leftSection={<IconHome size="1rem" stroke={1.5} />}
        label="All Ideas"
        component={Link}
        to={getAllIdeasRoute()}
        active={isActive(getAllIdeasRoute())}
        onClick={opened ? toggle : undefined}
      // variant={isActive(getAllIdeasRoute()) ? 'light' : 'subtle'} // Убрал filled
      // color={isActive(getAllIdeasRoute()) ? theme.primaryColor : undefined} // Цвет только для активной
      />


      {me ? (
        // Ссылки ТОЛЬКО для залогиненного пользователя
        <>
          <Divider my="sm" /> {/* Разделитель */}
          <NavLink
            leftSection={<IconPlus size="1rem" stroke={1.5} />}
            label="Add Idea"
            component={Link}
            to={getNewIdeaRoute()}
            active={isActive(getNewIdeaRoute())}
            onClick={opened ? toggle : undefined}
          // variant={isActive(getNewIdeaRoute()) ? 'light' : 'subtle'}
          // color={isActive(getNewIdeaRoute()) ? theme.primaryColor : undefined}
          />
          <NavLink
            leftSection={<IconUserCircle size="1rem" stroke={1.5} />}
            label="My Ideas"
            component={Link}
            to={getMyIdeasRoute()}
            active={isActive(getMyIdeasRoute())}
            onClick={opened ? toggle : undefined}
          // variant={isActive(getMyIdeasRoute()) ? 'light' : 'subtle'}
          // color={isActive(getMyIdeasRoute()) ? theme.primaryColor : undefined}
          />
          <NavLink
            leftSection={<IconHeart size="1rem" stroke={1.5} />}
            label="Liked Ideas"
            component={Link}
            to={getLikedIdeasRoute()}
            active={isActive(getLikedIdeasRoute())}
            onClick={opened ? toggle : undefined}
          // variant={isActive(getLikedIdeasRoute()) ? 'light' : 'subtle'}
          // color={isActive(getLikedIdeasRoute()) ? theme.primaryColor : undefined}
          />
        </>
      ) : (
        // Ссылки ТОЛЬКО для НЕзалогиненного пользователя
        <>
          <Divider my="sm" /> {/* Разделитель */}
          <NavLink
            leftSection={<IconUserPlus size="1rem" stroke={1.5} />}
            label="Sign Up"
            component={Link}
            to={getSignUpRoute()}
            active={isActive(getSignUpRoute())}
            onClick={opened ? toggle : undefined}
          // variant={isActive(getSignUpRoute()) ? 'light' : 'subtle'}
          // color={isActive(getSignUpRoute()) ? theme.primaryColor : undefined}
          />
          <NavLink
            leftSection={<IconLogin size="1rem" stroke={1.5} />}
            label="Sign In"
            component={Link}
            to={getSignInRoute()}
            active={isActive(getSignInRoute())}
            onClick={opened ? toggle : undefined}
          // variant={isActive(getSignInRoute()) ? 'light' : 'subtle'}
          // color={isActive(getSignInRoute()) ? theme.primaryColor : undefined}
          />
        </>
      )}
    </>
  );

  // --- Рендер AppShell ---
  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm', // Уменьшим breakpoint для навбара
        collapsed: { mobile: !opened },
      }}
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      <AppShell.Header
        style={{
          borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`, // Сделаем линию тоньше
          backgroundColor: headerBg,
        }}
      >
        <Group h="100%" px="md" justify="space-between">
          {/* Левая часть хедера */}
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" /> {/* Сопоставляем с breakpoint */}
            {/* Логотип как ссылка на главную */}
            <UnstyledButton component={Link} to={getAllIdeasRoute()}>
              <Logo style={{ height: 30, width: 'auto', display: 'block' }} fill={logoColor} />
            </UnstyledButton>
          </Group>

          {/* Правая часть хедера */}
          <Group>
            <ThemeToggle />
            <UserMenu />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar
        p="md"
        style={{
          backgroundColor: navbarBg,
          borderRight: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}`, // Добавим границу
        }}
      >
        {/* Убрал AppShell.Section grow, т.к. ссылок мало, пусть будут сверху */}
        {navLinks}
      </AppShell.Navbar>

      {/* Основной контент */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};