<script setup lang="ts">
import type { TodoItem } from '~/types';
import type { NoteDraft } from '~/utils/storage';
import { clearNoteDraft } from '~/utils/storage';

const props = defineProps<{
	noteId: string;
	pendingDraft: NoteDraft | null;
}>();

const title = defineModel<string>('title', { required: true });
const todos = defineModel<TodoItem[]>('todos', { required: true });

const isActive = ref(false);

const open = () => {
	isActive.value = true;
};

const handleRestore = () => {
	if (!props.pendingDraft) return;
	title.value = props.pendingDraft.title;
	todos.value = props.pendingDraft.todos.map((t) => ({ ...t }));
	clearNoteDraft(props.noteId);
	isActive.value = false;
};

const handleDiscard = () => {
	clearNoteDraft(props.noteId);
	isActive.value = false;
};

defineExpose({ open });
</script>

<template>
  <AppModal :open="isActive" @close="handleDiscard">
    <template #title>
      <h2>Обнаружен черновик</h2>
    </template>
    <template #default>
      <p>Найдена сохранённая версия этой заметки. Восстановить?</p>
    </template>
    <template #actions>
      <AppButton variant="info" mode="plain" @click="handleDiscard">
        Отклонить
      </AppButton>
      <AppButton mode="filled" @click="handleRestore">
        Восстановить
      </AppButton>
    </template>
  </AppModal>
</template>
