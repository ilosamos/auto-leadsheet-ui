/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobStatusEnum } from './JobStatusEnum';
/**
 * Response model for song status only.
 */
export type SongStatusResponse = {
    songId: string;
    chordStatus: JobStatusEnum;
    allin1Status: JobStatusEnum;
};

