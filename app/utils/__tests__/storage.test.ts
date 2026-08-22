import { beforeEach, describe, expect, it } from 'vitest';
import type { Note } from '~/types';
import {
	clearNoteDraft,
	clearPendingNewNoteId,
	generateId,
	getPendingNewNoteId,
	loadNoteDraft,
	loadNotes,
	saveNoteDraft,
	saveNotes,
	setPendingNewNoteId,
} from '~/utils/storage';

const STORAGE_KEY = 'notes-app-v1';

const makeNote = (overrides?: Partial<Note>): Note => ({
	id: 'note-1',
	title: 'Test Note',
	todos: [],
	createdAt: 1000,
	updatedAt: 1000,
	...overrides,
});

beforeEach(() => {
	localStorage.clear();
});

describe('loadNotes', () => {
	it('empty localStorage - empty array', () => {
		expect(loadNotes()).toEqual([]);
	});

	it('valid data - Note array', () => {
		const note = makeNote();
		saveNotes([note]);
		const result = loadNotes();
		expect(result).toHaveLength(1);
		expect(result[0].id).toBe('note-1');
	});

	it('wrong schema version - empty array', () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ version: 999, notes: [makeNote()] }),
		);
		expect(loadNotes()).toEqual([]);
	});

	it('invalid JSON - empty array', () => {
		localStorage.setItem(STORAGE_KEY, '{broken');
		expect(loadNotes()).toEqual([]);
	});

	it('notes not an array - empty array', () => {
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify({ version: 1, notes: 'not-array' }),
		);
		expect(loadNotes()).toEqual([]);
	});
});

describe('saveNotes', () => {
	it('writes with version', () => {
		const note = makeNote();
		saveNotes([note]);
		const raw = localStorage.getItem(STORAGE_KEY);
		expect(raw).toBeTruthy();
		const data = JSON.parse(raw!);
		expect(data.version).toBe(1);
		expect(data.notes).toHaveLength(1);
	});
});

describe('generateId', () => {
	it('returns a string', () => {
		const id = generateId();
		expect(typeof id).toBe('string');
		expect(id.length).toBeGreaterThan(0);
	});

	it('uniqueness', () => {
		const ids = new Set(Array.from({ length: 100 }, () => generateId()));
		expect(ids.size).toBe(100);
	});
});

describe('drafts', () => {
	it('save + load round-trip', () => {
		const todos = [{ id: 't1', text: 'Task', checked: false }];
		saveNoteDraft('note-1', { title: 'Draft', todos });
		const draft = loadNoteDraft('note-1');
		expect(draft).not.toBeNull();
		expect(draft!.title).toBe('Draft');
		expect(draft!.todos).toHaveLength(1);
		expect(draft!.savedAt).toBeGreaterThan(0);
	});

	it('load nonexistent - null', () => {
		expect(loadNoteDraft('nope')).toBeNull();
	});

	it('clear removes draft', () => {
		saveNoteDraft('note-1', { title: 'X', todos: [] });
		clearNoteDraft('note-1');
		expect(loadNoteDraft('note-1')).toBeNull();
	});
});

describe('pending note', () => {
	it('set + get round-trip', () => {
		setPendingNewNoteId('abc');
		expect(getPendingNewNoteId()).toBe('abc');
	});

	it('get empty - null', () => {
		expect(getPendingNewNoteId()).toBeNull();
	});

	it('clear removes', () => {
		setPendingNewNoteId('abc');
		clearPendingNewNoteId();
		expect(getPendingNewNoteId()).toBeNull();
	});
});
