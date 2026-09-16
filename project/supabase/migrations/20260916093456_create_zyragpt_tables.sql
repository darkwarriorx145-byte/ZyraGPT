/*
# Create ZyraGPT chat tables (single-tenant, no auth)

1. New Tables
- `chat_sessions` — stores conversation sessions with title and model used
  - id (uuid, primary key)
  - title (text, not null) — session title shown in sidebar
  - model (text, not null, default 'zyra-mini') — which AI model was active
  - created_at (timestamptz)
  - updated_at (timestamptz)
- `chat_messages` — stores individual messages within sessions
  - id (uuid, primary key)
  - session_id (uuid, foreign key to chat_sessions, cascade delete)
  - role (text, not null) — 'user' or 'assistant'
  - content (text, not null) — message text
  - image_url (text, nullable) — for image generation results
  - created_at (timestamptz)

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated full CRUD because this is a single-tenant app with no sign-in.
- All data is intentionally shared/public.

3. Indexes
- Index on chat_messages.session_id for fast message lookups.
- Index on chat_sessions.updated_at for sidebar sorting.
*/

CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New Chat',
  model text NOT NULL DEFAULT 'zyra-mini',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL DEFAULT '',
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON chat_sessions(updated_at DESC);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_chat_sessions" ON chat_sessions;
CREATE POLICY "anon_select_chat_sessions" ON chat_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_sessions" ON chat_sessions;
CREATE POLICY "anon_insert_chat_sessions" ON chat_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chat_sessions" ON chat_sessions;
CREATE POLICY "anon_update_chat_sessions" ON chat_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_sessions" ON chat_sessions;
CREATE POLICY "anon_delete_chat_sessions" ON chat_sessions FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_chat_messages" ON chat_messages;
CREATE POLICY "anon_select_chat_messages" ON chat_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_chat_messages" ON chat_messages;
CREATE POLICY "anon_insert_chat_messages" ON chat_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_chat_messages" ON chat_messages;
CREATE POLICY "anon_update_chat_messages" ON chat_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_chat_messages" ON chat_messages;
CREATE POLICY "anon_delete_chat_messages" ON chat_messages FOR DELETE
  TO anon, authenticated USING (true);
