import type { Track } from '../types';

export const DEFAULT_TRACKS: Track[] = [
  { id: 'kick',  name: 'Kick',  sample: 'kick01.mp3',  volume: 0.9,  pan: 0,    mute: false, solo: false, pattern: [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0] },
  { id: 'snare', name: 'Snare', sample: 'snare01.mp3', volume: 0.85, pan: 0,    mute: false, solo: false, pattern: [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0] },
  { id: 'hihat', name: 'HiHat', sample: 'hat01.mp3',   volume: 0.7,  pan: 0,    mute: false, solo: false, pattern: [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0] },
  { id: 'crash', name: 'Crash', sample: 'crash01.mp3', volume: 0.6,  pan: 0,    mute: false, solo: false, pattern: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1] },
  { id: 'tom1',  name: 'Tom1',  sample: 'tom01.mp3',   volume: 0.65, pan: -0.2, mute: false, solo: false, pattern: [0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0] },
  { id: 'tom2',  name: 'Tom2',  sample: 'tom02.mp3',   volume: 0.6,  pan: 0.2,  mute: false, solo: false, pattern: [0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0] },
];

export const DEFAULT_BPM = 120;

export const SAMPLE_OPTIONS: Record<string, string[]> = {
  kick:  ['kick01.mp3',  'kick02.mp3',  'kick03.mp3'],
  snare: ['snare01.mp3', 'snare02.mp3', 'snare03.mp3'],
  hihat: ['hat01.mp3',   'hat02.mp3',   'hat03.mp3'],
  crash: ['crash01.mp3', 'crash02.mp3', 'crash03.mp3'],
  tom1:  ['tom01.mp3',   'tom02.mp3',   'tom03.mp3'],
  tom2:  ['tom02.mp3',   'tom03.mp3',   'tom04.mp3'],
};

/* Deterministic seeded PRNG (mulberry32) */
function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomizePatterns(tracks: Track[]): Track[] {
  const rand = mulberry32(42);
  return tracks.map(track => {
    const pattern = new Array<number>(16).fill(0);

    if (track.id === 'kick') {
      [0, 4, 8, 12].forEach(i => { pattern[i] = 1; });
      for (let i = 0; i < 16; i++) {
        if (![0, 4, 8, 12].includes(i)) pattern[i] = rand() > 0.7 ? 1 : 0;
      }
    } else if (track.id === 'snare') {
      [4, 12].forEach(i => { pattern[i] = 1; });
      for (let i = 0; i < 16; i++) {
        if (![4, 12].includes(i)) pattern[i] = rand() > 0.85 ? 1 : 0;
      }
    } else if (track.id === 'hihat') {
      for (let i = 0; i < 16; i++) pattern[i] = i % 2 === 0 ? 1 : 0;
    } else if (track.id === 'crash') {
      pattern[15] = 1;
    } else {
      // Tom1 / Tom2: two unique random indices in [8..15]
      const used = new Set<number>();
      while (used.size < 2) {
        used.add(Math.floor(rand() * 8) + 8);
      }
      used.forEach(i => { pattern[i] = 1; });
    }

    return { ...track, pattern };
  });
}
