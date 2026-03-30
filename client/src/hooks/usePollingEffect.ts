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

    const intervalId = window.setInterval(() => {
      onTick();
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, intervalMs, onTick]);
};
