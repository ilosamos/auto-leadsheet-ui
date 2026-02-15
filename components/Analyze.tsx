"use client";

import { useMemo } from "react";
import { Button, Center, Group, Loader, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import { signIn, useSession } from "next-auth/react";
import { useJob } from "../providers/JobProvider";
import { useUser } from "../providers/AuthSessionProvider";
import { AuthRequiredModal } from "./AuthRequiredModal";
import { FileUpload } from "./FileUpload";
import { ResultList } from "./ResultList";
import { GenerateSheetButton } from "./GenerateSheetButton";
import { JobStatusEnum } from "../app/client";
import { StripeService } from "../app/client/services/StripeService";
import { api } from "../app/client/api";
import { notifyError } from "../utils/notifications";
import { usePolling } from "../hooks/usePolling";

const POLL_INTERVAL_MS = 5000;

export function Analyze() {
  const { isLoadingJob, currentJobSongs, createJob, fetchSongs, triggerAnalysisJobs } = useJob();
  const { user } = useUser();
  const { status } = useSession();
  const [newSessionModalOpen, newSessionModal] = useDisclosure(false);
  const [authRequiredModalOpen, authRequiredModal] = useDisclosure(false);
  const isLoading = isLoadingJob;
  const isAuthenticated = status === "authenticated";
  const freeEligible = user?.freeEligible ?? true;
  const remainingCredits = user?.credits ?? 0;

  const handleNewSessionClick = () => newSessionModal.open();
  const handleNewSessionConfirm = () => {
    createJob();
    newSessionModal.close();
  };
  const handleNewSessionCancel = () => newSessionModal.close();
  const handleAuthRequiredOpen = () => authRequiredModal.open();
  const handleAuthRequiredCancel = () => authRequiredModal.close();
  const handleAuthRequiredSignIn = () => {
    authRequiredModal.close();
    signIn("google");
  };

  const finishedSongs = useMemo(
    () => currentJobSongs.filter(
      (s) => s.chordStatus === "SUCCESS" && s.allin1Status === "SUCCESS",
    ),
    [currentJobSongs],
  );

  const isAllDoneOrFailed = useMemo(() => (
    currentJobSongs.length > 0 &&
    currentJobSongs.every(
      (s) =>
        (s.chordStatus === "SUCCESS" || s.chordStatus === "FAILED") &&
        (s.allin1Status === "SUCCESS" || s.allin1Status === "FAILED"),
    )
  ), [currentJobSongs]);

  const isNothingRunning = useMemo(() => currentJobSongs.every(
    (s) => (s.chordStatus === "SUCCESS" && s.allin1Status === "SUCCESS")
    || (s.chordStatus === "FAILED" && s.allin1Status === "FAILED")
    || (s.chordStatus === "CANCELLED" && s.allin1Status === "CANCELLED")
    || (s.chordStatus === "PENDING" && s.allin1Status === "PENDING"),
  ), [currentJobSongs]);
  const allSongsPending = useMemo(() => currentJobSongs.every(
    (s) => s.chordStatus === "PENDING" && s.allin1Status === "PENDING",
  ), [currentJobSongs]);

  const firstJobStatus = useMemo((): JobStatusEnum | null => {
    if (currentJobSongs.length === 0) { return null; }
    const [song] = currentJobSongs;
    const statusOrder: JobStatusEnum[] = [
      "PENDING",
      "TRIGGERED",
      "ANALYZING",
      "SUCCESS",
      "FAILED",
      "CANCELLED",
    ];
    const statuses = [song.chordStatus, song.allin1Status];
    return statusOrder.find((status) => statuses.includes(status)) ?? "PENDING";
  }, [currentJobSongs]);

  const handleGenerate = async () => {
    const error = await triggerAnalysisJobs();
    if (error) {
      notifyError("Error", "There was an error triggering the analysis jobs. Please try again.");
    }
  };

  const handlePurchase = async (tier: "low" | "high") => {
    const { data, error } = await api(
      StripeService.createCheckoutSessionStripeCheckoutPost({ tier }),
    );

    if (error) {
      notifyError("Checkout error", "Unable to start checkout. Please try again.");
      return;
    }

    const redirectUrl = data?.url ?? null;

    if (!redirectUrl) {
      notifyError("Checkout error", "Checkout URL was not returned. Please try again.");
      return;
    }

    window.location.href = redirectUrl;
  };

  usePolling({
    enabled: !isNothingRunning,
    intervalMs: POLL_INTERVAL_MS,
    onTick: fetchSongs,
  });

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
      <AuthRequiredModal
        opened={authRequiredModalOpen}
        onCancel={handleAuthRequiredCancel}
        onSignIn={handleAuthRequiredSignIn}
      />
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
      <FileUpload
        enabled={allSongsPending || false}
        allDone={!allSongsPending}
        isAuthenticated={isAuthenticated}
        onRequireAuth={handleAuthRequiredOpen}
      />
      {currentJobSongs.length > 0 && !isAllDoneOrFailed && (
        <GenerateSheetButton
          songs={currentJobSongs}
          loading={!isNothingRunning}
          loadingText="This may take a few minutes"
          loadingStatus={firstJobStatus ?? "PENDING"}
          onGenerate={handleGenerate}
          handlePurchase={handlePurchase}
          freeEligible={freeEligible}
          remainingCredits={remainingCredits}
        />
      )}
      <ResultList songs={finishedSongs} />
    </Stack>
  );
}
