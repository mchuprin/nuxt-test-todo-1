<script setup lang="ts">
const props = defineProps<{
	modelValue: string;
}>();

const emit = defineEmits<{
	'update:modelValue': [value: string];
	add: [];
}>();

const onInput = (e: Event) => {
	const target = e.target as HTMLInputElement;
	emit('update:modelValue', target.value);
};

const handleKeydown = (e: KeyboardEvent) => {
	if (e.key === 'Enter') {
		e.preventDefault();
		emit('add');
	}
};
</script>

<template>
  <div class="note-todo">
    <div class="note-todo__add-placeholder" aria-hidden="true" />
    <AppInput
      :model-value="modelValue"
      variant="add"
      placeholder="Добавить задачу..."
      aria-label="Добавить задачу"
      @input="onInput"
      @keydown="handleKeydown"
    />
  </div>
</template>

<style lang="scss" scoped>
$tr: 200ms ease;

.note-todo {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 4px;
	border-radius: 8px;
	transition: background-color $tr;

	&:hover { background-color: rgba(32, 30, 27, 0.50); }

	&__add-placeholder {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		border-radius: 4px;
		border: 1px dashed rgba(37, 34, 32, 0.50);
		transition: border-color $tr;

		.note-todo:focus-within & {
			border-color: rgba(196, 154, 108, 0.40);
		}
	}
}
</style>
