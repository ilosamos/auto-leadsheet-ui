import type { ApiError } from "./core/ApiError";

type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: ApiError };

/**
 * Wraps an API call so you don't need try/catch everywhere.
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
    return { data: null, error: error as ApiError };
  }
}
