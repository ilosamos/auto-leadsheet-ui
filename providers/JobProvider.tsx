"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { JobResponse } from "../app/client/models/JobResponse";
import type { SongResponse } from "../app/client/models/SongResponse";
import type { CreateSongRequest } from "../app/client/models/CreateSongRequest";
import type { UpdateSongRequest } from "../app/client/models/UpdateSongRequest";
import type { UploadStatusEnum } from "../app/client/models/UploadStatusEnum";
import { JobsService } from "../app/client/services/JobsService";
import { SongsService } from "../app/client/services/SongsService";
import { api } from "../app/client/api";

const CURRENT_JOB_KEY = "auto-leadsheet:currentJobId";

// ---------------------------------------------------------------------------
// Context value type
// ---------------------------------------------------------------------------

interface JobContextValue {
  // Current active job (persisted to localStorage)
  currentJob: JobResponse | null;
  currentJobSongs: SongResponse[];

  // Job history (in-memory, resets on refresh)
  jobHistory: JobResponse[];

  // Loading flags
  isLoadingJob: boolean;
  isLoadingSongs: boolean;

  // Actions
  createJob: () => Promise<void>;
  setCurrentJob: (jobId: string) => Promise<void>;
  refreshCurrentJob: () => Promise<void>;
  fetchSongs: () => Promise<void>;
  addSong: (request: CreateSongRequest) => Promise<SongResponse | null>;
  removeSong: (songId: string) => Promise<boolean>;
  updateSong: (songId: string, request: UpdateSongRequest) => Promise<SongResponse | null>;
  patchSongLocally: (songId: string, patch: Partial<SongResponse>) => void;
  updateSongUploadStatus: (songId: string, uploadStatus: UploadStatusEnum) => Promise<SongResponse | null>;
  triggerAllin1: () => Promise<void>;
  triggerChord: () => Promise<void>;
  clearCurrentJob: () => void;
}

