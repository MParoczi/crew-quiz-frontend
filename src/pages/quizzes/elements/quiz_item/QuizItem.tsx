import { Accordion, Button, Flex, Group, Space, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { memo, useCallback } from "react";

import { deleteApiQuizDeleteQuizByQuizIdMutation } from "../../../../api/@tanstack/react-query.gen.ts";
import ConfirmationModal from "../../../../components/confirmation_modal/ConfirmationModal.tsx";
import classes from "../../quizzesPage.module.css";

import QuestionGroupModal from "../quiz_modal/QuizModal.tsx";

import type { BackendModelsDtosQuestionGroupDto, BackendModelsDtosQuizDto } from "../../../../api/types.gen.ts";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface IQuizItemProps {
  item: BackendModelsDtosQuizDto;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<BackendModelsDtosQuizDto[]>>;
}

function QuizItem(props: IQuizItemProps) {
  const { item, refetch } = props;

  const [editQuizModalOpened, { open: openEditQuizModalOpened, close: closeEditQuizModalOpened }] = useDisclosure(false);
  const [deleteQuizModalOpened, { open: openDeleteQuizModalOpened, close: closeDeleteQuizModalOpened }] = useDisclosure(false);

  const deleteQuizMutation = useMutation({
    ...deleteApiQuizDeleteQuizByQuizIdMutation(),
  });

  const handleDelete = useCallback(() => {
    if (item.quizId) {
      deleteQuizMutation.mutate({ path: { quizId: item.quizId } });
      closeDeleteQuizModalOpened();
      void refetch();
    }
  }, [deleteQuizMutation, item.quizId, refetch, closeDeleteQuizModalOpened]);

  function renderQuestionGroupList(quiz: BackendModelsDtosQuestionGroupDto, index: number) {
    return (
      <span key={`${quiz.name ?? "quiz"}_${String(index + 1)}`}>
        <Group grow justify="space-between">
          <Title order={4}>{quiz.name}</Title>
          <Text>{quiz.description}</Text>
        </Group>
        <Space h="md" />
      </span>
    );
  }

  function renderQuizList() {
    return item.questionGroups?.map((questionGroup, index) => {
      return renderQuestionGroupList(questionGroup, index);
    });
  }

  function renderButtons() {
    return (
      <Flex justify="flex-end" align="center" direction="row" gap="md">
        <Button variant="light" radius="xs" size="md" color="warning" onClick={openEditQuizModalOpened} leftSection={<IconEdit />}>
          Edit
        </Button>
        <Button variant="light" radius="xs" size="md" color="error" onClick={openDeleteQuizModalOpened} leftSection={<IconTrash />}>
          Delete
        </Button>
      </Flex>
    );
  }

  function renderModals() {
    return (
      <>
        <ConfirmationModal
          opened={deleteQuizModalOpened}
          close={closeDeleteQuizModalOpened}
          onConfirm={handleDelete}
          onCancel={closeDeleteQuizModalOpened}
          question={`Do you want to delete "${item.name ?? "this quiz"}" quiz?`}
        />
        <QuestionGroupModal opened={editQuizModalOpened} onClose={closeEditQuizModalOpened} quizItem={item} getQuizList={refetch} />
      </>
    );
  }

  function render() {
    return (
      <Accordion.Item className={classes.item} value={item.name ?? ""} style={{ width: "100%" }}>
        <Accordion.Control>
          <Title order={3}>{item.name}</Title>
        </Accordion.Control>
        <Accordion.Panel>
          {renderQuizList()}
          {renderButtons()}
          {renderModals()}
        </Accordion.Panel>
      </Accordion.Item>
    );
  }

  return render();
}

export default memo(QuizItem);
