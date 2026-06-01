import React, { useState } from 'react';
import { 
  Hash, 
  Copy, 
  Check, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  User, 
  Info,
  Server
} from 'lucide-react';

interface UserDashboardProps {
  user: { id: number; email: string };
  claim: any;
  onClaimSuccess: (claim: any) => void;
}

export default function UserDashboard({
  user,
  claim,
  onClaimSuccess,
}: UserDashboardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    if (!claim?.token) return;
    navigator.clipboard.writeText(claim.token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimToken = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMsg(null);

    try {
      const response = await fetch('/api/claims/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Claim transaction rejected by registry rules.');
      }

      setSuccessMsg('Your custom 6-digit key has been generated and queued.');
      onClaimSuccess(data.claim);

    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred during claim processing.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <CheckCircle2 className="h-4 w-4" />
            <span className="uppercase tracking-widest text-[10px]">APPROVED</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-400 border border-rose-500/30">
            <XCircle className="h-4 w-4" />
            <span className="uppercase tracking-widest text-[10px]">REJECTED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
            <Clock className="h-4 w-4" />
            <span className="uppercase tracking-widest text-[10px]">PENDING REVIEWS</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-xl mx-auto px-4 py-12 space-y-8" id="hdx-user-dashboard">
      
      {/* Subdued Welcome Banner */}
      <div className="text-center space-y-1.5" id="user-dashboard-welcome">
        <p className="text-[10px] tracking-widest uppercase font-black text-cyan-400">Secure Allocator Portal</p>
        <div className="flex items-center justify-center space-x-1.5 text-slate-300">
          <User className="h-4 w-4 text-slate-500" />
          <span className="text-xs font-mono font-bold max-w-[240px] truncate">{user.email}</span>
        </div>
      </div>

      {/* Main Single Choice interactive card */}
      <div 
        className="w-full rounded-2xl border border-cyan-500/10 bg-slate-950/70 p-8 backdrop-blur-md shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden"
        id="interactive-claiming-module"
      >
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-cyan-500/5 blur-3xl rounded-full" />
        
        {errorMessage && (
          <div 
            className="mb-6 flex items-start space-x-2 rounded-xl border border-rose-500/25 bg-rose-950/20 p-4 text-xs text-rose-300 shadow-[0_0_15px_rgba(239,68,68,0.1)]" 
            id="claim-error-message-alert"
          >
            <AlertCircle className="h-5 w-5 text-rose-400 flex-shrink-0 mr-1.5 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Transaction Aborted</p>
              <p className="leading-relaxed text-rose-300/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {successMsg && (
          <div 
            className="mb-6 flex items-start space-x-2 rounded-xl border border-emerald-500/25 bg-emerald-950/20 p-4 text-xs text-emerald-300" 
            id="claim-success-message-alert"
          >
            <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0 mr-1.5" />
            <div className="space-y-0.5">
              <p className="font-bold">Token Created!</p>
              <p className="leading-relaxed text-emerald-300/90">{successMsg}</p>
            </div>
          </div>
        )}

        {!claim ? (
          <div className="text-center space-y-6" id="claim-primary-option-view">
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-slate-100 tracking-tight">Claim Your 6-Digit Token</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Generate your exclusive, physical 6-digit security credential. This is required to authorize cloud server resources for your client host profile.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClaimToken}
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] flex items-center justify-center space-x-3 text-sm tracking-wide cursor-pointer font-sans"
              id="btn-trigger-claim"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                  <span>Obtaining Token from Registry...</span>
                </>
              ) : (
                <>
                  <Hash className="h-5 w-5" />
                  <span>Generate Only Option (6-Digit Token)</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6" id="claim-result-view">
            
            {/* Header with allocation status badge */}
            <div className="flex items-center justify-between border-b border-slate-900/50 pb-4" id="claim-details-status">
              <div className="flex items-center space-x-2 text-slate-400">
                <Server className="h-4.5 w-4.5 text-cyan-400" />
                <span className="text-[10px] font-black tracking-widest uppercase">HDX CLIENT DEED</span>
              </div>
              <div id="allocation-state-indicator">
                {renderStatusBadge(claim.status)}
              </div>
            </div>

            {/* Glowing Digital code output */}
            <div className="text-center py-6 bg-slate-900/40 rounded-xl border border-slate-900/50 relative" id="verified-coupon-display">
              <p className="text-[9px] uppercase font-bold text-slate-500 tracking-widest mb-1.5 font-mono">YOUR RESERVED 6-DIGIT TOKEN</p>
              
              <div className="relative inline-flex items-center justify-center" id="glowing-code-number">
                <span className={`text-4xl sm:text-5xl font-black tracking-[0.25em] pl-4 font-mono select-all ${
                  claim.status === 'approved' 
                    ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.2)]' 
                    : claim.status === 'rejected'
                      ? 'text-slate-500 line-through'
                      : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                }`}>
                  {claim.token}
                </span>
                
                {claim.status !== 'rejected' && (
                  <button
                    onClick={handleCopyToken}
                    className="absolute -right-12 p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all hover:border-cyan-500/30"
                    title="Copy Token to Clipboard"
                    id="btn-copy-token-micro"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>
            </div>

            {/* Explanatory and guide metadata block */}
            <div className="bg-slate-900/20 border border-slate-900 rounded-xl p-4 text-[11px] leading-relaxed text-slate-400" id="claim-guideline">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {claim.status === 'pending' && (
                    <p>
                      ⏳ Your claim is registered under <strong className="text-amber-400 font-bold">Pending Review</strong> status. Access the Administrative terminal tab above to approve or reject this token claim instantly.
                    </p>
                  )}
                  {claim.status === 'approved' && (
                    <p>
                      ✅ <strong className="text-emerald-400 text-xs font-bold">Approved and Active!</strong> This security token has been fully synchronized with the Minecraft game database. Redeem using <code>/redeem {claim.token}</code>.
                    </p>
                  )}
                  {claim.status === 'rejected' && (
                    <p>
                      ❌ <strong className="text-rose-400 font-bold">Token Locked/Rejected</strong>. The requested claim tag was flagged on the server logs. Please register with a different account.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick copy code button */}
            {claim.status !== 'rejected' && (
              <button
                onClick={handleCopyToken}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-900/80 text-slate-300 font-bold text-xs rounded-xl border border-slate-800 hover:border-slate-700 hover:text-white flex items-center justify-center space-x-2 transition-all cursor-pointer font-sans"
                id="btn-copy-token-large"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-sans">Token Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 text-slate-500" />
                    <span>Copy Token Value</span>
                  </>
                )}
              </button>
            )}

          </div>
        )}

      </div>

    </div>
  );
}
