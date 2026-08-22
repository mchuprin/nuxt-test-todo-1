<script setup lang="ts">
import { useNoteEditor } from '~/composables/useNoteEditor';
import { NOTE_LAYOUT_KEY } from '~/constants';
import { useNotesStore } from '~/store/notes';
import type { NoteLayoutState, TodoItem } from '~/types';
import type { NoteDraft } from '~/utils/storage';
import { clearNoteDraft, loadNoteDraft } from '~/utils/storage';

definePageMeta({ layout: 'note', middleware: 'note-resolve' });

const store = useNotesStore();
const route = useRoute();
const noteId = computed(
	() => store.notes.find((note) => note.id === route.params.id)?.id ?? '',
);

const layout = useState<NoteLayoutState>(NOTE_LAYOUT_KEY);

const isNew = computed(() => route.hash === '#new');

const editor = useNoteEditor(noteId, isNew);

const {
	noteTitle,
	noteTodos,
	noteTodosNotChecked,
	noteTodosChecked,
	newTodoText,
	isDirty,
	history,
	handleTitleFocus,
	handleTitleBlur,
	handleTodoAdd,
	handleTodoCheck,
	handleTodoDelete,
	handleTodoTextUpdate,
	handleTodoTextFocus,
	handleTodoTextBlur,
	handleUndo,
	handleRedo,
	init,
	cleanup,
} = editor;

const draftRestore = ref();
const pendingDraft = ref<NoteDraft | null>(null);
const wasInitiallyFound = ref(false);

const todosEqual = (a: TodoItem[], b: TodoItem[]): boolean => {
	if (a.length !== b.length) return false;
	return a.every((item, i) => {
		const other = b[i];
		return (
			other &&
			item.id === other.id &&
			item.text === other.text &&
			item.checked === other.checked
		);
	});
};

watchEffect(() => {
	layout.value.noteId = noteId.value;
	layout.value.isNew = isNew.value;
	layout.value.isDirty = isDirty.value;
	layout.value.noteTitle = noteTitle.value;
	layout.value.noteTodos = noteTodos.value;
	layout.value.canUndo = history.canUndo.value;
	layout.value.canRedo = history.canRedo.value;
	layout.value.handleUndo = handleUndo;
	layout.value.handleRedo = handleRedo;
});

onMounted(() => {
	const found = store.getNote(noteId.value);
	wasInitiallyFound.value = !!found;
	init(found);

	const draft = loadNoteDraft(noteId.value);
	if (draft) {
		const draftChanged =
			draft.title !== noteTitle.value ||
			!todosEqual(draft.todos, noteTodos.value);
		if (draftChanged) {
			pendingDraft.value = draft;
			draftRestore.value?.open();
		} else {
			clearNoteDraft(noteId.value);
		}
	}
});

const onStorage = (e: StorageEvent) => {
	if (e.key !== 'notes-app-v1') return;
	store.init();
	if (wasInitiallyFound.value && !store.getNote(route.params.id as string)) {
		layout.value.deletedExternally = true;
	}
};

onMounted(() => {
	window.addEventListener('storage', onStorage);
});

onUnmounted(() => {
	window.removeEventListener('storage', onStorage);
	cleanup();
});
</script>

<template>
  <template v-if="!noteId">
    <div class="note__empty">Заметка не найдена</div>
    <NuxtLink to="/" class="note__back">← Назад к списку</NuxtLink>
  </template>

  <template v-else>
    <AppInput
      v-model="noteTitle"
      variant="title"
      placeholder="Название заметки"
      aria-label="Название заметки"
      @focus="handleTitleFocus"
      @blur="handleTitleBlur"
    />

    <div>
      <p class="note__section-label">Задачи</p>
      <div v-if="noteTodos.length === 0" class="note__empty">
        Пока нет задач
      </div>

      <div class="note__todos">
        <NoteTodoItem
          v-for="todo in noteTodosNotChecked"
          :key="todo.id"
          :todo="todo"
          editing
          @check="handleTodoCheck"
          @delete="handleTodoDelete"
          @update:text="handleTodoTextUpdate"
          @focus="handleTodoTextFocus"
          @blur="handleTodoTextBlur"
        />

        <NoteTodoItem
          v-for="todo in noteTodosChecked"
          :key="todo.id"
          :todo="todo"
          editing
          @check="handleTodoCheck"
          @delete="handleTodoDelete"
          @update:text="handleTodoTextUpdate"
          @focus="handleTodoTextFocus"
          @blur="handleTodoTextBlur"
        />
      </div>

      <NoteTodoAdd v-model="newTodoText" @add="handleTodoAdd" />
    </div>
  </template>

  <NoteDraftRestore
    ref="draftRestore"
    v-model:title="noteTitle"
    v-model:todos="noteTodos"
    :note-id="noteId"
    :pending-draft="pendingDraft"
  />
</template>

<style lang="scss" scoped>
$tr: 200ms ease;

.note {
  &__back {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--color-text-2);
    font-size: var(--text-base);
    text-decoration: none;
    cursor: pointer;
    transition: color $tr;

    &:hover { color: var(--color-text-1); }
  }

  &__section-label {
    color: var(--color-text-3);
    font-family: var(--font-sans);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 8px;
  }

  &__todos {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__empty {
    color: var(--color-text-3);
    font-size: var(--text-base);
    padding: 8px 0;
  }
}
</style>
