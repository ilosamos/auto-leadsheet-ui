"use client";

import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { IconFileTypeXml, IconFileTypePdf } from "@tabler/icons-react";
import { getSession } from "next-auth/react";
import { SongResponse } from "../app/client";
import { OpenAPI } from "../app/client/core/OpenAPI";
import { useJob } from "../providers/JobProvider";

interface ResultItemProps {
  song: SongResponse;
}

/**
 * Fetch an authenticated file from the API and trigger a browser download.
 */
async function downloadFile(url: string, filename: string) {
  const session = await getSession();
  const token = session?.idToken ?? "";

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Download failed: ${res.status} ${res.statusText}`);
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(objectUrl);
}

export function ResultItem({ song }: ResultItemProps) {
  const { currentJob } = useJob();
  const [downloading, setDownloading] = useState<"pdf" | "xml" | null>(null);

  const placeholderImageUrl = () => {
    const letter = song.title?.charAt(0).toUpperCase();
    return `https://placehold.co/72x72/1a1b1e/666?text=${letter}`
  }

  const handleDownload = useCallback(
    async (type: "pdf" | "xml") => {
      if (!currentJob) return;

      const ext = type === "pdf" ? "sheet.pdf" : "sheet.musicxml";
      const filename = `${song.title ?? song.songId}.${type === "pdf" ? "pdf" : "musicxml"}`;
      const url = `${OpenAPI.BASE}/jobs/${currentJob.jobId}/songs/${song.songId}/${ext}`;

      setDownloading(type);
      try {
        await downloadFile(url, filename);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(`Failed to download ${type}:`, err);
      } finally {
        setDownloading(null);
      }
    },
    [currentJob, song.songId, song.title],
  );

  return (
    <Paper withBorder p="sm" radius="md">
      <Group gap="md" align="flex-start" wrap="nowrap">
        {/* Preview thumbnail */}
        <Box
          style={{
            flexShrink: 0,
            width: 72,
            height: 72,
            borderRadius: "var(--mantine-radius-sm)",
            overflow: "hidden",
            background: "var(--mantine-color-dark-6)",
          }}
        >
          <Image
            src={
              song.preview
                ? `data:image/png;base64,${song.preview}`
                : undefined
            }
            alt={`${song.title} preview`}
            w={72}
            h={72}
            fit="cover"
            fallbackSrc={placeholderImageUrl()}
          />
        </Box>

        {/* Title, artist, and audio player */}
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <div>
            <Text size="sm" fw={600} lineClamp={1}>
              {song.title}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {song.artist}
            </Text>
          </div>

          {/* Native audio player */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            preload="none"
            src={undefined}
            style={{ width: "100%", height: 32 }}
          />
        </Stack>

        {/* Download buttons */}
        <Stack gap="xs" style={{ flexShrink: 0 }} justify="center">
          <Button
            variant="filled"
            size="xs"
            leftSection={<IconFileTypeXml size={16} />}
            loading={downloading === "xml"}
            onClick={() => handleDownload("xml")}
            justify="flex-start"
          >
            Download MusicXML
          </Button>
          <Button
            variant="filled"
            color="red"
            size="xs"
            leftSection={<IconFileTypePdf size={16} />}
            loading={downloading === "pdf"}
            onClick={() => handleDownload("pdf")}
            justify="flex-start"
          >
            Download PDF
          </Button>
        </Stack>
      </Group>
    </Paper>
  );
}
