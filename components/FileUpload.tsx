"use client";

import { useCallback, useRef, useState } from "react";
import { Button, Group, Text, Stack } from "@mantine/core";
import { Dropzone, type FileWithPath } from "@mantine/dropzone";
import {
  IconCloudUpload,
  IconDownload,
  IconX,
} from "@tabler/icons-react";
import { FileList } from "./FileList";
import type { UploadedFile } from "./FileItem";

function createMockFile(name: string, sizeInBytes: number, type: string): File {
  const buffer = new ArrayBuffer(sizeInBytes);
  return new File([buffer], name, { type });
}

const MOCK_FILES: UploadedFile[] = [
  {
    id: "mock-1",
    file: createMockFile("Take Five.mp3", 8_432_000, "audio/mpeg"),
    progress: 100,
    status: "done",
  },
  {
    id: "mock-2",
    file: createMockFile("Autumn Leaves.wav", 42_100_000, "audio/wav"),
    progress: 100,
    status: "done",
  },
  {
    id: "mock-3",
    file: createMockFile("So What.flac", 31_750_000, "audio/flac"),
    progress: 62,
    status: "uploading",
  },
  {
    id: "mock-4",
    file: createMockFile("Blue in Green.m4a", 5_280_000, "audio/mp4"),
    progress: 100,
    status: "error",
  },
];

const ACCEPTED_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "audio/mp4",
  "audio/x-m4a",
];

/** Simulates upload progress for a single file. */
function simulateUpload(
  fileId: string,
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>,
  intervalsRef: React.MutableRefObject<Map<string, ReturnType<typeof setInterval>>>
) {
  const interval = setInterval(() => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id !== fileId) {
          return f;
        }
        const next = Math.min(f.progress + Math.random() * 18 + 6, 100);
        const done = next >= 100;
        if (done) {
          clearInterval(intervalsRef.current.get(fileId)!);
          intervalsRef.current.delete(fileId);
        }
        return {
          ...f,
          progress: done ? 100 : next,
          status: done ? "done" : "uploading",
        };
      })
    );
  }, 200);

  intervalsRef.current.set(fileId, interval);
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>(MOCK_FILES);
  const openRef = useRef<(() => void) | null>(null);
  const intervalsRef = useRef<Map<string, ReturnType<typeof setInterval>>>(
    new Map()
  );

  const handleDrop = useCallback(
    (droppedFiles: FileWithPath[]) => {
      const newFiles: UploadedFile[] = droppedFiles.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file,
        progress: 0,
        status: "uploading" as const,
      }));

      setFiles((prev) => [...prev, ...newFiles]);

      // Start simulated upload for each new file
      newFiles.forEach((f) =>
        simulateUpload(f.id, setFiles, intervalsRef)
      );
    },
    []
  );

  const handleRemove = useCallback((id: string) => {
    // Clear any running interval for this file
    const interval = intervalsRef.current.get(id);
    if (interval) {
      clearInterval(interval);
      intervalsRef.current.delete(id);
    }
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <Stack gap="xl">
      <div style={{ position: "relative" }}>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          accept={ACCEPTED_MIME_TYPES}
          maxSize={100 * 1024 * 1024}
          radius="md"
          aria-label="Drop audio files here"
        >
          <div style={{ pointerEvents: "none" }}>
            <Group justify="center">
              <Dropzone.Accept>
                <IconDownload
                  size={50}
                  color="var(--mantine-color-blue-6)"
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={50}
                  color="var(--mantine-color-red-6)"
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconCloudUpload
                  size={50}
                  color="var(--mantine-color-dimmed)"
                  stroke={1.5}
                />
              </Dropzone.Idle>
            </Group>

            <Text ta="center" fw={700} fz="lg" mt="xl">
              <Dropzone.Accept>Drop files here</Dropzone.Accept>
              <Dropzone.Reject>
                Unsupported file type or file too large
              </Dropzone.Reject>
              <Dropzone.Idle>Upload audio files</Dropzone.Idle>
            </Text>

            <Text ta="center" fz="sm" mt="xs" mb="lg" c="dimmed">
              Drag &amp; drop your audio files here. We accept{" "}
              <Text span fs="italic">
                .mp3
              </Text>
              ,{" "}
              <Text span fs="italic">
                .wav
              </Text>
              ,{" "}
              <Text span fs="italic">
                .flac
              </Text>
              , and{" "}
              <Text span fs="italic">
                .m4a
              </Text>{" "}
              files up to 100 MB.
            </Text>
          </div>
        </Dropzone>

        <Button
          size="md"
          radius="xl"
          onClick={() => openRef.current?.()}
          style={{
            position: "absolute",
            bottom: -20,
            left: "calc(50% - 65px)",
          }}
        >
          Select files
        </Button>
      </div>

      <FileList files={files} onRemove={handleRemove} />
    </Stack>
  );
}
