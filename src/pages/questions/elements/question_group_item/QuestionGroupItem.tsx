import { Accordion, Badge, Button, Flex, Group, Space, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { memo, useCallback } from "react";

import { deleteApiQuestionGroupDeleteQuestionGroupByQuestionGroupIdMutation } from "../../../../api/@tanstack/react-query.gen.ts";
import ConfirmationModal from "../../../../components/confirmation_modal/ConfirmationModal.tsx";
import HoverPaper from "../../../../components/hover_paper/HoverPaper.tsx";
import useMutateData from "../../../../hooks/useMutateData.ts";
import classes from "../../questionsPage.module.css";

import QuestionGroupModal from "../question_group_modal/QuestionGroupModal.tsx";

import type { BackendModelsDtosQuestionDto, BackendModelsDtosQuestionGroupDto } from "../../../../api/types.gen.ts";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface IQuestionGroupItemProps {
  item: BackendModelsDtosQuestionGroupDto;
  getQuestionGroupList: (refetchOptions?: RefetchOptions) => Promise<QueryObserverResult<BackendModelsDtosQuestionGroupDto[]>>;
}

function QuestionGroupItem(props: IQuestionGroupItemProps) {
  const { item, getQuestionGroupList } = props;

  const [deleteQuestionGroupModalOpened, { open: openDeleteQuestionGroupModalOpened, close: closeDeleteQuestionGroupModalOpened }] = useDisclosure(false);
  const [editQuestionGroupModalOpened, { open: openEditQuestionGroupModalOpened, close: closeEditQuestionGroupModalOpened }] = useDisclosure(false);

  const handleDeleteSuccess = useCallback(async () => {
    await getQuestionGroupList();
  }, [getQuestionGroupList]);

  const [, deleteQuestionGroup] = useMutateData(deleteApiQuestionGroupDeleteQuestionGroupByQuestionGroupIdMutation, { onSuccess: handleDeleteSuccess });

  const handleDelete = useCallback(async () => {
    if (item.questionGroupId) {
      await deleteQuestionGroup(undefined, { questionGroupId: item.questionGroupId });
    }
    closeDeleteQuestionGroupModalOpened();
  }, [closeDeleteQuestionGroupModalOpened, deleteQuestionGroup, item.questionGroupId]);

  function renderQuestion(question: BackendModelsDtosQuestionDto, index: number) {
    return (
      <span key={`${question.inquiry ?? "question"}_${String(index + 1)}`}>
        <Group grow justify="space-between">
          <Badge variant="light" size="xl" radius="xs" flex="none">
            {question.point}
          </Badge>
          <HoverPaper text={question.inquiry ?? ""} />
          <HoverPaper text={question.answer ?? ""} />
        </Group>
        <Space h="md" />
      </span>
    );
  }

  function renderQuestionList() {
    return item.questions?.map((question: BackendModelsDtosQuestionDto, index) => {
      return renderQuestion(question, index);
    });
  }

  function renderButtons() {
    return (
      <Flex justify="flex-end" align="center" direction="row" gap="md">
        <Button variant="light" radius="xs" size="md" color="warning" onClick={openEditQuestionGroupModalOpened} leftSection={<IconEdit />}>
          Edit
        </Button>
        <Button variant="light" radius="xs" size="md" color="error" onClick={openDeleteQuestionGroupModalOpened} leftSection={<IconTrash />}>
          Delete
        </Button>
      </Flex>
    );
  }

  function renderModals() {
    return (
      <>
        <ConfirmationModal
          opened={deleteQuestionGroupModalOpened}
          close={closeDeleteQuestionGroupModalOpened}
          onConfirm={handleDelete}
          onCancel={closeDeleteQuestionGroupModalOpened}
          question={`Do you want to delete "${item.name ?? "this"}" question group?`}
        />
        <QuestionGroupModal
          opened={editQuestionGroupModalOpened}
          onClose={closeEditQuestionGroupModalOpened}
          questionGroupItem={item}
          getQuestionGroupList={getQuestionGroupList}
        />
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
          <Text>{item.description}</Text>
          <Space h="md" />
          {renderQuestionList()}
          {renderButtons()}
          {renderModals()}
        </Accordion.Panel>
      </Accordion.Item>
    );
  }

  return render();
}

export default memo(QuestionGroupItem);
