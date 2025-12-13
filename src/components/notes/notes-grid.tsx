"use client";

import { useState } from "react";
import { Plus, FileText, MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Note = {
  id: string;
  title: string;
  created_at: string;
  created_at_formatted: string;
};

interface NotesGridProps {
  notes: Note[];
  onNoteSelect: (noteId: string) => void;
  onNoteDelete: (noteId: string) => void;
  onCreateNote: () => void;
}

/**
 * Client Component: Notes Grid
 * 
 * Displays notes in a responsive grid layout with NotebookLM-style tiles.
 */
export function NotesGrid({
  notes,
  onNoteSelect,
  onNoteDelete,
  onCreateNote,
}: NotesGridProps) {
  const handleDelete = (noteId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm("Are you sure you want to delete this note?")) {
      onNoteDelete(noteId);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {/* Create New Note Tile */}
      <button
        onClick={onCreateNote}
        className="group flex min-h-[180px] flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/60 focus-within:ring-2 focus-within:ring-zinc-400 dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-white/20 dark:hover:shadow-black/40 dark:focus-within:ring-zinc-600"
      >
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 transition-colors duration-200 group-hover:bg-zinc-200 dark:bg-zinc-800 dark:group-hover:bg-zinc-700">
          <Plus className="h-6 w-6 text-zinc-600 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200" />
        </div>
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Create new note</span>
      </button>

      {/* Note Tiles */}
      {notes.map((note) => (
        <div
          key={note.id}
          role="button"
          tabIndex={0}
          onClick={() => onNoteSelect(note.id)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onNoteSelect(note.id);
            }
          }}
          className={cn(
            "group relative flex min-h-[180px] cursor-pointer flex-col rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-left transition-all duration-200 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/60 focus-within:ring-2 focus-within:ring-zinc-400 focus:outline-none dark:border-white/10 dark:bg-zinc-900/60 dark:hover:border-white/20 dark:hover:shadow-black/40 dark:focus-within:ring-zinc-600"
          )}
        >
          {/* Top row: Icon and Kebab menu */}
          <div className="mb-3 flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <FileText className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
            </div>
            <DropdownMenu
              trigger={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              }
            >
              <DropdownMenuItem
                onClick={(e) => {
                  e?.stopPropagation();
                  onNoteSelect(note.id);
                }}
              >
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => handleDelete(note.id, e)}
                className="text-red-400 hover:bg-red-950/20 hover:text-red-300"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenu>
          </div>

          {/* Title (truncate to 2 lines) */}
          <h3 className="mb-auto line-clamp-2 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {note.title}
          </h3>

          {/* Footer meta */}
          <div className="mt-4 text-xs text-zinc-600 dark:text-zinc-500">
            {note.created_at_formatted} · 1 note
          </div>
        </div>
      ))}
    </div>
  );
}

