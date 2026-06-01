import React from 'react';
import { Server, LogOut, User, Shield, Terminal, RefreshCw } from 'lucide-react';

interface HeaderProps {
  user: { id: number; email: string } | null;
  isAdmin: boolean;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onLogout: () => void;
  onResetAll: () => void;
}

export default function Header({
  user,
  isAdmin,
  activeTab,
  onChangeTab,
  onLogout,
  onResetAll,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/10 bg-slate-950/80 backdrop-blur-md" id="hdx-nav-header">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo and Title */}
        <div 
          className="flex cursor-pointer items-center space-x-3 transition-transform hover:scale-[1.02]" 
          onClick={() => onChangeTab('landing')}
          id="btn-brand-logo"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950 to-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Server className="h-5 w-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-wider text-white">
              HDX<span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">-CLOUD</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest font-bold text-cyan-400/70">Minecraft Enterprise</p>
          </div>
        </div>

        {/* Navigation Links and Buttons */}
        <nav className="flex items-center space-x-1 sm:space-x-4">
          <button
            onClick={() => onChangeTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === 'landing'
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
            }`}
            id="nav-btn-home"
          >
            Home
          </button>

          {user && (
            <button
              onClick={() => onChangeTab('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
              }`}
              id="nav-btn-dashboard"
            >
              Claims Area
            </button>
          )}

          {isAdmin ? (
            <button
              onClick={() => onChangeTab('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center space-x-1 ${
                activeTab === 'admin'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'text-purple-400 hover:text-purple-300 hover:bg-purple-950/20'
              }`}
              id="nav-btn-admin-panel"
            >
              <Shield className="h-3 w-3 mr-0.5" />
              <span>Admin System</span>
            </button>
          ) : (
            <button
              onClick={() => onChangeTab('admin-login')}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider text-slate-400 transition-all hover:text-purple-400 flex items-center space-x-1 ${
                activeTab === 'admin-login' ? 'text-purple-400' : ''
              }`}
              id="nav-btn-admin-gate"
            >
              <Terminal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Portal Admin</span>
            </button>
          )}
        </nav>

        {/* User Auth Info & Control Actions */}
        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-slate-800" id="user-menu-profile">
              <div className="hidden md:flex flex-col text-right">
                <span className="max-w-[140px] truncate text-xs font-semibold text-slate-200">{user.email}</span>
                <span className="text-[10px] text-cyan-400 font-medium">Logged Account</span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-950/60 border border-cyan-500/25">
                <User className="h-4 w-4 text-cyan-400" />
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-950/25 hover:text-rose-400 transition-all"
                title="Sign Out"
                id="btn-user-logout"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-3 border flex-shrink-0 border-transparent">
              <button
                onClick={() => onChangeTab('login')}
                className="hidden sm:inline-block px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white hover:underline transition-all"
                id="btn-login-header"
              >
                Sign In
              </button>
              <button
                onClick={() => onChangeTab('signup')}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_20px_rgba(6,182,212,0.55)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                id="btn-signup-header"
              >
                Join Now
              </button>
            </div>
          )}

          {/* Quick Sandbox Database Reset Utility */}
          <button
            onClick={onResetAll}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all text-[11px]"
            title="Reset Database (Sandbox Debug Utility)"
            id="btn-sandbox-reset"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

      </div>
    </header>
  );
}
