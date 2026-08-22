import { useHistory } from '~/composables/useHistory';
import { useNotesStore } from '~/store/notes';
import type { Note, TodoItem } from '~/types';
import {
	clearNoteDraft,
	clearPendingNewNoteId,
	saveNoteDraft,
} from '~/utils/storage';

export const useNoteEditor = (noteId: Ref<string>, isNew: Ref<boolean>) => {
	const store = useNotesStore();

	const noteTitle = ref('');
	const noteTodos = ref<TodoItem[]>([]);
	const titleBefore = ref('');
	const todosBefore = ref<TodoItem[]>([]);
	const newTodoText = ref('');

	const noteTodosNotChecked = computed(() =>
		noteTodos.value.filter((n) => !n.checked),
	);
	const noteTodosChecked = computed(() =>
		noteTodos.value.filter((n) => n.checked),
	);

	const isDirty = computed(() => {
		if (noteTitle.value !== titleBefore.value) return true;
		if (noteTodos.value.length !== todosBefore.value.length) return true;
		return noteTodos.value.some((t, i) => {
			const prev = todosBefore.value[i];
			return (
				!prev ||
				t.id !== prev.id ||
				t.text !== prev.text ||
				t.checked !== prev.checked
			);
		});
	});

	let draftTimer: ReturnType<typeof setTimeout> | null = null;

	const saveDraftDebounced = () => {
		if (draftTimer) clearTimeout(draftTimer);
		draftTimer = setTimeout(() => {
			if (isDirty.value && noteId.value) {
				saveNoteDraft(noteId.value, {
					title: noteTitle.value,
					todos: noteTodos.value,
				});
			}
		}, 1000);
	};

	watch([noteTitle, noteTodos], () => {
		saveDraftDebounced();
	});

	const removeDraft = () => {
		if (draftTimer) clearTimeout(draftTimer);
		if (noteId.value) clearNoteDraft(noteId.value);
	};

	// --- History ---
	const history = useHistory();

	const buildSnapshot = (): Note => ({
		id: noteId.value || '',
		title: noteTitle.value,
		todos: noteTodos.value,
		createdAt: 0,
		updatedAt: 0,
	});

	const applySnapshot = (note: Note) => {
		noteTitle.value = note.title;
		noteTodos.value = note.todos.map((t) => ({ ...t }));
	};

	const handleUndo = () => {
		const prev = history.undo(buildSnapshot());
		if (prev) applySnapshot(prev);
	};

	const handleRedo = () => {
		const next = history.redo(buildSnapshot());
		if (next) applySnapshot(next);
	};

	// --- Todo actions ---
	const handleTodoAdd = () => {
		if (!newTodoText.value.trim()) return;
		const item: TodoItem = {
			id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
			text: newTodoText.value.trim(),
			checked: false,
		};
		const index = noteTodos.value.length;
		noteTodos.value = [...noteTodos.value, item];
		newTodoText.value = '';

		history.push({ type: 'todo-add', item, index });
	};

	const handleTodoCheck = (id: string) => {
		const todo = noteTodos.value.find((t) => t.id === id);
		if (!todo) return;
		const before = todo.checked;
		const after = !todo.checked;

		noteTodos.value = noteTodos.value.map((t) =>
			t.id === id ? { ...t, checked: after } : t,
		);

		history.push({ type: 'todo-check', id, before, after });
	};

	const handleTodoDelete = (id: string) => {
		const index = noteTodos.value.findIndex((t) => t.id === id);
		if (index === -1) return;
		const item = noteTodos.value[index];

		noteTodos.value = noteTodos.value.filter((t) => t.id !== id);

		history.push({ type: 'todo-delete', item, index });
	};

	// --- Todo text history on blur ---
	const todoTextFocusSnapshots = new Map<string, string>();

	const handleTodoTextUpdate = (id: string, text: string) => {
		noteTodos.value = noteTodos.value.map((t) =>
			t.id === id ? { ...t, text } : t,
		);
	};

	const handleTodoTextFocus = (id: string) => {
		const todo = noteTodos.value.find((t) => t.id === id);
		if (todo) todoTextFocusSnapshots.set(id, todo.text);
	};

	const handleTodoTextBlur = (id: string, text: string) => {
		const before = todoTextFocusSnapshots.get(id) ?? '';
		todoTextFocusSnapshots.delete(id);
		if (before !== text) {
			history.push({ type: 'todo-text', id, before, after: text });
		}
	};

	// --- Title history on blur ---
	const titleFocusValue = ref('');

	const handleTitleFocus = () => {
		titleFocusValue.value = noteTitle.value;
	};

	const handleTitleBlur = () => {
		const before = titleFocusValue.value;
		const after = noteTitle.value;
		if (before !== after) {
			history.push({ type: 'title', before, after });
		}
	};

	// --- Save / Delete / Cancel ---
	const handleSave = () => {
		if (isNew.value) clearPendingNewNoteId();
		removeDraft();
		store.updateNote(noteId.value, {
			title: noteTitle.value,
			todos: noteTodos.value,
		});
		history.reset();
		navigateTo('/');
	};

	const handleDelete = () => {
		if (isNew.value) clearPendingNewNoteId();
		removeDraft();
		store.deleteNote(noteId.value);
		history.reset();
		navigateTo('/');
	};

	const handleCancel = () => {
		if (isNew.value) {
			clearPendingNewNoteId();
			store.deleteNote(noteId.value);
		}
		removeDraft();
		history.reset();
		navigateTo('/');
	};

	// --- Init ---
	const init = (found: Note | undefined) => {
		if (found) {
			noteTitle.value = found.title;
			noteTodos.value = found.todos.map((t) => ({ ...t }));
			titleBefore.value = found.title;
			todosBefore.value = found.todos.map((t) => ({ ...t }));
		}
	};

	// --- Cleanup ---
	const cleanup = () => {
		if (draftTimer) clearTimeout(draftTimer);
	};

	return {
		noteTitle,
		noteTodos,
		newTodoText,
		noteTodosNotChecked,
		noteTodosChecked,
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
		handleSave,
		handleDelete,
		handleCancel,
		init,
		cleanup,
	};
};
