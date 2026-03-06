import type { ToastMsg } from '../../types';
import styles from './Toast.module.css';

interface ToastProps {
  toasts: ToastMsg[];
}

export function Toast({ toasts }: ToastProps) {
  if (toasts.length === 0) return null;
  return (
    <div className={styles.container} aria-live="polite" aria-atomic="true">
      {toasts.map(toast => (
        <div key={toast.id} className={styles.toast}>
          {toast.text}
        </div>
      ))}
    </div>
  );
}
