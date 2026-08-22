<script setup lang="ts">
import { NOTE_LAYOUT_KEY } from '~/constants';
import { useNotesStore } from '~/store/notes';
import type { NoteLayoutState } from '~/types';
import { clearNoteDraft, clearPendingNewNoteId } from '~/utils/storage';

const layout = useState<NoteLayoutState>(NOTE_LAYOUT_KEY);
const store = useNotesStore();
const isActive = ref(false);

const handleConfirm = () => {
	if (layout.value.isNew) clearPendingNewNoteId();
	clearNoteDraft(layout.value.noteId);
	store.deleteNote(layout.value.noteId);
	navigateTo('/');
};
</script>

<template>
  <AppButton
    v-if="!layout.isNew"
    variant="danger"
    mode="plain"
    size="sm"
    aria-label="Удалить заметку"
    title="Удалить заметку"
    @click="isActive = true"
  >
    <template #icon>
      <img
        src="/icons/icon-trash-lg.svg"
        alt=""
        class="icon"
        aria-hidden="true"
        width="16"
        height="16"
      />
    </template>
  </AppButton>

  <AppModal :open="isActive" @close="isActive = false">
    <template #title>
      <h2>Удалить заметку?</h2>
    </template>
    <template #default>
      <p>Заметка будет удалена без возможности восстановления.</p>
    </template>
    <template #actions>
      <AppButton variant="info" mode="plain" @click="isActive = false">
        Отмена
      </AppButton>
      <AppButton variant="danger" mode="filled" @click="handleConfirm">
        Удалить
      </AppButton>
    </template>
  </AppModal>
</template>
