import { Badge, Button, Fieldset, Group, Modal, Space, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { memo, useCallback } from "react";

import { postApiQuestionGroupCreateQuestionGroupMutation, putApiQuestionGroupUpdateQuestionGroupMutation } from "../../../../api/@tanstack/react-query.gen.ts";
import useMutateData from "../../../../hooks/useMutateData.ts";

import type { BackendModelsDtosQuestionDto, BackendModelsDtosQuestionGroupDto } from "../../../../api";
import type { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

interface IQuestionGroupModalProps {
  opened: boolean;
  onClose: () => void;
  questionGroupItem?: BackendModelsDtosQuestionGroupDto;
  getQuestionGroupList: (options?: RefetchOptions) => Promise<QueryObserverResult<BackendModelsDtosQuestionGroupDto[]>>;
}

function QuestionGroupModal(props: IQuestionGroupModalProps) {
  const { opened, onClose, questionGroupItem, getQuestionGroupList } = props;

  const handleSubmitSuccess = useCallback(async () => {
    await getQuestionGroupList();
  }, [getQuestionGroupList]);

  const [, createNewQuestionGroup] = useMutateData(postApiQuestionGroupCreateQuestionGroupMutation, {
    onSuccess: handleSubmitSuccess,
    successMessage: "New question group was created",
  });
  const [, updateQuestionGroup] = useMutateData(putApiQuestionGroupUpdateQuestionGroupMutation, {
    onSuccess: handleSubmitSuccess,
    successMessage: "Question group was updated",
  });

  function generateInitialQuestions() {
    if (questionGroupItem) {
      return questionGroupItem.questions;
    }

    const questionList: BackendModelsDtosQuestionDto[] = [];
    for (let i = 1; i <= 5; i++) {
      questionList.push({
        inquiry: "",
        answer: "",
        point: i * 100,
      });
    }

    return questionList;
  }

  const form = useForm<BackendModelsDtosQuestionGroupDto>({
    initialValues: {
      name: questionGroupItem?.name ?? "",
      description: questionGroupItem?.description ?? "",
      questions: generateInitialQuestions(),
    },
    validate: {
      name(value) {
        if (value?.length && value.length > 20) {
          return "The name should be no longer than 20 characters.";
        }
        return null;
      },
      description(value) {
        if (value?.length && value.length > 200) {
          return "The description should be no longer than 200 characters.";
        }
      },
      questions: {
        inquiry(value) {
          if (value?.length && value.length > 500) {
            return "The question should be no longer than 100 characters.";
          }
        },
        answer(value) {
          if (value?.length && value.length > 50) {
            return "The answer should be no longer than 50 characters.";
          }
        },
      },
    },
  });

  const handleClose = useCallback(() => {
    onClose();
    form.reset();
  }, [form, onClose]);

  const handleSubmit = useCallback(
    async (form: BackendModelsDtosQuestionGroupDto) => {
      if (questionGroupItem) {
        await updateQuestionGroup({
          questionGroupId: questionGroupItem.questionGroupId,
          name: form.name,
          description: form.description,
          questions: form.questions,
        });
      } else {
        await createNewQuestionGroup({
          name: form.name,
          description: form.description,
          questions: form.questions,
        });
      }
      handleClose();
    },
    [createNewQuestionGroup, handleClose, questionGroupItem, updateQuestionGroup],
  );

  const renderQuestionList = useCallback(() => {
    const questions = form.values.questions ?? [];
    return questions.map((question, index) => (
      <span key={`question_${String(index)}`}>
        <Group grow wrap="nowrap" preventGrowOverflow={false}>
          <Badge variant="light" size="xl" radius="xs" flex="none">
            {question.point}
          </Badge>
          <TextInput required placeholder="Question" variant="filled" size="md" radius="xs" {...form.getInputProps(`questions.${String(index)}.inquiry`)} />
          <TextInput required placeholder="Answer" variant="filled" size="md" radius="xs" {...form.getInputProps(`questions.${String(index)}.answer`)} />
        </Group>
        <Space h="md" />
      </span>
    ));
  }, [form]);

  function renderNewQuestionGroupForm() {
    return (
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Fieldset legend="Question Group Details" variant="filled">
          <TextInput required placeholder="Name" variant="filled" size="md" radius="xs" {...form.getInputProps("name")} />
          <Space h="md" />
          <TextInput required placeholder="Description" variant="filled" size="md" radius="xs" {...form.getInputProps("description")} />
        </Fieldset>
        <Space h="md" />
        <Fieldset legend="Question List" variant="filled">
          {renderQuestionList()}
        </Fieldset>
        <Button type="submit" fullWidth variant="light" radius="xs" mt="xl" size="md">
          {questionGroupItem ? "Update" : "Save"}
        </Button>
      </form>
    );
  }

  function renderModalTitle() {
    if (questionGroupItem) {
      return <Title order={3}>Update Question Group</Title>;
    }

    return <Title order={3}>New Question Group</Title>;
  }

  function render() {
    return (
      <Modal opened={opened} onClose={handleClose} title={renderModalTitle()} size="xl">
        {renderNewQuestionGroupForm()}
      </Modal>
    );
  }

  return render();
}

export default memo(QuestionGroupModal);
