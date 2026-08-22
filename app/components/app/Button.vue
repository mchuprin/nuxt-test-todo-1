<script setup lang="ts">
import { computed } from 'vue';

interface Props {
	variant?: 'accent' | 'danger' | 'info';
	mode?: 'filled' | 'plain';
	size?: 'sm' | 'md';
	disabled?: boolean;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'accent',
	mode: 'filled',
	size: 'sm',
	disabled: false,
	loading: false,
});

const isDisabled = computed(() => props.disabled || props.loading);

const classes = computed(() => [
	'app-button',
	`app-button--${props.variant}`,
	`app-button--${props.mode}`,
	`app-button--${props.size}`,
	{
		'app-button--disabled': isDisabled.value,
		'app-button--loading': props.loading,
	},
]);
</script>

<template>
  <button :class="classes" :disabled="isDisabled" type="button">
    <span v-if="loading" class="app-button__spinner" aria-hidden="true" />
    <span class="app-button__icon" :class="{ 'app-button__icon--hidden': loading }">
      <slot name="icon" />
    </span>
    <span class="app-button__text" :class="{ 'app-button__text--hidden': loading }">
      <slot />
    </span>
  </button>
</template>

<style lang="scss" scoped>
$tr: 200ms ease;

.app-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: fit-content;
  border: 1px solid transparent;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-weight: 500;
  cursor: pointer;
  transition: background-color $tr, color $tr, border-color $tr, opacity $tr;
  white-space: nowrap;
  user-select: none;

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }

  &--sm {
    padding: 6px 12px;
    font-size: var(--text-base);
  }

  &--md {
    padding: 10px 20px;
    font-size: var(--text-base);
  }

  &--accent#{&}--filled {
    background-color: rgba(196, 154, 108, 0.10);
    color: var(--color-accent);
    border-color: rgba(196, 154, 108, 0.20);

    img {
      color: var(--color-accent);
    }

    &:hover:not(.app-button--disabled) {
      background-color: rgba(196, 154, 108, 0.20);
    }
  }

  &--danger#{&}--filled {
    background-color: rgba(168, 96, 96, 0.15);
    color: var(--color-danger);
    border-color: rgba(168, 96, 96, 0.20);

    &:hover:not(.app-button--disabled) {
      background-color: rgba(168, 96, 96, 0.25);
    }
  }

  &--info#{&}--filled {
    background-color: rgb(255 255 255 / 0.10);
    color: #ffffff;
    border-color: rgb(255 255 255 / 0.15);

    &:hover:not(.app-button--disabled) {
      background-color: rgb(255 255 255 / 0.15);
    }
  }

  &--accent#{&}--plain {
    background-color: transparent;
    color: var(--color-accent);

    &:hover:not(.app-button--disabled) {
      background-color: rgba(196, 154, 108, 0.10);
    }
  }

  &--danger#{&}--plain {
    background-color: transparent;
    color: var(--color-danger);

    &:hover:not(.app-button--disabled) {
      background-color: rgba(168, 96, 96, 0.10);
    }
  }

  &--info#{&}--plain {
    background-color: transparent;
    color: var(--color-text-2);

    &:hover:not(.app-button--disabled) {
      color: var(--color-text-1);
      background-color: rgba(134, 127, 118, 0.10);
    }
  }

  &--disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }

  &--loading {
    cursor: wait;
  }

  &__spinner {
    position: absolute;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 600ms linear infinite;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;

    &--hidden { visibility: hidden; }

    &:empty { display: none; }

    :deep(svg),
    :deep(img) {
      display: block;
      width: var(--text-base);
      height: var(--text-base);
    }
  }

  &__text {
    &--hidden { visibility: hidden; }
    &:empty { display: none; }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
