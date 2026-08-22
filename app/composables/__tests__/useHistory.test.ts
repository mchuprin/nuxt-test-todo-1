import { describe, expect, it, vi } from 'vitest';
import { applyDelta, reverseDelta, useHistory } from '~/composables/useHistory';
import type { HistoryDelta, Note } from '~/types';

vi.mock('vue', async () => {
	const vue = await vi.importActual<typeof import('vue')>('vue');
	return vue;
});

const makeNote = (overrides?: Partial<Note>): Note => ({
	id: 'note-1',
	title: 'Test Note',
	todos: [
		{ id: 't1', text: 'Todo 1', checked: false },
		{ id: 't2', text: 'Todo 2', checked: true },
	],
	createdAt: 1000,
	updatedAt: 1000,
	...overrides,
});

describe('applyDelta', () => {
	it('title — заменяет заголовок', () => {
		const note = makeNote();
		const delta: HistoryDelta = {
			type: 'title',
			before: 'Old',
			after: 'New',
		};
		const result = applyDelta(note, delta);
		expect(result.title).toBe('New');
	});

	it('todo-check — меняет checked по id', () => {
		const note = makeNote();
		const delta: HistoryDelta = {
			type: 'todo-check',
			id: 't1',
			before: false,
			after: true,
		};
		const result = applyDelta(note, delta);
		expect(result.todos[0].checked).toBe(true);
		expect(result.todos[1].checked).toBe(true);
	});

	it('todo-add — вставляет по индексу', () => {
		const note = makeNote();
		const newTodo = { id: 't-new', text: 'New', checked: false };
		const delta: HistoryDelta = {
			type: 'todo-add',
			item: newTodo,
			index: 1,
		};
		const result = applyDelta(note, delta);
		expect(result.todos).toHaveLength(3);
		expect(result.todos[1].id).toBe('t-new');
	});

	it('todo-delete — удаляет по id', () => {
		const note = makeNote();
		const delta: HistoryDelta = {
			type: 'todo-delete',
			item: { id: 't1', text: 'Todo 1', checked: false },
			index: 0,
		};
		const result = applyDelta(note, delta);
		expect(result.todos).toHaveLength(1);
		expect(result.todos[0].id).toBe('t2');
	});

	it('todo-text — меняет текст по id', () => {
		const note = makeNote();
		const delta: HistoryDelta = {
			type: 'todo-text',
			id: 't1',
			before: 'Todo 1',
			after: 'Updated',
		};
		const result = applyDelta(note, delta);
		expect(result.todos[0].text).toBe('Updated');
	});
});

describe('reverseDelta', () => {
	it('title — реверс заголовка', () => {
		const note = makeNote({ title: 'New' });
		const delta: HistoryDelta = {
			type: 'title',
			before: 'Old',
			after: 'New',
		};
		const result = reverseDelta(note, delta);
		expect(result.title).toBe('Old');
	});

	it('todo-check — реверс checked', () => {
		const note = makeNote();
		note.todos[0].checked = true;
		const delta: HistoryDelta = {
			type: 'todo-check',
			id: 't1',
			before: false,
			after: true,
		};
		const result = reverseDelta(note, delta);
		expect(result.todos[0].checked).toBe(false);
	});

	it('todo-add — удаляет добавленный', () => {
		const note = makeNote({
			todos: [
				{ id: 't1', text: 'Todo 1', checked: false },
				{ id: 't-new', text: 'New', checked: false },
				{ id: 't2', text: 'Todo 2', checked: true },
			],
		});
		const delta: HistoryDelta = {
			type: 'todo-add',
			item: { id: 't-new', text: 'New', checked: false },
			index: 1,
		};
		const result = reverseDelta(note, delta);
		expect(result.todos).toHaveLength(2);
		expect(result.todos.find((t) => t.id === 't-new')).toBeUndefined();
	});

	it('todo-delete — восстанавливает по индексу', () => {
		const note = makeNote({
			todos: [{ id: 't2', text: 'Todo 2', checked: true }],
		});
		const delta: HistoryDelta = {
			type: 'todo-delete',
			item: { id: 't1', text: 'Todo 1', checked: false },
			index: 0,
		};
		const result = reverseDelta(note, delta);
		expect(result.todos).toHaveLength(2);
		expect(result.todos[0].id).toBe('t1');
	});

	it('todo-text — реверс текста', () => {
		const note = makeNote();
		note.todos[0].text = 'Updated';
		const delta: HistoryDelta = {
			type: 'todo-text',
			id: 't1',
			before: 'Todo 1',
			after: 'Updated',
		};
		const result = reverseDelta(note, delta);
		expect(result.todos[0].text).toBe('Todo 1');
	});
});

