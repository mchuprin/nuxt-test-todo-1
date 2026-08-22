<script setup lang="ts">
import { useNotesStore } from '~/store/notes';

definePageMeta({ layout: 'default' });

const store = useNotesStore();
const deleteTarget = ref<string | null>(null);

onMounted(() => {
	store.init();
	window.addEventListener('storage', onStorage);
});

onUnmounted(() => {
	window.removeEventListener('storage', onStorage);
});

const onStorage = (e: StorageEvent) => {
	if (e.key === 'notes-app-v1') {
		store.init();
	}
};

const sorted = store.sorted;

const targetNote = computed(() =>
	deleteTarget.value ? (store.getNote(deleteTarget.value) ?? null) : null,
);

const handleDelete = (id: string) => {
	store.deleteNote(id);
	deleteTarget.value = null;
};
</script>

<template>
  <div v-if="store.notes.length === 0" class="empty">
    <div class="empty__icon">
      <img src="/icons/icon-empty-doc.svg" alt="" class="icon" aria-hidden="true" width="20" height="20" />
    </div>
    <p class="empty__text">Нет заметок</p>
    <NuxtLink to="/note/new" class="empty__link">Создать первую</NuxtLink>
  </div>

  <div v-else class="notes">
    <NoteCard
      v-for="note in store.notes"
      :key="note.id"
      :note="note"
      @delete="deleteTarget = $event"
    />
  </div>

  <AppModal :open="deleteTarget !== null" @close="deleteTarget = null">
    <template #title>
      <h2>Удалить заметку?</h2>
    </template>
    <p>
      «{{ targetNote?.title.trim() || 'Без названия' }}» будет удалена без возможности восстановления.
    </p>
    <template #actions>
        <AppButton variant="info" mode="plain" @click="deleteTarget = null">Отмена</AppButton>
        <AppButton variant="danger" mode="filled" @click="handleDelete(deleteTarget!)">Удалить</AppButton>
    </template>
  </AppModal>
</template>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 96px 0;
  text-align: center;

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: var(--color-surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  &__text {
    color: var(--color-text-3);
    font-size: var(--text-base);
  }

  &__link {
    margin-top: 16px;
    color: var(--color-accent);
    font-size: var(--text-base);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.notes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}
</style>
