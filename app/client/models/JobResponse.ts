/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobStatusEnum } from './JobStatusEnum';
/**
 * Response model for a job.
 */
export type JobResponse = {
    jobId: string;
    createdAt: string;
    updatedAt: string;
    status: JobStatusEnum;
    allin1Execution?: (string | null);
    chordExecution?: (string | null);
};

