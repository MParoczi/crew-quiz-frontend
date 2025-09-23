import { Button, Space, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { memo } from "react";

import QuizModal from "../quiz_modal/QuizModal.tsx";

import type { BackendModelsDtosQuizDto } from "../../../../api/types.gen.ts";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface IQuizHeaderProps {
  getQuizList: (options?: RefetchOptions) => Promise<QueryObserverResult<BackendModelsDtosQuizDto[]>>;
}

function QuizHeader(props: IQuizHeaderProps) {
  const { getQuizList } = props;

  const [newQuizModalOpened, { open: openNewQuizModal, close: closeNewQuizModal }] = useDisclosure(false);

  function render() {
    return (
      <Stack align="center" justify="center">
        <Title size="h1">Quizzes</Title>
        <Button variant="light" radius="xs" size="md" leftSection={<IconPlus />} onClick={openNewQuizModal}>
          Add new quiz
        </Button>
        <QuizModal opened={newQuizModalOpened} onClose={closeNewQuizModal} getQuizList={getQuizList} />
        <Space h="sm" />
      </Stack>
    );
  }

  return render();
}

export default memo(QuizHeader);
