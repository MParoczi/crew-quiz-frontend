import { AppShell, Burger, Group, Image, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogout } from "@tabler/icons-react";
import { memo, useCallback, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import ConfirmationModal from "../../components/confirmation_modal/ConfirmationModal.tsx";
import NavbarLink from "../../components/navbar_link/NavbarLink";
import menuItemList from "../../constants/menuItems.ts";
import { login } from "../../constants/pages.ts";
import useUserLocalStorage from "../../hooks/useUserLocalStorage";
import logo from "../../resources/images/logo.svg";
import { clearApiToken } from "../../utils/apiClient";

import classes from "./mainLayout.module.css";

function MainLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const [active, setActive] = useState(menuItemList.findIndex((menuItem) => location.pathname === menuItem.route));
  const [logoutConfirmationModalOpened, { open: openLogoutConfirmationModal, close: closeLogoutConfirmationModal }] = useDisclosure(false);
  const [, , removeUser] = useUserLocalStorage();
  const navigate = useNavigate();

  const handleNavigation = useCallback(
    (index: number, route: string) => {
      setActive(index);
      void navigate(route);
      toggle();
    },
    [navigate, toggle],
  );

  const handleLogoutClick = useCallback(() => {
    openLogoutConfirmationModal();
  }, [openLogoutConfirmationModal]);

  const handleLogout = useCallback(() => {
    closeLogoutConfirmationModal();
    clearApiToken();
    removeUser();
    void navigate(login);
  }, [closeLogoutConfirmationModal, navigate, removeUser]);

  function renderMenuItemList() {
    return menuItemList.map((link, index) => (
      <NavbarLink
        icon={link.icon}
        label={link.label}
        key={link.label}
        active={index === active}
        onClick={() => {
          handleNavigation(index, link.route);
        }}
      />
    ));
  }

  function renderHeader() {
    return (
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Image src={logo} width={50} height={50} alt="logo" className={classes.logo} />
          <Title order={1}>Crew Quiz</Title>
        </Group>
      </AppShell.Header>
    );
  }

  function renderNavbar() {
    return (
      <AppShell.Navbar p="md">
        <nav className={classes.navbar}>
          <div className={classes.navbarMain}>
            <Stack justify="center" gap={0}>
              {renderMenuItemList()}
            </Stack>
          </div>
          <Stack justify="center" gap={0}>
            <NavbarLink icon={IconLogout} label="Logout" onClick={handleLogoutClick} />
          </Stack>
        </nav>
      </AppShell.Navbar>
    );
  }

  function renderMain() {
    return (
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    );
  }

  function renderConfirmationModal() {
    return (
      <ConfirmationModal
        opened={logoutConfirmationModalOpened}
        close={closeLogoutConfirmationModal}
        onConfirm={handleLogout}
        onCancel={closeLogoutConfirmationModal}
        question="Do you want to logout?"
      />
    );
  }

  function renderContent() {
    return (
      <AppShell header={{ height: 60 }} navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }} padding="md">
        {renderHeader()}
        {renderNavbar()}
        {renderMain()}
        {renderConfirmationModal()}
      </AppShell>
    );
  }

  function render() {
    return renderContent();
  }

  return render();
}

export default memo(MainLayout);
