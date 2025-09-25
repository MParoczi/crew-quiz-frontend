import { Avatar, Badge, Box, Button, Container, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconPlayerPlay, IconUsers } from "@tabler/icons-react";
import type { BackendModelsDtosCurrentGameDto, BackendModelsDtosCurrentGameUserDto } from "../../../../api";
import classes from "./lobby.module.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import useMutateData from "../../../../hooks/useMutateData.ts";
import { postApiGameFlowStartGameMutation } from "../../../../api/@tanstack/react-query.gen.ts";
import CustomCopyButton from "../../../../components/custom_copy_button/CustomCopyButton.tsx";
import BackHomeButton from "../back_home_button/BackHomeButton.tsx";
import GameMenuDrawer from "../../../../components/game_menu_drawer/GameMenuDrawer.tsx";
import FloatingMenuChevron from "../../../../components/floating_menu_chevron/FloatingMenuChevron.tsx";

interface ILobbyProps {
  currentGame?: BackendModelsDtosCurrentGameDto | null;
  currentGamePlayer: BackendModelsDtosCurrentGameUserDto | null;
  sessionId: string;
  isGameMaster: boolean;
  joinGame: (sessionId: string) => Promise<boolean>;
}

function Lobby(props: ILobbyProps) {
  const { currentGame, currentGamePlayer, sessionId, isGameMaster, joinGame } = props;

  const [drawerOpened, setDrawerOpened] = useState(false);

  const canStartGame = useMemo(() => {
    return isGameMaster && (currentGame?.currentGameUsers?.length ?? 0) > 0 && !currentGame?.isStarted;
  }, [currentGame?.currentGameUsers?.length, currentGame?.isStarted, isGameMaster]);

  const [, startGame, isStartingGame] = useMutateData(postApiGameFlowStartGameMutation);

  const handleStartGame = useCallback(async () => {
    if (sessionId) {
      await startGame({ sessionId });
    }
  }, [startGame, sessionId]);

  const handleToggleDrawer = useCallback(() => {
    setDrawerOpened((prevState) => !prevState);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpened(false);
  }, []);

  useEffect(() => {
    void joinGame(sessionId);
  }, [joinGame, sessionId]);

  function renderSessionHeader() {
    return (
      <Paper p="lg" radius="xs" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Group gap="sm">
              <BackHomeButton />
              <Title order={2}>Game Session</Title>
            </Group>
            <Badge size="lg" variant="light" radius="xs">
              {currentGame?.isStarted ? "In Progress" : "Waiting"}
            </Badge>
          </Group>
          <Group justify="space-between" align="center">
            <Stack gap="xs">
              <Text size="sm" c="dimmed">
                Session ID
              </Text>
              <Text size="xl" fw={700} ff="monospace">
                {sessionId}
              </Text>
            </Stack>
            <CustomCopyButton value={sessionId} text="Copy Session ID" />
          </Group>
          <Text size="sm" c="dimmed">
            Share this session ID with other players to join the game
          </Text>
        </Stack>
      </Paper>
    );
  }

  function renderPlayerList() {
    return currentGame?.currentGameUsers?.map((gameUser, index) => (
      <Paper key={gameUser.user.userId ?? index} p="md" radius="xs" className={classes.player_item_paper}>
        <Group gap="md">
          <Avatar size="md" radius="xs" color="greenAccent">
            {gameUser.user.firstName?.[0]?.toUpperCase() ?? "?"}
          </Avatar>
          <Stack gap={2}>
            <Text fw={500}>
              {gameUser.user.firstName} {gameUser.user.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {gameUser.user.username}
            </Text>
          </Stack>
        </Group>
      </Paper>
    ));
  }

  function renderPlayersSection() {
    return (
      <Paper p="lg" radius="xs" withBorder h="100%">
        <Stack gap="md" h="100%">
          <Group gap="sm">
            <IconUsers size={24} />
            <Title order={3}>Players ({currentGame?.currentGameUsers?.length})</Title>
          </Group>
          <Stack gap="sm" style={{ flex: 1, overflowY: "auto" }}>
            {renderPlayerList()}
          </Stack>
        </Stack>
      </Paper>
    );
  }

  function renderGameActions() {
    if (!canStartGame) {
      return null;
    }

    return (
      <Paper p="lg" radius="xs" withBorder>
        <Stack gap="md">
          <Title order={3}>Game Controls</Title>
          <Button
            onClick={() => void handleStartGame()}
            disabled={!canStartGame}
            loading={isStartingGame}
            variant="light"
            radius="xs"
            size="lg"
            leftSection={<IconPlayerPlay size={20} />}
            fullWidth
          >
            Start Game
          </Button>
        </Stack>
      </Paper>
    );
  }

  function renderSessionNotFound() {
    return (
      <Container size="sm">
        <Paper p="xl" radius="xs" withBorder ta="center">
          <Stack gap="md">
            <Title order={3}>Game Not Found</Title>
            <Text c="dimmed">{`The game session "${sessionId}" could not be found or may have expired.`}</Text>
            <BackHomeButton />
          </Stack>
        </Paper>
      </Container>
    );
  }

  function renderLobbyPanels() {
    return (
      <Container size="xl" h="100vh" p="md">
        <Grid h="100%" gutter="xl">
          <Grid.Col span={{ base: 12, md: 4 }} order={{ base: 3, md: 1 }} h={{ base: "auto", md: "100%" }}>
            <Box h="100%">{renderPlayersSection()}</Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }} order={{ base: 1, md: 2 }}>
            <Stack gap="xl" h="100%" justify="flex-start">
              <Box>{renderSessionHeader()}</Box>
              <Box>{renderGameActions()}</Box>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  function render() {
    if (!currentGame) {
      return renderSessionNotFound();
    }

    return (
      <>
        {renderLobbyPanels()}
        <FloatingMenuChevron onClick={handleToggleDrawer} opened={drawerOpened} />
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

export default Lobby;
