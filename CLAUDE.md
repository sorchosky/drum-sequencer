# CLAUDE.md — Drum Sequencer

This file documents the project structure, development conventions, and workflows
for AI assistants (and human developers) working on this codebase.

## Project Overview

**drum-sequencer** is a browser-based drum sequencer built as a demonstration of
Claude Code's capabilities. It allows users to program rhythmic patterns by toggling
steps on a grid, adjust tempo (BPM), and play back audio in real-time using the
Web Audio API.

---

## Repository Status

**Current state:** Early initialization. Only a README exists. All source code,
configuration, and tooling are to be built out.

---

## Intended Tech Stack

When implementing this project, use the following stack unless otherwise directed:

| Concern         | Choice                                  |
|-----------------|-----------------------------------------|
| Language        | TypeScript                              |
| UI Framework    | React 18+                               |
| Bundler/Dev     | Vite                                    |
| Styling         | CSS Modules or Tailwind CSS             |
| Audio           | Web Audio API (native browser)          |
| State           | React `useState` / `useReducer` hooks   |
| Testing         | Vitest + React Testing Library          |
| Linting         | ESLint + Prettier                       |

Do not introduce additional runtime dependencies without a clear reason.

---

## Planned Project Structure

Once initialized, the project should follow this layout:

```
drum-sequencer/
├── public/              # Static assets (favicon, audio samples)
├── src/
│   ├── components/      # React UI components
│   │   ├── Sequencer/   # Main sequencer grid
│   │   ├── Controls/    # BPM, play/stop, volume
│   │   └── Track/       # Individual drum track row
│   ├── hooks/           # Custom React hooks
│   │   ├── useSequencer.ts   # Playback engine hook
│   │   └── useAudio.ts       # Web Audio API wrapper
│   ├── lib/             # Pure logic / utilities (no React)
│   │   ├── scheduler.ts      # Lookahead audio scheduler
│   │   └── patterns.ts       # Default/preset patterns
│   ├── types/           # Shared TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── tests/               # Unit and integration tests
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .eslintrc.cjs
└── CLAUDE.md
```

---

## Key Concepts

### Sequencer Grid

- The sequencer has **N tracks** (default 8), each representing a drum instrument
  (e.g., Kick, Snare, Hi-Hat, etc.).
- Each track has **16 steps** by default. Steps can be toggled on/off.
- On each beat, active steps trigger a corresponding audio sample.

### Audio Engine

- Use the **Web Audio API** with a lookahead scheduler pattern to avoid timing drift.
- Load drum samples as `AudioBuffer` objects at startup.
- Never block the main thread for audio; schedule notes slightly ahead of time
  using `AudioContext.currentTime`.

### State Shape

The core application state should look like:

```typescript
type StepGrid = boolean[][]; // [trackIndex][stepIndex]

interface SequencerState {
  bpm: number;          // Beats per minute (default: 120)
  isPlaying: boolean;
  currentStep: number;  // 0–15
  steps: StepGrid;      // Toggled pattern
  tracks: Track[];      // Ordered list of drum tracks
}

interface Track {
  id: string;
  name: string;         // e.g., "Kick"
  sampleUrl: string;    // Path to audio sample
  volume: number;       // 0.0–1.0
  muted: boolean;
}
```

---

## Development Commands

Once `package.json` is created, the following scripts should be defined:

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run test      # Run Vitest test suite
npm run lint      # Run ESLint
npm run format    # Run Prettier
```

---

## Coding Conventions

### General

- Write **TypeScript** with strict mode enabled (`"strict": true` in tsconfig).
- Prefer **named exports** over default exports for components and utilities.
- Keep components **small and focused** — a component should do one thing well.
- Do not use `any`. Use proper types or `unknown` with guards.

### React

- Use **functional components** with hooks only. No class components.
- Co-locate component styles, tests, and logic in a folder per component:
  ```
  src/components/Track/
  ├── Track.tsx
  ├── Track.module.css
  └── Track.test.tsx
  ```
- Avoid prop drilling beyond 2 levels — lift state or use context.

### Audio

- All Web Audio operations must happen inside an `AudioContext` that is created
  (or resumed) in response to a user gesture, due to browser autoplay policies.
- Wrap audio logic in custom hooks (`useAudio`, `useSequencer`) — do not put
  scheduling logic inside components directly.

### Styling

- Prefer **CSS Modules** (`.module.css`) for component-scoped styles.
- Use semantic HTML elements (`<button>`, `<input type="range">`, etc.).
- Ensure the UI is keyboard-accessible and passes basic a11y checks.

### Testing

- Test pure logic functions (scheduler math, pattern utilities) with unit tests.
- Test React components with **React Testing Library** — query by role/label,
  not by implementation details.
- Do not test internal component state directly; test behavior and output.

---

## Git Workflow

- **Branch naming:** Feature work goes on descriptively named branches.
  Claude Code uses `claude/<task-slug>` branches.
- **Commit messages:** Use imperative mood, short subject line (<72 chars).
  Example: `Add step toggle logic to Track component`
- **Do not commit** generated files (`dist/`, `node_modules/`, `.DS_Store`).
- A `.gitignore` should include at minimum:
  ```
  node_modules/
  dist/
  .DS_Store
  *.local
  ```

---

## AI Assistant Guidelines

When working on this project as an AI assistant:

1. **Read before editing.** Always read relevant source files before modifying them.
2. **Minimal changes.** Only change what is necessary for the task at hand.
3. **No over-engineering.** Avoid premature abstractions, extra config options,
   or speculative features.
4. **Preserve audio timing accuracy.** The scheduler is timing-critical — changes
   to `scheduler.ts` or `useSequencer.ts` must not introduce jitter or drift.
5. **Verify the build.** After significant changes, run `npm run build` to confirm
   no TypeScript or bundler errors.
6. **Run tests.** After modifying logic, run `npm test` and ensure all tests pass
   before committing.
7. **Do not add emoji to code or comments** unless explicitly asked.
8. **Keep CLAUDE.md current.** If the project structure or conventions change
   materially, update this file as part of the same commit.
