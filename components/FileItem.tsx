"use client";

import {
  ActionIcon,
  Group,
  Paper,
  Progress,
  Text,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCheck,
  IconFileMusic,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

export type FileStatus = "idle" | "uploading" | "done" | "error";

export interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: FileStatus;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface FileItemProps {
  uploadedFile: UploadedFile;
  onRemove: (id: string) => void;
}

export function FileItem({ uploadedFile, onRemove }: FileItemProps) {
  const { id, file, progress, status } = uploadedFile;

  const statusIcon =
    status === "done" ? (
      <ThemeIcon color="teal" variant="light" size="sm" radius="xl">
        <IconCheck size={14} />
      </ThemeIcon>
    ) : status === "error" ? (
      <ThemeIcon color="red" variant="light" size="sm" radius="xl">
        <IconX size={14} />
      </ThemeIcon>
    ) : null;

  const progressColor =
    status === "done" ? "teal" : status === "error" ? "red" : "blue";

  return (
    <Paper withBorder p="sm" radius="md">
      <Group justify="space-between" mb={progress < 100 ? 6 : 0}>
        <Group gap="sm">
          <ThemeIcon variant="light" color="blue" size="lg" radius="md">
            <IconFileMusic size={20} />
          </ThemeIcon>
          <div>
            <Text size="sm" fw={500} lineClamp={1}>
              {file.name}
            </Text>
            <Text size="xs" c="dimmed">
              {formatFileSize(file.size)}
            </Text>
          </div>
        </Group>
        <Group gap="xs">
          {statusIcon}
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            onClick={() => onRemove(id)}
            aria-label="Remove file"
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
      </Group>

      {status === "uploading" && (
        <Progress
          value={progress}
          color={progressColor}
          size="sm"
          radius="xl"
          animated
        />
      )}
    </Paper>
  );
}
