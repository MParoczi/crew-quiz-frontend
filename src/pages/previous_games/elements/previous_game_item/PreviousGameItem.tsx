import { Accordion, Badge, Center, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconMedal, IconTrophy } from "@tabler/icons-react";
import { memo } from "react";

import type { BackendModelsDtosPreviousGameDto } from "../../../../api/types.gen";

interface IPreviousGameItemProps {
  item: BackendModelsDtosPreviousGameDto;
}

function PreviousGameItem(props: IPreviousGameItemProps) {
  const { item } = props;

  function getRankIcon(rank: number) {
    switch (rank) {
      case 1:
        return <IconTrophy size={20} color="gold" />;
      case 2:
        return <IconMedal size={20} color="silver" />;
      case 3:
        return <IconMedal size={20} color="#CD7F32" />;
      default:
        return null;
    }
  }

  function getRankBadgeColor(rank: number) {
    switch (rank) {
      case 1:
        return "yellow";
      case 2:
        return "gray";
      case 3:
        return "orange";
      default:
        return "blue";
    }
  }

  function renderLeaderboard() {
    if (!item.previousGameUsers || item.previousGameUsers.length === 0) {
      return (
        <Text ta="center" c="dimmed">
          No players found in the game results.
        </Text>
      );
    }

    const sortedPlayers = [...item.previousGameUsers].filter((player) => !player.isGameMaster).sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

    if (sortedPlayers.length === 0) {
      return (
        <Text ta="center" c="dimmed">
          No players in leaderboard.
        </Text>
      );
    }

    return (
      <Stack gap="sm">
        <Title order={4} ta="center">
          Leaderboard
        </Title>
        {sortedPlayers.map((player, index) => (
          <Paper key={player.userId ?? index} p="sm" radius="xs" withBorder>
            <Group justify="space-between" align="center">
              <Group gap="sm">
                <Center w={32}>{getRankIcon(player.rank ?? 0)}</Center>
                <Text fw={500}>{player.username ?? "Unknown Player"}</Text>
              </Group>
              <Group gap="md">
                <Text fw={600} c={player.rank === 1 ? "yellow" : undefined}>
                  {player.points ?? 0} pts
                </Text>
                <Badge variant="filled" color={getRankBadgeColor(player.rank ?? 0)} radius="xs" size="sm">
                  #{player.rank}
                </Badge>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    );
  }

  function renderGameMasters() {
    if (!item.previousGameUsers) {
      return null;
    }

    const gameMasters = item.previousGameUsers.filter((player) => player.isGameMaster);

    if (gameMasters.length === 0) {
      return null;
    }

    return (
      <Stack gap="sm">
        <Title order={4} ta="center">
          Game Master
        </Title>
        {gameMasters.map((gameMaster, index) => (
          <Paper key={gameMaster.userId ?? index} p="sm" radius="xs" withBorder>
            <Group justify="space-between" align="center">
              <Text fw={500}>{gameMaster.username ?? "Unknown Game Master"}</Text>
              <Badge variant="filled" color="greenAccent" radius="xs" size="sm">
                Game Master
              </Badge>
            </Group>
          </Paper>
        ))}
      </Stack>
    );
  }

  function renderGameInfo() {
    return (
      <Stack gap="xs" mb="md">
        {item.quizName && (
          <Text ta="center" size="sm" fw={500} c="dimmed">
            Quiz: {item.quizName}
          </Text>
        )}
        {item.completedOn && (
          <Text ta="center" size="sm" c="dimmed">
            Completed: {new Date(item.completedOn).toLocaleString()}
          </Text>
        )}
      </Stack>
    );
  }

  function getDisplayTitle() {
    if (item.quizName) {
      return item.quizName;
    }
    if (item.sessionId) {
      return `Game ${item.sessionId.substring(0, 8)}`;
    }
    return "Unknown Game";
  }

  function render() {
    return (
      <Accordion.Item value={item.sessionId ?? `game_${String(item.previousGameId ?? Math.random())}`} style={{ width: "100%" }}>
        <Accordion.Control>
          <Group justify="space-between" w="100%">
            <Title order={3}>{getDisplayTitle()}</Title>
            {item.completedOn && (
              <Text size="sm" c="dimmed">
                {new Date(item.completedOn).toLocaleDateString()}
              </Text>
            )}
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="lg">
            {renderGameInfo()}
            {renderLeaderboard()}
            {renderGameMasters()}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    );
  }

  return render();
}

export default memo(PreviousGameItem);
