<script setup lang="ts">
import { computed } from 'vue';

type InputVariant = 'title' | 'add';

interface Props {
	modelValue?: string;
	variant?: InputVariant;
	placeholder?: string;
	disabled?: boolean;
	readonly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	modelValue: '',
	variant: undefined,
	placeholder: '',
	disabled: false,
	readonly: false,
});

const emit = defineEmits<{
	'update:modelValue': [value: string];
}>();

const classes = computed(() => [
	'app-input',
	props.variant ? `app-input--${props.variant}` : '',
]);

const onInput = (e: Event) => {
	const target = e.target as HTMLInputElement;
	emit('update:modelValue', target.value);
};
</script>

<template>
  <input
    :class="classes"
    type="text"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :readonly="readonly"
    @input="onInput"
  />
</template>

<style lang="scss" scoped>
$tr: 200ms ease;

.app-input {
  width: 100%;
  background: transparent;
  outline: none;
  border: none;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  color: var(--color-text-1);
  padding: 0.5rem 1rem;
  border-bottom: 1px solid transparent;
  transition: color $tr, border-color $tr;

  &:focus {
    outline: 1px solid var(--color-accent);
    border-radius: 10px;
  }

  &::placeholder {
    color: var(--color-text-3);
  }

  &--title {
    font-size: var(--text-lg);
    font-weight: 500;
    padding-bottom: 8px;

    &:focus {
      border-bottom-color: var(--color-border);
    }
  }

  &--add {
    color: var(--color-text-2);
  }
}
</style>
