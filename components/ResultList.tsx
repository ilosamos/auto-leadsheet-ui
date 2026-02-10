"use client";

import { Stack, Text, Title } from "@mantine/core";
import { ResultItem } from "./ResultItem";
import { SongResponse } from "../app/client";

interface ResultListProps {
  songs?: SongResponse[];
}

export function ResultList({ songs }: ResultListProps) {
  if (!songs || songs.length === 0) {
    return null;
  }

  return (
    <Stack gap="sm">
      <div>
        <Title order={4}>Generated Lead Sheets</Title>
        <Text size="sm" c="dimmed">
          {songs.length} {songs.length === 1 ? "file" : "files"} processed
        </Text>
      </div>
      {songs.map((s) => (
        <ResultItem key={s.songId} song={s} />
      ))}
    </Stack>
  );
}
