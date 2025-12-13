"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NotesList } from "./notes-list";
import { NoteViewer } from "./note-viewer";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_at_formatted: string;
};

interface DashboardContainerProps {
  notes: Note[];
}

/**
 * Client Component: Dashboard Container
 * 
 * Manages note selection state and coordinates between NotesList and NoteViewer.
 * This is the single Client Component that handles all interactivity.
 */
export function DashboardContainer({ notes }: DashboardContainerProps) {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const selectedNote =
    selectedNoteId !== null
      ? notes.find((note) => note.id === selectedNoteId) || null
      : null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Left Column: Notes List */}
      <Card className="h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <NotesList
            notes={notes.map((note) => ({
              id: note.id,
              title: note.title,
              created_at_formatted: note.created_at_formatted,
            }))}
            selectedNoteId={selectedNoteId}
            onNoteSelect={setSelectedNoteId}
          />
        </CardContent>
      </Card>

      {/* Right Column: Note Viewer */}
      <NoteViewer selectedNote={selectedNote} />
    </div>
  );
}

