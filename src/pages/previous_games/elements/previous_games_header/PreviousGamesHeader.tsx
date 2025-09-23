import { Space, Stack, Title } from "@mantine/core";
import { memo } from "react";

function PreviousGamesHeader() {
  function render() {
    return (
      <Stack align="center" justify="center">
        <Title size="h1">Previous Games</Title>
        <Space h="sm" />
      </Stack>
    );
  }

  return render();
}

export default memo(PreviousGamesHeader);
