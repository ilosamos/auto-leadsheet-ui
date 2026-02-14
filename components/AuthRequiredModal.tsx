"use client";

import { Button, Group, Modal, Text } from "@mantine/core";
import { IconBrandGoogle } from "@tabler/icons-react";

type AuthRequiredModalProps = {
  opened: boolean;
  onCancel: () => void;
  onSignIn: () => void;
};

export function AuthRequiredModal({
  opened,
  onCancel,
  onSignIn,
}: AuthRequiredModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onCancel}
      title="Sign in required"
      centered
    >
      <Text size="sm" c="dimmed" mb="md">
        Please sign in before starting a new session and uploading songs.
      </Text>
      <Group justify="flex-end" gap="xs">
        <Button variant="default" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="filled"
          leftSection={<IconBrandGoogle size={16} />}
          onClick={onSignIn}
        >
          Sign in with Google
        </Button>
      </Group>
    </Modal>
  );
}
