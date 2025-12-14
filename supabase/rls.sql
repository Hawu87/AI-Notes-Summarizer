-- Enable Row Level Security on notes table
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy for SELECT: Users can only see their own notes
CREATE POLICY "Users can view their own notes"
  ON notes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for INSERT: Users can only create notes for themselves
CREATE POLICY "Users can insert their own notes"
  ON notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for UPDATE: Users can only update their own notes
CREATE POLICY "Users can update their own notes"
  ON notes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for DELETE: Users can only delete their own notes
CREATE POLICY "Users can delete their own notes"
  ON notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Enable Row Level Security on summaries table (if it exists)
-- If summaries table doesn't exist, this will fail gracefully
DO $$
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'summaries') THEN
    ALTER TABLE summaries ENABLE ROW LEVEL SECURITY;

    -- Policy for SELECT: Users can only see summaries for their own notes
    CREATE POLICY "Users can view summaries for their own notes"
      ON summaries
      FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM notes
          WHERE notes.id = summaries.note_id
          AND notes.user_id = auth.uid()
        )
      );

    -- Policy for INSERT: Users can only create summaries for their own notes
    CREATE POLICY "Users can insert summaries for their own notes"
      ON summaries
      FOR INSERT
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM notes
          WHERE notes.id = summaries.note_id
          AND notes.user_id = auth.uid()
        )
      );

    -- Policy for UPDATE: Users can only update summaries for their own notes
    CREATE POLICY "Users can update summaries for their own notes"
      ON summaries
      FOR UPDATE
      USING (
        EXISTS (
          SELECT 1 FROM notes
          WHERE notes.id = summaries.note_id
          AND notes.user_id = auth.uid()
        )
      )
      WITH CHECK (
        EXISTS (
          SELECT 1 FROM notes
          WHERE notes.id = summaries.note_id
          AND notes.user_id = auth.uid()
        )
      );

    -- Policy for DELETE: Users can only delete summaries for their own notes
    CREATE POLICY "Users can delete summaries for their own notes"
      ON summaries
      FOR DELETE
      USING (
        EXISTS (
          SELECT 1 FROM notes
          WHERE notes.id = summaries.note_id
          AND notes.user_id = auth.uid()
        )
      );
  END IF;
END $$;

