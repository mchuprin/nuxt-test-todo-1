# Todo Notes

> Test assignment — a single-page notes application with todo items

**Maksim Chuprin**, August 2026

<p align="center">
  <a href="https://mchuprin.github.io/nuxt-test-todo-1/">
    <strong>Demo &rarr;</strong>
  </a>
</p>

<p align="center">
  <img src=".github/assets/demo.png" alt="Demo" width="800" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Nuxt-4.5-00DC82?logo=nuxt" alt="Nuxt" />
  <img src="https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs" alt="Vue" />
  <img src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Pinia-4.0-FCC72B?logo=pinia" alt="Pinia" />
  <img src="https://img.shields.io/badge/Biome-lint-6502B1?logo=biome" alt="Biome" />
  <img src="https://img.shields.io/badge/Vitest-4.1-729B1B?logo=vitest" alt="Vitest" />
  <img src="https://img.shields.io/badge/Docker-ready-2496ED?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/tests-49%20passing-brightgreen" alt="Tests" />
</p>

<p align="center">
  <a href="./README.md">Русский</a>
</p>

---

## Task

Build a single-page notes application with todo items. Core requirements:

- Undo/redo editing history
- Auto-saved drafts
- Resilience when multiple tabs are open simultaneously

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4.5 (SPA) |
| UI | Vue 3.5 + Composition API |
| State | Pinia 4.0 |
| Styles | SCSS (no UI libraries) |
| Typing | TypeScript strict |
| Linter | Biome |
| Tests | Vitest + jsdom |
| Containers | Docker + nginx |
| CI/CD | GitHub Actions &rarr; GitHub Pages |

## Project Structure

```
app/
├── pages/
│   ├── index.vue                  # Note list
│   └── note/[id].vue              # Note editor
├── layouts/
│   ├── default.vue                # Note list
│   └── note.vue                   # Editor + undo/redo buttons
├── middleware/
│   └── note-resolve.ts            # Note ID resolver + guard
├── components/
│   ├── app/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── Modal.vue
│   └── note/
│       ├── Card.vue               # List card
│       └── TodoItem.vue           # Todo element
├── composables/
│   ├── useHistory.ts              # Undo/redo (pure functions + reactivity)
│   └── useNoteEditor.ts           # All editing logic
├── stores/
│   └── notes.ts                   # Pinia store (CRUD, sorting)
├── types/
│   └── index.ts                   # HistoryDelta, Note, TodoItem
├── utils/
│   └── storage.ts                 # localStorage helpers
└── styles/
    ├── _variables.scss
    └── styles.scss
```

## Approach & Decisions

### Nuxt 4 SPA over SSR

No server-side data, auth, or SEO needs. SSR would add complexity without benefit. Nuxt chosen for auto-imports, file-based routing, and built-in Pinia integration.

### Pinia for state, localStorage for persistence

Store centralizes CRUD logic and separates business from presentation. localStorage is a thin persistence layer via a dedicated `useStorage` composable — not scattered across components.

### Undo/redo through pure functions + composable

History is an array of `HistoryDelta` objects. `applyDelta` and `reverseDelta` are pure functions — trivially testable. The composable adds reactivity (ref, computed, watchEffect) on top. 50-step cap is a deliberate trade-off between history completeness and memory usage.

```
HistoryDelta =
  | { type: 'title', before, after }
  | { type: 'todo-check', id, before, after }
  | { type: 'todo-add', item, index }
  | { type: 'todo-delete', item, index }
  | { type: 'todo-text', id, before, after }
```

Triggers: title and todo-text save on blur, add/check/delete save immediately.

### Cross-tab safety via `storage` event

The browser fires `storage` when another tab modifies localStorage. The note page listens and re-syncs the store. If the note was deleted elsewhere, a modal appears instead of a crash.

### Testing

49 unit tests covering:

| Module | Tests | Coverage |
|--------|-------|----------|
| `useHistory` | 20 | applyDelta, reverseDelta, composable |
| `notes store` | 15 | CRUD, sorting, edge-cases |
| `useStorage` | 14 | drafts, pending notes, schema versioning |

## Features

- Note CRUD (create, edit, delete)
- Undo/redo history (50 steps, Ctrl+Z / Ctrl+Shift+Z)
- Auto-save drafts + restore on load
- Cross-tab safety (modal when note deleted in another tab)
- Confirmation modals (delete, cancel editing)
- Edge-cases: direct URL to non-existent note, empty fields, null/undefined
- TypeScript strict, Biome linting
- Docker + docker-compose (multi-stage: node &rarr; nginx)
- GitHub Pages CI/CD via GitHub Actions

## Limitations

- **No e2e tests** — Vitest covers logic, but not user journeys. Next step: Playwright.
- **No PWA** — No Service Worker. Offline-first works via localStorage, but no manifest or installability.
- **No server sync** — localStorage only. Multi-device requires a backend.

## Running

### Docker

```bash
docker compose up
# http://localhost:3000
```

### Development

```bash
pnpm install
pnpm dev
# http://localhost:3000
```

### Tests & Lint

```bash
pnpm test    # 49/49 green
pnpm lint    # biome check
```
