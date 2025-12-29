import type { Note } from '@services/note-service';

export interface IntentDisplayProps {
  notes?: Note[];
  intent?: string;
  messageContent?: string;
  onNotesChange?: (notes: Note[]) => void;
}
