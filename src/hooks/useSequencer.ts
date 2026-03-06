import { useRef, useState, useCallback, useEffect } from 'react';
import type { MutableRefObject } from 'react';
import type { Track, PlayState } from '../types';
import { triggerInstrument } from '../synth';

const SCHEDULE_AHEAD = 0.1;   // seconds to look ahead
const SCHEDULER_MS   = 25;    // scheduler interval in ms

interface ScheduledStep {
  step: number;
  time: number;
}

export function useSequencer(
  tracksRef: MutableRefObject<Track[]>,
  bpmRef: MutableRefObject<number>,
) {
  const audioCtxRef      = useRef<AudioContext | null>(null);
  const timerRef         = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef           = useRef<number | null>(null);
  const nextNoteTimeRef  = useRef(0);
  const scheduledStepRef = useRef(0);
  const noteQueueRef     = useRef<ScheduledStep[]>([]);
  const playStateRef     = useRef<PlayState>('stopped');

  const [playState, setPlayState]   = useState<PlayState>('stopped');
  const [currentStep, setCurrentStep] = useState(-1);

  const getCtx = useCallback((): AudioContext => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === 'suspended') {
      void audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Defined as stable refs so interval/RAF always calls the latest version
  const scheduleStepFn = useRef<(step: number, time: number) => void>();
  const runSchedulerFn = useRef<() => void>();
  const drawLoopFn     = useRef<() => void>();

  scheduleStepFn.current = (step: number, time: number) => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const tracks = tracksRef.current;
    const anySoloed = tracks.some(t => t.solo);
    tracks.forEach(track => {
      const audible = anySoloed ? track.solo : !track.mute;
      if (audible && track.pattern[step] === 1) {
        triggerInstrument(ctx, track.id, time, track.volume, track.pan);
      }
    });
    noteQueueRef.current.push({ step, time });
  };

  runSchedulerFn.current = () => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    const secondsPerStep = 60.0 / bpmRef.current / 4;
    while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD) {
      scheduleStepFn.current!(scheduledStepRef.current, nextNoteTimeRef.current);
      nextNoteTimeRef.current += secondsPerStep;
      scheduledStepRef.current = (scheduledStepRef.current + 1) % 16;
    }
  };

  drawLoopFn.current = () => {
    const ctx = audioCtxRef.current;
    if (ctx) {
      const now = ctx.currentTime;
      const q = noteQueueRef.current;
      while (q.length && q[0].time < now) {
        setCurrentStep(q.shift()!.step);
      }
    }
    rafRef.current = requestAnimationFrame(() => drawLoopFn.current!());
  };

  const startEngine = useCallback((ctx: AudioContext) => {
    const startTime = ctx.currentTime + 0.05;
    nextNoteTimeRef.current = startTime;
    noteQueueRef.current = [];
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    timerRef.current = setInterval(() => runSchedulerFn.current!(), SCHEDULER_MS);
    rafRef.current = requestAnimationFrame(() => drawLoopFn.current!());
  }, []);

  const play = useCallback(() => {
    const ctx = getCtx();
    if (playStateRef.current === 'stopped') {
      scheduledStepRef.current = 0;
    }
    startEngine(ctx);
    playStateRef.current = 'playing';
    setPlayState('playing');
  }, [getCtx, startEngine]);

  const pause = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    playStateRef.current = 'paused';
    setPlayState('paused');
  }, []);

  const stop = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    noteQueueRef.current = [];
    scheduledStepRef.current = 0;
    nextNoteTimeRef.current = 0;
    playStateRef.current = 'stopped';
    setPlayState('stopped');
    setCurrentStep(-1);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      audioCtxRef.current?.close();
    };
  }, []);

  return { playState, currentStep, play, pause, stop };
}
