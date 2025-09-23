import { Button, Group, Modal, Stack, Text, Title } from "@mantine/core";
import { memo } from "react";

import styles from "./questionModal.module.css";

interface IQuestionModalProps {
  opened: boolean;
  close: () => void;
  question: string;
  category: string;
  points: number;
  onAnswer: (isCorrect: boolean) => void;
  answers?: string[];
  correctAnswer?: string;
}

function QuestionModal(props: IQuestionModalProps) {
  const { opened, close, question, category, points, onAnswer, answers, correctAnswer } = props;

  function handleAnswer(selectedAnswer: string) {
    const isCorrect = selectedAnswer === correctAnswer;
    onAnswer(isCorrect);
  }

  function renderHeader() {
    return (
      <Stack gap="xs" className={styles.header}>
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed" fw={500} className={styles.category}>
            {category}
          </Text>
          <Text size="lg" fw={700} c="greenAccent" className={styles.points}>
            ${points}
          </Text>
        </Group>
      </Stack>
    );
  }

  function renderQuestion() {
    return (
      <Title order={3} ta="center" fw={600} className={styles.question}>
        {question}
      </Title>
    );
  }

  function renderAnswers() {
    if (!answers || answers.length === 0) {
      return null;
    }

    return (
      <Stack gap="sm" className={styles.answersContainer}>
        {answers.map((answer) => (
          <Button
            key={answer}
            variant="light"
            size="lg"
            radius="xs"
            color="greenAccent"
            onClick={() => {
              handleAnswer(answer);
            }}
            fullWidth
            className={styles.answerButton}
          >
            {answer}
          </Button>
        ))}
      </Stack>
    );
  }

  function renderActions() {
    return (
      <Group justify="center" className={styles.actions}>
        <Button variant="light" size="md" radius="xs" onClick={close} color="error" className={styles.closeButton}>
          Close
        </Button>
      </Group>
    );
  }

  function render() {
    return (
      <Modal opened={opened} onClose={close} size="lg" centered withCloseButton={false} radius="xs" padding="xl" className={styles.modal}>
        <Stack gap="xl">
          {renderHeader()}
          {renderQuestion()}
          {renderAnswers()}
          {renderActions()}
        </Stack>
      </Modal>
    );
  }

  return render();
}

export default memo(QuestionModal);
