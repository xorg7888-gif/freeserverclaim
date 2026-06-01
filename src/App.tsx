import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import LandingPage from './components/LandingPage.jsx';
import AuthPage from './components/AuthPage.jsx';
import UserDashboard from './components/UserDashboard.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import AdminLogin from './components/AdminLogin.jsx';

import { Shield, Sparkles, RefreshCw, X, Check, Server, Terminal, AlertCircle } from 'lucide-react';
import { AuthState } from './types.js';

export default function App() {
  // Main authentication states
  const [user, setUser] = useState<{ id: number; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [claim, setClaim] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Router tab tracking
  const [activeTab, setActiveTab] = useState<string>('landing');
  
  // Dev Sandbox Toast notifications states
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Dynamic Toast trigger function
  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Perform secure credentials query on initialization (session resume)
  const querySessionState = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsAdmin(data.isAdmin);
        setClaim(data.claim);
      }
    } catch (err) {
      console.error('Session state verification query failed:', err);
    } finally {
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    querySessionState();
  }, []);

  // Logout action handler
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setIsAdmin(false);
      setClaim(null);
      triggerToast('Security session cleared. Logged out successfully.', 'success');
      setActiveTab('landing');
    } catch (err) {
      triggerToast('Log out action failed. Please try again.', 'error');
    }
  };

  // Authenticated successes
  const handleUserAuthSuccess = (authUser: { id: number; email: string }) => {
    setUser(authUser);
    triggerToast(`Welcome back, ${authUser.email}. Secure session initiated.`, 'success');
    // Grab if they have any claims
    querySessionState();
    setActiveTab('dashboard');
  };

  const handleAdminAuthSuccess = () => {
    setIsAdmin(true);
    triggerToast('Administrative crypt-keys authorized. Root access granted.', 'success');
    setActiveTab('admin');
  };

  // Secret sandbox database reset action
  const handleResetDatabaseAll = async () => {
    if (confirm('SANDBOX UTILITY WARNING: This will clear ALL claimed coupons and registered users in the SQLite database to allow testing with fresh IPs and accounts. Proceed with resetting?')) {
      try {
        const res = await fetch('/api/claims/reset-all', { method: 'POST' });
        if (res.ok) {
          setUser(null);
          setIsAdmin(false);
          setClaim(null);
          triggerToast('Database fully initialized and local session cookies cleared.', 'success');
          setActiveTab('landing');
        } else {
          triggerToast('Database clearing aborted.', 'error');
        }
      } catch (err) {
        triggerToast('Could not reach backend reset endpoints.', 'error');
      }
    }
  };

  // Helper to render appropriate subviews based on active tags
  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <LandingPage 
            user={user} 
            claim={claim} 
            onChangeTab={(tab) => {
              if (tab === 'dashboard' && !user) {
                setActiveTab('signup');
              } else {
                setActiveTab(tab);
              }
            }} 
          />
        );
      
      case 'signup':
        return (
          <AuthPage 
            initialIsSignUp={true} 
            onAuthSuccess={handleUserAuthSuccess}
            onToggleForm={(isSignUp) => setActiveTab(isSignUp ? 'signup' : 'login')}
          />
        );
      
      case 'login':
        return (
          <AuthPage 
            initialIsSignUp={false} 
            onAuthSuccess={handleUserAuthSuccess}
            onToggleForm={(isSignUp) => setActiveTab(isSignUp ? 'signup' : 'login')}
          />
        );

      case 'dashboard':
        if (!user) {
          return (
            <AuthPage 
              initialIsSignUp={false} 
              onAuthSuccess={handleUserAuthSuccess}
              onToggleForm={(isSignUp) => setActiveTab(isSignUp ? 'signup' : 'login')}
            />
          );
        }
        return (
          <UserDashboard 
            user={user} 
            claim={claim} 
            onClaimSuccess={(newClaim) => {
              setClaim(newClaim);
              triggerToast('Voucher voucher code issued under pending status. Copied to Clipboard.', 'success');
            }} 
          />
        );

      case 'admin-login':
        if (isAdmin) {
          return <AdminDashboard onLogoutAdmin={handleLogout} />;
        }
        return <AdminLogin onAdminSuccess={handleAdminAuthSuccess} />;

      case 'admin':
        if (!isAdmin) {
          return <AdminLogin onAdminSuccess={handleAdminAuthSuccess} />;
        }
        return <AdminDashboard onLogoutAdmin={handleLogout} />;

      default:
        return <LandingPage user={user} claim={claim} onChangeTab={setActiveTab} />;
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full select-none bg-slate-950 font-sans text-slate-100 overflow-x-hidden flex flex-col justify-between"
      style={{
        backgroundImage: `url('https://w.wallhaven.cc/full/dp/wallhaven-dpd8rm.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
      id="root-viewport-hdx"
    >
      {/* Premium Cinematic Ambient Overlay */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[3px] z-0 pointer-events-none" />

      {/* Main Page Layout Wrapper */}
      <div className="relative z-10 w-full flex flex-col min-h-screen">
        
        {/* Navigation Header */}
        <Header 
          user={user} 
          isAdmin={isAdmin} 
          activeTab={activeTab} 
          onChangeTab={setActiveTab} 
          onLogout={handleLogout}
          onResetAll={handleResetDatabaseAll}
        />

        {/* Dynamic Warning for Sandbox Client IP matches */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 w-full" id="sandbox-warning-header">
          <div className="rounded-xl border border-yellow-500/10 bg-yellow-950/15 p-3 text-center flex items-center justify-center space-x-2 text-[11px] text-yellow-400">
            <Sparkles className="h-4 w-4 text-yellow-400 animate-spin" />
            <span><strong>HDX-CLOUD Node Sandbox Mode Active:</strong> Use the "Random IP" slider tool on the Claims Area to test and experience the multi-IP sybil validation rules!</span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {initialLoading ? (
            <div className="flex h-[50vh] flex-col items-center justify-center space-y-4" id="view-initial-loading-spinner">
              <RefreshCw className="h-10 w-10 text-cyan-400 animate-spin" />
              <p className="text-xs uppercase tracking-widest font-black text-cyan-400">Bootstrapping HDX-CLOUD Core...</p>
            </div>
          ) : (
            renderActiveView()
          )}
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-slate-900 bg-slate-950/95 py-8 relative z-10 text-xs text-slate-500" id="hdx-nav-footer">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div>
              <p className="font-extrabold text-slate-300">HDX-CLOUD Minecraft Enterprise Services</p>
              <p className="mt-1 text-[10px] text-slate-500 font-medium">© 2026 HDX-CLOUD. All server hardware allocations reserved. We are not affiliated with Monolith Mojang AB.</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              <span className="hover:text-cyan-400 cursor-pointer">SLA Core</span>
              <span className="text-slate-800">•</span>
              <span className="hover:text-cyan-400 cursor-pointer">Security shielding</span>
              <span className="text-slate-800">•</span>
              <span className="hover:text-purple-400 cursor-pointer">Acceptable Use Policies</span>
            </div>
          </div>
        </footer>

      </div>

      {/* Floating Alert Toast notifications */}
      {toast && (
        <div 
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl border flex items-center space-x-3 shadow-2xl transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-slate-950 border-emerald-500/30 text-emerald-400 shadow-emerald-900/10' 
              : toast.type === 'error'
                ? 'bg-slate-950 border-rose-500/20 text-rose-400 shadow-rose-900/10'
                : 'bg-slate-950 border-cyan-500/20 text-cyan-400 shadow-cyan-900/10'
          }`}
          id="hdx-floating-toast"
        >
          <div className="flex-shrink-0">
            {toast.type === 'success' ? (
              <div className="h-6 w-6 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                <Check className="h-3.5 w-3.5" />
              </div>
            ) : toast.type === 'error' ? (
              <div className="h-6 w-6 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-400">
                <X className="h-3.5 w-3.5" />
              </div>
            ) : (
              <div className="h-6 w-6 rounded-full bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400">
                <Server className="h-3.5 w-3.5" />
              </div>
            )}
          </div>
          <span className="text-[11px] font-bold font-sans tracking-wide leading-relaxed">{toast.message}</span>
        </div>
      )}

    </div>
  );
}
