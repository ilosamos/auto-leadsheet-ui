"use client";

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

export interface GeneratedResult {
  id: string;
  title: string;
  artist: string;
  previewUrl: string;
  audioSrc: string;
  xmlDownloadUrl: string;
  pdfDownloadUrl: string;
}

interface ResultItemProps {
  result: GeneratedResult;
}

export function ResultItem({ result }: ResultItemProps) {
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
            src={result.previewUrl}
            alt={`${result.title} preview`}
            w={72}
            h={72}
            fit="cover"
            fallbackSrc="https://placehold.co/72x72/1a1b1e/666?text=Sheet"
          />
        </Box>

        {/* Title, artist, and audio player */}
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <div>
            <Text size="sm" fw={600} lineClamp={1}>
              {result.title}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {result.artist}
            </Text>
          </div>

          {/* Native audio player */}
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio
            controls
            preload="none"
            src={result.audioSrc}
            style={{ width: "100%", height: 32 }}
          />
        </Stack>

        {/* Download buttons */}
        <Stack gap="xs" style={{ flexShrink: 0 }} justify="center">
          <Button
            variant="light"
            size="xs"
            leftSection={<IconFileTypeXml size={16} />}
            component="a"
            href={result.xmlDownloadUrl}
            download
          >
            MusicXML
          </Button>
          <Button
            variant="light"
            size="xs"
            leftSection={<IconFileTypePdf size={16} />}
            component="a"
            href={result.pdfDownloadUrl}
            download
          >
            PDF
          </Button>
        </Stack>
      </Group>
    </Paper>
  );
}
