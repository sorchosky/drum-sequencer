import styles from './Header.module.css';

interface HeaderProps {
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onTapTempo: () => void;
}

export function Header({ bpm, onBpmChange, onTapTempo }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.titleRow}>
        <span className={styles.logo}>DRUM SEQ</span>
        <span className={styles.badge}>16-step</span>
      </div>

      <div className={styles.bpmRow}>
        <div className={styles.bpmDisplay}>
          <span className={styles.bpmValue}>{bpm}</span>
          <span className={styles.bpmUnit}>BPM</span>
        </div>

        <div className={styles.bpmControls}>
          <button
            className={styles.tapBtn}
            onClick={onTapTempo}
            aria-label="Tap tempo"
          >
            TAP
          </button>

          <input
            type="range"
            min={40}
            max={240}
            step={1}
            value={bpm}
            onChange={e => onBpmChange(parseInt(e.target.value, 10))}
            aria-label="BPM slider"
            className={styles.bpmSlider}
          />
        </div>
      </div>
    </header>
  );
}
