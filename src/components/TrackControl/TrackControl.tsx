import type { Track } from '../../types';
import styles from './TrackControl.module.css';

interface TrackControlProps {
  track: Track;
  dimmed: boolean;
  onMuteToggle: () => void;
  onSoloToggle: () => void;
  onVolumeChange: (v: number) => void;
  onPanChange: (v: number) => void;
  onSampleSelect: () => void;
}

export function TrackControl({
  track,
  dimmed,
  onMuteToggle,
  onSoloToggle,
  onVolumeChange,
  onPanChange,
  onSampleSelect,
}: TrackControlProps) {
  const panDisplay = track.pan === 0
    ? 'C'
    : track.pan > 0
    ? `+${Math.round(track.pan * 50)}`
    : `${Math.round(track.pan * 50)}`;

  return (
    <div className={`${styles.control} ${dimmed ? styles.dimmed : ''}`}>
      {/* Row 1: track name + sample selector */}
      <div className={styles.topRow}>
        <span className={styles.name}>{track.name}</span>
        <button
          className={styles.sampleBtn}
          onClick={onSampleSelect}
          aria-label={`Select sample for ${track.name}, current: ${track.sample}`}
          title={track.sample}
        >
          <SampleIcon />
        </button>
      </div>

      {/* Row 2: M, S, volume, pan */}
      <div className={styles.bottomRow}>
        <button
          className={`${styles.toggle} ${track.mute ? styles.muteOn : ''}`}
          onClick={onMuteToggle}
          aria-label={`Mute ${track.name}`}
          aria-pressed={track.mute}
        >
          M
        </button>
        <button
          className={`${styles.toggle} ${track.solo ? styles.soloOn : ''}`}
          onClick={onSoloToggle}
          aria-label={`Solo ${track.name}`}
          aria-pressed={track.solo}
        >
          S
        </button>
        <div className={styles.sliderWrap}>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={track.volume}
            onChange={e => onVolumeChange(parseFloat(e.target.value))}
            aria-label={`${track.name} volume`}
            className={styles.volSlider}
          />
        </div>
        <button
          className={styles.panBtn}
          onClick={() => {
            // Cycle through pan values: -0.5, 0, +0.5
            const next = track.pan <= -0.4 ? 0 : track.pan >= 0.4 ? -0.5 : 0.5;
            onPanChange(next);
          }}
          aria-label={`${track.name} pan: ${panDisplay}`}
          title={`Pan: ${panDisplay}`}
        >
          <span className={styles.panLabel}>{panDisplay}</span>
        </button>
      </div>
    </div>
  );
}

function SampleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="6" cy="6" r="2" fill="currentColor" />
    </svg>
  );
}
