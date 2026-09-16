import { useState, useRef, useEffect } from 'react';
import {
  Activity,
  ChevronDown,
  Check,
  Globe,
  Zap,
  Cpu,
  Signal,
} from 'lucide-react';
import { AI_MODELS } from '@/data/models';

interface TopNavProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
}

export default function TopNav({ selectedModel, onModelChange }: TopNavProps) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel) ?? AI_MODELS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 h-16 flex items-center justify-between px-6 border-b border-white/[0.04] bg-ink-900/60 backdrop-blur-xl">
      {/* Left — Status indicators */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <div className="relative">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <span className="text-xs font-medium text-emerald-300">All Nodes Online</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
          <Activity className="w-3.5 h-3.5 text-ember-400" />
          <span className="text-xs font-medium text-gray-300">
            Global Latency <span className="text-ember-300 font-semibold">&lt;30ms</span>
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
          <Signal className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-medium text-gray-300">12 Edge PoPs Active</span>
        </div>
      </div>

      {/* Right — Model selector */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-600" />
          <span className="text-xs text-gray-500">Frankfurt · DE</span>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-ember-500/20 to-amber-500/10 border border-ember-500/20 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-ember-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white leading-none">
                  {currentModel.name}
                </p>
                <p className="text-[10px] text-gray-500 mt-0.5">{currentModel.provider}</p>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                modelDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {modelDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 glass-card p-2 animate-slide-up z-50">
              <div className="px-3 py-2 mb-1">
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-ember-400" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Select Model
                  </span>
                </div>
              </div>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id);
                      setModelDropdownOpen(false);
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 ${
                      selectedModel === model.id
                        ? 'bg-ember-500/10 border border-ember-500/20'
                        : 'hover:bg-white/[0.04] border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        selectedModel === model.id
                          ? 'bg-ember-500/20 border border-ember-500/30'
                          : 'bg-white/[0.04] border border-white/[0.06]'
                      }`}
                    >
                      <Cpu
                        className={`w-4 h-4 ${
                          selectedModel === model.id ? 'text-ember-400' : 'text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-white">{model.name}</p>
                        {model.badge && (
                          <span className="glow-badge glow-amber !px-2 !py-0.5 !text-[9px]">
                            {model.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{model.description}</p>
                      <p className="text-[10px] text-gray-600 mt-1">
                        {model.provider} · {model.contextWindow}
                      </p>
                    </div>
                    {selectedModel === model.id && (
                      <Check className="w-4 h-4 text-ember-400 shrink-0 mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
