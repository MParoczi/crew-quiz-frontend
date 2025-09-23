import { Card, Text } from "@mantine/core";
import type { BackendModelsDtosCurrentGameUserDto } from "../../../../../api";

interface ICurrentUserPointsProps {
  currentGamePlayer: BackendModelsDtosCurrentGameUserDto | null;
}

function CurrentUserPoints(props: ICurrentUserPointsProps) {
  const { currentGamePlayer } = props;

  function render() {
    return (
      <Card padding="md" radius="xs" withBorder mb="lg" variant="light" ta="center">
        <Text size="lg" fw={600}>
          Your Points: {currentGamePlayer?.points ?? 0}
        </Text>
      </Card>
    );
  }

  return render();
}

export default CurrentUserPoints;
