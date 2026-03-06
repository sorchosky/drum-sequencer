export interface Track {
  id: string;
  name: string;
  sample: string;
  volume: number;
  pan: number;
  mute: boolean;
  solo: boolean;
  pattern: number[];
}

export interface SequencerData {
  bpm: number;
  steps: number;
  tracks: Track[];
}

export type PlayState = 'stopped' | 'playing' | 'paused';

export type CellVariant = 'off' | 'active' | 'playing' | 'active_playing';

export interface ToastMsg {
  id: string;
  text: string;
}
