import { ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useCallback } from "react";
import { home } from "../../../../constants/pages.ts";
import { useNavigate } from "react-router-dom";

function BackHomeButton() {
  const navigate = useNavigate();

  const handleBackToHome = useCallback(() => {
    void navigate(home);
  }, [navigate]);

  function render() {
    return (
      <ActionIcon variant="light" radius="xs" onClick={handleBackToHome} size="lg">
        <IconArrowLeft size={20} />
      </ActionIcon>
    );
  }
  return render();
}

export default BackHomeButton;