describe('useHistory', () => {
	it('начальное состояние — canUndo=false, canRedo=false', () => {
		const history = useHistory();
		expect(history.canUndo.value).toBe(false);
		expect(history.canRedo.value).toBe(false);
	});

	it('push — canUndo=true, canRedo=false', () => {
		const history = useHistory();
		history.push({
			type: 'title',
			before: 'Old',
			after: 'New',
		});
		expect(history.canUndo.value).toBe(true);
		expect(history.canRedo.value).toBe(false);
	});

	it('undo — возвращает предыдущее состояние', () => {
		const history = useHistory();
		const note = makeNote();
		history.push({
			type: 'title',
			before: 'Old',
			after: 'New',
		});
		const result = history.undo(note);
		expect(result).not.toBeNull();
		expect(result!.title).toBe('Old');
	});

	it('undo — возвращает null когда нет истории', () => {
		const history = useHistory();
		const note = makeNote();
		const result = history.undo(note);
		expect(result).toBeNull();
	});

	it('redo — возвращает следующее состояние', () => {
		const history = useHistory();
		const note = makeNote();
		history.push({
			type: 'title',
			before: 'Old',
			after: 'New',
		});
		history.undo(note);
		const result = history.redo(note);
		expect(result).not.toBeNull();
		expect(result!.title).toBe('New');
	});

	it('redo — возвращает null когда нет redo', () => {
		const history = useHistory();
		const note = makeNote();
		history.push({
			type: 'title',
			before: 'Old',
			after: 'New',
		});
		const result = history.redo(note);
		expect(result).toBeNull();
	});

	it('push после undo — обрезает redo', () => {
		const history = useHistory();
		const note = makeNote();
		history.push({
			type: 'title',
			before: 'A',
			after: 'B',
		});
		history.undo(note);
		history.push({
			type: 'title',
			before: 'B',
			after: 'C',
		});
		expect(history.canRedo.value).toBe(false);
		const result = history.redo(note);
		expect(result).toBeNull();
	});

	it('несколько push/undo/redo — корректная навигация', () => {
		const history = useHistory();
		const note = makeNote();

		history.push({ type: 'title', before: 'A', after: 'B' });
		history.push({ type: 'title', before: 'B', after: 'C' });
		history.push({ type: 'title', before: 'C', after: 'D' });

		expect(history.canUndo.value).toBe(true);
		expect(history.canRedo.value).toBe(false);

		let result = history.undo(note);
		expect(result!.title).toBe('C');

		result = history.undo(note);
		expect(result!.title).toBe('B');

		result = history.redo(note);
		expect(result!.title).toBe('C');

		result = history.redo(note);
		expect(result!.title).toBe('D');

		expect(history.canRedo.value).toBe(false);
	});

	it('MAX_HISTORY=50 — push 51 раз, oldest теряется', () => {
		const history = useHistory();
		const note = makeNote();

		for (let i = 0; i < 51; i++) {
			history.push({
				type: 'title',
				before: `v${i}`,
				after: `v${i + 1}`,
			});
		}

		expect(history.canUndo.value).toBe(true);
		expect(history.canRedo.value).toBe(false);

		const result = history.undo(note);
		expect(result!.title).toBe('v50');
	});

	it('reset — canUndo=false, canRedo=false', () => {
		const history = useHistory();
		history.push({ type: 'title', before: 'A', after: 'B' });
		history.reset();
		expect(history.canUndo.value).toBe(false);
		expect(history.canRedo.value).toBe(false);
	});
});
