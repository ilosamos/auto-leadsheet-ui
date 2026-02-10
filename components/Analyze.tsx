"use client";

import { useRef, useEffect, useState } from "react";
import { Button, Center, Group, Loader, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useJob } from "../providers/JobProvider";
import { FileUpload } from "./FileUpload";
import { ResultList } from "./ResultList";
import { GenerateSheetButton } from "./GenerateSheetButton";
import { showNotification } from "@mantine/notifications";
import { JobStatusEnum } from "../app/client";

const POLL_INTERVAL_MS = 5000;

export function Analyze() {
  const { isLoadingJob, currentJobSongs, createJob, fetchSongs, triggerAnalysisJobs } = useJob();
  const pollerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [newSessionModalOpen, setNewSessionModalOpen] = useState(false);
  const isLoading = isLoadingJob;

  const handleNewSessionClick = () => setNewSessionModalOpen(true);
  const handleNewSessionConfirm = () => {
    createJob();
    setNewSessionModalOpen(false);
  };
  const handleNewSessionCancel = () => setNewSessionModalOpen(false);

  const finishedSongs = currentJobSongs.filter(
    (s) => s.chordStatus === "SUCCESS" && s.allin1Status === "SUCCESS",
  );

  const isAllDoneOrFailed = currentJobSongs.length > 0 && currentJobSongs.every(
    (s) => s.chordStatus === "SUCCESS" || s.allin1Status === "SUCCESS"
    || s.chordStatus === "FAILED" || s.allin1Status === "FAILED"
  );

  const isNothingRunning = currentJobSongs.every(
    (s) => (s.chordStatus === "SUCCESS" && s.allin1Status === "SUCCESS") 
    || (s.chordStatus === "FAILED" && s.allin1Status === "FAILED")
    || (s.chordStatus === "CANCELLED" && s.allin1Status === "CANCELLED")
    || (s.chordStatus === "PENDING" && s.allin1Status === "PENDING"),
  );
  const allSongsPending = currentJobSongs.every(
    (s) => s.chordStatus === "PENDING" && s.allin1Status === "PENDING",
  );

  const firstJobStatus = (): JobStatusEnum | null => {
    if (currentJobSongs.length === 0) return null;
    const song = currentJobSongs[0];
    if (song.chordStatus === "PENDING" || song.allin1Status === "PENDING") return "PENDING";
    if (song.chordStatus === "TRIGGERED" || song.allin1Status === "TRIGGERED") return "TRIGGERED";
    if (song.chordStatus === "ANALYZING" || song.allin1Status === "ANALYZING") return "ANALYZING";
    if (song.chordStatus === "SUCCESS" || song.allin1Status === "SUCCESS") return "SUCCESS";
    if (song.chordStatus === "FAILED" || song.allin1Status === "FAILED") return "FAILED";
    if (song.chordStatus === "CANCELLED" || song.allin1Status === "CANCELLED") return "CANCELLED";
    return "PENDING";
  }

  const handleGenerate = async () => {
    const error = await triggerAnalysisJobs();
    if (error) {
      showNotification({
        title: "Error",
        message: "There was an error triggering the analysis jobs. Please try again.",
        color: "red",
      });
    }
  };

  // Single poller: when any song is in progress, refresh songs every POLL_INTERVAL_MS.
  // Cleanup ensures only one interval is ever active; re-running when allSongsRunning
  // becomes true again starts a fresh poller.
  useEffect(() => {
    if (isNothingRunning) {
      pollerRef.current = null;
      return;
    }
    const id = setInterval(() => {
      fetchSongs();
    }, POLL_INTERVAL_MS);
    pollerRef.current = id;
    return () => {
      clearInterval(id);
      pollerRef.current = null;
    };
  }, [isNothingRunning, fetchSongs]);

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
    <Stack gap="md">
      <Modal
        opened={newSessionModalOpen}
        onClose={handleNewSessionCancel}
        title="New Session"
        centered
      >
        <Text size="sm" c="dimmed" mb="md">
          Start a new session? This will replace your current job and songs, but you can still view them in your history.
        </Text>
        <Group justify="flex-end" gap="xs">
          <Button variant="default" onClick={handleNewSessionCancel}>
            No
          </Button>
          <Button variant="filled" onClick={handleNewSessionConfirm} loading={isLoadingJob}>
            Yes
          </Button>
        </Group>
      </Modal>
      <Paper withBorder radius="md" p="sm" shadow="xs" bg="gray.9">
        <Group justify="space-between" align="center" wrap="nowrap">
          <div style={{ minWidth: 0 }}>
            <Title order={4} lh={1.1}>
              Analyze
            </Title>
            <Text size="sm" c="dimmed" lineClamp={1}>
              Upload songs, run analysis, and generate your leadsheets.
            </Text>
          </div>
          {isAllDoneOrFailed && <Button
            variant="filled"
            size="xs"
            leftSection={<IconPlus size={16} />}
            onClick={handleNewSessionClick}
          >
            New Session
          </Button>}
        </Group>
      </Paper>
      <FileUpload enabled={allSongsPending || false} allDone={!allSongsPending} />
      {currentJobSongs.length > 0 && !isAllDoneOrFailed && (
        <GenerateSheetButton
          songs={currentJobSongs}
          loading={!isNothingRunning}
          loadingText="This may take a few minutes"
          loadingStatus={firstJobStatus() ?? "PENDING"}
          onGenerate={handleGenerate}
        />
      )}
      <ResultList songs={finishedSongs} />
    </Stack>
  );
}
