import { Accordion, ActionIcon, Container, Title } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { memo, useEffect } from "react";

import { getApiQuizGetQuizzesForCurrentUserOptions } from "../../api/@tanstack/react-query.gen.ts";
import LoadingContainer from "../../components/loading_container/LoadingContainer.tsx";
import useQueryData from "../../hooks/useQueryData";

import QuizHeader from "./elements/quiz_header/QuizHeader.tsx";
import QuizItem from "./elements/quiz_item/QuizItem.tsx";
import classes from "./quizzesPage.module.css";

import type { BackendModelsDtosQuizDto, GetApiQuizGetQuizzesForCurrentUserData } from "../../api/types.gen.ts";

function QuizzesPage() {
  const [quizList, getQuizList, isLoading] = useQueryData<BackendModelsDtosQuizDto[], GetApiQuizGetQuizzesForCurrentUserData>(getApiQuizGetQuizzesForCurrentUserOptions);

  useEffect(() => {
    void getQuizList();
  }, [getQuizList]);

  function renderQuizzes() {
    if (quizList?.length === 0) {
      return <Title order={3}>No quizzes yet</Title>;
    }

    return quizList?.map((questionGroup, index) => {
      return <QuizItem item={questionGroup} key={`${questionGroup.name ?? "quiz"}_${String(index + 1)}`} refetch={getQuizList} />;
    });
  }

  function renderContent() {
    return (
      <div className={classes.wrapper}>
        <Container size="sm">
          <QuizHeader getQuizList={getQuizList} />
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
            <LoadingContainer loading={isLoading}>{renderQuizzes()}</LoadingContainer>
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

export default memo(QuizzesPage);
