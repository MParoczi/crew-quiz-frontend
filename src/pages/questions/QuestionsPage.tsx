import { Accordion, ActionIcon, Container, Title } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { memo, useEffect } from "react";

import { getApiQuestionGroupGetQuestionGroupsForCurrentUserOptions } from "../../api/@tanstack/react-query.gen.ts";
import LoadingContainer from "../../components/loading_container/LoadingContainer.tsx";
import useQueryData from "../../hooks/useQueryData.ts";

import QuestionGroupItem from "./elements/question_group_item/QuestionGroupItem.tsx";
import QuestionsHeader from "./elements/questions_header/QuestionsHeader.tsx";
import classes from "./questionsPage.module.css";

import type { BackendModelsDtosQuestionGroupDto, GetApiQuestionGroupGetQuestionGroupsForCurrentUserData } from "../../api/types.gen.ts";

function QuestionsPage() {
  const [questionGroupList, getQuestionGroupList, isLoading] = useQueryData<BackendModelsDtosQuestionGroupDto[], GetApiQuestionGroupGetQuestionGroupsForCurrentUserData>(
    getApiQuestionGroupGetQuestionGroupsForCurrentUserOptions,
  );

  useEffect(() => {
    void getQuestionGroupList();
  }, [getQuestionGroupList]);

  function renderQuestionGroups() {
    if (questionGroupList?.length === 0) {
      return <Title order={3}>No question groups yet</Title>;
    }

    return questionGroupList?.map((questionGroup, index) => {
      return <QuestionGroupItem item={questionGroup} key={`${questionGroup.name ?? "questionGroup"}_${String(index + 1)}`} getQuestionGroupList={getQuestionGroupList} />;
    });
  }

  function renderContent() {
    return (
      <div className={classes.wrapper}>
        <Container size="sm">
          <QuestionsHeader getQuestionGroupList={getQuestionGroupList} />
          <Accordion
            chevronPosition="right"
            variant="separated"
            radius="xs"
            chevronSize={26}
            chevron={
              <ActionIcon variant="light" radius="xs" size={26}>
                <IconChevronDown size={18} stroke={1.5} />
              </ActionIcon>
            }
          >
            <LoadingContainer loading={isLoading}>{renderQuestionGroups()}</LoadingContainer>
          </Accordion>
        </Container>
      </div>
    );
  }

  function render() {
    return renderContent();
  }

  return render();
}

export default memo(QuestionsPage);
