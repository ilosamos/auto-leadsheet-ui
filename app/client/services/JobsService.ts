/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelJobResponse } from '../models/CancelJobResponse';
import type { JobResponse } from '../models/JobResponse';
import type { JobStatusResponse } from '../models/JobStatusResponse';
import type { RunJobsResponse } from '../models/RunJobsResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class JobsService {
    /**
     * Create New Job
     * Create a new job.
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static createNewJobJobsPost(): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jobs',
        });
    }
    /**
     * Get Job Details
     * Get job details by ID.
     * @returns JobResponse Successful Response
     * @throws ApiError
     */
    public static getJobDetailsJobsJobIdGet({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<JobResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Job Status
     * Get job status by ID.
     * @returns JobStatusResponse Successful Response
     * @throws ApiError
     */
    public static getJobStatusJobsJobIdStatusGet({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<JobStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/status',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Trigger All Jobs
     * Trigger both allin1 and chord analysis Cloud Run jobs.
     * @returns RunJobsResponse Successful Response
     * @throws ApiError
     */
    public static triggerAllJobsJobsJobIdRunPost({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<RunJobsResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jobs/{job_id}/run',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Cancel Job Executions
     * Cancel all running Cloud Run job executions for this job.
     *
     * Uses execution IDs from allin1_execution and chord_execution. Executions that
     * are already finished or not found are skipped. Resets allin1 and chord status
     * of all songs in the job to PENDING.
     * @returns CancelJobResponse Successful Response
     * @throws ApiError
     */
    public static cancelJobExecutionsJobsJobIdCancelPost({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<CancelJobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jobs/{job_id}/cancel',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
