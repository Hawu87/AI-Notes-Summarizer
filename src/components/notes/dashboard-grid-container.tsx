"use client";

import { useState } from "react";
import { NotesGrid } from "./notes-grid";
import { NoteViewer } from "./note-viewer";
import { CreateNoteDialog } from "./create-note-dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  created_at_formatted: string;
  pinned?: boolean;
  pinned_at?: string | null;
};

type CreateNoteAction = (formData: FormData) => Promise<{ error?: string; success?: boolean }>;

interface DashboardGridContainerProps {
  notes: Note[];
  createNoteAction: CreateNoteAction;
  deleteNoteAction: (noteId: string) => Promise<void>;
  pinNoteAction: (noteId: string) => Promise<void>;
  unpinNoteAction: (noteId: string) => Promise<void>;
}

/**
 * Client Component: Dashboard Grid Container
 * 
 * Manages note selection, creation dialog, and deletion.
 * Shows grid view by default, switches to detail view when note is selected.
 */
export function DashboardGridContainer({
  notes,
  createNoteAction,
  deleteNoteAction,
  pinNoteAction,
  unpinNoteAction,
}: DashboardGridContainerProps) {
  const router = useRouter();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const selectedNote =
    selectedNoteId !== null
      ? notes.find((note) => note.id === selectedNoteId) || null
      : null;

  async function handleDelete(noteId: string) {
    setIsDeleting(noteId);
    const toastId = toast.loading("Deleting...");
    try {
      await deleteNoteAction(noteId);
      if (selectedNoteId === noteId) {
        setSelectedNoteId(null);
      }
      toast.success("Note deleted", { id: toastId });
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete note",
        { id: toastId }
      );
    } finally {
      setIsDeleting(null);
    }
  }

  async function handlePin(noteId: string) {
    const toastId = toast.loading("Pinning...");
    try {
      await pinNoteAction(noteId);
      toast.success("Note pinned", { id: toastId });
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to pin note",
        { id: toastId }
      );
    }
  }

  async function handleUnpin(noteId: string) {
    const toastId = toast.loading("Unpinning...");
    try {
      await unpinNoteAction(noteId);
      toast.success("Note unpinned", { id: toastId });
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to unpin note",
        { id: toastId }
      );
    }
  }

  // If a note is selected, show detail view
  if (selectedNote) {
    return (
      <div className="w-full">
        <NoteViewer
          selectedNote={selectedNote}
          onBack={() => setSelectedNoteId(null)}
        />
        <CreateNoteDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          createNoteAction={createNoteAction}
        />
      </div>
    );
  }

  // Default: show grid view
  return (
    <>
      <NotesGrid
        notes={notes}
        onNoteSelect={setSelectedNoteId}
        onNoteDelete={handleDelete}
        onNotePin={handlePin}
        onNoteUnpin={handleUnpin}
        onCreateNote={() => setShowCreateDialog(true)}
      />
      <CreateNoteDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        createNoteAction={createNoteAction}
      />
    </>
  );
}

