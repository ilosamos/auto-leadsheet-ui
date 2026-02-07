/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JobStatusEnum } from './JobStatusEnum';
/**
 * Response model for a song.
 */
export type SongResponse = {
    song_id: string;
    chord_status: JobStatusEnum;
    allin1_status: JobStatusEnum;
    title?: (string | null);
    artist?: (string | null);
    audio_path?: (string | null);
    chords_path?: (string | null);
    allin1_path?: (string | null);
    size?: (number | null);
    length?: (number | null);
};

