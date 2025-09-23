import { Button, Group, Modal, Stack, Text } from "@mantine/core";

import styles from "./confirmationModal.module.css";

interface IConfirmationModalProps {
  opened: boolean;
  close: () => void;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
  question: string;
}

function ConfirmationModal(props: IConfirmationModalProps) {
  const { opened, close, onConfirm, onCancel, question } = props;

  function renderActions() {
    return (
      <Group justify="flex-end" gap="sm" className={styles.actions}>
        <Button variant="light" radius="xs" size="md" onClick={onCancel} color="error" className={styles.cancelButton}>
          Cancel
        </Button>
        {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
        <Button variant="light" radius="xs" size="md" onClick={onConfirm} color="greenAccent" className={styles.confirmButton}>
          Confirm
        </Button>
      </Group>
    );
  }

  function render() {
    return (
      <Modal centered opened={opened} onClose={close} withCloseButton={false} size="xs" radius="xs" className={styles.modal}>
        <Stack gap="lg">
          <Text size="md" fw={500} className={styles.questionText}>
            {question}
          </Text>
          {renderActions()}
        </Stack>
      </Modal>
    );
  }

  return render();
}

export default ConfirmationModal;
