import type { Note } from '~/types';

const STORAGE_KEY = 'notes-app-v1';
const SCHEMA_VERSION = 1;

export function loadNotes(): Note[] {
	if (import.meta.server) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const data = JSON.parse(raw) as { version: number; notes: Note[] };
		if (data.version !== SCHEMA_VERSION) return [];
		return Array.isArray(data.notes) ? data.notes : [];
	} catch {
		return [];
	}
}

export function saveNotes(notes: Note[]): void {
	if (import.meta.server) return;
	const data = { version: SCHEMA_VERSION, notes };
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
	return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const PENDING_NEW_NOTE_KEY = 'notes-app-pending-new';

export function getPendingNewNoteId(): string | null {
	return localStorage.getItem(PENDING_NEW_NOTE_KEY);
}

export function setPendingNewNoteId(id: string): void {
	localStorage.setItem(PENDING_NEW_NOTE_KEY, id);
}

export function clearPendingNewNoteId(): void {
	localStorage.removeItem(PENDING_NEW_NOTE_KEY);
}

const DRAFT_PREFIX = 'notes-app-draft-';

export interface NoteDraft {
	title: string;
	todos: TodoItem[];
	savedAt: number;
}

export function saveNoteDraft(
	noteId: string,
	data: { title: string; todos: TodoItem[] },
): void {
	if (import.meta.server) return;
	const draft: NoteDraft = {
		title: data.title,
		todos: data.todos,
		savedAt: Date.now(),
	};
	localStorage.setItem(DRAFT_PREFIX + noteId, JSON.stringify(draft));
}

export function loadNoteDraft(noteId: string): NoteDraft | null {
	if (import.meta.server) return null;
	try {
		const raw = localStorage.getItem(DRAFT_PREFIX + noteId);
		if (!raw) return null;
		return JSON.parse(raw) as NoteDraft;
	} catch {
		return null;
	}
}

export function clearNoteDraft(noteId: string): void {
	if (import.meta.server) return;
	localStorage.removeItem(DRAFT_PREFIX + noteId);
}
