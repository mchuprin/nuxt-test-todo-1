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
	store.updateNote(layout.value.noteId, {
		title: layout.value.noteTitle,
		todos: layout.value.noteTodos,
	});
	navigateTo('/');
};
</script>

<template>
  <AppButton
    :disabled="!layout.isDirty"
    variant="accent"
    mode="filled"
    @click="isActive = true"
  >
    Сохранить
  </AppButton>

  <AppModal :open="isActive" @close="isActive = false">
    <template #title>
      <h2>Сохранить заметку?</h2>
    </template>
    <template #actions>
      <AppButton variant="info" mode="plain" @click="isActive = false">
        Отмена
      </AppButton>
      <AppButton mode="filled" @click="handleConfirm">
        Сохранить
      </AppButton>
    </template>
  </AppModal>
</template>
