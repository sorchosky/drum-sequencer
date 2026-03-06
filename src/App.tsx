import { useState, useRef, useCallback, useEffect } from 'react';
import type { Track, ToastMsg } from './types';
import { DEFAULT_TRACKS, DEFAULT_BPM, randomizePatterns } from './data/patterns';
import { useSequencer } from './hooks/useSequencer';
import { useTapTempo } from './hooks/useTapTempo';
import { Header } from './components/Header/Header';
import { TrackRow } from './components/TrackRow/TrackRow';
import { Transport } from './components/Transport/Transport';
import { SampleModal } from './components/SampleModal/SampleModal';
import { Toast } from './components/Toast/Toast';
import styles from './App.module.css';

export function App() {
  const [tracks, setTracks]           = useState<Track[]>(DEFAULT_TRACKS);
  const [bpm, setBpm]                 = useState(DEFAULT_BPM);
  const [sampleModalId, setSampleModalId] = useState<string | null>(null);
  const [toasts, setToasts]           = useState<ToastMsg[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Keep refs in sync for the audio scheduler
  const tracksRef = useRef(tracks);
  const bpmRef    = useRef(bpm);
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);
  useEffect(() => { bpmRef.current = bpm; }, [bpm]);

  const { playState, currentStep, play, pause, stop } = useSequencer(tracksRef, bpmRef);

  const showToast = useCallback((text: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, text }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 1500);
  }, []);

  // ── Track mutation helpers ──────────────────────────────────────────────────

  const updateTrack = useCallback((trackId: string, patch: Partial<Track>) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, ...patch } : t));
  }, []);

  const handleToggleStep = useCallback((trackId: string, stepIndex: number) => {
    setTracks(prev => prev.map(t => {
      if (t.id !== trackId) return t;
      const pattern = [...t.pattern];
      pattern[stepIndex] = pattern[stepIndex] === 1 ? 0 : 1;
      return { ...t, pattern };
    }));
  }, []);

  const handleMuteToggle = useCallback((trackId: string) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, mute: !t.mute } : t,
    ));
  }, []);

  const handleSoloToggle = useCallback((trackId: string) => {
    setTracks(prev => prev.map(t =>
      t.id === trackId ? { ...t, solo: !t.solo } : t,
    ));
  }, []);

  const handleVolumeChange = useCallback((trackId: string, v: number) => {
    updateTrack(trackId, { volume: v });
  }, [updateTrack]);

  const handlePanChange = useCallback((trackId: string, v: number) => {
    updateTrack(trackId, { pan: v });
  }, [updateTrack]);

  const handleSampleSelect = useCallback((trackId: string, sample: string) => {
    updateTrack(trackId, { sample });
  }, [updateTrack]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleRandomize = useCallback(() => {
    setTracks(prev => randomizePatterns(prev));
    showToast('Randomized');
  }, [showToast]);

  const handleClear = useCallback(() => {
    setTracks(prev => prev.map(t => ({ ...t, pattern: new Array<number>(16).fill(0) })));
    showToast('Cleared');
  }, [showToast]);

  const handleSave = useCallback(() => {
    showToast('Pattern Saved');
  }, [showToast]);

  const handleCopy = useCallback(async () => {
    const data = { bpm, steps: 16, tracks };
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      showToast('Pattern Copied');
    } catch {
      showToast('Copy failed');
    }
  }, [bpm, tracks, showToast]);

  const tapTempo = useTapTempo(setBpm);

  // ── Solo/mute dimming ────────────────────────────────────────────────────────
  const anySoloed = tracks.some(t => t.solo);

  // ── Sample modal ─────────────────────────────────────────────────────────────
  const sampleModalTrack = sampleModalId ? tracks.find(t => t.id === sampleModalId) : null;

  return (
    <div
      className={styles.frame}
      data-reduced-motion={reducedMotion}
      role="main"
      aria-label="Drum Sequencer"
    >
      <div className={styles.inner}>
        {/* Header */}
        <Header
          bpm={bpm}
          onBpmChange={setBpm}
          onTapTempo={tapTempo}
        />

        {/* Sequencer */}
        <section className={styles.sequencer} aria-label="Sequencer">
          <div className={styles.sequencerLabel}>SEQUENCER</div>
          <div className={styles.trackList}>
            {tracks.map(track => {
              const dimmed = anySoloed && !track.solo;
              return (
                <TrackRow
                  key={track.id}
                  track={track}
                  currentStep={currentStep}
                  dimmed={dimmed}
                  reducedMotion={reducedMotion}
                  onToggleStep={handleToggleStep}
                  onMuteToggle={handleMuteToggle}
                  onSoloToggle={handleSoloToggle}
                  onVolumeChange={handleVolumeChange}
                  onPanChange={handlePanChange}
                  onSampleSelect={setSampleModalId}
                />
              );
            })}
          </div>
        </section>

        {/* Transport + Actions */}
        <Transport
          playState={playState}
          reducedMotion={reducedMotion}
          onPlay={play}
          onPause={pause}
          onStop={stop}
          onRandomize={handleRandomize}
          onClear={handleClear}
          onSave={handleSave}
          onCopy={handleCopy}
          onToggleReducedMotion={() => setReducedMotion(p => !p)}
        />
      </div>

      {/* Sample modal */}
      {sampleModalTrack && (
        <SampleModal
          trackId={sampleModalTrack.id}
          trackName={sampleModalTrack.name}
          currentSample={sampleModalTrack.sample}
          onSelect={sample => handleSampleSelect(sampleModalTrack.id, sample)}
          onClose={() => setSampleModalId(null)}
        />
      )}

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </div>
  );
}
