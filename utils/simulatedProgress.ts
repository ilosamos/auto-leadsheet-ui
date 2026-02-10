import type { SongResponse } from "../app/client/models/SongResponse";

/**
 * Computes a simulated progress value from a song's `lastJobTriggered` timestamp.
 * Elapsed time since that timestamp is scaled linearly between `min` and `max`:
 * - At 0 elapsed → returns `min`
 * - At `expectedMaxSeconds` elapsed (or more) → returns `max` (capped)
 *
 * Use this for UI progress indicators when you don't have real progress from the
 * backend but want to show movement between a min and max over an expected duration.
 *
 * @param song - Song with optional `lastJobTriggered` (ISO date string, e.g. "2026-02-09T19:42:50.852882Z")
 * @param min - Progress value when just triggered (e.g. 0)
 * @param max - Progress value when expected duration is reached (e.g. 100)
 * @param expectedMaxSeconds - Duration in seconds after which progress should be at `max`
 * @param now - Optional timestamp (ms). Defaults to Date.now() (useful for tests or fixed "now")
 * @returns Progress in [min, max], or min if song has no valid lastJobTriggered
 */
export function getSimulatedProgressFromSong(
  song: Pick<SongResponse, "lastJobTriggered">,
  min: number,
  max: number,
  expectedMaxSeconds: number,
  now: number = Date.now()
): number {
  const triggered = song.lastJobTriggered;
  if (!triggered) { return min; }

  const triggeredMs = new Date(triggered).getTime();
  if (Number.isNaN(triggeredMs)) { return min; }

  const elapsedMs = Math.max(0, now - triggeredMs);
  const elapsedSeconds = elapsedMs / 1000;

  const ratio = Math.min(1, elapsedSeconds / expectedMaxSeconds);

  return min + ratio * (max - min);
}
