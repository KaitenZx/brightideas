import { AppShell, Burger, Group, NavLink, ScrollArea } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Logo from '../../assets/images/logo.svg?react'

import { useMe } from '../../lib/ctx'
import {
  getAllIdeasRoute,
  getEditProfileRoute,
  getNewIdeaRoute,
  getSignInRoute,
  getSignOutRoute,
  getSignUpRoute,
} from '../../lib/routes'

export const Layout = () => {
  const [opened, { toggle }] = useDisclosure()
  const me = useMe()
  const location = useLocation()

  const navLinks = (
    <>
      <NavLink
        label="All Ideas"
        component={Link}
        to={getAllIdeasRoute()}
        active={location.pathname === getAllIdeasRoute()}
        onClick={toggle}
      />
      {me ? (
        <>
          <NavLink
            label="Add Idea"
            component={Link}
            to={getNewIdeaRoute()}
            active={location.pathname === getNewIdeaRoute()}
            onClick={toggle}
          />
          <NavLink
            label="Edit Profile"
            component={Link}
            to={getEditProfileRoute()}
            active={location.pathname === getEditProfileRoute()}
            onClick={toggle}
          />
          <NavLink
            label={`Log Out (${me.nick})`}
            component={Link}
            to={getSignOutRoute()}
            active={location.pathname === getSignOutRoute()}
            onClick={toggle}
          />
        </>
      ) : (
        <>
          <NavLink
            label="Sign Up"
            component={Link}
            to={getSignUpRoute()}
            active={location.pathname === getSignUpRoute()}
            onClick={toggle}
          />
          <NavLink
            label="Sign In"
            component={Link}
            to={getSignInRoute()}
            active={location.pathname === getSignInRoute()}
            onClick={toggle}
          />
        </>
      )}
    </>
  )

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 200,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <Logo style={{ maxWidth: 130, height: 'auto', marginBottom: 15 }} />
        </AppShell.Section>
        <AppShell.Section grow component={ScrollArea}>
          {navLinks}
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}
