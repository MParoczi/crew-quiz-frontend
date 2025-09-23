import { ActionIcon, NavLink, Title } from "@mantine/core";
import { memo } from "react";

import styles from "./navbarLink.module.css";

import type { ComponentType } from "react";

interface INavbarLinkProps {
  icon: ComponentType<{ size?: number; stroke?: number }>;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink(props: INavbarLinkProps) {
  const Icon = props.icon;
  const { label, active, onClick } = props;

  function renderIcon() {
    return (
      <ActionIcon variant="light" size="xl" radius="xs" color="greenAccent" className={styles.icon}>
        <Icon size={30} stroke={2} />
      </ActionIcon>
    );
  }

  function renderLabel() {
    return (
      <Title order={4} className={styles.label}>
        {label}
      </Title>
    );
  }

  function render() {
    return <NavLink onClick={onClick} label={renderLabel()} leftSection={renderIcon()} active={active} variant="filled" className={styles.navLink} />;
  }

  return render();
}

export default memo(NavbarLink);
