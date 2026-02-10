"use client";

import { Button, SemiCircleProgress, Stack, Text, Tooltip } from "@mantine/core";
import { IconZoomScan } from "@tabler/icons-react";
import type { SongResponse } from "../app/client/models/SongResponse";
import { JobStatusEnum } from "../app/client";
import { getSimulatedProgressFromSong } from "../utils/simulatedProgress";

interface GenerateSheetButtonProps {
  songs: SongResponse[];
  onGenerate: () => void;
  loading?: boolean;
  /** Optional status text shown below the button while loading (e.g. "This can take a while…") */
  loadingText?: string;
  loadingStatus?: JobStatusEnum;
}

function getDisabledReason(songs: SongResponse[]): string | null {
  if (songs.length === 0) { return "Add at least one song first"; }

  const pendingUploads = songs.filter((s) => s.uploadStatus !== "SUCCESS");
  if (pendingUploads.length > 0) { return "Wait for all uploads to finish"; }

  const missingMeta = songs.filter((s) => !s.title?.trim() || !s.artist?.trim());
  if (missingMeta.length > 0) { return "Set title and artist for every song"; }

  return null;
}

export function GenerateSheetButton({
  songs,
  onGenerate,
  loading = false,
  loadingStatus,
  loadingText,
}: GenerateSheetButtonProps) {
  const disabledReason = getDisabledReason(songs);
  const isDisabled = disabledReason !== null;
  const simulatedProgress = getSimulatedProgressFromSong(songs[0], 25, 90, 180);

  const percentForStatus = (status?: JobStatusEnum): number => {
    switch (status) {
      case "PENDING":
        return 0;
      case "TRIGGERED":
        return 10;
      case "ANALYZING":
        return simulatedProgress;
      case "SUCCESS":
        return 90;
    }
    return 0;
  }

  const textForStatus = (status?: JobStatusEnum): string => {
    switch (status) {
      case "PENDING":
        return "";
      case "TRIGGERED":
        return "Preparing Songs";
      case "ANALYZING":
        return "Analyzing Songs";
      case "SUCCESS":
        return "Almost done!";
    }
    return "";
  }

  const button = (
    <Button
      size="lg"
      radius="xl"
      fullWidth
      style={{ maxWidth: '400px' }}
      disabled={isDisabled && !loading}
      loading={loading}
      onClick={onGenerate}
      leftSection={!loading ? <IconZoomScan size={24} /> : undefined}
      variant="filled"
      color="cyan"
    >
      Analyze Songs
    </Button>
  );

  const wrappedButton =
    isDisabled && !loading ? (
      <Tooltip label={disabledReason} position="top" withArrow>
        {button}
      </Tooltip>
    ) : (
      button
    );

  const semiCircleProgress = (
    <SemiCircleProgress
      fillDirection="left-to-right"
      orientation="down"
      filledSegmentColor="cyan"
      size={200}
      thickness={12}
      value={percentForStatus(loadingStatus)}
      transitionDuration={250}
      label={textForStatus(loadingStatus)}
      labelPosition="center"
      styles={{
        label: { marginTop: -40, fontStyle: 'italic', fontSize: '0.9rem' },
      }}
    />
  )

  return (
    <Stack gap={0} align="center" style={{ width: '100%' }}>
      {wrappedButton}
      {loading && loadingStatus && semiCircleProgress}
      {loading && loadingText && (
        <Text size="xs" c="dimmed" mt="xs" ta="center">
          {loadingText}
        </Text>
      )}
    </Stack>
  );
}