const JobContext = createContext<JobContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function JobProvider({ children }: { children: React.ReactNode }) {
  const [currentJob, setCurrentJobState] = useState<JobResponse | null>(null);
  const [currentJobSongs, setCurrentJobSongs] = useState<SongResponse[]>([]);
  const [jobHistory, setJobHistory] = useState<JobResponse[]>([]);
  const [isLoadingJob, setIsLoadingJob] = useState(false);
  const [isLoadingSongs, setIsLoadingSongs] = useState(false);

  // ---- internal helpers ---------------------------------------------------

  const fetchJobAndSongs = useCallback(async (jobId: string) => {
    setIsLoadingJob(true);
    setIsLoadingSongs(true);

    const [jobResult, songsResult] = await Promise.all([
      api(JobsService.getJobDetailsJobsJobIdGet({ jobId })),
      api(SongsService.listSongsJobsJobIdSongsGet({ jobId })),
    ]);

    if (jobResult.error) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch job:", jobResult.error);
      setIsLoadingJob(false);
      setIsLoadingSongs(false);
      return;
    }

    setCurrentJobState(jobResult.data);
    setIsLoadingJob(false);

    if (songsResult.error) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch songs:", songsResult.error);
    } else {
      setCurrentJobSongs(songsResult.data.songs);
    }
    setIsLoadingSongs(false);
  }, []);

  // ---- restore persisted job on mount -------------------------------------

  useEffect(() => {
    const persistedJobId = localStorage.getItem(CURRENT_JOB_KEY);
    if (persistedJobId) {
      fetchJobAndSongs(persistedJobId);
    }
  }, [fetchJobAndSongs]);

  // ---- actions ------------------------------------------------------------

  const createJob = useCallback(async () => {
    setIsLoadingJob(true);
    const { data, error } = await api(
      JobsService.createNewJobJobsPost(),
    );

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to create job:", error);
      setIsLoadingJob(false);
      return;
    }

    setCurrentJobState(data);
    setCurrentJobSongs([]);
    setJobHistory((prev) => [data, ...prev]);
    localStorage.setItem(CURRENT_JOB_KEY, data.jobId);
    setIsLoadingJob(false);
  }, []);

  const setCurrentJob = useCallback(
    async (jobId: string) => {
      localStorage.setItem(CURRENT_JOB_KEY, jobId);
      await fetchJobAndSongs(jobId);
    },
    [fetchJobAndSongs],
  );

  const refreshCurrentJob = useCallback(async () => {
    if (!currentJob) return;
    await fetchJobAndSongs(currentJob.jobId);
  }, [currentJob, fetchJobAndSongs]);

  const fetchSongs = useCallback(async () => {
    if (!currentJob) return;
    setIsLoadingSongs(true);

    const { data, error } = await api(
      SongsService.listSongsJobsJobIdSongsGet({ jobId: currentJob.jobId }),
    );

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to fetch songs:", error);
    } else {
      setCurrentJobSongs(data.songs);
    }
    setIsLoadingSongs(false);
  }, [currentJob]);

  const addSong = useCallback(
    async (request: CreateSongRequest): Promise<SongResponse | null> => {
      if (!currentJob) return null;

      const { data, error } = await api(
        SongsService.createNewSongJobsJobIdSongsPost({
          jobId: currentJob.jobId,
          requestBody: request,
        }),
      );

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to add song:", error);
        return null;
      }

      setCurrentJobSongs((prev) => [...prev, data]);
      return data;
    },
    [currentJob],
  );

  const removeSong = useCallback(
    async (songId: string): Promise<boolean> => {
      if (!currentJob) return false;

      const { error } = await api(
        SongsService.deleteSongEndpointJobsJobIdSongsSongIdDelete({
          jobId: currentJob.jobId,
          songId,
        }),
      );

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to remove song:", error);
        return false;
      }

      setCurrentJobSongs((prev) => prev.filter((s) => s.songId !== songId));
      return true;
    },
    [currentJob],
  );

  const updateSong = useCallback(
    async (songId: string, request: UpdateSongRequest): Promise<SongResponse | null> => {
      if (!currentJob) return null;

      const { data, error } = await api(
        SongsService.updateSongEndpointJobsJobIdSongsSongIdPatch({
          jobId: currentJob.jobId,
          songId,
          requestBody: request,
        }),
      );

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to update song:", error);
        return null;
      }

      setCurrentJobSongs((prev) =>
        prev.map((s) => (s.songId === songId ? data : s)),
      );
      return data;
    },
    [currentJob],
  );

  const patchSongLocally = useCallback(
    (songId: string, patch: Partial<SongResponse>) => {
      setCurrentJobSongs((prev) =>
        prev.map((s) => (s.songId === songId ? { ...s, ...patch } : s)),
      );
    },
    [],
  );

  const updateSongUploadStatus = useCallback(
    async (songId: string, uploadStatus: UploadStatusEnum): Promise<SongResponse | null> => {
      if (!currentJob) return null;

      const { data, error } = await api(
        SongsService.updateUploadStatusJobsJobIdSongsSongIdUploadStatusPatch({
          jobId: currentJob.jobId,
          songId,
          requestBody: { uploadStatus },
        }),
      );

      if (error) {
        // eslint-disable-next-line no-console
        console.error("Failed to update upload status:", error);
        return null;
      }

      // Replace the song in context with the updated version from the server
      setCurrentJobSongs((prev) =>
        prev.map((s) => (s.songId === songId ? data : s)),
      );
      return data;
    },
    [currentJob],
  );

  const triggerAllin1 = useCallback(async () => {
    if (!currentJob) return;

    const { error } = await api(
      JobsService.triggerAllin1JobJobsJobIdRunAllin1Post({
        jobId: currentJob.jobId,
      }),
    );

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to trigger allin1:", error);
    }
  }, [currentJob]);

  const triggerChord = useCallback(async () => {
    if (!currentJob) return;

    const { error } = await api(
      JobsService.triggerChordJobJobsJobIdRunChordPost({
        jobId: currentJob.jobId,
      }),
    );

    if (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to trigger chord:", error);
    }
  }, [currentJob]);

  const clearCurrentJob = useCallback(() => {
    setCurrentJobState(null);
    setCurrentJobSongs([]);
    localStorage.removeItem(CURRENT_JOB_KEY);
  }, []);

  // ---- context value ------------------------------------------------------

  const value: JobContextValue = {
    currentJob,
    currentJobSongs,
    jobHistory,
    isLoadingJob,
    isLoadingSongs,
    createJob,
    setCurrentJob,
    refreshCurrentJob,
    fetchSongs,
    addSong,
    removeSong,
    updateSong,
    patchSongLocally,
    updateSongUploadStatus,
    triggerAllin1,
    triggerChord,
    clearCurrentJob,
  };

  return <JobContext.Provider value={value}>{children}</JobContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useJob(): JobContextValue {
  const ctx = useContext(JobContext);
  if (!ctx) {
    throw new Error("useJob must be used within a <JobProvider>");
  }
  return ctx;
}
