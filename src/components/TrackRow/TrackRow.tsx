import type { Track } from '../../types';
import { TrackControl } from '../TrackControl/TrackControl';
import { StepGrid } from '../StepGrid/StepGrid';
import styles from './TrackRow.module.css';

interface TrackRowProps {
  track: Track;
  currentStep: number;
  dimmed: boolean;
  reducedMotion: boolean;
  onToggleStep: (trackId: string, stepIndex: number) => void;
  onMuteToggle: (trackId: string) => void;
  onSoloToggle: (trackId: string) => void;
  onVolumeChange: (trackId: string, v: number) => void;
  onPanChange: (trackId: string, v: number) => void;
  onSampleSelect: (trackId: string) => void;
}

export function TrackRow({
  track,
  currentStep,
  dimmed,
  reducedMotion,
  onToggleStep,
  onMuteToggle,
  onSoloToggle,
  onVolumeChange,
  onPanChange,
  onSampleSelect,
}: TrackRowProps) {
  return (
    <div className={styles.row}>
      <TrackControl
        track={track}
        dimmed={dimmed}
        onMuteToggle={() => onMuteToggle(track.id)}
        onSoloToggle={() => onSoloToggle(track.id)}
        onVolumeChange={v => onVolumeChange(track.id, v)}
        onPanChange={v => onPanChange(track.id, v)}
        onSampleSelect={() => onSampleSelect(track.id)}
      />
      <StepGrid
        trackId={track.id}
        pattern={track.pattern}
        currentStep={currentStep}
        reducedMotion={reducedMotion}
        onToggleStep={i => onToggleStep(track.id, i)}
      />
    </div>
  );
}
