import { Button, Space, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { memo } from "react";

import QuestionGroupModal from "../question_group_modal/QuestionGroupModal.tsx";

import type { BackendModelsDtosQuestionGroupDto } from "../../../../api/types.gen.ts";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface IQuestionsHeaderProps {
  getQuestionGroupList: (refetchOptions?: RefetchOptions) => Promise<QueryObserverResult<BackendModelsDtosQuestionGroupDto[]>>;
}

function QuestionsHeader(props: IQuestionsHeaderProps) {
  const { getQuestionGroupList } = props;

  const [newQuestionGroupModalOpened, { open: openNewQuestionGroupModal, close: closeNewQuestionGroupModal }] = useDisclosure(false);

  function render() {
    return (
      <Stack align="center" justify="center">
        <Title size="h1">Question Groups</Title>
        <Button variant="light" radius="xs" size="md" leftSection={<IconPlus />} onClick={openNewQuestionGroupModal}>
          Add new question group
        </Button>
        <QuestionGroupModal opened={newQuestionGroupModalOpened} onClose={closeNewQuestionGroupModal} getQuestionGroupList={getQuestionGroupList} />
        <Space h="sm" />
      </Stack>
    );
  }

  return render();
}

export default memo(QuestionsHeader);
