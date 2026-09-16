import { useState, useEffect, useCallback } from 'react';
import AmbientBackground from '@/components/AmbientBackground';
import AuthPage from '@/components/AuthPage';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import Playground from '@/components/Playground';
import {
  createSession,
  getSessions,
  getMessages,
  addMessage,
  updateSessionTitle,
  deleteSession,
  sendChatMessage,
} from '@/lib/api';
import { supabase } from '@/lib/supabase';
import type { ChatSession, ChatMessage } from '@/types';

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
  image?: string;
}

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('zyra-mini');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsAuthenticated(!!data.session);
      setUserEmail(data.session?.user?.email ?? null);
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setIsAuthenticated(!!session);
        setUserEmail(session?.user?.email ?? null);
      })();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const loadSessions = useCallback(async () => {
    const data = await getSessions();
    setSessions(data);
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadSessions();
  }, [isAuthenticated, loadSessions]);

  const loadMessages = useCallback(async (sessionId: string) => {
    const data = await getMessages(sessionId);
    setMessages(
      data.map((m: ChatMessage) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
        image: m.image_url ?? undefined,
      }))
    );
  }, []);

  const handleNewChat = useCallback(async () => {
    const session = await createSession(selectedModel);
    if (session) {
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setMessages([]);
    }
  }, [selectedModel]);

  const handleSelectSession = useCallback(
    (id: string) => {
      setActiveSessionId(id);
      loadMessages(id);
    },
    [loadMessages]
  );

  const handleDeleteSession = useCallback(
    async (id: string) => {
      await deleteSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        setActiveSessionId(null);
        setMessages([]);
      }
    },
    [activeSessionId]
  );

  const handleSendFromPlayground = useCallback(
    async (text: string) => {
      let sessionId = activeSessionId;

      if (!sessionId) {
        const session = await createSession(selectedModel);
        if (!session) return;
        sessionId = session.id;
        setSessions((prev) => [session, ...prev]);
        setActiveSessionId(session.id);
      }

      const userMsg: DisplayMessage = { role: 'user', content: text };
      const currentMessages = [...messages, userMsg];
      setMessages(currentMessages);
      setChatLoading(true);

      await addMessage(sessionId, 'user', text);

      const apiMessages = currentMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const result = await sendChatMessage(apiMessages, selectedModel);

      if ('error' in result) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: result.error, error: true },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: result.content,
            image: result.image,
          },
        ]);
        await addMessage(sessionId, 'assistant', result.content, result.image);
      }

      const title = text.length > 40 ? text.slice(0, 40) + '...' : text;
      await updateSessionTitle(sessionId, title);

      setChatLoading(false);
      loadSessions();
    },
    [activeSessionId, selectedModel, messages, loadSessions]
  );

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setSessions([]);
    setActiveSessionId(null);
    setMessages([]);
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-900">
        <div className="w-8 h-8 border-2 border-ember-500/30 border-t-ember-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <AmbientBackground />
        <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />
      </>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AmbientBackground />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNewChat={handleNewChat}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        sessions={sessions}
        onDeleteSession={handleDeleteSession}
        userEmail={userEmail}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNav selectedModel={selectedModel} onModelChange={setSelectedModel} />

        <main className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <div className="max-w-5xl mx-auto">
            <Playground
              model={selectedModel}
              messages={messages}
              onSendMessage={handleSendFromPlayground}
              loading={chatLoading}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
