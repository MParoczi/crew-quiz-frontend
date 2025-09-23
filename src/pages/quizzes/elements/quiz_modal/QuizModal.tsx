import { ActionIcon, Button, Group, List, Modal, Space, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconTrash } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo } from "react";

import {
  getApiQuestionGroupGetQuestionGroupsForCurrentUserOptions,
  postApiQuizCreateQuizMutation,
  putApiQuizUpdateQuizMutation,
} from "../../../../api/@tanstack/react-query.gen.ts";
import CustomAutocomplete from "../../../../components/custom_autocomplete/CustomAutocomplete.tsx";
import useMutateData from "../../../../hooks/useMutateData.ts";
import useQueryData from "../../../../hooks/useQueryData.ts";

import type { BackendModelsDtosQuestionGroupDto, BackendModelsDtosQuizDto, GetApiQuestionGroupGetQuestionGroupsForCurrentUserData } from "../../../../api/types.gen.ts";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface IQuizModalProps {
  opened: boolean;
  onClose: () => void;
  quizItem?: BackendModelsDtosQuizDto;
  getQuizList: (options?: RefetchOptions) => Promise<QueryObserverResult<BackendModelsDtosQuizDto[]>>;
}

interface IQuizForm {
  name: string;
  questionGroups: BackendModelsDtosQuestionGroupDto[];
}

function QuizModal(props: IQuizModalProps) {
  const { opened, onClose, quizItem, getQuizList } = props;

  const handleSubmitSuccess = useCallback(async () => {
    await getQuizList();
  }, [getQuizList]);

  const [, createNewQuiz] = useMutateData(postApiQuizCreateQuizMutation, {
    onSuccess: handleSubmitSuccess,
    successMessage: "New quiz was created",
  });

  const [, updateQuiz] = useMutateData(putApiQuizUpdateQuizMutation, {
    onSuccess: handleSubmitSuccess,
    successMessage: "Quiz was updated",
  });

  const [questionGroupData, getQuestionGroupList] = useQueryData<BackendModelsDtosQuestionGroupDto[], GetApiQuestionGroupGetQuestionGroupsForCurrentUserData>(
    getApiQuestionGroupGetQuestionGroupsForCurrentUserOptions,
  );

  const form = useForm<IQuizForm>({
    mode: "controlled",
    initialValues: {
      name: quizItem?.name ?? "",
      questionGroups: quizItem?.questionGroups ?? [],
    },
    validate: {
      name(value) {
        if (value.length && value.length > 50) {
          return "The name should be no longer than 50 characters.";
        }
        return null;
      },
      questionGroups(value: BackendModelsDtosQuestionGroupDto[]) {
        return value.length < 1 ? "Quiz must have at least 1 question group" : null;
      },
    },
  });

  useEffect(() => {
    void getQuestionGroupList();
  }, [getQuestionGroupList]);

  const questionGroupList = useMemo(() => {
    const addedQuestionGroupIdList = form.getValues().questionGroups.map((questionGroup: BackendModelsDtosQuestionGroupDto) => questionGroup.questionGroupId);
    return questionGroupData?.filter((questionGroup: BackendModelsDtosQuestionGroupDto) => !addedQuestionGroupIdList.includes(questionGroup.questionGroupId));
  }, [questionGroupData, form]);

  const handleClose = useCallback(() => {
    onClose();
    form.reset();
  }, [form, onClose]);

  const handleQuestionGroupSelection = useCallback(
    (selectedListItem: BackendModelsDtosQuestionGroupDto) => {
      form.insertListItem("questionGroups", selectedListItem);
    },
    [form],
  );

  const handleSubmit = useCallback(
    async (formData: IQuizForm) => {
      if (quizItem?.quizId) {
        await updateQuiz({
          quizId: quizItem.quizId,
          name: formData.name,
          questionGroups: formData.questionGroups,
        });
      } else {
        await createNewQuiz({
          name: formData.name,
          questionGroups: formData.questionGroups,
        });
      }
      handleClose();
    },
    [createNewQuiz, handleClose, quizItem?.quizId, updateQuiz],
  );

  function renderQuestionGroupSelector() {
    return (
      <CustomAutocomplete<BackendModelsDtosQuestionGroupDto>
        label="Question Group List"
        keyProperty="name"
        options={questionGroupList ?? []}
        onChange={handleQuestionGroupSelection}
      />
    );
  }

  function renderQuestionGroupList() {
    return form.getValues().questionGroups.map((questionGroup: BackendModelsDtosQuestionGroupDto, index: number) => {
      return (
        <List.Item key={`${questionGroup.name ?? "unnamed"}_${String(index + 1)}`}>
          <Group>
            <Text>{questionGroup.name}</Text>
            <ActionIcon
              variant="light"
              radius="xs"
              color="error"
              onClick={() => {
                form.removeListItem("questionGroups", index);
              }}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        </List.Item>
      );
    });
  }

  function renderQuestionGroupListHeader() {
    if (form.getValues().questionGroups.length) {
      return <Title order={4}>Selected question groups:</Title>;
    }

    return <Title order={4}>Select question groups!</Title>;
  }

  function renderNewQuizForm() {
    return (
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput required placeholder="Name" variant="filled" size="md" radius="xs" key={form.key("name")} {...form.getInputProps("name")} />
        <Space h="md" />
        {renderQuestionGroupSelector()}
        <Space h="md" />
        {renderQuestionGroupListHeader()}
        <List>{renderQuestionGroupList()}</List>
        <Button type="submit" fullWidth variant="light" radius="xs" mt="xl" size="md">
          {quizItem ? "Update" : "Save"}
        </Button>
      </form>
    );
  }

  function renderModalTitle() {
    if (quizItem) {
      return <Title order={3}>Update Quiz</Title>;
    }

    return <Title order={3}>New Quiz</Title>;
  }

  function render() {
    return (
      <Modal opened={opened} onClose={handleClose} title={renderModalTitle()} centered>
        {renderNewQuizForm()}
      </Modal>
    );
  }

  return render();
}

export default QuizModal;
