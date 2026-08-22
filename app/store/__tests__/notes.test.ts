import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useNotesStore } from '~/store/notes';
import type { Note } from '~/types';

const STORAGE_KEY = 'notes-app-v1';

const makeNote = (overrides?: Partial<Note>): Note => ({
	id: 'note-1',
	title: 'Test Note',
	todos: [],
	createdAt: 1000,
	updatedAt: 1000,
	...overrides,
});

const saveToStorage = (notes: Note[]) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, notes }));
};

beforeEach(() => {
	vi.useFakeTimers();
	setActivePinia(createPinia());
	localStorage.clear();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('init', () => {
	it('loads from localStorage', () => {
		const note = makeNote();
		saveToStorage([note]);
		const store = useNotesStore();
		store.init();
		expect(store.notes).toHaveLength(1);
		expect(store.notes[0].id).toBe('note-1');
	});

	it('empty localStorage - empty array', () => {
		const store = useNotesStore();
		store.init();
		expect(store.notes).toHaveLength(0);
	});
});

describe('addNote', () => {
	it('creates with id, empty title, timestamps', () => {
		const store = useNotesStore();
		const note = store.addNote();
		expect(note.id).toBeTruthy();
		expect(note.title).toBe('');
		expect(note.todos).toEqual([]);
		expect(note.createdAt).toBeGreaterThan(0);
		expect(note.updatedAt).toBeGreaterThan(0);
	});

	it('saves to localStorage', () => {
		const store = useNotesStore();
		store.addNote();
		const raw = localStorage.getItem(STORAGE_KEY);
		expect(raw).toBeTruthy();
		const data = JSON.parse(raw!);
		expect(data.version).toBe(1);
		expect(data.notes).toHaveLength(1);
	});
});

describe('getNote', () => {
	it('finds by id', () => {
		const store = useNotesStore();
		const created = store.addNote();
		const found = store.getNote(created.id);
		expect(found).toBeDefined();
		expect(found!.id).toBe(created.id);
	});

	it('undefined for nonexistent', () => {
		const store = useNotesStore();
		expect(store.getNote('nope')).toBeUndefined();
	});
});

describe('updateNote', () => {
	it('updates title and todos', () => {
		const store = useNotesStore();
		const note = store.addNote();
		store.updateNote(note.id, {
			title: 'Updated',
			todos: [{ id: 't1', text: 'Todo', checked: false }],
		});
		const updated = store.getNote(note.id);
		expect(updated!.title).toBe('Updated');
		expect(updated!.todos).toHaveLength(1);
	});

	it('changes updatedAt', () => {
		const store = useNotesStore();
		const note = store.addNote();
		const before = note.updatedAt;
		vi.advanceTimersByTime(10);
		store.updateNote(note.id, { title: 'X' });
		const updated = store.getNote(note.id);
		expect(updated!.updatedAt).toBeGreaterThan(before);
	});
});

describe('deleteNote', () => {
	it('removes from array and localStorage', () => {
		const store = useNotesStore();
		const note = store.addNote();
		store.deleteNote(note.id);
		expect(store.notes).toHaveLength(0);
		expect(store.getNote(note.id)).toBeUndefined();
		const raw = localStorage.getItem(STORAGE_KEY);
		const data = JSON.parse(raw!);
		expect(data.notes).toHaveLength(0);
	});
});

describe('addTodo', () => {
	it('adds todo and returns TodoItem', () => {
		const store = useNotesStore();
		const note = store.addNote();
		const item = store.addTodo(note.id, 'Buy milk');
		expect(item).not.toBeNull();
		expect(item!.text).toBe('Buy milk');
		expect(item!.checked).toBe(false);
		const updated = store.getNote(note.id);
		expect(updated!.todos).toHaveLength(1);
	});

	it('null for empty text', () => {
		const store = useNotesStore();
		const note = store.addNote();
		expect(store.addTodo(note.id, '')).toBeNull();
		expect(store.addTodo(note.id, '   ')).toBeNull();
	});

	it('null for nonexistent noteId', () => {
		const store = useNotesStore();
		expect(store.addTodo('nope', 'text')).toBeNull();
	});
});

describe('toggleTodo', () => {
	it('flips checked', () => {
		const store = useNotesStore();
		const note = store.addNote();
		const item = store.addTodo(note.id, 'Task');
		store.toggleTodo(note.id, item!.id);
		const updated = store.getNote(note.id);
		expect(updated!.todos[0].checked).toBe(true);
	});
});

describe('deleteTodo', () => {
	it('removes todo', () => {
		const store = useNotesStore();
		const note = store.addNote();
		const item = store.addTodo(note.id, 'Task');
		store.deleteTodo(note.id, item!.id);
		const updated = store.getNote(note.id);
		expect(updated!.todos).toHaveLength(0);
	});
});

describe('sorted', () => {
	it('sorts by updatedAt DESC', () => {
		const store = useNotesStore();
		const n1 = store.addNote();
		vi.advanceTimersByTime(10);
		store.updateNote(n1.id, { title: 'A' });
		vi.advanceTimersByTime(10);
		const n2 = store.addNote();
		vi.advanceTimersByTime(10);
		store.updateNote(n2.id, { title: 'B' });
		expect(store.sorted[0].title).toBe('B');
		expect(store.sorted[1].title).toBe('A');
	});
});
