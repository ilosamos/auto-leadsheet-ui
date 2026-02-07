"use client";

import { Button, Stack, Text, Tooltip } from "@mantine/core";
import { IconFileMusic } from "@tabler/icons-react";
import type { SongResponse } from "../app/client/models/SongResponse";

interface GenerateSheetButtonProps {
  songs: SongResponse[];
  onGenerate: () => void;
  loading?: boolean;
  /** Optional status text shown below the button while loading (e.g. "This can take a while…") */
  loadingText?: string;
}

function getDisabledReason(songs: SongResponse[]): string | null {
  if (songs.length === 0) return "Add at least one song first";

  const pendingUploads = songs.filter((s) => s.uploadStatus !== "SUCCESS");
  if (pendingUploads.length > 0) return "Wait for all uploads to finish";

  const missingMeta = songs.filter((s) => !s.title?.trim() || !s.artist?.trim());
  if (missingMeta.length > 0) return "Set title and artist for every song";

  return null;
}

export function GenerateSheetButton({
  songs,
  onGenerate,
  loading = false,
  loadingText,
}: GenerateSheetButtonProps) {
  const disabledReason = getDisabledReason(songs);
  const isDisabled = disabledReason !== null;

  const button = (
    <Button
      size="lg"
      radius="xl"
      fullWidth
      disabled={isDisabled && !loading}
      loading={loading}
      onClick={onGenerate}
      leftSection={!loading ? <IconFileMusic size={20} /> : undefined}
      variant="gradient"
      gradient={{ from: "violet", to: "cyan", deg: 135 }}
      styles={{
        root: {
          height: 52,
          fontSize: 16,
          fontWeight: 600,
          letterSpacing: 0.3,
          transition: "transform 150ms ease, box-shadow 150ms ease",
          "&:not([disabled]):hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 20px rgba(99, 102, 241, 0.4)",
          },
          "&:not([disabled]):active": {
            transform: "translateY(0)",
          },
        },
      }}
    >
      "Generate Lead Sheet"
    </Button>
  );

  const wrappedButton =
    isDisabled && !loading ? (
      <Tooltip label={disabledReason} position="top" withArrow>
        <div>{button}</div>
      </Tooltip>
    ) : (
      button
    );

  return (
    <Stack gap={6} align="center">
      {wrappedButton}
      {loading && loadingText && (
        <Text size="xs" c="dimmed" ta="center">
          {loadingText}
        </Text>
      )}
    </Stack>
  );
}
