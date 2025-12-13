"use client";

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

type Note = {
  id: string;
  title: string;
  created_at_formatted: string;
};

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
}

/**
 * Client Component: Notes List
 * 
 * Displays clickable list of notes with selection state.
 * Handles note selection interactivity.
 */
export function NotesList({
  notes,
  selectedNoteId,
  onNoteSelect,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            No notes yet. Create your first note to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-16rem)]">
      <div className="px-6 pb-4">
        {notes.map((note, index) => (
          <div key={note.id}>
            <button
              className={`w-full text-left transition-colors ${
                selectedNoteId === note.id
                  ? "bg-zinc-200 dark:bg-zinc-800"
                  : "hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
              type="button"
              onClick={() => onNoteSelect(note.id)}
            >
              <div className="px-4 py-4">
                <h3 className="font-medium text-black dark:text-zinc-50">
                  {note.title}
                </h3>
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {note.created_at_formatted}
                </p>
              </div>
            </button>
            {index < notes.length - 1 && <Separator className="mx-4" />}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

