"use client";

import { useCallback, useState } from "react";
import {
  ActionIcon,
  Badge,
  Group,
  Loader,
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
import type { SongResponse } from "../app/client/models/SongResponse";
import type { UpdateSongRequest } from "../app/client/models/UpdateSongRequest";
import { EditableField } from "./EditableField";

export type UploadStatus = "uploading" | "done" | "error";

export interface UploadProgress {
  progress: number;
  status: UploadStatus;
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
  song: SongResponse;
  upload?: UploadProgress;
  onRemove?: (songId: string) => Promise<void> | void;
  onUpdate?: (songId: string, request: UpdateSongRequest) => Promise<void> | void;
}

export function FileItem({ song, upload, onRemove, onUpdate }: FileItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const status: UploadStatus | "idle" = upload?.status ?? "idle";
  const progress = upload?.progress ?? (song.uploadStatus === "SUCCESS" ? 100 : 0);

  const isSongUploadStatusError = song.uploadStatus === "ERROR";
  const isSongPending = song.allin1Status === "PENDING" || song.chordStatus === "PENDING";

  const statusIcon =
    status === "done" || (!upload && song.uploadStatus === "SUCCESS") ? (
      <ThemeIcon color="teal" variant="light" size="sm" radius="xl">
        <IconCheck size={14} />
      </ThemeIcon>
    ) : status === "error" || isSongUploadStatusError ? (
      <ThemeIcon color="red" variant="light" size="sm" radius="xl">
        <IconX size={14} />
      </ThemeIcon>
    ) : null;

  const progressColor =
    status === "done" ? "teal" : status === "error" ? "red" : "blue";
  const statusLabel =
    status === "uploading"
      ? "Uploading"
      : status === "done" || (!upload && song.uploadStatus === "SUCCESS")
        ? "Uploaded"
        : status === "error" || isSongUploadStatusError
          ? "Error"
          : "Pending";

  const handleTitleSubmit = useCallback(
    (newTitle: string) => {
      onUpdate?.(song.songId, { title: newTitle });
    },
    [song.songId, onUpdate],
  );

  const handleArtistSubmit = useCallback(
    (newArtist: string) => {
      onUpdate?.(song.songId, { artist: newArtist });
    },
    [song.songId, onUpdate],
  );

  return (
    <Paper
      withBorder
      p="sm"
      radius="lg"
      bg="dark.7"
      style={{
        borderColor: "var(--mantine-color-dark-4)",
      }}
    >
      <Group justify="space-between" mb={status === "uploading" ? 6 : 0}>
        <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
          <ThemeIcon
            variant="light"
            color="blue"
            size="lg"
            radius="md"
            style={{
              flexShrink: 0,
              border: "1px solid var(--mantine-color-dark-4)",
              background: "var(--mantine-color-dark-6)",
            }}
          >
            <IconFileMusic size={20} />
          </ThemeIcon>
          <div style={{ minWidth: 0, flex: 1 }}>
            <EditableField
              value={song.title ?? ""}
              placeholder="Untitled"
              size="sm"
              fw={500}
              maxLength={50}
              onSubmit={handleTitleSubmit}
              disabled={!isSongPending}
            />
            <EditableField
              value={song.artist ?? ""}
              placeholder="Unknown artist"
              size="xs"
              c={song.artist ? "inherit" : "orange.3"}
              maxLength={50}
              onSubmit={handleArtistSubmit}
              disabled={!isSongPending}
            />
            <Group gap="xs" mt={2}>
              {song.size != null && (
                <Text size="xs" c="dimmed">
                  {formatFileSize(song.size)}
                </Text>
              )}
              <Badge
                size="xs"
                variant="light"
                color={status === "error" || isSongUploadStatusError ? "red" : "gray"}
              >
                {statusLabel}
              </Badge>
            </Group>
          </div>
        </Group>
        <Group gap="xs" style={{ flexShrink: 0 }}>
          {isSongUploadStatusError ? <Text size="xs" c="red">Upload Error</Text> : null}
          {statusIcon}
          {onRemove && isSongPending && (
            isDeleting ? (
              <Loader size="xs" color="red" />
            ) : (
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                style={{ borderRadius: "var(--mantine-radius-md)" }}
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await onRemove(song.songId);
                  } finally {
                    setIsDeleting(false);
                  }
                }}
                aria-label="Remove file"
              >
                <IconTrash size={16} />
              </ActionIcon>
            )
          )}
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
