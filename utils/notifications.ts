import { showNotification } from "@mantine/notifications";

export function notifyError(title: string, message: string) {
  showNotification({
    title,
    message,
    color: "red",
  });
}
