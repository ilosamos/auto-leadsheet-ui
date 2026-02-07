"use client";

import { Stack, Text, Title } from "@mantine/core";
import { ResultItem, type GeneratedResult } from "./ResultItem";

const MOCK_RESULTS: GeneratedResult[] = [
  {
    id: "result-1",
    title: "Take Five",
    artist: "Dave Brubeck",
    previewUrl: "",
    audioSrc: "",
    xmlDownloadUrl: "#",
    pdfDownloadUrl: "#",
  },
  {
    id: "result-2",
    title: "Autumn Leaves",
    artist: "Joseph Kosma",
    previewUrl: "",
    audioSrc: "",
    xmlDownloadUrl: "#",
    pdfDownloadUrl: "#",
  },
];

interface ResultListProps {
  results?: GeneratedResult[];
}

export function ResultList({ results = MOCK_RESULTS }: ResultListProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <Stack gap="sm">
      <div>
        <Title order={4}>Generated Lead Sheets</Title>
        <Text size="sm" c="dimmed">
          {results.length} {results.length === 1 ? "file" : "files"} processed
        </Text>
      </div>
      {results.map((r) => (
        <ResultItem key={r.id} result={r} />
      ))}
    </Stack>
  );
}
