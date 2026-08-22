# Todo Notes

A notes app with undo/redo, auto-save drafts, and cross-tab resilience — built with Nuxt 4, zero UI libraries.

[Русский](./README.md)

![License](https://img.shields.io/badge/license-MIT-blue)
![Nuxt](https://img.shields.io/badge/Nuxt-4.5-00DC82?logo=nuxt)
![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs)
![Tests](https://img.shields.io/badge/tests-49%20passing-brightgreen)

<!-- Screenshot placeholder: capture the note editor page showing undo/redo buttons, todo list, and dark theme -->
<!-- ![App screenshot](./docs/screenshot.png) -->

## Why this exists

Most todo apps lose your work. You switch tabs, your draft vanishes. You make a mistake, there's no undo. You delete a note in one tab, the other tab crashes.

Todo Notes solves these three problems with a client-side architecture that respects your data — even when things go wrong.

## Key features

- **Undo/redo that remembers** — 50-step history. Continuous typing counts as one action. Ctrl+Z / Ctrl+Shift+Z globally on the editor page.
- **Drafts survive crashes** — Auto-saves every second to localStorage. Come back tomorrow, restore your work.
- **Cross-tab safe** — Delete a note in another tab? A modal tells you what happened. No broken UI, no silent data loss.
- **No UI libraries** — Every component built from scratch with SCSS. Full control over styling and behavior.
- **49 unit tests** — History logic, Pinia store, and localStorage utilities covered by Vitest.

## Quick start

```bash
# Option 1: Docker (recommended)
docker-compose up
# Open http://localhost:3000

# Option 2: Development
pnpm install
pnpm dev
# Open http://localhost:3000
```

## Development

```bash
pnpm test          # Run 49 unit tests
pnpm lint          # Check code with Biome
pnpm build         # Production build
pnpm preview       # Preview production build locally
```

<details>
<summary>GitHub Pages deployment</summary>

Push to `main` branch triggers automatic deployment to GitHub Pages.

Update `NUXT_APP_BASE_URL` in `.github/workflows/deploy.yml` to match your repo name:

```yaml
env:
  NUXT_APP_BASE_URL: /your-repo-name/
```

</details>

## Usage

Create a note, add todos, use Ctrl+Z to undo mistakes:

```
/                  → List of all notes
/note/new          → Create new note
/note/:id          → Edit existing note
```

Keyboard shortcuts on editor page:
- `Ctrl+Z` — Undo
- `Ctrl+Shift+Z` or `Ctrl+Y` — Redo

## Architecture

```
app/
├── pages/              # Route components
│   ├── index.vue       # Note list
│   └── note/[id].vue   # Editor (228 lines)
├── components/
│   ├── app/            # Reusable: Button, Input, Modal
│   └── note/           # Feature: Card, TodoItem, actions
├── composables/
│   └── useHistory.ts   # Undo/redo engine (pure functions + composable)
├── stores/
│   └── notes.ts        # Pinia: CRUD, localStorage sync
├── types/
│   └── index.ts        # NoteLayoutState, TodoItem, HistoryDelta
└── utils/
    └── storage.ts      # localStorage helpers with schema versioning
```

<details>
<summary>Comparison with alternatives</summary>

| Feature | Todo Notes | localStorage-only apps | Server-backed apps |
|---------|-----------|----------------------|-------------------|
| Undo/redo | 50 steps, blur-aware | No | Rarely |
| Draft recovery | Auto-save + prompt | Manual | Requires backend |
| Cross-tab safety | Modal notification | Crashes or silent | WebSocket sync |
| Offline-first | Yes | Yes | No |
| Deployment | Static (Docker/GH Pages) | Static | Server required |

</details>

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Run tests: `pnpm test`
4. Submit a pull request

Code style: Biome formatter, no UI libraries, no `any`, Conventional Commits.

## License

MIT
