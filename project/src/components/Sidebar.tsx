import { useState } from 'react';
import {
  Zap,
  Plus,
  Search,
  Cpu,
  History,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Settings,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import type { ChatSession } from '@/types';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  sessions: ChatSession[];
  onDeleteSession: (id: string) => void;
  userEmail: string | null;
  onSignOut: () => void;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

export default function Sidebar({
  collapsed,
  onToggle,
  onNewChat,
  activeSessionId,
  onSelectSession,
  sessions,
  onDeleteSession,
  userEmail,
  onSignOut,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const initials = userEmail ? userEmail[0].toUpperCase() : 'Z';

  return (
    <aside
      className={`${
        collapsed ? 'w-[72px]' : 'w-[280px]'
      } shrink-0 h-screen sticky top-0 z-30 transition-all duration-300 flex flex-col glass border-r border-white/[0.06] rounded-none`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ember-500 to-ember-700 flex items-center justify-center shadow-lg shadow-ember-500/30">
              <Zap className="w-5 h-5 text-white" fill="white" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-ember-500/20 blur-md -z-10" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                Zyra<span className="text-gradient-ember">GPT</span>
              </h1>
              <p className="text-[10px] text-gray-500 mt-0.5 font-medium tracking-wide uppercase">
                Edge AI Platform
              </p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="p-3 space-y-1.5">
        <button
          onClick={onNewChat}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-ember-500/10 to-amber-500/5 border border-ember-500/20 text-ember-200 hover:from-ember-500/20 hover:to-amber-500/10 hover:border-ember-500/30 transition-all duration-200 group ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Plus className="w-4 h-4 shrink-0 group-hover:rotate-90 transition-transform duration-300" />
          {!collapsed && <span className="text-sm font-medium">New Chat</span>}
        </button>

        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Search className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">Search History</span>}
        </button>

        {showSearch && !collapsed && (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions..."
            className="w-full px-3 py-2 rounded-lg bg-ink-700/50 border border-white/[0.06] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-ember-500/30 transition-colors animate-slide-up"
            autoFocus
          />
        )}

        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <Cpu className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-sm font-medium">GPU Model Hub</span>}
        </button>
      </div>

      {/* Recent Sessions */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <div className="flex items-center gap-2 px-2 mb-2">
            <History className="w-3 h-3 text-gray-600" />
            <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">
              Recent Sessions
            </span>
          </div>
          {filteredSessions.length === 0 ? (
            <div className="px-3 py-6 text-center">
              <p className="text-xs text-gray-600">No sessions yet</p>
              <p className="text-[10px] text-gray-700 mt-1">Click "New Chat" to start</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className={`w-full flex items-start gap-2.5 px-2.5 py-2 rounded-lg text-left transition-all duration-200 group cursor-pointer ${
                    activeSessionId === session.id
                      ? 'bg-white/[0.06] text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                  onClick={() => onSelectSession(session.id)}
                >
                  <MessageSquare
                    className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                      activeSessionId === session.id ? 'text-ember-400' : 'text-gray-600'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate leading-tight">
                      {session.title}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {formatTime(session.updated_at)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="shrink-0 mt-0.5"
                  >
                    <Trash2 className="w-3 h-3 text-gray-700 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {collapsed && <div className="flex-1" />}

      {/* User Profile Card */}
      <div className="p-3 border-t border-white/[0.04]">
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-all ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ember-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-ink-800" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {userEmail ?? 'User'}
              </p>
              <p className="text-[10px] text-gray-500 truncate">Edge Plan</p>
            </div>
          )}
          {!collapsed && (
            <button
              onClick={onSignOut}
              className="p-1 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
