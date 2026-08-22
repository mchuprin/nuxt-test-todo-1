import { defineStore } from 'pinia';
import type { Note, TodoItem } from '~/types';
import { generateId, loadNotes, saveNotes } from '~/utils/storage';

export const useNotesStore = defineStore('notes', () => {
	const notes = ref<Note[]>([]);

	const sorted = computed(() =>
		[...notes.value].sort((a, b) => b.updatedAt - a.updatedAt),
	);

	const init = () => {
		notes.value = loadNotes();
	};

	const addNote = (): Note => {
		const now = Date.now();
		const note: Note = {
			id: generateId(),
			title: '',
			todos: [],
			createdAt: now,
			updatedAt: now,
		};
		notes.value = [...notes.value, note];
		saveNotes(notes.value);
		return note;
	};

	const getNote = (id: string): Note | undefined => {
		return notes.value.find((n) => n.id === id);
	};

	const updateNote = (
		id: string,
		updates: Partial<Pick<Note, 'title' | 'todos'>>,
	) => {
		notes.value = notes.value.map((n) =>
			n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n,
		);
		saveNotes(notes.value);
	};

	const deleteNote = (id: string) => {
		notes.value = notes.value.filter((note) => note.id !== id);
		saveNotes(notes.value);
	};

	const addTodo = (noteId: string, text: string): TodoItem | null => {
		if (!text.trim()) return null;
		const item: TodoItem = {
			id: generateId(),
			text: text.trim(),
			checked: false,
		};
		const note = notes.value.find((n) => n.id === noteId);
		if (!note) return null;
		updateNote(noteId, { todos: [...note.todos, item] });
		return item;
	};

	const toggleTodo = (noteId: string, todoId: string) => {
		const note = notes.value.find((n) => n.id === noteId);
		if (!note) return;
		const todos = note.todos.map((t) =>
			t.id === todoId ? { ...t, checked: !t.checked } : t,
		);
		updateNote(noteId, { todos });
	};

	const deleteTodo = (noteId: string, todoId: string) => {
		const note = notes.value.find((n) => n.id === noteId);
		if (!note) return;
		const todos = note.todos.filter((t) => t.id !== todoId);
		updateNote(noteId, { todos });
	};

	return {
		notes,
		sorted,
		init,
		addNote,
		getNote,
		updateNote,
		deleteNote,
		addTodo,
		toggleTodo,
		deleteTodo,
	};
});
