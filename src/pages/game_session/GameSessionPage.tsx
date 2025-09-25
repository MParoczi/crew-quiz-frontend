/* eslint-disable eqeqeq */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import useQueryData from "../../hooks/useQueryData";
import { getApiCurrentGameGetCurrentGameBySessionIdBySessionIdOptions, getApiPreviousGameGetPreviousGameBySessionIdBySessionIdOptions } from "../../api/@tanstack/react-query.gen";
import type {
  BackendModelsDtosCurrentGameDto,
  BackendModelsDtosPreviousGameDto,
  GetApiCurrentGameGetCurrentGameBySessionIdBySessionIdData,
  GetApiPreviousGameGetPreviousGameBySessionIdBySessionIdData,
} from "../../api/types.gen";
import { home } from "../../constants/pages";
import LoadingContainer from "../../components/loading_container/LoadingContainer";
import Lobby from "./elements/lobby/Lobby.tsx";
import Result from "./elements/result/Result.tsx";
import useUserLocalStorage from "../../hooks/useUserLocalStorage.ts";
import QuestionSelection from "./elements/question_selection/QuestionSelection.tsx";
import Answer from "./elements/answer/Answer.tsx";
import useSignalR, { GameEventType } from "../../hooks/useSignalR.ts";

function GameSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [user] = useUserLocalStorage();
  const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);

  const [currentGame, getCurrentGame, isLoadingGame] = useQueryData<BackendModelsDtosCurrentGameDto, GetApiCurrentGameGetCurrentGameBySessionIdBySessionIdData>(
    getApiCurrentGameGetCurrentGameBySessionIdBySessionIdOptions,
    {
      path: { sessionId: sessionId ?? "" },
    } as GetApiCurrentGameGetCurrentGameBySessionIdBySessionIdData,
    {
      onError: () => {
        void navigate(home);
      },
    },
  );

  const [archivedGame, getArchivedGame, isArchivedGameLoading] = useQueryData<BackendModelsDtosPreviousGameDto, GetApiPreviousGameGetPreviousGameBySessionIdBySessionIdData>(
    getApiPreviousGameGetPreviousGameBySessionIdBySessionIdOptions,
    {
      path: { sessionId: sessionId ?? "" },
    } as GetApiPreviousGameGetPreviousGameBySessionIdBySessionIdData,
    {
      onError: () => {
        void navigate(home);
      },
    },
  );

  const handleReconnect = useCallback(() => {
    if (isGameCompleted) {
      void getArchivedGame();
    } else {
      void getCurrentGame();
    }
  }, [getArchivedGame, getCurrentGame, isGameCompleted]);

  const [signalRStatus, signalRMethods] = useSignalR("/crew-quiz", { autoReconnect: true, onReconnect: handleReconnect });

  const currentGamePlayer = useMemo(() => {
    if (currentGame?.currentGameUsers?.length === 0) {
      return null;
    }

    return currentGame?.currentGameUsers?.find((cgu) => cgu.user.userId == user?.userId) ?? null;
  }, [currentGame?.currentGameUsers, user?.userId]);

  const isGameMaster = useMemo(() => {
    return currentGamePlayer?.isGameMaster ?? false;
  }, [currentGamePlayer?.isGameMaster]);

  const isCurrentUser = useMemo(() => {
    return currentGamePlayer?.isCurrent ?? false;
  }, [currentGamePlayer?.isCurrent]);

  const isQuestionSelected = useMemo(() => {
    return currentGame?.currentGameQuestions?.some((cgq) => cgq.isCurrent) ?? false;
  }, [currentGame?.currentGameQuestions]);

  const handlePlayerJoined = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.PlayerJoined, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  const handleGameStarted = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.GameStarted, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  const handleQuestionSelected = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.QuestionSelected, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  const handlePlayerLeft = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.PlayerLeft, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  const handleAnswerSubmitted = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.AnswerSubmitted, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  const handleQuestionAnswered = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.QuestionAnswered, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  const handleGameEnded = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.GameEnded, () => {
      setIsGameCompleted(true);
      void getArchivedGame();
    });
  }, [getArchivedGame, signalRMethods]);

  const handleQuestionRobbed = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.QuestionRobbed, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  const handleQuestionRobbingIsAllowed = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.QuestionRobbingIsAllowed, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  const handleGameCancelled = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.GameCancelled, () => {
      void navigate(home);
    });
  }, [navigate, signalRMethods]);

  const handleNextPlayerSelected = useCallback(() => {
    return signalRMethods.addEventListener(GameEventType.NextPlayerSelected, () => {
      void getCurrentGame();
    });
  }, [getCurrentGame, signalRMethods]);

  useEffect(() => {
    if (!user?.token || !sessionId) {
      return;
    }

    let cleanup: (() => void) | undefined;
    let hasJoinedSession = false;

    const initializeSignalR = async () => {
      try {
        if (!signalRStatus.isConnected && !signalRStatus.isConnecting) {
          const connected = await signalRMethods.connect();
          if (!connected) {
            return;
          }
        }

        if (signalRStatus.isConnected && !hasJoinedSession) {
          const removePlayerJoined = handlePlayerJoined();
          const removePlayerLeft = handlePlayerLeft();
          const removeGameStarted = handleGameStarted();
          const removeGameEnded = handleGameEnded();
          const removeQuestionSelected = handleQuestionSelected();
          const removeAnswerSubmitted = handleAnswerSubmitted();
          const removeQuestionAnswered = handleQuestionAnswered();
          const removeQuestionRobbed = handleQuestionRobbed();
          const removeQuestionRobbingIsAllowed = handleQuestionRobbingIsAllowed();
          const removeGameCancelled = handleGameCancelled();
          const removeNextPlayerSelected = handleNextPlayerSelected();

          const joined = await signalRMethods.joinGame(sessionId);
          if (!joined) {
            removePlayerJoined();
            removePlayerLeft();
            removeGameStarted();
            removeGameEnded();
            removeQuestionSelected();
            removeAnswerSubmitted();
            removeQuestionAnswered();
            removeQuestionRobbed();
            removeQuestionRobbingIsAllowed();
            removeGameCancelled();
            removeNextPlayerSelected();
            return;
          }

          hasJoinedSession = true;

          cleanup = () => {
            removePlayerJoined();
            removePlayerLeft();
            removeGameStarted();
            removeGameEnded();
            removeQuestionSelected();
            removeAnswerSubmitted();
            removeQuestionAnswered();
            removeQuestionRobbed();
            removeQuestionRobbingIsAllowed();
            void signalRMethods.leaveGame(sessionId);
            hasJoinedSession = false;
          };
        }
      } catch (error) {
        console.error("Error initializing SignalR:", error);
      }
    };

    void initializeSignalR();

    return () => {
      cleanup?.();
    };
  }, [
    handleAnswerSubmitted,
    handleGameCancelled,
    handleGameEnded,
    handleGameStarted,
    handleNextPlayerSelected,
    handlePlayerJoined,
    handlePlayerLeft,
    handleQuestionAnswered,
    handleQuestionRobbed,
    handleQuestionRobbingIsAllowed,
    handleQuestionSelected,
    sessionId,
    signalRMethods,
    signalRStatus.isConnected,
    signalRStatus.isConnecting,
    user?.token,
  ]);

  useEffect(() => {
    if (sessionId && !isGameCompleted) {
      void getCurrentGame();
    }
  }, [getCurrentGame, isGameCompleted, sessionId]);

  useEffect(() => {
    if (!sessionId) {
      void navigate(home);
    }
  }, [sessionId, navigate]);

  function renderCurrentPage() {
    if (!currentGame?.isStarted && !currentGame?.isCompleted && sessionId) {
      return <Lobby currentGame={currentGame} currentGamePlayer={currentGamePlayer} sessionId={sessionId} isGameMaster={isGameMaster} joinGame={signalRMethods.joinGame} />;
    }

    if (currentGame?.isCompleted || isGameCompleted) {
      return <Result archivedGame={archivedGame} />;
    }

    if (!isQuestionSelected && currentGame) {
      return (
        <QuestionSelection currentGamePlayer={currentGamePlayer} isCurrentPlayer={isCurrentUser} isGameMaster={isGameMaster} currentGame={currentGame} sessionId={sessionId} />
      );
    }

    if (currentGame) {
      return <Answer isCurrentUser={isCurrentUser} currentGamePlayer={currentGamePlayer} isGameMaster={isGameMaster} currentGame={currentGame} sessionId={sessionId} />;
    }
  }

  function render() {
    return <LoadingContainer loading={isLoadingGame || isArchivedGameLoading}>{renderCurrentPage()}</LoadingContainer>;
  }

  return render();
}

export default GameSessionPage;
