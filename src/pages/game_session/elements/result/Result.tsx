import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Title, Text, Button, Stack, Group, Badge, Center } from "@mantine/core";
import { IconTrophy, IconMedal } from "@tabler/icons-react";
import type { BackendModelsDtosPreviousGameDto } from "../../../../api";
import { home } from "../../../../constants/pages";

interface IResultProps {
  archivedGame: BackendModelsDtosPreviousGameDto | null;
}

function Result(props: IResultProps) {
  const { archivedGame } = props;
  const navigate = useNavigate();

  const handleLeaveGame = useCallback(() => {
    void navigate(home);
  }, [navigate]);

  function getRankIcon(rank: number) {
    switch (rank) {
      case 1:
        return <IconTrophy size={24} color="gold" />;
      case 2:
        return <IconMedal size={24} color="silver" />;
      case 3:
        return <IconMedal size={24} color="#CD7F32" />;
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
    if (!archivedGame?.previousGameUsers || archivedGame.previousGameUsers.length === 0) {
      return (
        <Text ta="center" c="dimmed">
          No players found in the game results.
        </Text>
      );
    }

    const sortedPlayers = [...archivedGame.previousGameUsers].filter((player) => !player.isGameMaster).sort((a, b) => (a.rank ?? 999) - (b.rank ?? 999));

    return (
      <Stack gap="sm">
        {sortedPlayers.map((player, index) => (
          <Paper key={player.userId ?? index} p="md" radius="xs" withBorder>
            <Group justify="space-between" align="center">
              <Group gap="md">
                <Center w={40}>{getRankIcon(player.rank ?? 0)}</Center>
                <Stack gap={4}>
                  <Group gap="sm">
                    <Text fw={500} size="lg">
                      {player.username ?? "Unknown Player"}
                    </Text>
                  </Group>
                </Stack>
              </Group>
              <Group gap="lg">
                <Text fw={600} size="xl" c={player.rank === 1 ? "yellow" : undefined}>
                  {player.points ?? 0} pts
                </Text>
                <Badge variant="filled" color={getRankBadgeColor(player.rank ?? 0)} radius="xs" size="lg">
                  #{player.rank}
                </Badge>
              </Group>
            </Group>
          </Paper>
        ))}
      </Stack>
    );
  }

  function renderGameInfo() {
    return (
      <Paper p="lg" radius="xs" withBorder mb="xl">
        <Stack gap="sm">
          <Title order={2} ta="center" c="greenAccent">
            🎉 Game Complete! 🎉
          </Title>
          {archivedGame?.quizName && (
            <Text ta="center" size="lg" fw={500} c="dimmed">
              Quiz: {archivedGame.quizName}
            </Text>
          )}
          {archivedGame?.completedOn && (
            <Text ta="center" size="sm" c="dimmed">
              Completed on: {new Date(archivedGame.completedOn).toLocaleString()}
            </Text>
          )}
        </Stack>
      </Paper>
    );
  }

  function render() {
    return (
      <Container size="md" py="xl">
        <Stack gap="xl">
          {renderGameInfo()}

          <Stack gap="md">
            <Title order={3} ta="center">
              Final Result
            </Title>
            {renderLeaderboard()}
          </Stack>

          <Center mt="xl">
            <Button variant="light" radius="xs" size="lg" onClick={handleLeaveGame} fullWidth maw={300}>
              Leave Game
            </Button>
          </Center>
        </Stack>
      </Container>
    );
  }

  return render();
}

export default Result;
