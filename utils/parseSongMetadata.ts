"use client";

import type { FileWithPath } from "@mantine/dropzone";

/** Map MIME type to the fileType the API expects. */
function mimeToFileType(mime: string): string {
  const map: Record<string, string> = {
    "audio/mpeg": "mp3",
    "audio/wav": "wav",
    "audio/x-wav": "wav",
    "audio/flac": "flac",
    "audio/mp4": "m4a",
    "audio/x-m4a": "m4a",
  };
  return map[mime] ?? "mp3";
}

export function parseSongMetadata(file: FileWithPath): {
  title: string;
  artist?: string;
  originalName: string;
  fileType: string;
} {
  const fileType = mimeToFileType(file.type);
  const originalName = file.name;
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const dashIndex = baseName.indexOf("-");
  let title: string;
  let artist: string | undefined;
  if (dashIndex !== -1) {
    title = baseName.slice(0, dashIndex).trim().slice(0, 50);
    artist = baseName.slice(dashIndex + 1).trim().slice(0, 50) || undefined;
  } else {
    title = baseName.trim().slice(0, 50);
  }
  return { title, artist, originalName, fileType };
}
