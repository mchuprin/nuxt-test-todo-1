<script setup lang="ts">
import { useNotesStore } from '~/store/notes';

defineOptions({ name: 'DefaultLayout' });

const store = useNotesStore();
const notes = computed(() => store.notes);
</script>

<template>
  <div class="layout">
    <div class="layout__content">
      <header class="header">
        <div>
          <h1 class="header__title">Заметки</h1>
          <p v-if="notes.length > 0" class="header__count">
            {{ notes.length }} заметок
          </p>
        </div>
        <NuxtLink to="/note/new" class="header__new">
          <img src="/icons/icon-plus.svg" alt="" class="icon" aria-hidden="true" width="14" height="14" />
          Новая
        </NuxtLink>
      </header>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
$tr: 200ms ease;

.layout {
    background-color: var(--color-bg);
    height: 100%;

    &__content {
      min-height: 100%;
      max-width: 640px;
      margin: 0 auto;
      padding: 1rem 0;
    }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;

  &__title {
    color: var(--color-text-1);
    font-size: var(--text-lg);
    font-weight: 500;
    letter-spacing: -0.01em;
  }

  &__count {
    color: var(--color-text-3);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    margin-top: 2px;
  }

  &__new {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background-color: rgba(196, 154, 108, 0.10);
    color: var(--color-accent);
    border: 1px solid rgba(196, 154, 108, 0.20);
    border-radius: 8px;
    font-size: var(--text-base);
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background-color $tr;

    &:hover {
      background-color: rgba(196, 154, 108, 0.20);
    }
  }
}
</style>
