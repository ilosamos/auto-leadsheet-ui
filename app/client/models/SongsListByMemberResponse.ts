/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SongResponse } from './SongResponse';
/**
 * Paginated response for listing the current user's songs.
 */
export type SongsListByMemberResponse = {
    songs: Array<SongResponse>;
    nextCursor?: (string | null);
};

