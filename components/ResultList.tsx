"use client";

import { Stack, Text, Title } from "@mantine/core";
import { ResultItem } from "./ResultItem";
import { SongResponse } from "../app/client";

const MOCK_RESULTS: SongResponse[] = [
  {
    songId: "result-1",
    chordStatus: "SUCCESS",
    allin1Status: "SUCCESS",
    title: "Take Five",
    artist: "Dave Brubeck",
    audioPath: "https://example.com/audio.mp3",
    chordsPath: "https://example.com/chords.xml",
    allin1Path: "https://example.com/allin1.pdf",
    size: 1000000,
    length: 180,
  },
];

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
