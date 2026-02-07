/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSongRequest } from '../models/CreateSongRequest';
import type { SongResponse } from '../models/SongResponse';
import type { SongsListResponse } from '../models/SongsListResponse';
import type { SongStatusResponse } from '../models/SongStatusResponse';
import type { UploadUrlResponse } from '../models/UploadUrlResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SongsService {
    /**
     * List Songs
     * List all songs in a job.
     * @returns SongsListResponse Successful Response
     * @throws ApiError
     */
    public static listSongsJobsJobIdSongsGet({
        jobId,
    }: {
        jobId: string,
    }): CancelablePromise<SongsListResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs',
            path: {
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Create New Song
     * Create a new song in a job.
     * @returns SongResponse Successful Response
     * @throws ApiError
     */
    public static createNewSongJobsJobIdSongsPost({
        jobId,
        requestBody,
    }: {
        jobId: string,
        requestBody: CreateSongRequest,
    }): CancelablePromise<SongResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/jobs/{job_id}/songs',
            path: {
                'job_id': jobId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Song Details
     * Get song details by ID.
     * @returns SongResponse Successful Response
     * @throws ApiError
     */
    public static getSongDetailsJobsJobIdSongsSongIdGet({
        jobId,
        songId,
    }: {
        jobId: string,
        songId: string,
    }): CancelablePromise<SongResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs/{song_id}',
            path: {
                'job_id': jobId,
                'song_id': songId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Song Status
     * Get song status by ID.
     * @returns SongStatusResponse Successful Response
     * @throws ApiError
     */
    public static getSongStatusJobsJobIdSongsSongIdStatusGet({
        jobId,
        songId,
    }: {
        jobId: string,
        songId: string,
    }): CancelablePromise<SongStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs/{song_id}/status',
            path: {
                'job_id': jobId,
                'song_id': songId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Upload Url
     * Get a signed URL for uploading audio to this song.
     *
     * The signed URL is valid for 15 minutes and should be used with a PUT request.
     * @returns UploadUrlResponse Successful Response
     * @throws ApiError
     */
    public static getUploadUrlJobsJobIdSongsSongIdUploadUrlGet({
        jobId,
        songId,
    }: {
        jobId: string,
        songId: string,
    }): CancelablePromise<UploadUrlResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs/{song_id}/upload-url',
            path: {
                'job_id': jobId,
                'song_id': songId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
