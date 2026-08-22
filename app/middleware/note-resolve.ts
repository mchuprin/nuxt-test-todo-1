import { useNotesStore } from '~/store/notes';
import { getPendingNewNoteId, setPendingNewNoteId } from '~/utils/storage';

export default defineNuxtRouteMiddleware((to) => {
	const id = to.params.id as string;

	const store = useNotesStore();
	store.init();

	if (id !== 'new') return;

	const pendingId = getPendingNewNoteId();
	let noteId: string;

	if (pendingId && store.getNote(pendingId)) {
		noteId = pendingId;
	} else {
		const created = store.addNote();
		noteId = created.id;
		setPendingNewNoteId(noteId);
	}

	return navigateTo(`/note/${noteId}#new`);
});
