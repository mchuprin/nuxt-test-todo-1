<script setup lang="ts">
import { NOTE_LAYOUT_KEY } from '~/constants';
import type { NoteLayoutState } from '~/types';
import { clearPendingNewNoteId } from '~/utils/storage';

defineOptions({ name: 'NoteLayout' });

const layout = useState<NoteLayoutState>(NOTE_LAYOUT_KEY, () => ({
	isDirty: false,
	canUndo: false,
	canRedo: false,
	noteId: '',
	isNew: false,
	noteTitle: '',
	noteTodos: [],
	pendingNavigation: null as string | null,
	openCancel: false,
	deletedExternally: false,
	handleUndo: null as (() => void) | null,
	handleRedo: null as (() => void) | null,
}));

const handleBack = () => {
	if (layout.value.isNew || layout.value.isDirty) {
		layout.value.pendingNavigation = null;
		layout.value.openCancel = true;
	} else {
		clearPendingNewNoteId();
		navigateTo('/');
	}
};
</script>

<template>
  <div class="note-layout">
    <header class="header">
      <AppButton @click="handleBack">
        <template #icon>
          <img
            src="/icons/icon-arrow-left.svg"
            alt=""
            class="icon"
            aria-hidden="true"
            width="16"
            height="16"
          />
        </template>
        Заметки
      </AppButton>
      <span
        v-if="layout.isDirty"
        class="note-layout__dirty"
        aria-label="Есть несохранённые изменения"
      />
      <NoteHistoryActions />
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="footer-inner">
        <NoteDeleteAction />
        <div class="footer__spacer" />
        <NoteCancelAction />
        <NoteSaveAction />
      </div>
    </footer>
    <NoteDeletedNotice />
  </div>
</template>

<style lang="scss" scoped>
$tr: 200ms ease;

.note-layout {
  min-height: 100%;
  background-color: var(--color-bg);
  display: flex;
  flex-direction: column;

  &__dirty {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(196, 154, 108, 0.60);
    flex-shrink: 0;
  }
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid rgba(37, 34, 32, 0.50);

  &__history {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}

.main {
  flex: 1;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.footer {
  position: sticky;
  bottom: 0;
  border-top: 1px solid rgba(37, 34, 32, 0.50);
  background-color: rgba(15, 14, 13, 0.90);
  backdrop-filter: blur(8px);
  padding: 12px 16px;

  &-inner {
    max-width: 640px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__spacer {
    flex: 1;
  }
}
</style>
