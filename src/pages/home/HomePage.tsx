import { memo, useCallback, useEffect, useState } from "react";
import { Container, Paper, Title, Stack, Button, TextInput, Select, Text, Group } from "@mantine/core";
import { IconDeviceGamepad2, IconPlus, IconPlayerPlay, IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import useMutateData from "../../hooks/useMutateData";
import useQueryData from "../../hooks/useQueryData";
import {
  getApiCurrentGameGetCurrentGameForCurrentUserOptions,
  getApiQuizGetQuizzesForCurrentUserOptions,
  postApiCurrentGameCreateCurrentGameMutation,
  postApiGameFlowAddUserToCurrentGameMutation,
  postApiGameFlowLeaveGameMutation,
} from "../../api/@tanstack/react-query.gen";
import type { BackendModelsDtosCurrentGameDto, BackendModelsDtosQuizDto } from "../../api/types.gen";
import { gameSession } from "../../constants/pages";
import LoadingContainer from "../../components/loading_container/LoadingContainer.tsx";
import useUserLocalStorage from "../../hooks/useUserLocalStorage.ts";

function HomePage() {
  const [sessionId, setSessionId] = useState("");
  const [user] = useUserLocalStorage();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [quizzes, getQuizzes, isLoadingQuizzes] = useQueryData<BackendModelsDtosQuizDto[], undefined>(getApiQuizGetQuizzesForCurrentUserOptions, undefined);
  const [existingGameForUser, getExistingGameForUser, isExistingGameForUserLoading] = useQueryData<BackendModelsDtosCurrentGameDto, undefined>(
    getApiCurrentGameGetCurrentGameForCurrentUserOptions,
    undefined,
  );
  const [, joinGameRequest, isJoiningGame] = useMutateData(postApiGameFlowAddUserToCurrentGameMutation, {
    onSuccess: () => {
      void navigate(`${gameSession}/${sessionId}`);
    },
    successMessage: "Joined game successfully!",
  });

  const navigate = useNavigate();

  const handleCreateGameSuccess = useCallback(() => {
    if (sessionId) {
      void navigate(`${gameSession}/${sessionId}`);
    }
    setSelectedQuizId(null);
    setSessionId("");
  }, [navigate, sessionId]);

  const [, createGameRequest, isCreatingGame] = useMutateData(postApiCurrentGameCreateCurrentGameMutation, {
    onSuccess: handleCreateGameSuccess,
    successMessage: "Game created successfully!",
  });

  const handleLeaveGameSuccess = useCallback(() => {
    void getExistingGameForUser();
  }, [getExistingGameForUser]);

  const [, leaveGameRequest, isLeavingGame] = useMutateData(postApiGameFlowLeaveGameMutation, {
    onSuccess: handleLeaveGameSuccess,
    successMessage: "Left game successfully!",
  });

  useEffect(() => {
    void getQuizzes();
    void getExistingGameForUser();
  }, [getQuizzes, getExistingGameForUser]);

  const generateSessionId = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNPQRSTUVWXYZ123456789";
    let result = "";
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }, []);

  const handleJoinGame = useCallback(async () => {
    if (sessionId.trim()) {
      await joinGameRequest({
        userId: user?.userId,
        sessionId: sessionId.trim().toUpperCase(),
      });
    }
  }, [joinGameRequest, sessionId, user?.userId]);

  const handleCreateGame = useCallback(async () => {
    if (selectedQuizId) {
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      await createGameRequest({
        quizId: BigInt(selectedQuizId),
        sessionId: newSessionId,
      });
    }
  }, [createGameRequest, generateSessionId, selectedQuizId]);

  const handleRejoinGame = useCallback(() => {
    if (existingGameForUser?.sessionId) {
      void navigate(`${gameSession}/${existingGameForUser.sessionId}`);
    }
  }, [navigate, existingGameForUser]);

  const handleLeaveGame = useCallback(async () => {
    if (existingGameForUser?.sessionId) {
      await leaveGameRequest({
        userId: user?.userId,
        sessionId: existingGameForUser.sessionId,
      });
    }
  }, [existingGameForUser?.sessionId, leaveGameRequest, user?.userId]);

  function renderExistingGameSection() {
    if (!existingGameForUser || isExistingGameForUserLoading) {
      return null;
    }

    return (
      <Paper p="lg" radius="xs" withBorder>
        <Stack gap="md">
          <Group gap="sm">
            <IconPlayerPlay size={24} />
            <Title order={3}>Your Current Game</Title>
          </Group>
          <Text size="sm" c="dimmed">
            You are already participating in a game
          </Text>
          <Text size="sm">
            <strong>Session ID:</strong> {existingGameForUser.sessionId}
          </Text>
          <Text size="sm">
            <strong>Status:</strong> {existingGameForUser.isStarted ? "Game Started" : "Waiting to Start"}
          </Text>
          <Group grow>
            <Button onClick={handleRejoinGame} variant="light" radius="xs" leftSection={<IconPlayerPlay size={16} />}>
              Rejoin Game
            </Button>
            {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
            <Button onClick={handleLeaveGame} loading={isLeavingGame} variant="light" color="red" radius="xs" leftSection={<IconLogout size={16} />}>
              Leave Game
            </Button>
          </Group>
        </Stack>
      </Paper>
    );
  }

  function renderJoinGameSection() {
    return (
      <Paper p="lg" radius="xs" withBorder>
        <Stack gap="md">
          <Group gap="sm">
            <IconDeviceGamepad2 size={24} />
            <Title order={3}>Join Existing Game</Title>
          </Group>
          <Text size="sm" c="dimmed">
            Enter the 8-character session ID to join an existing game
          </Text>
          <TextInput
            label="Session ID"
            placeholder="Enter session ID"
            value={sessionId}
            onChange={(event) => {
              setSessionId(event.currentTarget.value.toUpperCase());
            }}
            maxLength={8}
            variant="filled"
            radius="xs"
          />
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onClick={handleJoinGame} disabled={sessionId.length !== 8} loading={isJoiningGame} variant="light" radius="xs" fullWidth>
            Join Game
          </Button>
        </Stack>
      </Paper>
    );
  }

  function renderCreateGameSection() {
    const quizOptions =
      quizzes?.map((quiz: BackendModelsDtosQuizDto) => ({
        value: quiz.quizId?.toString() ?? "",
        label: quiz.name ?? "",
      })) ?? [];

    return (
      <Paper p="lg" radius="xs" withBorder>
        <Stack gap="md">
          <Group gap="sm">
            <IconPlus size={24} />
            <Title order={3}>Create New Game</Title>
          </Group>
          <Text size="sm" c="dimmed">
            Select a quiz to create a new game session
          </Text>
          <Select
            label="Select Quiz"
            placeholder="Choose a quiz"
            data={quizOptions}
            value={selectedQuizId}
            onChange={setSelectedQuizId}
            variant="filled"
            radius="xs"
            disabled={isLoadingQuizzes}
          />
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button onClick={handleCreateGame} disabled={!selectedQuizId} loading={isCreatingGame} variant="light" radius="xs" fullWidth>
            Create Game
          </Button>
        </Stack>
      </Paper>
    );
  }

  function renderContent() {
    if (existingGameForUser?.sessionId) {
      return (
        <>
          <Text size="lg" ta="center" c="dimmed">
            Welcome back to your game
          </Text>
          {renderExistingGameSection()}
        </>
      );
    }

    return (
      <>
        <Text size="lg" ta="center" c="dimmed">
          Choose how you want to play
        </Text>
        {renderJoinGameSection()}
        {renderCreateGameSection()}
      </>
    );
  }

  function render() {
    return (
      <Container size="sm">
        <Stack gap="xl">
          <Title order={1} ta="center">
            CrewQuiz
          </Title>
          <LoadingContainer loading={isLoadingQuizzes || isExistingGameForUserLoading}>{renderContent()}</LoadingContainer>
        </Stack>
      </Container>
    );
  }

  return render();
}

export default memo(HomePage);
