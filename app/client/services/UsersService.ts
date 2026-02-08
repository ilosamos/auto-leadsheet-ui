/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateUserRequest } from '../models/CreateUserRequest';
import type { SongsListByMemberResponse } from '../models/SongsListByMemberResponse';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Create User
     * Create a new user or return the existing one.
     *
     * If a user with the given ID already exists, the existing user is
     * returned without modification.
     * @returns UserResponse Successful Response
     * @throws ApiError
     */
    public static createUserUsersPost({
        requestBody,
    }: {
        requestBody: CreateUserRequest,
    }): CancelablePromise<UserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * List My Songs
     * List songs the authenticated user is a member of, newest first.
     *
     * Uses a Firestore collection group query ordered by creation date.
     * Pagination is cursor-based: pass ``nextCursor`` from the previous response as ``cursor``.
     * @returns SongsListByMemberResponse Successful Response
     * @throws ApiError
     */
    public static listMySongsUsersMeSongsGet({
        limit = 50,
        cursor,
    }: {
        /**
         * Page size
         */
        limit?: number,
        /**
         * Pagination cursor from previous response
         */
        cursor?: (string | null),
    }): CancelablePromise<SongsListByMemberResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/users/me/songs',
            query: {
                'limit': limit,
                'cursor': cursor,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
