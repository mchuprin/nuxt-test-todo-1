<script setup lang="ts">
import { NOTE_LAYOUT_KEY } from '~/constants';
import type { NoteLayoutState } from '~/types';

const layout = useState<NoteLayoutState>(NOTE_LAYOUT_KEY);

const handleGoHome = () => {
	layout.value.deletedExternally = false;
	navigateTo('/');
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="layout.deletedExternally"
        class="modal-overlay"
      >
        <div class="modal">
          <div class="modal__title">
            <h2>Заметка удалена</h2>
          </div>
          <div class="modal__message">
            Эта заметка была удалена в другой вкладке.
          </div>
          <div class="modal__actions">
            <AppButton variant="info" mode="filled" @click="handleGoHome">
              На главную
            </AppButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.60);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 400;
}

.modal {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.40);

  &__title {
    color: var(--color-text-1);
    font-size: var(--text-md);
    font-weight: 500;
    margin-bottom: 8px;
  }

  &__message {
    color: var(--color-text-2);
    font-size: var(--text-base);
    line-height: 1.6;
    margin-bottom: 24px;
  }

  &__actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
