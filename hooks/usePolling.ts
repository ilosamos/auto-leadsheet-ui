import { useEffect } from "react";

type UsePollingOptions = {
  enabled: boolean;
  intervalMs: number;
  onTick: () => void;
};

export function usePolling({ enabled, intervalMs, onTick }: UsePollingOptions) {
  useEffect(() => {
    if (!enabled) { return; }
    const id = setInterval(onTick, intervalMs);
    return () => clearInterval(id);
  }, [enabled, intervalMs, onTick]);
}
