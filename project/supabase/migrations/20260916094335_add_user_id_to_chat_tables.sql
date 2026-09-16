/*
# Add user_id to chat tables for multi-user auth

1. Changes
- Delete existing test rows (app is pre-launch, no real user data)
- Add user_id column to chat_sessions (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users)
- Add user_id column to chat_messages (uuid, NOT NULL, DEFAULT auth.uid(), references auth.users)

2. Security
- Drop old anon policies
- Create authenticated-only policies scoped to user_id ownership
- Each user can only see/edit their own sessions and messages

3. Important
- user_id defaults to auth.uid() so inserts from authenticated clients work without passing it
*/

-- Clear test data so we can add NOT NULL user_id column
DELETE FROM chat_messages;
DELETE FROM chat_sessions;

ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

-- Drop old anon policies
DROP POLICY IF EXISTS "anon_select_chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "anon_insert_chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "anon_update_chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "anon_delete_chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "anon_update_chat_messages" ON chat_messages;
DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;

-- Sessions: authenticated, owner-scoped
DROP POLICY IF EXISTS "select_own_sessions" ON chat_sessions;
CREATE POLICY "select_own_sessions" ON chat_sessions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_sessions" ON chat_sessions;
CREATE POLICY "insert_own_sessions" ON chat_sessions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_sessions" ON chat_sessions;
CREATE POLICY "update_own_sessions" ON chat_sessions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_sessions" ON chat_sessions;
CREATE POLICY "delete_own_sessions" ON chat_sessions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Messages: authenticated, owner-scoped
DROP POLICY IF EXISTS "select_own_messages" ON chat_messages;
CREATE POLICY "select_own_messages" ON chat_messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_messages" ON chat_messages;
CREATE POLICY "insert_own_messages" ON chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_messages" ON chat_messages;
CREATE POLICY "update_own_messages" ON chat_messages FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_messages" ON chat_messages;
CREATE POLICY "delete_own_messages" ON chat_messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);
