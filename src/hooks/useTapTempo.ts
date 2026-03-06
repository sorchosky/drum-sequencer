import { useRef, useCallback } from 'react';

const MAX_TAPS = 4;
const TAP_TIMEOUT_MS = 2000; // reset if idle > 2s

export function useTapTempo(onBpmChange: (bpm: number) => void) {
  const tapsRef     = useRef<number[]>([]);
  const lastTapRef  = useRef<number>(0);

  const tap = useCallback(() => {
    const now = Date.now();

    // Reset tap history if too much time has passed
    if (now - lastTapRef.current > TAP_TIMEOUT_MS) {
      tapsRef.current = [];
    }
    lastTapRef.current = now;
    tapsRef.current = [...tapsRef.current.slice(-(MAX_TAPS - 1)), now];

    if (tapsRef.current.length >= 2) {
      const taps = tapsRef.current;
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      const clamped = Math.max(40, Math.min(240, bpm));
      onBpmChange(clamped);
    }
  }, [onBpmChange]);

  return tap;
}
