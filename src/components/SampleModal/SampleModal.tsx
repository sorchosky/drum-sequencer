import { SAMPLE_OPTIONS } from '../../data/patterns';
import styles from './SampleModal.module.css';

interface SampleModalProps {
  trackId: string;
  trackName: string;
  currentSample: string;
  onSelect: (sample: string) => void;
  onClose: () => void;
}

export function SampleModal({ trackId, trackName, currentSample, onSelect, onClose }: SampleModalProps) {
  const options = SAMPLE_OPTIONS[trackId] ?? [];

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={`Select sample for ${trackName}`}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <span className={styles.title}>SAMPLE — {trackName.toUpperCase()}</span>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <ul className={styles.list} role="listbox" aria-label="Sample options">
          {options.map((sample, i) => (
            <li
              key={sample}
              className={`${styles.item} ${sample === currentSample ? styles.selected : ''}`}
              role="option"
              aria-selected={sample === currentSample}
            >
              <button
                className={styles.selectBtn}
                onClick={() => { onSelect(sample); onClose(); }}
              >
                <span className={styles.sampleName}>{`sample_${i + 1}`}</span>
                <span className={styles.fileName}>{sample}</span>
              </button>
              <button
                className={styles.previewBtn}
                aria-label={`Preview ${sample}`}
                onClick={e => e.stopPropagation()}
              >
                <PlaySmallIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="2" y1="2" x2="12" y2="12" />
      <line x1="12" y1="2" x2="2" y2="12" />
    </svg>
  );
}

function PlaySmallIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" aria-hidden="true">
      <polygon points="2,1 9,5 2,9" />
    </svg>
  );
}
