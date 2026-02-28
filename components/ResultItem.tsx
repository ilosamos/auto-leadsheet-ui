"use client";

import { useCallback, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Group,
  Image,
  Paper,
  Stack,
  Switch,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconChecks,
  IconFileTypePdf,
  IconFileTypeXml,
  IconMusic,
} from "@tabler/icons-react";
import { getSession } from "next-auth/react";
import { SongResponse } from "../app/client";
import { OpenAPI } from "../app/client/core/OpenAPI";
import { useJob } from "../providers/JobProvider";
import { notifications } from "@mantine/notifications";
import { SMALL_SCREEN_QUERY } from "../utils/breakpoints";

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
  const [includeGuitarTabs, setIncludeGuitarTabs] = useState(false);
  const isSmallScreen = useMediaQuery(SMALL_SCREEN_QUERY);
  const jobId = song.jobId ?? currentJob?.jobId ?? null;

  const placeholderImageUrl = () => {
    const letter = song.title?.charAt(0).toUpperCase();
    return `https://placehold.co/72x72/1a1b1e/666?text=${letter}`;
  };

  const handleDownload = useCallback(
    async (type: "pdf" | "xml") => {
      if (!jobId) { return; }

      const ext = type === "pdf" ? "sheet.pdf" : "sheet.musicxml";
      const baseName = `${song.title ?? song.songId}${includeGuitarTabs ? "-with-tabs" : ""}`;
      const filename = `${baseName}.${type === "pdf" ? "pdf" : "musicxml"}`;
      const params = new URLSearchParams();
      if (includeGuitarTabs) {
        params.set("guitar_tabs", "true");
      }
      const query = params.toString();
      const url = `${OpenAPI.BASE}/jobs/${jobId}/songs/${song.songId}/${ext}${query ? `?${query}` : ""}`;

      setDownloading(type);
      try {
        await downloadFile(url, filename);
      } catch (err) {
        notifications.show({
          title: "Error",
          message: "Failed to download file. File may be not convertible to MusicXML or PDF.",
          color: "red",
        });
      } finally {
        setDownloading(null);
      }
    },
    [includeGuitarTabs, jobId, song.songId, song.title],
  );

  return (
    <Paper
      withBorder
      p="sm"
      radius="md"
      bg="dark.7"
      style={{
        borderColor: "var(--mantine-color-dark-5)",
      }}
    >
      <Group
        gap="md"
        align="flex-start"
        wrap={isSmallScreen ? "wrap" : "nowrap"}
        style={{ width: "100%", minWidth: 0 }}
      >
        {/* Preview thumbnail */}
        <Box
          style={{
            flexShrink: 0,
            width: 72,
            height: 72,
            borderRadius: "var(--mantine-radius-md)",
            overflow: "hidden",
            background: "var(--mantine-color-dark-8)",
            border: "1px solid var(--mantine-color-dark-5)",
            boxShadow: "0 4px 14px rgba(0, 0, 0, 0.25)",
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
          <div style={{ minWidth: 0 }}>
            <Group gap="xs" wrap="nowrap">
              <ThemeIcon
                variant="light"
                color="blue"
                size={20}
                radius="xl"
                style={{ flexShrink: 0 }}
              >
                <IconMusic size={12} />
              </ThemeIcon>
              <Text size="sm" fw={700} lineClamp={1}>
                {song.title}
              </Text>
            </Group>
            <Text size="xs" c="dimmed" lineClamp={1} mt={2}>
              {song.artist}
            </Text>
          </div>
          <Group gap="xs">
            <Badge
              size="xs"
              variant="light"
              color="teal"
              leftSection={<IconChecks size={10} />}
            >
              Ready to export
            </Badge>
            <Text size="xs" c="dimmed">
              MusicXML + PDF
            </Text>
          </Group>
        </Stack>

        {/* Download buttons */}
        <Stack
          gap="xs"
          style={{
            flexShrink: 0,
            width: isSmallScreen ? "100%" : "auto",
          }}
          justify="center"
        >
          <Button
            variant="light"
            color="blue"
            size="xs"
            leftSection={<IconFileTypeXml size={16} />}
            loading={downloading === "xml"}
            onClick={() => handleDownload("xml")}
            justify="flex-start"
            fullWidth={isSmallScreen}
            radius="md"
          >
            Download MusicXML
          </Button>
          <Button
            variant="light"
            color="gray"
            size="xs"
            leftSection={<IconFileTypePdf size={16} />}
            loading={downloading === "pdf"}
            onClick={() => handleDownload("pdf")}
            justify="flex-start"
            fullWidth={isSmallScreen}
            radius="md"
          >
            Download PDF
          </Button>
          <Switch
            size="xs"
            checked={includeGuitarTabs}
            onChange={(event) => setIncludeGuitarTabs(event.currentTarget.checked)}
            label="Include guitar tabs"
            styles={{ label: { fontSize: "12px", color: "var(--mantine-color-dimmed)" } }}
          />
        </Stack>
      </Group>
    </Paper>
  );
}
