<script setup lang="ts">
import { computed } from 'vue';
import type { Note } from '~/types';

const PREVIEW_COUNT = 3;

const formatDate = (ts: number): string => {
	return new Date(ts).toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	});
};

const checkedCount = (todos: Note['todos']): number => {
	return todos.filter((t) => t.checked).length;
};

const props = defineProps<{
	note: Note;
}>();

defineEmits<{
	delete: [id: string];
}>();

const previewTodos = computed(() => props.note.todos.slice(0, PREVIEW_COUNT));
const remaining = computed(() => props.note.todos.length - PREVIEW_COUNT);
const displayTitle = computed(() => props.note.title.trim() || 'Без названия');
const date = computed(() => formatDate(props.note.updatedAt));
const doneCount = computed(() => checkedCount(props.note.todos));
const totalCount = computed(() => props.note.todos.length);
const hasTodos = computed(() => props.note.todos.length > 0);
</script>

<template>
  <article class="card">
    <div class="card__body">
      <div class="card__main">
        <NuxtLink :to="`/note/${note.id}`" class="card__title">
          {{ displayTitle }}
        </NuxtLink>

        <template v-if="hasTodos">
          <div class="card__todos">
            <div v-for="todo in previewTodos" :key="todo.id" class="card__todo">
              <div class="card__checkbox" :class="{ 'card__checkbox--checked': todo.checked }">
                <img v-if="todo.checked" src="/icons/icon-check.svg" alt="" class="icon card__check-icon" aria-hidden="true" />
              </div>
              <span class="card__todo-text" :class="{ 'card__todo-text--checked': todo.checked }">
                {{ todo.text || 'Пустой пункт' }}
              </span>
            </div>
            <p v-if="remaining > 0" class="card__remaining">
              +{{ remaining }} ещё
            </p>
          </div>
        </template>
        <p v-else class="card__empty-tasks">Задачи не добавлены</p>
      </div>

      <div class="card__actions">
        <NuxtLink :to="`/note/${note.id}`" class="card__action" aria-label="Редактировать" title="Редактировать">
          <img src="/icons/icon-edit.svg" alt="" class="icon" aria-hidden="true" width="15" height="15" />
        </NuxtLink>
        <AppButton variant="danger" mode="plain" size="sm" aria-label="Удалить" title="Удалить" @click="$emit('delete', note.id)">
          <template #icon>
            <img src="/icons/icon-trash.svg" alt="" class="icon" aria-hidden="true" />
          </template>
        </AppButton>
      </div>
    </div>

    <div class="card__footer">
      <span class="card__footer-item">{{ date }}</span>
      <span v-if="hasTodos" class="card__footer-item">
        {{ doneCount }}/{{ totalCount }} выполнено
      </span>
    </div>
  </article>
</template>

<style lang="scss" scoped>
$tr: 200ms ease;

.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  transition: border-color $tr;

  &:hover {
    border-color: rgba(37, 34, 32, 0.80);

    .card__actions {
      opacity: 1;
    }
  }

  &__body {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }

  &__title {
    display: block;
    color: var(--color-text-1);
    font-size: var(--text-md);
    font-weight: 500;
    line-height: 1.4;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 12px;
    cursor: pointer;
    transition: color $tr;

    &:hover {
      color: var(--color-accent);
    }
  }

  &__todos {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  &__todo {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__checkbox {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    border-radius: 3px;
    border: 1px solid var(--color-border);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color $tr, background-color $tr;

    &--checked {
      border-color: rgba(95, 138, 95, 0.50);
      background-color: rgba(95, 138, 95, 0.10);
    }
  }

  &__check-icon {
    width: 10px;
    height: 10px;
  }

  &__todo-text {
    font-size: var(--text-base);
    line-height: 1.3;
    color: var(--color-text-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    &--checked {
      color: var(--color-text-3);
      text-decoration: line-through;
    }
  }

  &__remaining {
    color: var(--color-text-3);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding-left: 24px;
  }

  &__empty-tasks {
    color: var(--color-text-3);
    font-size: var(--text-sm);
    font-style: italic;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity $tr;
  }

  &__action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    color: var(--color-text-3);
    text-decoration: none;
    cursor: pointer;
    transition: color $tr, background-color $tr;
    background: none;
    border: none;
    padding: 0;

    &:hover {
      color: var(--color-text-1);
      background-color: var(--color-surface-2);
    }
  }

  &__footer {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(37, 34, 32, 0.50);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__footer-item {
    color: var(--color-text-3);
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }
}
</style>
