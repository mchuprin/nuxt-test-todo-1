<script setup lang="ts">
import { NOTE_LAYOUT_KEY } from '~/constants';
import { useNotesStore } from '~/store/notes';
import type { NoteLayoutState } from '~/types';
import { clearNoteDraft, clearPendingNewNoteId } from '~/utils/storage';

const layout = useState<NoteLayoutState>(NOTE_LAYOUT_KEY);
const store = useNotesStore();
const isActive = ref(false);

watch(
	() => layout.value.openCancel,
	(val) => {
		if (val) {
			isActive.value = true;
			layout.value.openCancel = false;
		}
	},
);

const handleConfirm = () => {
	if (layout.value.isNew) {
		clearPendingNewNoteId();
		store.deleteNote(layout.value.noteId);
	}
	clearNoteDraft(layout.value.noteId);
	const target = layout.value.pendingNavigation || '/';
	layout.value.pendingNavigation = null;
	navigateTo(target);
};
</script>

<template>
  <AppButton variant="info" mode="plain" @click="isActive = true">
    Отмена
  </AppButton>

  <AppModal :open="isActive" @close="isActive = false">
    <template #title>
      <h2>Вернуться к заметкам?</h2>
    </template>
    <template #default>
      <p v-if="layout.isNew && layout.isDirty">Несохранённая заметка будет удалена.</p>
    </template>
    <template #actions>
      <AppButton variant="info" mode="plain" @click="isActive = false">
        Отмена
      </AppButton>
      <AppButton variant="danger" mode="filled" @click="handleConfirm">
        Покинуть страницу
      </AppButton>
    </template>
  </AppModal>
</template>
