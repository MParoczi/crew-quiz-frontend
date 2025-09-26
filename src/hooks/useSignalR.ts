import type { HubConnection } from "@microsoft/signalr";
import { HubConnectionBuilder, HubConnectionState, LogLevel } from "@microsoft/signalr";
import { useCallback, useEffect, useRef, useState } from "react";

import useUserLocalStorage from "./useUserLocalStorage";
import { API_BASE_URL } from "../constants/environmentVariables";

import type { BackendModelsDtosGameFlowDto } from "../api/types.gen";

export enum GameEventType {
  GameStarted = "GameStarted",
  GameEnded = "GameEnded",
  QuestionSelected = "QuestionSelected",
  AnswerSubmitted = "AnswerSubmitted",
  QuestionRobbingIsAllowed = "QuestionRobbingIsAllowed",
  QuestionRobbed = "QuestionRobbed",
  QuestionAnswered = "QuestionAnswered",
  QuestionAnsweredWrong = "QuestionAnsweredWrong",
  PlayerJoined = "PlayerJoined",
  PlayerLeft = "PlayerLeft",
  PlayerDisconnected = "PlayerDisconnected",
  GameCancelled = "GameCancelled",
  NextPlayerSelected = "NextPlayerSelected",
}

interface ISignalREventHandler {
  (gameFlowDto: BackendModelsDtosGameFlowDto): void;
}

interface IUseSignalROptions {
  onConnect?: () => void;
  onReconnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
  autoReconnect?: boolean;
}

interface ISignalRState {
  connectionState: HubConnectionState;
  isConnected: boolean;
  isConnecting: boolean;
}

function useSignalR(hubUrl: string = "/crew-quiz", options?: IUseSignalROptions) {
  const [user] = useUserLocalStorage();
  const connectionRef = useRef<HubConnection | null>(null);
  const eventHandlersRef = useRef<Map<GameEventType, ISignalREventHandler[]>>(new Map());

  const [state, setState] = useState<ISignalRState>({
    connectionState: HubConnectionState.Disconnected,
    isConnected: false,
    isConnecting: false,
  });

  const updateState = useCallback((connectionState: HubConnectionState) => {
    setState({
      connectionState,
      isConnected: connectionState === HubConnectionState.Connected,
      isConnecting: connectionState === HubConnectionState.Connecting || connectionState === HubConnectionState.Reconnecting,
    });
  }, []);

  const connect = useCallback(async () => {
    if (!user?.token) {
      return false;
    }

    if (connectionRef.current?.state === HubConnectionState.Connected) {
      return true;
    }

    try {
      updateState(HubConnectionState.Connecting);

      const connection = new HubConnectionBuilder()
        .withUrl(`${API_BASE_URL}${hubUrl}`, {
          accessTokenFactory: () => user.token ?? "",
        })
        .withAutomaticReconnect(options?.autoReconnect !== false ? [0, 2000, 10000, 30000] : [])
        .configureLogging(LogLevel.None)
        .build();

      connection.onclose((error) => {
        updateState(HubConnectionState.Disconnected);
        if (error) {
          options?.onError?.(error);
        }
        options?.onDisconnect?.();
      });

      connection.onreconnecting(() => {
        updateState(HubConnectionState.Reconnecting);
      });

      connection.onreconnected(() => {
        updateState(HubConnectionState.Connected);
        options?.onReconnect?.();
      });

      Object.values(GameEventType).forEach((eventType) => {
        connection.on(eventType, (gameFlowDto: BackendModelsDtosGameFlowDto) => {
          const handlers = eventHandlersRef.current.get(eventType as GameEventType) ?? [];
          handlers.forEach((handler) => {
            handler(gameFlowDto);
          });
        });
      });

      await connection.start();
      connectionRef.current = connection;
      updateState(HubConnectionState.Connected);
      options?.onConnect?.();
      return true;
    } catch (error) {
      updateState(HubConnectionState.Disconnected);
      const errorMsg = `Failed to connect to SignalR: ${error instanceof Error ? error.message : "Unknown error"}`;
      options?.onError?.(error instanceof Error ? error : new Error(errorMsg));
      return false;
    }
  }, [user, updateState, hubUrl, options]);

  const disconnect = useCallback(async () => {
    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
        connectionRef.current = null;
        updateState(HubConnectionState.Disconnected);
      } catch (error) {
        const errorMsg = `Error disconnecting SignalR: ${error instanceof Error ? error.message : "Unknown error"}`;
        options?.onError?.(error instanceof Error ? error : new Error(errorMsg));
      }
    }
  }, [options, updateState]);

  const joinGame = useCallback(
    async (sessionId: string) => {
      if (!connectionRef.current || connectionRef.current.state !== HubConnectionState.Connected) {
        return false;
      }

      if (!user?.userId) {
        return false;
      }

      try {
        await connectionRef.current.invoke("JoinGame", sessionId, Number(user.userId));
        return true;
      } catch (error) {
        const errorMsg = `Failed to join game: ${error instanceof Error ? error.message : "Unknown error"}`;
        options?.onError?.(error instanceof Error ? error : new Error(errorMsg));
        return false;
      }
    },
    [user?.userId, options],
  );

  const leaveGame = useCallback(
    async (sessionId: string) => {
      if (!connectionRef.current || connectionRef.current.state !== HubConnectionState.Connected) {
        return false;
      }

      if (!user?.userId) {
        return false;
      }

      try {
        await connectionRef.current.invoke("LeaveGame", sessionId, Number(user.userId));
        return true;
      } catch (error) {
        const errorMsg = `Failed to leave game: ${error instanceof Error ? error.message : "Unknown error"}`;
        options?.onError?.(error instanceof Error ? error : new Error(errorMsg));
        return false;
      }
    },
    [user?.userId, options],
  );

  const addEventListener = useCallback((eventType: GameEventType, handler: ISignalREventHandler) => {
    const handlers = eventHandlersRef.current.get(eventType) ?? [];
    handlers.push(handler);
    eventHandlersRef.current.set(eventType, handlers);

    return () => {
      const currentHandlers = eventHandlersRef.current.get(eventType) ?? [];
      const filteredHandlers = currentHandlers.filter((h) => h !== handler);
      if (filteredHandlers.length === 0) {
        eventHandlersRef.current.delete(eventType);
      } else {
        eventHandlersRef.current.set(eventType, filteredHandlers);
      }
    };
  }, []);

  const removeEventListener = useCallback((eventType: GameEventType, handler: ISignalREventHandler) => {
    const handlers = eventHandlersRef.current.get(eventType) ?? [];
    const filteredHandlers = handlers.filter((h) => h !== handler);
    if (filteredHandlers.length === 0) {
      eventHandlersRef.current.delete(eventType);
    } else {
      eventHandlersRef.current.set(eventType, filteredHandlers);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (connectionRef.current) {
        void connectionRef.current.stop();
      }
    };
  }, []);

  return [
    state,
    {
      connect,
      disconnect,
      joinGame,
      leaveGame,
      addEventListener,
      removeEventListener,
    },
  ] as const;
}

export default useSignalR;
