import { Accordion, ActionIcon, Container, Title } from "@mantine/core";
import { IconChevronDown } from "@tabler/icons-react";
import { memo, useEffect } from "react";

import { getApiPreviousGameGetPreviousGamesForCurrentUserOptions } from "../../api/@tanstack/react-query.gen";
import LoadingContainer from "../../components/loading_container/LoadingContainer";
import useQueryData from "../../hooks/useQueryData";

import PreviousGameItem from "./elements/previous_game_item/PreviousGameItem";
import PreviousGamesHeader from "./elements/previous_games_header/PreviousGamesHeader";
import classes from "./previousGamesPage.module.css";

import type { BackendModelsDtosPreviousGameDto, GetApiPreviousGameGetPreviousGamesForCurrentUserData } from "../../api/types.gen";

function PreviousGamesPage() {
  const [previousGamesList, getPreviousGamesList, isLoading] = useQueryData<BackendModelsDtosPreviousGameDto[], GetApiPreviousGameGetPreviousGamesForCurrentUserData>(
    getApiPreviousGameGetPreviousGamesForCurrentUserOptions,
  );

  useEffect(() => {
    void getPreviousGamesList();
  }, [getPreviousGamesList]);

  function renderPreviousGames() {
    if (previousGamesList?.length === 0) {
      return <Title order={3}>No previous games yet</Title>;
    }

    return previousGamesList?.map((previousGame, index) => {
      return <PreviousGameItem item={previousGame} key={`${previousGame.sessionId ?? "previousGame"}_${String(index + 1)}`} />;
    });
  }

  function renderContent() {
    return (
      <div className={classes.wrapper}>
        <Container size="sm">
          <PreviousGamesHeader />
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
            <LoadingContainer loading={isLoading}>{renderPreviousGames()}</LoadingContainer>
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

export default memo(PreviousGamesPage);
