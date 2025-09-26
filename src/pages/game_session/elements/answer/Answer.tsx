import { type BackendModelsDtosCurrentGameDto, type BackendModelsDtosCurrentGameUserDto } from "../../../../api";
import { useMemo, useState, useCallback, type ChangeEvent, type KeyboardEvent } from "react";
import useMutateData from "../../../../hooks/useMutateData.ts";
import { postApiGameFlowRobQuestionMutation, postApiGameFlowSubmitAnswerMutation } from "../../../../api/@tanstack/react-query.gen.ts";
import { Card, Text, Stack, TextInput, Button, Box } from "@mantine/core";
import InfoCard from "../../../../components/info_card/InfoCard.tsx";
import GameMenuDrawer from "../../../../components/game_menu_drawer/GameMenuDrawer.tsx";
import FloatingMenuChevron from "../../../../components/floating_menu_chevron/FloatingMenuChevron.tsx";
import { showErrorNotification } from "../../../../utils/notifications.tsx";

interface IAnswerProps {
  isCurrentUser: boolean;
  currentGamePlayer: BackendModelsDtosCurrentGameUserDto | null;
  isGameMaster: boolean;
  currentGame: BackendModelsDtosCurrentGameDto;
  sessionId?: string;
}

interface IAnswerValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

const ANSWER_VALIDATION = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 500,
  INVALID_CHARS: /[<>{}]/g,
} as const;

