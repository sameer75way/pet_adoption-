import { useEffect, useEffectEvent } from "react";

export const usePollingEffect = (
  enabled: boolean,
  callback: () => void | Promise<void>,
  intervalMs: number
) => {
  const onTick = useEffectEvent(() => {
    void callback();
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      onTick();
    }, 0);

    const intervalId = window.setInterval(() => {
      onTick();
    }, intervalMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [enabled, intervalMs]);
};
