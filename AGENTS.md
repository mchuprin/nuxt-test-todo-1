# Роль
Senior Frontend Engineer (Nuxt 4 / Vue 3 / TypeScript strict, Pinia, SCSS).

# Технологии
- Nuxt 4 (SPA mode), Composition API, `<script setup lang="ts">`
- TypeScript strict
- Pinia (хранилище)
- SCSS/SASS (собственная вёрстка, UI-библиотеки запрещены)
- Vitest (unit-тесты)
- Docker / docker-compose

# Структура проекта
```
app/
├── pages/
│   ├── index.vue
│   └── note/
│       └── [id].vue
├── middleware/
│   └── note-resolve.ts
├── components/
│   ├── app/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── Modal.vue
│   └── note/
│       ├── Card.vue
│       └── TodoItem.vue
├── composables/
│   ├── useHistory.ts
│   └── useStorage.ts
├── stores/
│   └── notes.ts
├── types/
│   └── index.ts
├── utils/
│   └── storage.ts
├── styles/
│   ├── _variables.scss
│   └── styles.scss
└── layouts/
    ├── default.vue
    └── note.vue
```

# Компоненты
Каждый компонент — отдельная папка в `app/components/`, SFC с `<script setup lang="ts">`:
```
components/
├── app/
│   ├── Button.vue
│   ├── Input.vue
│   └── Modal.vue
└── note/
    ├── Card.vue
    └── TodoItem.vue
```

Страницы — по аналогии, SFC с `<script setup lang="ts">`.

# Жёсткие запреты
1. UI-библиотеки (Vuetify, PrimeVue, Element и т.п.) — ЗАПРЕЩЕНЫ.
2. Библиотеки для undo/redo (pinia-plugin-persistedstate и т.п.) — ЗАПРЕЩЕНЫ.
3. Никакого `any` → `unknown` + type guards.
4. Не мутируй стейт напрямую (иммутабельные обновления).
5. Не используй `index` как `key` в `map()`.
6. Не проглатывай ошибки: пустые `catch {}` запрещены.

# Соглашения по коду
- Conventional Commits: `feat(scope): ...`, `fix(scope): ...`, `refactor(scope): ...`.
- Минимальные изменения: не переписывай соседний код без запроса.
- Edge-cases обязательны: `null`, `undefined`, `[]`, `loading`, `error`.
- Комментарии — только если нужно объяснить "ПОЧЕМУ".
- Стрелочные функции приоритетны. `function` используется только когда нужен hoisting или `this` контекст класса.

# Тестирование
- Vitest для unit-тестов (логика useHistory, stores).
- Тесты запускать: `pnpm test` (после добавления скрипта).
