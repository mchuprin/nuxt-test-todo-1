<script setup lang="ts">
import { NOTE_LAYOUT_KEY } from '~/constants';
import type { NoteLayoutState } from '~/types';

const layout = useState<NoteLayoutState>(NOTE_LAYOUT_KEY);

const isInputFocused = () => {
	const el = document.activeElement;
	return el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement;
};

const handleKeydown = (e: KeyboardEvent) => {
	const mod = e.metaKey || e.ctrlKey;
	if (!mod) return;

	if (e.key === 'z' && !e.shiftKey) {
		e.preventDefault();
		if (!isInputFocused()) layout.value.handleUndo?.();
	}

	if (e.key === 'z' && e.shiftKey) {
		e.preventDefault();
		if (!isInputFocused()) layout.value.handleRedo?.();
	}

	if (e.key === 'y') {
		e.preventDefault();
		if (!isInputFocused()) layout.value.handleRedo?.();
	}
};

onMounted(() => {
	document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="header__history">
    <AppButton
      variant="info"
      mode="plain"
      size="sm"
      :disabled="!layout.canUndo"
      aria-label="Отменить (Ctrl+Z)"
      title="Отменить (Ctrl+Z)"
      @click="layout.handleUndo?.()"
    >
      <template #icon>
        <img
          src="/icons/icon-undo.svg"
          alt=""
          class="icon"
          aria-hidden="true"
          width="16"
          height="16"
        />
      </template>
    </AppButton>
    <AppButton
      variant="info"
      mode="plain"
      size="sm"
      :disabled="!layout.canRedo"
      aria-label="Повторить (Ctrl+Shift+Z)"
      title="Повторить (Ctrl+Shift+Z)"
      @click="layout.handleRedo?.()"
    >
      <template #icon>
        <img
          src="/icons/icon-redo.svg"
          alt=""
          class="icon"
          aria-hidden="true"
          width="16"
          height="16"
        />
      </template>
    </AppButton>
  </div>
</template>
