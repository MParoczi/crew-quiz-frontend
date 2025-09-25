import type { BackendModelsDtosCurrentGameDto, BackendModelsDtosCurrentGameQuestionDto, BackendModelsDtosCurrentGameUserDto } from "../../../../api";
import useMutateData from "../../../../hooks/useMutateData.ts";
import { postApiGameFlowSelectQuestionMutation } from "../../../../api/@tanstack/react-query.gen.ts";
import { useMemo, useState, useCallback } from "react";
import { Grid, Card, Text, Button, Table, List, Stack, Box, Space } from "@mantine/core";
import ConfirmationModal from "../../../../components/confirmation_modal/ConfirmationModal.tsx";
import GameMenuDrawer from "../../../../components/game_menu_drawer/GameMenuDrawer.tsx";
import FloatingMenuChevron from "../../../../components/floating_menu_chevron/FloatingMenuChevron.tsx";
import CurrentUserPoints from "./elements/CurrentUserPoints.tsx";
import Leaderboard from "./elements/Leaderboard.tsx";
import InfoCard from "../../../../components/info_card/InfoCard.tsx";

interface IQuestionSelectionProps {
  currentGamePlayer: BackendModelsDtosCurrentGameUserDto | null;
  isCurrentPlayer: boolean;
  isGameMaster: boolean;
  currentGame: BackendModelsDtosCurrentGameDto;
  sessionId?: string;
}

interface IProcessedQuestionGroup {
  groupName: string;
  questions: Array<{
    gameQuestion: BackendModelsDtosCurrentGameQuestionDto;
    pointValue: number;
    isAnswered: boolean;
    questionId: bigint | undefined;
  }>;
}

