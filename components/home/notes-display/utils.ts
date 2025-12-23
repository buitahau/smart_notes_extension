import { Note } from '@services/note-service';

export const groupNotesByDate = (notes: Note[]): { [date: string]: Note[] } => {
  const grouped: { [date: string]: Note[] } = {};

  notes.forEach((note) => {
    const dateKey = new Date(note.dateAt).toDateString();
    grouped[dateKey] = grouped[dateKey] ? [...grouped[dateKey], note] : [note];
  });

  const sortedKeys = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  const sortedGrouped: { [date: string]: Note[] } = {};
  sortedKeys.forEach((key) => {
    sortedGrouped[key] = grouped[key].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  });

  return sortedGrouped;
};
