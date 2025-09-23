import { Group, HoverCard, Text } from "@mantine/core";
import { memo } from "react";

import styles from "./hoverPaper.module.css";

interface IHoverPaperProps {
  text: string;
}

function HoverPaper(props: IHoverPaperProps) {
  const { text } = props;

  function renderHoverTarget() {
    return (
      <HoverCard.Target>
        <Text truncate="end" size="md" className={styles.hoverText}>
          {text}
        </Text>
      </HoverCard.Target>
    );
  }

  function renderHoverDropdown() {
    return (
      <HoverCard.Dropdown className={styles.dropdown}>
        <Text size="sm">{text}</Text>
      </HoverCard.Dropdown>
    );
  }

  function render() {
    return (
      <Group justify="center" className={styles.hoverContainer}>
        <HoverCard width={280} shadow="md" radius="xs">
          {renderHoverTarget()}
          {renderHoverDropdown()}
        </HoverCard>
      </Group>
    );
  }

  return render();
}

export default memo(HoverPaper);
