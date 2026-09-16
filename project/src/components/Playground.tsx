import { useEffect, useRef, useState } from 'react';
import { Loader2, Send, Sparkles, Zap } from 'lucide-react';

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
  image?: string;
}

interface PlaygroundProps {
  model: string;
  messages: DisplayMessage[];
  onSendMessage: (text: string) => void;
  loading: boolean;
}

const TEXT_SUGGESTIONS = [
  'Explain edge computing in 3 sentences',
  'Write a haiku about GPU inference',
  'Compare L40S vs A100 for AI workloads',
  'Generate an image of a futuristic city skyline',
  'Make an image of a cat wearing a spacesuit',
];

export default function Playground({ messages, onSendMessage, loading }: PlaygroundProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend() {
    if (!input.trim() || loading) return;
    onSendMessage(input.trim());
    setInput('');
  }

  return (
    <div className="glass-card p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="glow-badge glow-ember">
            <Zap className="w-3 h-3" />
            Inference at the Edge
          </span>
          <span className="glow-badge glow-amber">GPU Accelerated</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
          Text Generate
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Ask ZyraGPT anything and get fast responses from edge AI.
        </p>
      </div>

      <div className="min-h-[500px] flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ember-500/10 border border-ember-500/20 mb-4">
              <Sparkles className="w-8 h-8 text-ember-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
            <p className="text-sm text-gray-500 mb-6">
              Ask anything — responses are generated on edge GPUs.
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
              {TEXT_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setInput(suggestion)}
                  className="px-3 py-1.5 rounded-full text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex-1 space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-ember-500/15 to-amber-500/10 border border-ember-500/20 text-ember-50'
                      : message.error
                      ? 'bg-red-500/10 border border-red-500/20 text-red-200'
                      : 'bg-white/[0.04] border border-white/[0.06] text-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Generated"
                      className="mt-3 rounded-xl max-w-full border border-white/10"
                    />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating on edge GPU...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="flex gap-2 mt-6">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSend();
            }}
            placeholder="Ask ZyraGPT anything..."
            className="flex-1 px-4 py-3 rounded-xl bg-ink-700/50 border border-white/[0.06] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-ember-500/30 transition-colors"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
