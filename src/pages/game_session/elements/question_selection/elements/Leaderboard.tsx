import { Card, Text, Table } from "@mantine/core";
import type { BackendModelsDtosCurrentGameDto } from "../../../../../api";
import { useMemo } from "react";

interface ILeaderboardProps {
  currentGame: BackendModelsDtosCurrentGameDto;
}

function Leaderboard(props: ILeaderboardProps) {
  const { currentGame } = props;

  const sortedPlayers = useMemo(() => {
    if (!currentGame.currentGameUsers) {
      return [];
    }

    // Filter out game master and sort by points descending
    return currentGame.currentGameUsers.filter((user) => !user.isGameMaster).sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  }, [currentGame.currentGameUsers]);

  function render() {
    return (
      <Card padding="md" radius="xs" withBorder mb="lg" variant="light">
        <Text size="lg" fw={600} ta="center" mb="md">
          Leaderboard
        </Text>

        {sortedPlayers.length === 0 ? (
          <Text ta="center" c="gray.6">
            No players in the game yet
          </Text>
        ) : (
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ textAlign: "center" }}>Rank</Table.Th>
                <Table.Th>Player</Table.Th>
                <Table.Th style={{ textAlign: "center" }}>Points</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {sortedPlayers.map((player, index) => (
                <Table.Tr key={player.user.userId?.toString() ?? index}>
                  <Table.Td style={{ textAlign: "center", fontWeight: 600 }}>{index + 1}</Table.Td>
                  <Table.Td>
                    <Text fw={player.isCurrent ? 600 : 400}>
                      {player.user.username ?? "Unknown"}
                      {player.isCurrent && " (Current Player)"}
                    </Text>
                  </Table.Td>
                  <Table.Td style={{ textAlign: "center", fontWeight: 500 }}>{player.points ?? 0}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Card>
    );
  }

  return render();
}

export default Leaderboard;
