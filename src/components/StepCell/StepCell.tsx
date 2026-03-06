import type { CellVariant } from '../../types';
import styles from './StepCell.module.css';

interface StepCellProps {
  trackId: string;
  index: number;
  active: boolean;
  isPlaying: boolean;
  reducedMotion: boolean;
  onToggle: (index: number) => void;
}

function getVariant(active: boolean, isPlaying: boolean): CellVariant {
  if (active && isPlaying)  return 'active_playing';
  if (!active && isPlaying) return 'playing';
  if (active)               return 'active';
  return 'off';
}

export function StepCell({ trackId, index, active, isPlaying, reducedMotion, onToggle }: StepCellProps) {
  const variant = getVariant(active, isPlaying);
  const visualClass = [
    styles.visual,
    styles[variant],
    reducedMotion ? styles.noAnim : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={styles.wrapper} aria-hidden="false">
      {/* 44×44 accessible hit target */}
      <button
        className={styles.hit}
        onClick={() => onToggle(index)}
        aria-label={`${trackId} step ${index + 1}, ${active ? 'active' : 'inactive'}`}
        aria-pressed={active}
        data-name={`${trackId}_step_${index + 1}`}
      />
      {/* 18×18 visual cell */}
      <span className={visualClass} />
    </div>
  );
}
