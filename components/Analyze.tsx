"use client";

import { Button, Center, Group, Loader, Stack, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useJob } from "../providers/JobProvider";
import { FileUpload } from "./FileUpload";
import { ResultList } from "./ResultList";
import { GenerateSheetButton } from "./GenerateSheetButton";

export function Analyze() {
  const { isLoadingJob, isLoadingSongs, currentJobSongs, createJob } = useJob();
  const isLoading = isLoadingJob || isLoadingSongs;

  const finishedSongs = currentJobSongs.filter(
    (s) => s.chordStatus === "SUCCESS" && s.allin1Status === "SUCCESS",
  );
  const allSongsFinished = currentJobSongs.every(
    (s) => s.chordStatus === "SUCCESS" && s.allin1Status === "SUCCESS",
  );
  const allSongsPending = currentJobSongs.every(
    (s) => s.chordStatus === "PENDING" && s.allin1Status === "PENDING",
  );
  const allSongsRunning = !allSongsPending && !allSongsFinished;
  const firstJobStatus =
    currentJobSongs[0]?.chordStatus ??
    currentJobSongs[0]?.allin1Status ??
    "PENDING";

  if (isLoading) {
    return (
      <Center py="xl">
        <Stack align="center" gap="sm">
          <Text size="sm" c="dimmed">
            Loading data…
          </Text>
          <Loader size="md" />
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="xl">
      <Group justify="flex-end">
        <Button
          variant="filled"
          leftSection={<IconPlus size={16} />}
          onClick={createJob}
          loading={isLoadingJob}
        >
          New Session
        </Button>
      </Group>
      <FileUpload enabled={allSongsFinished} />
      {currentJobSongs.length > 0 && (
        <GenerateSheetButton
          songs={currentJobSongs}
          loading={allSongsRunning}
          loadingText="This may take a few minutes"
          loadingStatus={firstJobStatus}
          onGenerate={() => {
            // TODO: wire up actual sheet generation
          }}
        />
      )}
      <ResultList songs={finishedSongs} />
    </Stack>
  );
}
