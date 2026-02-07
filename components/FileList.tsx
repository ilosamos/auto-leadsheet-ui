"use client";

import { Accordion, Stack, Text } from "@mantine/core";
import { IconFiles } from "@tabler/icons-react";
import { FileItem, type UploadProgress } from "./FileItem";
import type { SongResponse } from "../app/client/models/SongResponse";
import type { UpdateSongRequest } from "../app/client/models/UpdateSongRequest";

interface FileListProps {
  songs: SongResponse[];
  uploads: Map<string, UploadProgress>;
  onRemove?: (songId: string) => void;
  onUpdate?: (songId: string, request: UpdateSongRequest) => void;
}

export function FileList({ songs, uploads, onRemove, onUpdate }: FileListProps) {
  if (songs.length === 0) {
    return null;
  }

  const uploadedCount = songs.filter((s) => {
    const upload = uploads.get(s.songId);
    return upload ? upload.status === "done" : !!s.audioPath;
  }).length;

  return (
    <Accordion defaultValue="files" variant="contained" radius="md">
      <Accordion.Item value="files">
        <Accordion.Control icon={<IconFiles size={20} />}>
          <Text size="sm" fw={500}>
            Files ({uploadedCount}/{songs.length} uploaded)
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack gap="xs">
            {songs.map((song) => (
              <FileItem
                key={song.songId}
                song={song}
                upload={uploads.get(song.songId)}
                onRemove={onRemove}
                onUpdate={onUpdate}
              />
            ))}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
