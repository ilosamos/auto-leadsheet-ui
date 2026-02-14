"use client";

import { useCallback, useRef, useState } from "react";
import { Alert, Button, Group, Text, Stack } from "@mantine/core";
import { Dropzone, type FileWithPath } from "@mantine/dropzone";
import {
  IconInfoCircle,
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
import { uploadToSignedUrl } from "../utils/uploadToSignedUrl";
import { parseSongMetadata } from "../utils/parseSongMetadata";

const ACCEPTED_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/flac",
  "audio/mp4",
  "audio/x-m4a",
];

interface FileUploadProps {
  enabled?: boolean;
  allDone?: boolean;
  isAuthenticated?: boolean;
  onRequireAuth?: () => void;
}

export function FileUpload({
  enabled = true,
  allDone = false,
  isAuthenticated = true,
  onRequireAuth,
}: FileUploadProps) {
  const openRef = useRef<(() => void) | null>(null);
  const [uploads, setUploads] = useState<Map<string, UploadProgress>>(
    () => new Map(),
  );
  const [isUploading, setIsUploading] = useState(false);
  const activeUploadsRef = useRef(0);
  const { currentJob, currentJobSongs, addSong, removeSong, updateSong, patchSongLocally, updateSongUploadStatus, createJob } = useJob();

  const ensureJobId = useCallback(async (): Promise<string | null> => {
    if (currentJob?.jobId) {
      return currentJob.jobId;
    }
    if (!isAuthenticated) {
      onRequireAuth?.();
      return null;
    }
    const job = await createJob();
    if (!job) {
      notifications.show({
        title: "Could not create session",
        message: "Please try again or sign in again.",
        color: "red",
      });
      return null;
    }
    return job.jobId;
  }, [currentJob?.jobId, isAuthenticated, onRequireAuth, createJob]);

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
    async (file: FileWithPath, jobIdOverride?: string) => {
      const jobId = jobIdOverride ?? currentJob?.jobId;
      if (!jobId) {
        finishOneUpload();
        return;
      }

      // 1. Create a song record via the provider (updates currentJobSongs)
      const { title, artist, originalName, fileType } = parseSongMetadata(file);
      const { song, error } = await addSong(
        { title, artist, originalName, fileType, size: file.size },
        jobId,
      );
      if (error) {
        finishOneUpload();
        notifications.show({
          title: "Failed to upload song",
          message: error.body.detail,
          color: "red",
        });
        return;
      }

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
          await updateSongUploadStatus(songId, "ERROR", jobId);
          return;
        }

        const { uploadUrl, contentType } = urlResult.data;

        // 3. PUT the file to the signed URL
        await uploadToSignedUrl(file, uploadUrl, contentType, (progress) => {
          updateUpload(songId, { progress });
        });

        updateUpload(songId, { progress: 100, status: "done" });

        // 4. Notify the backend that upload succeeded
        await updateSongUploadStatus(songId, "SUCCESS", jobId);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Upload failed:", err);
        updateUpload(songId, { status: "error", progress: 100 });

        // Notify the backend that upload failed
        await updateSongUploadStatus(songId, "ERROR", jobId);
      } finally {
        finishOneUpload();
      }
    },
    [currentJob, addSong, updateUpload, updateSongUploadStatus, finishOneUpload],
  );

  const beginUploads = useCallback(
    (files: FileWithPath[], jobId: string) => {
      // Set uploading state immediately before starting uploads
      activeUploadsRef.current += files.length;
      setIsUploading(true);

      // Start real uploads in parallel (pass jobId so uploads work before state has updated)
      files.forEach((file) => {
        uploadFile(file, jobId);
      });
    },
    [uploadFile],
  );

  const startUploads = useCallback(
    async (files: FileWithPath[]) => {
      if (files.length === 0) { return; }
      const jobId = await ensureJobId();
      if (!jobId) { return; }

      beginUploads(files, jobId);
    },
    [beginUploads, ensureJobId],
  );

  const handleDrop = useCallback(
    async (droppedFiles: FileWithPath[]) => {
      if (!isAuthenticated) {
        onRequireAuth?.();
        return;
      }

      await startUploads(droppedFiles);
    },
    [isAuthenticated, onRequireAuth, startUploads],
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
    <Stack gap="0">
      <div
        style={{
          position: "relative",
          maxHeight: enabled ? 500 : 0,
          overflow: "hidden",
          opacity: enabled ? 1 : 0,
          transform: enabled ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "top",
          transition: "max-height 0.3s ease, opacity 0.25s ease, transform 0.25s ease, margin-bottom 0.3s ease, padding-bottom 0.3s ease",
          paddingBottom: enabled ? 20 : 0,
          marginBottom: enabled ? 20 : 0
        }}
      >
        <Dropzone
          openRef={openRef}
          onDrop={handleDrop}
          accept={ACCEPTED_MIME_TYPES}
          maxSize={100 * 1024 * 1024}
          radius="md"
          disabled={isUploading || !enabled}
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
            bottom: 0,
            left: "calc(50% - 65px)",
          }}
        >
          Select files
        </Button>
      </div>

      <FileList 
        songs={currentJobSongs} 
        uploads={uploads} 
        onRemove={handleRemoveSong}
        isAccordionOpen={!allDone} 
        onUpdate={handleUpdateSong} 
      />

      {currentJobSongs.length > 0 &&
        currentJobSongs.some((s) => !s.title?.trim() || !s.artist?.trim()) && (
          <Alert
            variant="light"
            color="yellow"
            radius="md"
            icon={<IconInfoCircle size={18} />}
            mt="md"
          >
            Please set a title and artist for every song before generating.
          </Alert>
        )}
    </Stack>
  );
}
