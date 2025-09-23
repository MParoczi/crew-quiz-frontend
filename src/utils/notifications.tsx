import { notifications } from "@mantine/notifications";
import { IconCheck, IconExclamationMark, IconInfoCircle, IconX } from "@tabler/icons-react";

const defaultOptions = {
  autoClose: 5000,
  withCloseButton: true,
  withBorder: true,
  radius: "sm",
  className: "crew-quiz-notification",
};

const getIconSize = () => {
  if (typeof window !== "undefined") {
    return window.innerWidth <= 768 ? 20 : 18;
  }
  return 18;
};

export const showSuccessNotification = (title: string, message: string, options = {}) => {
  notifications.show({
    title,
    message,
    color: "success",
    icon: <IconCheck size={getIconSize()} />,
    ...defaultOptions,
    ...options,
  });
};

export const showErrorNotification = (title: string, message: string, options = {}) => {
  notifications.show({
    title,
    message,
    color: "error",
    icon: <IconX size={getIconSize()} />,
    ...defaultOptions,
    ...options,
  });
};

export const showWarningNotification = (title: string, message: string, options = {}) => {
  notifications.show({
    title,
    message,
    color: "warning",
    icon: <IconExclamationMark size={getIconSize()} />,
    ...defaultOptions,
    ...options,
  });
};

export const showInfoNotification = (title: string, message: string, options = {}) => {
  notifications.show({
    title,
    message,
    color: "info",
    icon: <IconInfoCircle size={getIconSize()} />,
    ...defaultOptions,
    ...options,
  });
};

export const hideAllNotifications = () => {
  notifications.clean();
};
