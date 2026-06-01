import React, { useState } from 'react';
import { Terminal, CheckCircle, ArrowRight, User, Lock, AlertCircle } from 'lucide-react';

interface AdminLoginProps {
  onAdminSuccess: () => void;
}

export default function AdminLogin({ onAdminSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Access denied. Invalid terminal credentials.');
      }

      setSuccessMessage('Administrator terminal authenticated successfully. Launching console...');
      
      setTimeout(() => {
        onAdminSuccess();
      }, 1000);

    } catch (err: any) {
      setErrorMessage(err.message || 'Verification failed. Authority rejected.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-8" id="hdx-admin-login">
      <div 
        className="w-full max-w-md rounded-2xl border border-purple-500/15 bg-slate-950/70 p-8 backdrop-blur-md shadow-[0_0_50px_rgba(168,85,247,0.15)] relative overflow-hidden"
        id="admin-login-card"
      >
        {/* Glow visuals */}
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-purple-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-cyan-500/5 blur-3xl rounded-full" />

        {/* Header decoration */}
        <div className="flex flex-col items-center mb-8" id="admin-login-head">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-950/50 text-purple-400 mb-3 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
            <Terminal className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase text-center">
            HDX MANAGER<span className="text-purple-400"> TERMINAL</span>
          </h2>
          <p className="text-[10px] text-slate-400 tracking-widest font-semibold uppercase mt-0.5" id="admin-login-subtitle">
            Secure Administrator Authorization
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 flex items-start space-x-2 rounded-xl border border-rose-500/20 bg-rose-950/20 p-4 text-xs text-rose-400" id="admin-login-err">
            <AlertCircle className="h-5 w-5 text-rose-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Access Aborted</p>
              <p className="mt-1 leading-relaxed text-rose-300">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage ? (
          <div className="mb-5 flex items-start space-x-2 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 text-xs text-emerald-400 animate-pulse" id="admin-login-suc">
            <CheckCircle className="h-5 w-5 text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Gateway Authorized</p>
              <p className="mt-1 leading-relaxed text-emerald-300">{successMessage}</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAdminSignIn} className="space-y-5" id="admin-login-form">
            <div className="space-y-1.5" id="admin-username-input-container">
              <label className="text-[10px] tracking-widest font-black uppercase text-slate-400" htmlFor="admin-username-input">
                Terminal Login ID
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="admin-username-input"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator ID..."
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5" id="admin-password-input-container">
              <label className="text-[10px] tracking-widest font-black uppercase text-slate-400" htmlFor="admin-password-input">
                Secure Key Word
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  id="admin-password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 border border-slate-800 focus:border-purple-500/50 rounded-xl py-3 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-purple-400 to-indigo-400 hover:from-purple-300 hover:to-indigo-300 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center space-x-2.5 cursor-pointer font-sans"
              id="btn-admin-login-submit"
            >
              {isLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
              ) : (
                <>
                  <span>Sign In & Verify Credentials</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
