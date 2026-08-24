# Todo Notes — Test Assignment

Maksim Chuprin, August 2026

![Nuxt](https://img.shields.io/badge/Nuxt-4.5-00DC82?logo=nuxt)
![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![Tests](https://img.shields.io/badge/tests-49%20passing-brightgreen)

[Русский](./README.md)

## Task Summary

Build a single-page notes application with todo items. Core requirements: undo/redo editing history, auto-saved drafts, and resilience when multiple tabs are open simultaneously.

## Approach & Decisions

**Nuxt 4 SPA over SSR.** No server-side data, auth, or SEO needs. SSR would add complexity without benefit. Nuxt chosen for auto-imports, file-based routing, and built-in Pinia integration.

**Pinia for state, localStorage for persistence.** Store centralizes CRUD logic and separates business from presentation. localStorage is a thin persistence layer via a dedicated `useStorage` composable — not scattered across components.

**Undo/redo through pure functions + composable.** History is an array of `HistoryDelta` objects. `applyDelta` and `reverseDelta` are pure functions — trivially testable. The composable adds reactivity (ref, computed, watchEffect) on top. 50-step cap is a deliberate trade-off between history completeness and memory usage. Continuous typing merges into one action via blur/pause debounce (300ms).

**SCSS without UI libraries.** Full control over styles required by the task. All components built from scratch. Modals with focus-trap and Escape handling — custom implementation, not a node_modules dependency.

**Cross-tab safety via `storage` event.** The browser fires `storage` when another tab modifies localStorage. The note page listens and re-syncs the store. If the note was deleted elsewhere, a modal appears instead of a crash.

**Vitest + jsdom for testing.** 49 unit tests cover: useHistory logic (applyDelta, reverseDelta, composable), Pinia store (CRUD, sorting, edge-cases), localStorage utilities (drafts, pending notes, schema versioning). No e2e tests — not required by the task, but the clear next step.

**Biome over ESLint.** Faster, simpler config, built-in formatter. Only friction: alphabetical import sorting, which required attention during development.

## What's Implemented

- ✅ Note CRUD (create, edit, delete)
- ✅ Undo/redo history (50 steps, Ctrl+Z / Ctrl+Shift+Z hotkeys)
- ✅ Auto-save drafts + restore on load
- ✅ Cross-tab safety (modal when note deleted in another tab)
- ✅ Confirmation modals (delete, cancel editing)
- ✅ Edge-cases: direct URL to non-existent note → redirect, empty fields, null/undefined
- ✅ 49 unit tests (useHistory: 20, store: 15, storage: 14)
- ✅ Docker + docker-compose (multi-stage: node → nginx)
- ✅ GitHub Pages CI/CD via GitHub Actions
- ✅ TypeScript strict, Biome linting

## Known Limitations & Future Improvements

- **No e2e tests** — Vitest covers logic, but not user journeys. Next step: Playwright.
- **No PWA** — No Service Worker. Offline-first works via localStorage, but no manifest or installability.
- **No server sync** — localStorage only. Multi-device requires a backend.
- **History tied to layout** — `useHistory` resets when leaving the editor page (composable unmount).
- **Docker not tested** — Dockerfile and docker-compose are syntactically correct, but `docker build` was not executed during the assignment (daemon unavailable).

## How to Run

```bash
# Docker
docker-compose up
# Open http://localhost:3000

# Development
pnpm install
pnpm dev
# Open http://localhost:3000

# Tests
pnpm test

# Lint
pnpm lint
```

Expected: app opens at `localhost:3000`, note list is empty, "Create note" button is available. Tests: 49/49 green.
