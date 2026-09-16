import { supabase } from './supabase';
import type { ChatSession, ChatMessage } from '@/types';

const EDGE_FUNCTION_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

function getAuthHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json',
  };
}

// ---- Chat Sessions ----

export async function createSession(model = 'zyra-mini'): Promise<ChatSession | null> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .insert({ title: 'New Chat', model })
    .select()
    .single();
  if (error) {
    console.error('Failed to create session:', error);
    return null;
  }
  return data as ChatSession;
}

export async function getSessions(): Promise<ChatSession[]> {
  const { data, error } = await supabase
    .from('chat_sessions')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(50);
  if (error) {
    console.error('Failed to fetch sessions:', error);
    return [];
  }
  return (data ?? []) as ChatSession[];
}

export async function updateSessionTitle(id: string, title: string): Promise<void> {
  const { error } = await supabase
    .from('chat_sessions')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) console.error('Failed to update session:', error);
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase.from('chat_sessions').delete().eq('id', id);
  if (error) console.error('Failed to delete session:', error);
}

// ---- Chat Messages ----

export async function getMessages(sessionId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Failed to fetch messages:', error);
    return [];
  }
  return (data ?? []) as ChatMessage[];
}

export async function addMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  content: string,
  imageUrl?: string
): Promise<ChatMessage | null> {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      session_id: sessionId,
      role,
      content,
      image_url: imageUrl ?? null,
    })
    .select()
    .single();
  if (error) {
    console.error('Failed to add message:', error);
    return null;
  }
  return data as ChatMessage;
}

// ---- AI API calls ----

export interface ChatResult {
  content: string;
  model: string;
  image?: string;
  type?: 'text' | 'image';
}

export async function sendChatMessage(
  messages: { role: string; content: string }[],
  model: string
): Promise<ChatResult | { error: string }> {
  try {
    const headers = getAuthHeaders();
    const response = await fetch(`${EDGE_FUNCTION_BASE}/ai-chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ messages, model }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: 'Request failed' }));
      const errMsg = err.detail ? `${err.error} — ${err.detail}` : (err.error ?? `Request failed (${response.status})`);
      return { error: errMsg };
    }
    const data = await response.json();
    if (!data.content) return { error: 'No content in response' };
    return {
      content: data.content,
      model: data.model,
      image: data.image,
      type: data.type as 'text' | 'image' | undefined,
    };
  } catch (err) {
    return { error: (err as Error).message };
  }
}