function Answer(props: IAnswerProps) {
  const { isCurrentUser, currentGamePlayer, isGameMaster, currentGame, sessionId } = props;

  const [answer, setAnswer] = useState("");
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [drawerOpened, setDrawerOpened] = useState(false);

  const currentQuestion = useMemo(() => {
    return currentGame.currentGameQuestions?.find((cgq) => cgq.isCurrent) ?? null;
  }, [currentGame.currentGameQuestions]);

  const validateAnswer = useCallback(
    (answerText: string): IAnswerValidationResult => {
      const trimmedAnswer = answerText.trim();

      if (trimmedAnswer.length < ANSWER_VALIDATION.MIN_LENGTH) {
        return {
          isValid: false,
          errorMessage: "Answer cannot be empty",
        };
      }

      if (trimmedAnswer.length > (currentQuestion?.answerHint?.length ?? ANSWER_VALIDATION.MAX_LENGTH)) {
        return {
          isValid: false,
          errorMessage: `Answer cannot exceed ${String(currentQuestion?.answerHint?.length ?? ANSWER_VALIDATION.MAX_LENGTH)} characters`,
        };
      }

      if (ANSWER_VALIDATION.INVALID_CHARS.test(trimmedAnswer)) {
        return {
          isValid: false,
          errorMessage: "Answer contains invalid characters",
        };
      }

      return { isValid: true };
    },
    [currentQuestion?.answerHint?.length],
  );

  const currentUser = useMemo(() => {
    return currentGame.currentGameUsers?.find((cgu) => cgu.isCurrent) ?? null;
  }, [currentGame.currentGameUsers]);

  const isRobbingAllowed = useMemo(() => {
    if (currentQuestion === null) {
      return false;
    }

    return currentQuestion.isRobbingAllowed;
  }, [currentQuestion]);

  const handleWrongAnswer = useCallback(() => {
    showErrorNotification("Answer submitted", "You got it wrong! Try with another answer!");
  }, []);

  const [, submitAnswer, isSubmittedAnswerPending] = useMutateData(postApiGameFlowSubmitAnswerMutation, {
    onSuccess: (rightAnswer) => {
      setAnswer("");
      if (!rightAnswer) {
        handleWrongAnswer();
      }
    },
    onError: (error) => {
      if (error.message.includes("network") || error.message.includes("fetch")) {
        setAnswerError("Network error occurred. Please check your connection and try again.");
      } else if (error.message.includes("timeout")) {
        setAnswerError("Request timed out. Please try again.");
      } else {
        setAnswerError("Failed to submit answer. Please try again.");
      }
    },
  });

  const [, robAnswer, isRobbedAnswerPending] = useMutateData(postApiGameFlowRobQuestionMutation, {
    onSuccess: (rightAnswer) => {
      setAnswer("");
      if (!rightAnswer) {
        handleWrongAnswer();
      }
    },
    onError: (error) => {
      if (error.message.includes("network") || error.message.includes("fetch")) {
        setAnswerError("Network error occurred. Please check your connection and try again.");
      } else if (error.message.includes("timeout")) {
        setAnswerError("Request timed out. Please try again.");
      } else {
        setAnswerError("Failed to submit answer. Please try again.");
      }
    },
  });

  const handleSubmitAnswer = useCallback(async () => {
    setAnswerError(null);

    if (!currentGamePlayer?.user) {
      setAnswerError("User authentication required. Please log in again.");
      return;
    }

    if (!currentQuestion?.question) {
      setAnswerError("No question is currently selected. Please wait for a question to be chosen.");
      return;
    }

    if (!currentGame.sessionId) {
      setAnswerError("Invalid game session. Please refresh and try again.");
      return;
    }

    const validation = validateAnswer(answer);
    if (!validation.isValid) {
      setAnswerError(validation.errorMessage ?? "Invalid answer format.");
      return;
    }

    try {
      if (isCurrentUser) {
        await submitAnswer({
          userId: currentGamePlayer.user.userId,
          sessionId: currentGame.sessionId,
          questionId: currentQuestion.question.questionId,
          answer: answer.trim(),
        });
      }

      if (!isCurrentUser && isRobbingAllowed) {
        await robAnswer({
          userId: currentGamePlayer.user.userId,
          sessionId: currentGame.sessionId,
          questionId: currentQuestion.question.questionId,
          answer: answer.trim(),
        });
      }
    } catch {
      if (!answerError) {
        setAnswerError("Unexpected error occurred. Please try again.");
      }
    }
  }, [answer, answerError, currentGame.sessionId, currentQuestion?.question, isCurrentUser, isRobbingAllowed, robAnswer, submitAnswer, currentGamePlayer?.user, validateAnswer]);

  const handleAnswerChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const newAnswer = event.currentTarget.value;
      setAnswer(newAnswer);

      if (newAnswer.length > (currentQuestion?.answerHint?.length ?? ANSWER_VALIDATION.MAX_LENGTH)) {
        setAnswerError(`Answer cannot exceed ${String(currentQuestion?.answerHint?.length ?? ANSWER_VALIDATION.MAX_LENGTH)} characters`);
      } else {
        setAnswerError(null);
      }
    },
    [currentQuestion?.answerHint?.length],
  );

  const handleToggleDrawer = useCallback(() => {
    setDrawerOpened((prevState) => !prevState);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpened(false);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!answer.trim() || isSubmittedAnswerPending || isRobbedAnswerPending || !!answerError) {
          return;
        }
        void handleSubmitAnswer();
      }
    },
    [answer, answerError, handleSubmitAnswer, isRobbedAnswerPending, isSubmittedAnswerPending],
  );

  function renderAnswerForm(isMobile: boolean = false) {
    return (
      <Card padding="md" radius="xs" withBorder>
        <Stack gap="md">
          <TextInput
            label="Your Answer"
            placeholder="Enter your answer here..."
            value={answer}
            onChange={handleAnswerChange}
            onKeyDown={handleKeyDown}
            variant="filled"
            radius="xs"
            disabled={isSubmittedAnswerPending || isRobbedAnswerPending}
            required
            size={isMobile ? "md" : "sm"}
            error={answerError}
            description={`${String(answer.length)}/${String(currentQuestion?.answerHint?.length ?? ANSWER_VALIDATION.MAX_LENGTH)} characters`}
          />
          <Button
            onClick={() => void handleSubmitAnswer()}
            loading={isSubmittedAnswerPending || isRobbedAnswerPending}
            disabled={!answer.trim() || isSubmittedAnswerPending || isRobbedAnswerPending || !!answerError}
            variant="light"
            radius="xs"
            fullWidth
            size={isMobile ? "md" : "sm"}
            style={{
              minHeight: isMobile ? "48px" : "36px",
            }}
          >
            Submit Answer
          </Button>
        </Stack>
      </Card>
    );
  }

  function renderQuestionDisplay(isMobile: boolean = false) {
    return (
      <Card padding={isMobile ? "lg" : "md"} radius="xs" withBorder>
        <Stack gap={isMobile ? "sm" : "md"}>
          <Text size={isMobile ? "xs" : "sm"} fw={600} c="dimmed">
            {currentQuestion?.question.questionGroupName ?? "Unknown Group"} - {currentQuestion?.question.point} points
          </Text>
          <Text size={isMobile ? "lg" : "xl"} fw={500} ta="center">
            {currentQuestion?.question.inquiry}
          </Text>
          <Text size="sm" fw={600} c="dimmed" mb="xs" ta="center">
            Answer Hint:
          </Text>
          <Text size="md" fw={500} ta="center">
            {currentQuestion?.answerHint}
          </Text>
        </Stack>
      </Card>
    );
  }

  function renderBystanderMobileLayout() {
    const currentUserName = currentUser?.user.username;

    return (
      <Stack gap="md">
        {renderQuestionDisplay(true)}
        <InfoCard text={currentUserName ? `${currentUserName} is answering` : "Waiting for current player"} />
        <InfoCard text="Robbing is not allowed" type="warning" />
      </Stack>
    );
  }

  function renderBystanderDesktopLayout() {
    const currentUserName = currentUser?.user.username;

    return (
      <Stack gap="lg">
        {renderQuestionDisplay(false)}
        <InfoCard text={currentUserName ? `${currentUserName} is answering` : "Waiting for current player"} />
        <InfoCard text="Robbing is not allowed" type="warning" />
      </Stack>
    );
  }

  function renderBystanderScreen() {
    return (
      <>
        <Box hiddenFrom="sm">{renderBystanderMobileLayout()}</Box>
        <Box visibleFrom="sm">{renderBystanderDesktopLayout()}</Box>
      </>
    );
  }

  function renderBystanderRobbingMobileLayout() {
    return (
      <Stack gap="md">
        {renderQuestionDisplay(true)}
        <InfoCard text="Robbing Allowed - You can steal this question!" />
        {renderAnswerForm(true)}
      </Stack>
    );
  }

  function renderBystanderRobbingDesktopLayout() {
    return (
      <Stack gap="lg">
        {renderQuestionDisplay(false)}
        <InfoCard text="Robbing Allowed - You can steal this question!" />
        {renderAnswerForm(false)}
      </Stack>
    );
  }

  function renderBystanderRobbingScreen() {
    return (
      <>
        <Box hiddenFrom="sm">{renderBystanderRobbingMobileLayout()}</Box>
        <Box visibleFrom="sm">{renderBystanderRobbingDesktopLayout()}</Box>
      </>
    );
  }

  function renderCurrentUserMobileLayout() {
    return (
      <Stack gap="md">
        {renderQuestionDisplay(true)}
        <InfoCard text="Your turn to answer!" />
        {renderAnswerForm(true)}
      </Stack>
    );
  }

  function renderCurrentUserDesktopLayout() {
    return (
      <Stack gap="lg">
        {renderQuestionDisplay(false)}
        <InfoCard text="Your turn to answer!" />
        {renderAnswerForm(false)}
      </Stack>
    );
  }

  function renderCurrentUserScreen() {
    return (
      <>
        <Box hiddenFrom="sm">{renderCurrentUserMobileLayout()}</Box>
        <Box visibleFrom="sm">{renderCurrentUserDesktopLayout()}</Box>
      </>
    );
  }

  function renderGameMasterMobileLayout() {
    return (
      <Stack gap="md">
        {renderQuestionDisplay(true)}
        <InfoCard text={`Game Master View - Robbing ${isRobbingAllowed ? "Allowed" : "Not Allowed"}`} />
      </Stack>
    );
  }

  function renderGameMasterDesktopLayout() {
    return (
      <Stack gap="lg">
        {renderQuestionDisplay(false)}
        <InfoCard text={`Game Master View - Robbing ${isRobbingAllowed ? "Allowed" : "Not Allowed"}`} />
      </Stack>
    );
  }

  function renderGameMasterScreen() {
    return (
      <>
        <Box hiddenFrom="sm">{renderGameMasterMobileLayout()}</Box>
        <Box visibleFrom="sm">{renderGameMasterDesktopLayout()}</Box>
      </>
    );
  }

  function render() {
    const mainContent = () => {
      if (isGameMaster) {
        return renderGameMasterScreen();
      }

      if (isCurrentUser) {
        return renderCurrentUserScreen();
      }

      if (isRobbingAllowed) {
        return renderBystanderRobbingScreen();
      }

      return renderBystanderScreen();
    };

    return (
      <>
        {mainContent()}
        <FloatingMenuChevron onClick={handleToggleDrawer} opened={drawerOpened} />
        <GameMenuDrawer
          opened={drawerOpened}
          onClose={handleCloseDrawer}
          isGameMaster={isGameMaster}
          sessionId={sessionId}
          userId={currentGamePlayer?.user.userId}
          questionId={currentQuestion?.question.questionId}
          isGameStarted={currentGame.isStarted ?? false}
        />
      </>
    );
  }

  return render();
}

export default Answer;
