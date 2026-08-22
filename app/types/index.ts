export interface TodoItem {
	id: string;
	text: string;
	checked: boolean;
}

export interface Note {
	id: string;
	title: string;
	todos: TodoItem[];
	createdAt: number;
	updatedAt: number;
}

export type HistoryDelta =
	| { type: 'title'; before: string; after: string }
	| { type: 'todo-check'; id: string; before: boolean; after: boolean }
	| { type: 'todo-add'; item: TodoItem; index: number }
	| { type: 'todo-delete'; item: TodoItem; index: number }
	| { type: 'todo-text'; id: string; before: string; after: string };

export interface NoteLayoutState {
	isDirty: boolean;
	canUndo: boolean;
	canRedo: boolean;
	noteId: string;
	isNew: boolean;
	noteTitle: string;
	noteTodos: TodoItem[];
	pendingNavigation: string | null;
	openCancel: boolean;
	deletedExternally: boolean;
	handleUndo: (() => void) | null;
	handleRedo: (() => void) | null;
}
