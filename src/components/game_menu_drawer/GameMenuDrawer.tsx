import { Drawer, Stack, Button, Divider } from "@mantine/core";
import { IconHome, IconPlayerPlay, IconBan, IconX, IconDoorExit } from "@tabler/icons-react";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../confirmation_modal/ConfirmationModal.tsx";
import useMutateData from "../../hooks/useMutateData.ts";
import {
  postApiGameFlowSelectNextPlayerMutation,
  postApiGameFlowAllowRobbingMutation,
  postApiGameFlowCancelGameMutation,
  postApiGameFlowLeaveGameMutation,
} from "../../api/@tanstack/react-query.gen.ts";

interface IGameMenuDrawerProps {
  opened: boolean;
  onClose: () => void;
  isGameMaster: boolean;
  sessionId?: string;
  userId?: bigint | null;
  questionId?: bigint | null;
  isGameStarted: boolean;
}

interface IConfirmationAction {
  type: "selectNextPlayer" | "allowRobbing" | "backToHome" | "cancelGame" | "leaveGame";
  title: string;
  message: string;
}

function GameMenuDrawer(props: IGameMenuDrawerProps) {
  const { opened, onClose, isGameMaster, sessionId, userId, questionId, isGameStarted } = props;

  const navigate = useNavigate();
  const [confirmationAction, setConfirmationAction] = useState<IConfirmationAction | null>(null);

  const [, selectNextPlayer, isSelectingNextPlayer] = useMutateData(postApiGameFlowSelectNextPlayerMutation, {
    successMessage: "Next player selected successfully!",
    onSuccess: () => {
      onClose();
    },
  });

  const [, allowRobbing, isAllowingRobbing] = useMutateData(postApiGameFlowAllowRobbingMutation, {
    successMessage: "Robbing allowed successfully!",
    onSuccess: () => {
      onClose();
    },
  });

  const [, cancelGame, isCancellingGame] = useMutateData(postApiGameFlowCancelGameMutation, {
    successMessage: "Game cancelled successfully!",
    onSuccess: () => {
      void navigate("/");
    },
  });

  const [, leaveGame, isLeavingGame] = useMutateData(postApiGameFlowLeaveGameMutation, {
    successMessage: "Left game successfully!",
    onSuccess: () => {
      void navigate("/");
    },
  });

  const handleSelectNextPlayer = useCallback(() => {
    setConfirmationAction({
      type: "selectNextPlayer",
      title: "Select Next Player",
      message: "Are you sure you want to select the next player?",
    });
  }, []);

  const handleAllowRobbing = useCallback(() => {
    setConfirmationAction({
      type: "allowRobbing",
      title: "Allow Robbing",
      message: "Are you sure you want to allow robbing for this question?",
    });
  }, []);

  const handleBackToHome = useCallback(() => {
    setConfirmationAction({
      type: "backToHome",
      title: "Back to Home",
      message: "Are you sure you want to go back to the home screen?",
    });
  }, []);

  const handleCancelGame = useCallback(() => {
    setConfirmationAction({
      type: "cancelGame",
      title: "Cancel Game",
      message: "Are you sure you want to cancel this game? This action cannot be undone.",
    });
  }, []);

  const handleLeaveGame = useCallback(() => {
    setConfirmationAction({
      type: "leaveGame",
      title: "Leave Game",
      message: "Are you sure you want to leave this game?",
    });
  }, []);

  const handleConfirmAction = useCallback(async () => {
    if (!confirmationAction || !sessionId) {
      return;
    }

    switch (confirmationAction.type) {
      case "selectNextPlayer":
        await selectNextPlayer({ sessionId });
        break;
      case "allowRobbing":
        await allowRobbing({ sessionId, questionId });
        break;
      case "backToHome":
        void navigate("/");
        break;
      case "cancelGame":
        await cancelGame({ sessionId });
        break;
      case "leaveGame":
        await leaveGame({ userId, sessionId });
        break;
    }

    setConfirmationAction(null);
  }, [confirmationAction, selectNextPlayer, allowRobbing, cancelGame, leaveGame, navigate, sessionId, userId, questionId]);

  const handleCancelAction = useCallback(() => {
    setConfirmationAction(null);
  }, []);

  const isPending = isSelectingNextPlayer || isAllowingRobbing || isCancellingGame || isLeavingGame;

  function renderGameMasterActions() {
    return (
      <>
        <Button variant="light" radius="xs" size="lg" leftSection={<IconPlayerPlay size={20} />} onClick={handleSelectNextPlayer} disabled={isPending || !isGameStarted} fullWidth>
          Select Next Player
        </Button>
        <Button variant="light" radius="xs" size="lg" leftSection={<IconBan size={20} />} onClick={handleAllowRobbing} disabled={isPending || !questionId} fullWidth>
          Allow Robbing
        </Button>
        <Divider />
        <Button variant="light" radius="xs" size="lg" leftSection={<IconHome size={20} />} onClick={handleBackToHome} disabled={isPending} fullWidth>
          Back to Home Screen
        </Button>
        <Button variant="light" radius="xs" size="lg" color="error" leftSection={<IconX size={20} />} onClick={handleCancelGame} disabled={isPending} fullWidth>
          Cancel Game
        </Button>
        <Button variant="light" radius="xs" size="lg" color="warning" leftSection={<IconDoorExit size={20} />} onClick={handleLeaveGame} disabled={isPending} fullWidth>
          Leave Game
        </Button>
      </>
    );
  }

  function renderPlayerActions() {
    return (
      <>
        <Button variant="light" radius="xs" size="lg" leftSection={<IconHome size={20} />} onClick={handleBackToHome} disabled={isPending} fullWidth>
          Back to Home Screen
        </Button>
        <Button variant="light" radius="xs" size="lg" color="warning" leftSection={<IconDoorExit size={20} />} onClick={handleLeaveGame} disabled={isPending} fullWidth>
          Leave Game
        </Button>
      </>
    );
  }

  function render() {
    return (
      <>
        <Drawer opened={opened} onClose={onClose} position="bottom" size="auto" radius="xs" withCloseButton={false} overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}>
          <Stack gap="md" p="md">
            {isGameMaster ? renderGameMasterActions() : renderPlayerActions()}
          </Stack>
        </Drawer>
        <ConfirmationModal
          opened={confirmationAction !== null}
          close={handleCancelAction}
          onConfirm={handleConfirmAction}
          onCancel={handleCancelAction}
          question={confirmationAction?.message ?? ""}
        />
      </>
    );
  }

  return render();
}

export default GameMenuDrawer;