function QuestionSelection(props: IQuestionSelectionProps) {
  const { currentGamePlayer, isCurrentPlayer, isGameMaster, currentGame, sessionId } = props;

  const [drawerOpened, setDrawerOpened] = useState(false);

  const currentUser = useMemo(() => {
    return currentGame.currentGameUsers?.find((cgu) => cgu.isCurrent) ?? null;
  }, [currentGame.currentGameUsers]);

  const [selectedQuestion, setSelectedQuestion] = useState<{
    questionId: bigint;
    pointValue: number;
    groupName: string;
  } | null>(null);

  const processedQuestionGroups = useMemo(() => {
    if (!currentGame.currentGameQuestions) {
      return [];
    }

    const groupedQuestions = new Map<
      string,
      Array<{
        gameQuestion: BackendModelsDtosCurrentGameQuestionDto;
        pointValue: number;
        isAnswered: boolean;
        questionId: bigint | undefined;
      }>
    >();

    currentGame.currentGameQuestions.forEach((gameQuestion) => {
      const { question } = gameQuestion;
      const groupName = question.questionGroupName ?? "Unknown Group";
      const pointValue = question.point ?? 0;
      const isAnswered = gameQuestion.isAnswered ?? false;
      const { questionId } = question;

      if (!groupedQuestions.has(groupName)) {
        groupedQuestions.set(groupName, []);
      }

      const groupQuestions = groupedQuestions.get(groupName);
      if (groupQuestions) {
        groupQuestions.push({
          gameQuestion,
          pointValue,
          isAnswered,
          questionId,
        });
      }
    });

    const result: IProcessedQuestionGroup[] = Array.from(groupedQuestions.entries()).map(([groupName, questions]) => ({
      groupName,
      questions: questions.sort((a, b) => a.pointValue - b.pointValue),
    }));

    return result.sort((a, b) => a.groupName.localeCompare(b.groupName));
  }, [currentGame.currentGameQuestions]);

  const [, selectQuestion] = useMutateData(postApiGameFlowSelectQuestionMutation);

  const handleConfirmSelection = useCallback(async () => {
    if (!selectedQuestion || !currentUser?.user.userId || !currentGame.sessionId) {
      return;
    }

    await selectQuestion({
      userId: currentUser.user.userId,
      sessionId: currentGame.sessionId,
      questionId: selectedQuestion.questionId,
    });
    setSelectedQuestion(null);
  }, [selectedQuestion, selectQuestion, currentUser?.user.userId, currentGame.sessionId]);

  const handleCancelSelection = useCallback(() => {
    setSelectedQuestion(null);
  }, []);

  const handleToggleDrawer = useCallback(() => {
    setDrawerOpened((prevState) => !prevState);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpened(false);
  }, []);

  const getAllPointValues = useMemo(() => {
    const pointValues = new Set<number>();
    processedQuestionGroups.forEach((group) => {
      group.questions.forEach((q) => pointValues.add(q.pointValue));
    });
    return Array.from(pointValues).sort((a, b) => a - b);
  }, [processedQuestionGroups]);

  function renderQuestionGroupQuestionsMobileLayout(isInteractive: boolean, pointValue: number) {
    return processedQuestionGroups.map((group, groupIndex) => {
      const questionData = group.questions.find((q) => q.pointValue === pointValue);
      return (
        <Table.Td key={`${group.groupName}_${String(groupIndex)}_question`} style={{ textAlign: "center", padding: "4px" }}>
          {questionData ? (
            <Button
              variant={questionData.isAnswered ? "outline" : "light"}
              color={questionData.isAnswered ? "gray" : "greenAccent"}
              disabled={questionData.isAnswered}
              size="sm"
              radius="xs"
              style={{
                cursor: questionData.isAnswered || !isInteractive ? "not-allowed" : "pointer",
                minWidth: "60px",
                height: "32px",
              }}
              onClick={() => {
                if (isInteractive && !questionData.isAnswered && questionData.questionId) {
                  setSelectedQuestion({
                    questionId: questionData.questionId,
                    pointValue: questionData.pointValue,
                    groupName: group.groupName,
                  });
                }
              }}
            >
              {questionData.pointValue}
            </Button>
          ) : (
            <Box style={{ height: "32px" }} />
          )}
        </Table.Td>
      );
    });
  }

  function renderMobileLayout(isInteractive: boolean) {
    return (
      <Stack gap="sm">
        <Space />
        <Text size="lg" fw={600} ta="center">
          Question Groups
        </Text>
        <List type="ordered" withPadding>
          {processedQuestionGroups.map((group) => (
            <List.Item key={group.groupName}>
              <Text size="lg" fw={500}>
                {group.groupName}
              </Text>
            </List.Item>
          ))}
        </List>
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <Table.Thead>
            <Table.Tr>
              {processedQuestionGroups.map((questionGroup, index) => (
                <Table.Th key={`${questionGroup.groupName}_${String(index)}_header`} style={{ textAlign: "center" }}>
                  {index + 1}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {getAllPointValues.map((pointValue) => (
              <Table.Tr key={pointValue}>{renderQuestionGroupQuestionsMobileLayout(isInteractive, pointValue)}</Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Stack>
    );
  }

  function renderQuestionGroupQuestionsDesktopLayout(group: IProcessedQuestionGroup, isInteractive: boolean) {
    return group.questions.map((questionData) => (
      <Button
        key={questionData.questionId?.toString() ?? questionData.pointValue}
        variant={questionData.isAnswered ? "outline" : "light"}
        color={questionData.isAnswered ? "gray" : "greenAccent"}
        disabled={questionData.isAnswered}
        size="lg"
        fullWidth
        mb="sm"
        radius="xs"
        style={{
          cursor: questionData.isAnswered || !isInteractive ? "not-allowed" : "pointer",
        }}
        onClick={() => {
          if (isInteractive && !questionData.isAnswered && questionData.questionId) {
            setSelectedQuestion({
              questionId: questionData.questionId,
              pointValue: questionData.pointValue,
              groupName: group.groupName,
            });
          }
        }}
      >
        {questionData.pointValue} pts
      </Button>
    ));
  }

  function renderDesktopLayout(isInteractive: boolean) {
    return (
      <>
        <Text size="lg" fw={600} ta="center" mb="md">
          Question Groups
        </Text>
        <Grid>
          {processedQuestionGroups.map((group) => (
            <Grid.Col key={group.groupName} span="auto">
              <Card padding="md" radius="xs" withBorder>
                <Text size="lg" fw={700} ta="center" mb="md">
                  {group.groupName}
                </Text>
                {renderQuestionGroupQuestionsDesktopLayout(group, isInteractive)}
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </>
    );
  }

  function renderBystanderScreen() {
    return (
      <>
        <Box mb="md">
          <CurrentUserPoints currentGamePlayer={currentGamePlayer} />
        </Box>
        <InfoCard text={`${currentUser?.user.username ?? "Unknown"} is choosing a question`} />
      </>
    );
  }

  function renderCurrentUserScreen() {
    return (
      <>
        <Box mb="md">
          <CurrentUserPoints currentGamePlayer={currentGamePlayer} />
        </Box>
        <InfoCard text="Your turn to choose a question" />
        <Space h="lg" />
        <Card withBorder hiddenFrom="sm">
          {renderMobileLayout(true)}
        </Card>
        <Card withBorder visibleFrom="sm">
          {renderDesktopLayout(true)}
        </Card>
      </>
    );
  }

  function renderGameMasterScreen() {
    return (
      <>
        <Box mb="md">
          <Leaderboard currentGame={currentGame} />
        </Box>
        <InfoCard text={`Current Player: ${currentUser?.user.username ?? "Unknown"}`} />
        <Space h="lg" />
        <Card withBorder hiddenFrom="sm">
          {renderMobileLayout(false)}
        </Card>
        <Card withBorder visibleFrom="sm">
          {renderDesktopLayout(false)}
        </Card>
      </>
    );
  }

  function render() {
    return (
      <>
        {isGameMaster && renderGameMasterScreen()}
        {isCurrentPlayer && renderCurrentUserScreen()}
        {!isGameMaster && !isCurrentPlayer && renderBystanderScreen()}
        <FloatingMenuChevron onClick={handleToggleDrawer} opened={drawerOpened} />
        <ConfirmationModal
          opened={selectedQuestion !== null}
          close={handleCancelSelection}
          onConfirm={handleConfirmSelection}
          onCancel={handleCancelSelection}
          question={selectedQuestion ? `Do you want to select the ${String(selectedQuestion.pointValue)} point question from ${selectedQuestion.groupName}?` : ""}
        />
        <GameMenuDrawer
          opened={drawerOpened}
          onClose={handleCloseDrawer}
          isGameMaster={isGameMaster}
          sessionId={sessionId}
          userId={currentGamePlayer?.user.userId}
          isGameStarted={currentGame.isStarted ?? false}
        />
      </>
    );
  }

  return render();
}

export default QuestionSelection;
