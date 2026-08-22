<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();

const handleError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="error">
    <div class="error__icon">
      <img
        src="/icons/icon-empty-doc.svg"
        alt=""
        class="icon"
        aria-hidden="true"
        width="20"
        height="20"
      />
    </div>
    <h1 class="error__title">Что-то пошло не так</h1>
    <p class="error__description">Попробуйте вернуться на главную</p>
    <AppButton @click="handleError">На главную</AppButton>
  </div>
</template>

<style lang="scss" scoped>
.error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background-color: var(--color-surface-2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 16px;
  }

  &__title {
    color: var(--color-text-1);
    font-size: var(--text-md);
    font-weight: 500;
    margin-bottom: 8px;
  }

  &__description {
    color: var(--color-text-3);
    font-size: var(--text-base);
    margin-bottom: 24px;
  }
}
</style>
