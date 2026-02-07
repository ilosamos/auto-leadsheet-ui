/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobStatusEnum } from './JobStatusEnum';
/**
 * Response model for a job.
 */
export type JobResponse = {
    job_id: string;
    created_at: string;
    updated_at: string;
    status: JobStatusEnum;
    allin1_execution?: (string | null);
    chord_execution?: (string | null);
};

