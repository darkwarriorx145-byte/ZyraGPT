import { useState, useEffect } from 'react';
import { Zap, Mail, Lock, User, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export default function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        (async () => {
          onAuthSuccess();
        })();
      }
    });
  }, [onAuthSuccess]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        setError('Account created! Check your email for confirmation, or if confirmation is off, try logging in.');
        setMode('login');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        onAuthSuccess();
      }
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes('Invalid login')) {
        setError('Wrong email or password. Please try again.');
      } else if (msg.includes('Email not confirmed')) {
        setError('Please confirm your email first, or contact support.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] animate-pulse-glow"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)' }}
        />
        <div className="absolute inset-0 bg-grid opacity-30" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-ember-500 to-ember-700 shadow-lg shadow-ember-500/30 mb-4 relative">
            <Zap className="w-8 h-8 text-white" fill="white" />
            <div className="absolute inset-0 rounded-2xl bg-ember-500/20 blur-lg -z-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Zyra<span className="text-gradient-ember">GPT</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Edge AI Platform</p>
        </div>

        {/* Auth card */}
        <div className="glass-card p-8">
          <div className="flex gap-1 p-1 rounded-xl bg-ink-700/40 border border-white/[0.04] mb-6">
            <button
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-ember-500/20 to-amber-500/10 text-ember-200 border border-ember-500/20'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                mode === 'signup'
                  ? 'bg-gradient-to-r from-ember-500/20 to-amber-500/10 text-ember-200 border border-ember-500/20'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm mb-4 animate-slide-up">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-ink-700/50 border border-white/[0.06] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-ember-500/30 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-ink-700/50 border border-white/[0.06] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-ember-500/30 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-400 mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-ink-700/50 border border-white/[0.06] text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-ember-500/30 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-ember-500 to-ember-600 text-white font-semibold text-sm hover:from-ember-400 hover:to-ember-500 hover:shadow-lg hover:shadow-ember-500/30 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-600 text-center mt-6">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(null); }}
              className="text-ember-400 hover:text-ember-300 transition-colors font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>

        <p className="text-xs text-gray-700 text-center mt-6">
          By continuing, you agree to ZyraGPT's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
