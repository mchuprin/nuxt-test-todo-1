# Todo Notes — Тестовое задание

Максим Чуприн, август 2026

![Nuxt](https://img.shields.io/badge/Nuxt-4.5-00DC82?logo=nuxt)
![Vue](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript)
![Tests](https://img.shields.io/badge/tests-49%20passing-brightgreen)

[English](./README.en.md)

## Задача

Создать SPA-приложение для заметок с задачами (todo). Ключевые требования: undo/redo история редактирования, автосохранение черновиков, устойчивость к одновременной работе во нескольких вкладках.

## Подход и решения

**Nuxt 4 SPA вместо SSR.** Приложение полностью клиентское — нет серверных данных, авторизации, SEO. SSR добавил бы сложность без пользы. Nuxt chosen за автоимпорты, file-based routing и встроенную интеграцию с Pinia.

**Pinia вместо localStorage напрямую.** Стор централизует CRUD-логику и отделает бизнес-от представления. localStorage — только persistence-слой через отдельный `useStorage` composable.

**Undo/redo через чистые функции + composable.** История — массив `HistoryDelta` объектов. `applyDelta` и `reverseDelta` — чистые функции, легко тестируются. Composable добавляет реактивность (ref, computed, watchEffect) поверх них. Ограничение 50 шагов — компромисс между полнотой истории и потреблением памяти. Непрерывный ввод текста объединяется в одно действие через debounce по blur/паузе (300мс).

**SCSS без UI-библиотек.** Задание требует полного контроля над стилями. Все компоненты созданы с нуля. Модальные окна с focus-trap и Escape — свой implementation, не модуль из node_modules.

**Cross-tab safety через `storage` event.** Браузер шлёт событие `storage` при изменениях в другом tab. Страница заметки слушает это событие и синхронизирует стор. Если заметка удалена в другой вкладке — показывается модальное окно вместо крэша.

**Vitest + jsdom для тестов.** 49 unit-тестов покрывают: логику useHistory (applyDelta, reverseDelta, composable), Pinia-стор (CRUD, сортировка, edge-cases), утилиты localStorage (черновики, pending notes, версия схемы). E2E-тесты не делал — не требовалось по заданию.

**Biome вместо ESLint.** Быстрее, проще конфиг, встроенный форматер. Единственное неудобство — alphabetical import sorting, который пришлось учитывать при написании кода.

## Что реализовано

- ✅ CRUD заметок (создание, редактирование, удаление)
- ✅ Undo/redo история (50 шагов, горячие клавиши Ctrl+Z / Ctrl+Shift+Z)
- ✅ Автосохранение черновиков + восстановление при загрузке
- ✅ Cross-tab safety (modal при удалении заметки в другой вкладке)
- ✅ Модальные окна с подтверждением (удаление, отмена редактирования)
- ✅ Edge-cases: прямой URL несуществующей заметки → редирект, пустые поля, null/undefined
- ✅ 49 unit-тестов (useHistory: 20, store: 15, storage: 14)
- ✅ Docker + docker-compose (multi-stage: node → nginx)
- ✅ GitHub Pages CI/CD через GitHub Actions
- ✅ TypeScript strict, Biome linting

## Известные ограничения

- **Нет e2e-тестов** — Vitest покрывает логику, но не пользовательские сценарии. Следующий шаг: Playwright.
- **Нет PWA** — Service Worker не подключен. Offline-first работает через localStorage, но нет манифеста и установки на рабочий стол.
- **Нет серверной синхронизации** — данные только в localStorage. Для multi-device нужен бэкенд.
- **История привязана к layout** — `useHistory` работает пока открыта страница редактирования. При уходе со страницы история сбрасывается (composable unmount).
- **Docker daemon не тестировался** — Dockerfile и docker-compose написаны корректно, но `docker build` не запускался в рамках задания (Docker daemon не был доступен).

## Как запустить

```bash
# Через Docker
docker-compose up
# Откройте http://localhost:3000

# Через pnpm
pnpm install
pnpm dev
# Откройте http://localhost:3000

# Тесты
pnpm test

# Линтер
pnpm lint
```

Ожидаемый результат: приложение открывается на `localhost:3000`, список заметок пуст, кнопка «Создать заметку» доступна. Тесты: 49/49 green.
