<script setup lang="ts">
const props = defineProps<{
	todo: { id: string; text: string; checked: boolean };
	editing?: boolean;
}>();

const emit = defineEmits<{
	check: [id: string];
	delete: [id: string];
	'update:text': [id: string, text: string];
	focus: [id: string];
	blur: [id: string, text: string];
}>();

const handleCheck = () => {
	emit('check', props.todo.id);
};

const handleDelete = () => {
	emit('delete', props.todo.id);
};

const handleTextUpdate = (text: string) => {
	emit('update:text', props.todo.id, text);
};

const handleFocus = () => {
	emit('focus', props.todo.id);
};

const handleBlur = (e: Event) => {
	const target = e.target as HTMLInputElement;
	emit('blur', props.todo.id, target.value);
};
</script>

<template>
  <div class="note-todo">
    <div
      class="note-todo__checkbox"
      :class="{ 'note-todo__checkbox--checked': todo.checked }"
      @click="handleCheck"
    >
      <img v-if="todo.checked" src="/icons/icon-check.svg" alt="" class="icon note-todo__check-icon" aria-hidden="true" />
    </div>
    <AppInput
      :model-value="todo.text"
      :class="{ 'note-todo__input--checked': todo.checked }"
      :readonly="!editing"
      placeholder="Текст задачи"
      aria-label="Текст задачи"
      @update:model-value="handleTextUpdate"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div class="note-todo__delete">
      <AppButton variant="danger" mode="plain" size="sm" aria-label="Удалить задачу" @click="handleDelete">
        <template #icon>
          <img src="/icons/icon-close.svg" alt="" class="icon" aria-hidden="true" />
        </template>
      </AppButton>
    </div>
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

	&__checkbox {
		width: 16px;
		height: 16px;
		flex-shrink: 0;
		border-radius: 4px;
		border: 1px solid var(--color-border);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: border-color $tr, background-color $tr;

		&--checked {
			border-color: rgba(95, 138, 95, 0.60);
			background-color: rgba(95, 138, 95, 0.10);
		}
	}

	&__check-icon {
		width: var(--text-sm);
		height: var(--text-sm);
	}

	:deep(.note-todo__input--checked) {
		color: var(--color-text-3);
		text-decoration: line-through;
	}

	&__delete {
		opacity: 0;
		transition: opacity $tr;
	}

	&:hover &__delete {
		opacity: 1;
	}
}
</style>
