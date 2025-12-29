import type { Note } from '@services/note-service';

export const groupNotesByDate = (notes: Note[]): Record<string, Note[]> => {
  const grouped: Record<string, Note[]> = {};

  notes.forEach((note) => {
    const dateKey = new Date(note.dateAt).toDateString();
    grouped[dateKey] = [...(grouped[dateKey] ?? []), note];
  });

  return Object.keys(grouped)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    .reduce<Record<string, Note[]>>((acc, key) => {
      acc[key] = grouped[key].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return acc;
    }, {});
};
