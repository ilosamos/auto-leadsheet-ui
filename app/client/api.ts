import { signOut } from "next-auth/react";
import type { ApiError } from "./core/ApiError";

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: ApiError };

/**
 * Wraps an API call so you don't need try/catch everywhere.
 *
 * If the server responds with 401 Unauthorized the user is automatically
 * signed out so the login prompt re-appears.
 *
 * Usage:
 *   const { data, error } = await api(JobsService.createNewJobJobsPost());
 *   if (error) { ... }
 *   console.log(data);
 */
export async function api<T>(promise: Promise<T>): Promise<ApiResult<T>> {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    const apiError = error as ApiError;

    // 401 means the token is invalid / expired — force re-authentication
    if (apiError.status === 401) {
      await signOut({ redirect: false });
    }

    return { data: null, error: apiError };
  }
}
