/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateSongRequest } from '../models/CreateSongRequest';
import type { SongResponse } from '../models/SongResponse';
import type { SongsListResponse } from '../models/SongsListResponse';
import type { SongStatusResponse } from '../models/SongStatusResponse';
import type { UpdateSongRequest } from '../models/UpdateSongRequest';
import type { UpdateUploadStatusRequest } from '../models/UpdateUploadStatusRequest';
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
        songId,
        jobId,
    }: {
        songId: string,
        jobId: string,
    }): CancelablePromise<SongResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs/{song_id}',
            path: {
                'song_id': songId,
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Song Endpoint
     * Delete a song and all its associated files from GCS.
     *
     * Removes the song document from Firestore and deletes the song
     * directory under both the input and output bucket prefixes.
     * @returns void
     * @throws ApiError
     */
    public static deleteSongEndpointJobsJobIdSongsSongIdDelete({
        jobId,
        songId,
    }: {
        jobId: string,
        songId: string,
    }): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
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
     * Update Song Endpoint
     * Update song metadata.
     *
     * Only the fields provided in the request body will be updated.
     * Omitted (null) fields are left unchanged.
     * @returns SongResponse Successful Response
     * @throws ApiError
     */
    public static updateSongEndpointJobsJobIdSongsSongIdPatch({
        jobId,
        songId,
        requestBody,
    }: {
        jobId: string,
        songId: string,
        requestBody: UpdateSongRequest,
    }): CancelablePromise<SongResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/jobs/{job_id}/songs/{song_id}',
            path: {
                'job_id': jobId,
                'song_id': songId,
            },
            body: requestBody,
            mediaType: 'application/json',
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
        songId,
        jobId,
    }: {
        songId: string,
        jobId: string,
    }): CancelablePromise<SongStatusResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs/{song_id}/status',
            path: {
                'song_id': songId,
                'job_id': jobId,
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
        songId,
        jobId,
    }: {
        songId: string,
        jobId: string,
    }): CancelablePromise<UploadUrlResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs/{song_id}/upload-url',
            path: {
                'song_id': songId,
                'job_id': jobId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Upload Status
     * Update the upload status of a song.
     *
     * Called by the client after a file upload completes (or fails) via the
     * signed URL so the backend can track progress.
     * @returns SongResponse Successful Response
     * @throws ApiError
     */
    public static updateUploadStatusJobsJobIdSongsSongIdUploadStatusPatch({
        jobId,
        songId,
        requestBody,
    }: {
        jobId: string,
        songId: string,
        requestBody: UpdateUploadStatusRequest,
    }): CancelablePromise<SongResponse> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/jobs/{job_id}/songs/{song_id}/upload-status',
            path: {
                'job_id': jobId,
                'song_id': songId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get Song Musicxml
     * Get the MusicXML lead sheet for a song.
     *
     * Generates the file on the first request and caches it in GCS for
     * subsequent requests.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSongMusicxmlJobsJobIdSongsSongIdSheetMusicxmlGet({
        jobId,
        songId,
    }: {
        jobId: string,
        songId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs/{song_id}/sheet.musicxml',
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
     * Get Song Pdf
     * Get the PDF lead sheet for a song.
     *
     * Generates the file on the first request and caches it in GCS for
     * subsequent requests.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getSongPdfJobsJobIdSongsSongIdSheetPdfGet({
        jobId,
        songId,
    }: {
        jobId: string,
        songId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/jobs/{job_id}/songs/{song_id}/sheet.pdf',
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
