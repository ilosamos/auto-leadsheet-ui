/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobStatusEnum } from './JobStatusEnum';
import type { UploadStatusEnum } from './UploadStatusEnum';
/**
 * Response model for a song.
 */
export type SongResponse = {
    jobId?: (string | null);
    songId: string;
    uploadStatus: UploadStatusEnum;
    chordStatus: JobStatusEnum;
    allin1Status: JobStatusEnum;
    createdAt?: (string | null);
    title?: (string | null);
    artist?: (string | null);
    size?: (number | null);
    length?: (number | null);
    originalName?: (string | null);
    preview?: (string | null);
};

