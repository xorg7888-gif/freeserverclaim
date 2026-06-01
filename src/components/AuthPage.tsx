import React, { useState } from 'react';
import { Lock, Mail, Server, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface AuthPageProps {
  initialIsSignUp: boolean;
  onAuthSuccess: (user: { id: number; email: string }) => void;
  onToggleForm: (isSignUp: boolean) => void;
}

export default function AuthPage({
  initialIsSignUp,
  onAuthSuccess,
  onToggleForm,
}: AuthPageProps) {
  const [isSignUp, setIsSignUp] = useState(initialIsSignUp);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // UX State management
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Clear states when toggle
  const handleToggle = (choice: boolean) => {
    setIsSignUp(choice);
    onToggleForm(choice);
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // Validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters in length.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify your entries.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = isSignUp ? '/api/auth/signup' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server validation failed.');
      }

      setSuccessMessage(isSignUp ? 'Registration successful! Initiating secure session...' : 'Authentication verified. Access granted.');
      
      // Delay success handler slightly for smooth UX transition
      setTimeout(() => {
        onAuthSuccess(data.user);
      }, 1000);

    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-8" id="hdx-auth-page">
      <div 
        className="w-full max-w-md rounded-2xl border border-cyan-500/15 bg-slate-950/70 p-8 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.15)] relative overflow-hidden"
        id="auth-box-container"
      >
        {/* Glow decorative gradients */}
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-cyan-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-purple-500/10 blur-3xl rounded-full" />

        {/* Branding header */}
        <div className="flex flex-col items-center mb-8" id="auth-header">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-950/50 text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Server className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-black text-white tracking-widest uppercase">
            HDX<span className="text-cyan-400">-CLOUD</span> GATEWAY
          </h2>
          <p className="text-[11px] text-slate-400 tracking-wider font-semibold uppercase mt-0.5" id="auth-subtitle">
            {isSignUp ? 'Establish Minecraft Tenant Profile' : 'Authenticate Security Credentials'}
          </p>
        </div>

        {/* Toggle Form Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/60 rounded-xl border border-slate-800 mb-6" id="auth-switch-tabs">
          <button
            type="button"
            onClick={() => handleToggle(false)}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              !isSignUp
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-inner'
                : 'text-slate-400 hover:text-white'
            }`}
            id="tab-select-signin"
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleToggle(true)}
            className={`py-2 rounded-lg text-xs font-bold transition-all ${
              isSignUp
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/30 shadow-inner'
                : 'text-slate-400 hover:text-white'
            }`}
            id="tab-select-signup"
          >
            Sign Up
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMessage && (
          <div className="mb-5 flex items-start space-x-2 rounded-xl border border-red-500/20 bg-red-950/25 p-3.5 text-xs text-red-400" id="auth-error-block">
            <AlertCircle className="h-4.5 w-4.5 text-red-400 mr-1 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Access Denied</p>
              <p className="mt-0.5 leading-relaxed text-red-300/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-5 flex items-start space-x-2 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3.5 text-xs text-emerald-400" id="auth-success-block">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-400 mr-1 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold">Credential Authorized</p>
              <p className="mt-0.5 leading-relaxed text-emerald-300/95">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4" id="form-auth-submit">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="auth-email-input">
              Server Registry Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="auth-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="auth-password-input">
              Account Security Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Minimum 6 characters" : "••••••••"}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 pl-10 pr-10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-500 hover:text-slate-300 transition-all"
                id="btn-toggle-password-view"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5" htmlFor="auth-confirm-password-input">
                Confirm Security Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="auth-confirm-password-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/40 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_10px_rgba(6,182,212,0.15)] transition-all"
                />
              </div>
            </div>
          )}

          {/* Guidelines on signup */}
          {isSignUp && (
            <div className="rounded-xl bg-slate-900/30 p-3 border border-slate-900 text-[10px] text-slate-400 space-y-1" id="signup-guidelines">
              <span className="font-bold text-slate-300">Password Specifications:</span>
              <p>• Minimum of 6 characters in length</p>
              <p>• Handled with server-side bcrypt cryptographic salting hashes</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 mt-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-purple-400 hover:from-cyan-300 hover:to-purple-300 disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] flex items-center justify-center space-x-2"
            id="btn-auth-submit"
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
            ) : (
              <span>{isSignUp ? 'Generate Cloud Profile' : 'Gain System Access'}</span>
            )}
          </button>
        </form>

        {/* Footnote Toggle Link */}
        <div className="mt-6 text-center text-xs" id="auth-footnote">
          <span className="text-slate-400">
            {isSignUp ? 'Already registered in the registry? ' : 'First time accessing this network? '}
          </span>
          <button
            type="button"
            onClick={() => handleToggle(!isSignUp)}
            className="text-cyan-400 hover:text-cyan-300 font-bold underline transition-all"
            id="tab-toggle-footer"
          >
            {isSignUp ? 'Sign In' : 'Register Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
