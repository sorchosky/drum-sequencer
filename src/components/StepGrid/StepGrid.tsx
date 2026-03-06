import { StepCell } from '../StepCell/StepCell';
import styles from './StepGrid.module.css';

const GROUP_AFTER = new Set([3, 7, 11]); // 0-indexed: add 12px gap after these

interface StepGridProps {
  trackId: string;
  pattern: number[];
  currentStep: number;
  reducedMotion: boolean;
  onToggleStep: (index: number) => void;
}

export function StepGrid({ trackId, pattern, currentStep, reducedMotion, onToggleStep }: StepGridProps) {
  return (
    <div className={styles.scrollContainer} role="group" aria-label={`${trackId} step grid`}>
      <div className={styles.row}>
        {pattern.map((value, i) => (
          <div
            key={i}
            className={styles.cellSlot}
            style={GROUP_AFTER.has(i) ? { marginRight: 16 } : { marginRight: 4 }}
          >
            <StepCell
              trackId={trackId}
              index={i}
              active={value === 1}
              isPlaying={currentStep === i}
              reducedMotion={reducedMotion}
              onToggle={onToggleStep}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
