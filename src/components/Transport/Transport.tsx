import type { PlayState } from '../../types';
import styles from './Transport.module.css';

interface TransportProps {
  playState: PlayState;
  reducedMotion: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onRandomize: () => void;
  onClear: () => void;
  onSave: () => void;
  onCopy: () => void;
  onToggleReducedMotion: () => void;
}

export function Transport({
  playState,
  reducedMotion,
  onPlay,
  onPause,
  onStop,
  onRandomize,
  onClear,
  onSave,
  onCopy,
  onToggleReducedMotion,
}: TransportProps) {
  const isPlaying = playState === 'playing';

  const handlePlayPause = () => {
    if (isPlaying) onPause();
    else onPlay();
  };

  return (
    <div className={styles.bottomBar}>
      {/* Transport */}
      <div className={styles.transportRow}>
        <button
          className={styles.stopBtn}
          onClick={onStop}
          aria-label="Stop"
          disabled={playState === 'stopped'}
        >
          <StopIcon />
        </button>

        <button
          className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
          onClick={handlePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className={styles.playStateLabel} aria-live="polite">
          {playState === 'playing' && <span className={styles.dot} />}
          <span className={styles.stateText}>
            {playState === 'playing' ? 'PLAYING' : playState === 'paused' ? 'PAUSED' : 'STOPPED'}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actionsRow}>
        <ActionBtn onClick={onRandomize} label="RAND" title="Randomize pattern (seed 42)" />
        <ActionBtn onClick={onClear}     label="CLR"  title="Clear all steps" />
        <ActionBtn onClick={onSave}      label="SAVE" title="Save pattern" accent />
        <ActionBtn onClick={onCopy}      label="COPY" title="Copy pattern JSON" />
        <button
          className={`${styles.actionBtn} ${reducedMotion ? styles.actionBtnActive : ''}`}
          onClick={onToggleReducedMotion}
          aria-label="Toggle reduced motion"
          aria-pressed={reducedMotion}
          title="Reduced motion"
        >
          <MotionIcon />
        </button>
      </div>
    </div>
  );
}

interface ActionBtnProps {
  onClick: () => void;
  label: string;
  title?: string;
  accent?: boolean;
}

function ActionBtn({ onClick, label, title, accent }: ActionBtnProps) {
  return (
    <button
      className={`${styles.actionBtn} ${accent ? styles.actionBtnAccent : ''}`}
      onClick={onClick}
      aria-label={title ?? label}
      title={title}
    >
      {label}
    </button>
  );
}

/* ── Icons ── */

function PlayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
      <polygon points="5,2 19,11 5,20" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor" aria-hidden="true">
      <rect x="4"  y="2" width="5" height="18" rx="1" />
      <rect x="13" y="2" width="5" height="18" rx="1" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="1" />
    </svg>
  );
}

function MotionIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <circle cx="7" cy="7" r="5" />
      <path d="M7 4v3l2 2" strokeLinecap="round" />
    </svg>
  );
}
