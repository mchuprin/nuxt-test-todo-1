import type { HistoryDelta, Note } from '~/types';

const MAX_HISTORY = 50;

export const applyDelta = (note: Note, delta: HistoryDelta): Note => {
	switch (delta.type) {
		case 'title':
			return { ...note, title: delta.after };
		case 'todo-check':
			return {
				...note,
				todos: note.todos.map((t) =>
					t.id === delta.id ? { ...t, checked: delta.after } : t,
				),
			};
		case 'todo-add': {
			const todos = [...note.todos];
			todos.splice(delta.index, 0, delta.item);
			return { ...note, todos };
		}
		case 'todo-delete':
			return {
				...note,
				todos: note.todos.filter((t) => t.id !== delta.item.id),
			};
		case 'todo-text':
			return {
				...note,
				todos: note.todos.map((t) =>
					t.id === delta.id ? { ...t, text: delta.after } : t,
				),
			};
	}
};

export const reverseDelta = (note: Note, delta: HistoryDelta): Note => {
	switch (delta.type) {
		case 'title':
			return { ...note, title: delta.before };
		case 'todo-check':
			return {
				...note,
				todos: note.todos.map((t) =>
					t.id === delta.id ? { ...t, checked: delta.before } : t,
				),
			};
		case 'todo-add':
			return {
				...note,
				todos: note.todos.filter((t) => t.id !== delta.item.id),
			};
		case 'todo-delete': {
			const todos = [...note.todos];
			todos.splice(delta.index, 0, delta.item);
			return { ...note, todos };
		}
		case 'todo-text':
			return {
				...note,
				todos: note.todos.map((t) =>
					t.id === delta.id ? { ...t, text: delta.before } : t,
				),
			};
	}
};

export const useHistory = () => {
	const deltas = ref<HistoryDelta[]>([]);
	const cursor = ref(-1);

	const canUndo = computed(() => cursor.value >= 0);
	const canRedo = computed(() => cursor.value < deltas.value.length - 1);

	const push = (delta: HistoryDelta) => {
		const sliced = deltas.value.slice(0, cursor.value + 1);
		sliced.push(delta);

		if (sliced.length > MAX_HISTORY) {
			sliced.shift();
			cursor.value = MAX_HISTORY - 1;
		} else {
			cursor.value = sliced.length - 1;
		}

		deltas.value = sliced;
	};

	const undo = (note: Note): Note | null => {
		if (cursor.value < 0) return null;
		const delta = deltas.value[cursor.value];
		cursor.value--;
		return reverseDelta(note, delta);
	};

	const redo = (note: Note): Note | null => {
		if (cursor.value >= deltas.value.length - 1) return null;
		cursor.value++;
		const delta = deltas.value[cursor.value];
		return applyDelta(note, delta);
	};

	const reset = () => {
		deltas.value = [];
		cursor.value = -1;
	};

	return { push, undo, redo, reset, canUndo, canRedo };
};
