"use client";

import { useCallback, useRef, useState } from "react";
import { Button, Group, Text, Stack } from "@mantine/core";
import { Dropzone, type FileWithPath } from "@mantine/dropzone";
import {
  IconCloudUpload,
  IconDownload,
  IconX,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { FileList } from "./FileList";
import type { UploadProgress } from "./FileItem";
import { useJob } from "../providers/JobProvider";
import { SongsService } from "../app/client/services/SongsService";
import { api } from "../app/client/api";
import type { UpdateSongRequest } from "../app/client/models/UpdateSongRequest";

const ACCEPTED_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "audio/mp4",
  "audio/x-m4a",
];

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

/** Upload a file to a signed URL with progress tracking via XMLHttpRequest. */
function uploadToSignedUrl(
  file: File,
  signedUrl: string,
  contentType: string,
  onProgress: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", contentType);

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress((e.loaded / e.total) * 100);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
      }
    });

    xhr.addEventListener("error", () => reject(new Error("Upload network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.send(file);
  });
}

export function FileUpload() {
  const openRef = useRef<(() => void) | null>(null);
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(
    () => new Map(),
  );
  const [isUploading, setIsUploading] = useState(false);
  const activeUploadsRef = useRef(0);
  const { currentJob, currentJobSongs, addSong, removeSong, updateSong, patchSongLocally, updateSongUploadStatus } = useJob();

  const updateUpload = useCallback(
    (songId: string, patch: Partial<UploadProgress>) =>
      setUploads((prev) => {
        const next = new Map(prev);
        const current = next.get(songId) ?? { progress: 0, status: "uploading" as const };
        next.set(songId, { ...current, ...patch });
        return next;
      }),
    [],
  );

  const finishOneUpload = useCallback(() => {
    activeUploadsRef.current -= 1;
    if (activeUploadsRef.current <= 0) {
      activeUploadsRef.current = 0;
      setIsUploading(false);
    }
  }, []);

  const uploadFile = useCallback(
    async (file: FileWithPath) => {
      const jobId = currentJob?.jobId;
      if (!jobId) {
        finishOneUpload();
        return;
      }

      // 1. Create a song record via the provider (updates currentJobSongs)
      const fileType = mimeToFileType(file.type);
      const title = file.name.replace(/\.[^.]+$/, "");
      const song = await addSong({ title, fileType });
      if (!song) {
        finishOneUpload();
        return;
      }

      const songId = song.songId;
      updateUpload(songId, { progress: 0, status: "uploading" });

      try {
        // 2. Get the signed upload URL
        const urlResult = await api(
          SongsService.getUploadUrlJobsJobIdSongsSongIdUploadUrlGet({
            jobId,
            songId,
          }),
        );
        if (urlResult.error) {
          updateUpload(songId, { status: "error", progress: 100 });
          await updateSongUploadStatus(songId, "ERROR");
          return;
        }

        const { uploadUrl, contentType } = urlResult.data;

        // 3. PUT the file to the signed URL
        await uploadToSignedUrl(file, uploadUrl, contentType, (progress) => {
          updateUpload(songId, { progress });
        });

        updateUpload(songId, { progress: 100, status: "done" });

        // 4. Notify the backend that upload succeeded
        await updateSongUploadStatus(songId, "SUCCESS");
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Upload failed:", err);
        updateUpload(songId, { status: "error", progress: 100 });

        // Notify the backend that upload failed
        await updateSongUploadStatus(songId, "ERROR");
      } finally {
        finishOneUpload();
      }
    },
    [currentJob, addSong, updateUpload, updateSongUploadStatus, finishOneUpload],
  );

  const handleDrop = useCallback(
    (droppedFiles: FileWithPath[]) => {
      if (!currentJob?.jobId) {
        // eslint-disable-next-line no-console
        console.error("No active job; create a new session first.");
        return;
      }

      // Set uploading state immediately before any async work
      activeUploadsRef.current += droppedFiles.length;
      setIsUploading(true);

      // Start real uploads in parallel
      droppedFiles.forEach((file) => {
        uploadFile(file);
      });
    },
    [currentJob, uploadFile],
  );

  const handleRemoveSong = useCallback(
    async (songId: string) => {
      const success = await removeSong(songId);

      if (success) {
        // Clean up local upload progress
        setUploads((prev) => {
          const next = new Map(prev);
          next.delete(songId);
          return next;
        });
      } else {
        notifications.show({
          title: "Failed to remove song",
          message: "Something went wrong while deleting the song. Please try again.",
          color: "red",
        });
      }
    },
    [removeSong],
  );

  const handleUpdateSong = useCallback(
    async (songId: string, request: UpdateSongRequest) => {
      // Find the current song to save its state for rollback
      const previousSong = currentJobSongs.find((s) => s.songId === songId);

      // Optimistically update the UI
      patchSongLocally(songId, request);

      const updated = await updateSong(songId, request);
      if (!updated && previousSong) {
        // Rollback to the previous values
        patchSongLocally(songId, {
          title: previousSong.title,
          artist: previousSong.artist,
        });
        notifications.show({
          title: "Failed to update song",
          message: "Something went wrong while saving changes. Please try again.",
          color: "red",
        });
      }
    },
    [currentJobSongs, updateSong, patchSongLocally],
  );

  return (
    <Stack gap="xl">
      <div style={{ position: "relative" }}>
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          accept={ACCEPTED_MIME_TYPES}
          maxSize={100 * 1024 * 1024}
          radius="md"
          disabled={isUploading}
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
          loading={isUploading}
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

      <FileList songs={currentJobSongs} uploads={uploads} onRemove={handleRemoveSong} onUpdate={handleUpdateSong} />
    </Stack>
  );
}
