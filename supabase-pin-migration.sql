-- Migration: Add pinned functionality to notes table
-- Run this in your Supabase SQL Editor

-- Add pinned column (boolean, default false)
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT false;

-- Add pinned_at column (timestamptz, nullable)
ALTER TABLE notes 
ADD COLUMN IF NOT EXISTS pinned_at TIMESTAMPTZ;

-- Create index to support efficient sorting by pinned status
-- This index supports: pinned DESC, pinned_at DESC (nulls last), created_at DESC
CREATE INDEX IF NOT EXISTS idx_notes_user_pinned_sort 
ON notes(user_id, pinned DESC, pinned_at DESC NULLS LAST, created_at DESC);

-- Note: RLS policies for UPDATE and DELETE already exist in rls.sql
-- They ensure users can only update/delete their own notes

