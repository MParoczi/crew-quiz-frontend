import { ActionIcon } from "@mantine/core";
import { IconChevronUp, IconChevronDown } from "@tabler/icons-react";
import styles from "./floatingMenuChevron.module.css";

interface IFloatingMenuChevronProps {
  onClick: () => void;
  opened: boolean;
}

function FloatingMenuChevron(props: IFloatingMenuChevronProps) {
  const { onClick, opened } = props;

  function render() {
    return (
      <ActionIcon variant="light" radius="xs" size="xl" onClick={onClick} className={styles.floatingChevron} color="greenAccent">
        {opened ? <IconChevronDown size={24} /> : <IconChevronUp size={24} />}
      </ActionIcon>
    );
  }

  return render();
}

export default FloatingMenuChevron;
