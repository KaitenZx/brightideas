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
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  IconLogout,
  IconSettings,
  IconChevronDown,
  IconSun,
  IconMoon,
  IconHome,
  IconPlus,
  IconLogin,
  IconUserPlus,
  IconUserCircle,
  IconHeart,
  type Icon as TablerIcon,
} from '@tabler/icons-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Logo from '../../assets/images/logo.svg?react'

import { LinkButton } from '../../components/Button'
import { getAvatarUrl } from '../../lib/cloudinary'
import { useMe } from '../../lib/ctx'
import {
  getAllIdeasRoute,
  getEditProfileRoute,
  getNewIdeaRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
  getMyIdeasRoute,
  getLikedIdeasRoute,
} from '../../lib/routes'
import classes from './Layout.module.css'

const navLinkConfig = {
  common: [{ label: 'All Ideas', href: getAllIdeasRoute(), icon: IconHome }],
  authenticated: [
    { label: 'Add Idea', href: getNewIdeaRoute(), icon: IconPlus },
    { label: 'My Ideas', href: getMyIdeasRoute(), icon: IconUserCircle },
    { label: 'Liked Ideas', href: getLikedIdeasRoute(), icon: IconHeart },
  ],
  guest: [
    { label: 'Sign Up', href: getSignUpRoute(), icon: IconUserPlus },
    { label: 'Sign In', href: getSignInRoute(), icon: IconLogin },
  ],
}

const UserMenu = () => {
  const me = useMe()

  if (!me) {
    return <LinkButton to={getSignInRoute()}>Sign In</LinkButton>
  }

  return (
    <Menu shadow="md" width={200} withArrow position="bottom-end">
      <Menu.Target>
        <UnstyledButton className={classes.userMenuButton}>
          <Group gap="xs">
            <Avatar src={getAvatarUrl(me.avatar, 'small')} color="teal" radius="xl">
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
  )
}

const ThemeToggle = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()

  return (
    <ActionIcon onClick={() => toggleColorScheme()} variant="light" size="lg" aria-label="Toggle color scheme">
      {colorScheme === 'dark' ? (
        <IconSun style={{ width: '70%', height: '70%' }} stroke={1.5} />
      ) : (
        <IconMoon style={{ width: '70%', height: '70%' }} stroke={1.5} />
      )}
    </ActionIcon>
  )
}

export const Layout = () => {
  const [opened, { toggle }] = useDisclosure()
  const me = useMe()
  const location = useLocation()
  const theme = useMantineTheme()
  const { colorScheme } = useMantineColorScheme()

  const headerBg = colorScheme === 'dark' ? theme.colors.dark[7] : theme.white
  const navbarBg = colorScheme === 'dark' ? theme.colors.dark[7] : theme.white // Сделаем навбар белым/темным как хедер
  const logoColor = colorScheme === 'dark' ? theme.colors.teal[4] : theme.primaryColor // Лого в primary цвете

  const isActive = (path: string) => location.pathname === path

  const renderNavLink = (link: { label: string; href: string; icon: TablerIcon }) => {
    const Icon = link.icon
    return (
      <NavLink
        key={link.label}
        leftSection={<Icon size="1rem" stroke={1.5} />}
        label={link.label}
        component={Link}
        to={link.href}
        active={isActive(link.href)}
        onClick={opened ? toggle : undefined}
      />
    )
  }

  const navLinks = (
    <>
      {navLinkConfig.common.map(renderNavLink)}
      <Divider my="sm" />
      {(me ? navLinkConfig.authenticated : navLinkConfig.guest).map(renderNavLink)}
    </>
  )

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 250,
        breakpoint: 'sm',
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
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" /> {/* Сопоставляем с breakpoint */}
            <UnstyledButton component={Link} to={getAllIdeasRoute()}>
              <Logo style={{ height: 30, width: 'auto', display: 'block' }} fill={logoColor} />
            </UnstyledButton>
          </Group>

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
        {navLinks}
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
