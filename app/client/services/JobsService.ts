/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobResponse } from '../models/JobResponse';
import type { JobStatusResponse } from '../models/JobStatusResponse';
import type { RunJobResponse } from '../models/RunJobResponse';
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
     * Trigger Allin1 Job
     * Trigger the allin1 analysis Cloud Run job. Returns immediately without waiting.
     * @returns RunJobResponse Successful Response
     * @throws ApiError
     */
    public static triggerAllin1JobJobsJobIdRunAllin1Post({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<RunJobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jobs/{job_id}/run-allin1',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Trigger Chord Job
     * Trigger the chord analysis Cloud Run job. Returns immediately without waiting.
     * @returns RunJobResponse Successful Response
     * @throws ApiError
     */
    public static triggerChordJobJobsJobIdRunChordPost({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<RunJobResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jobs/{job_id}/run-chord',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
