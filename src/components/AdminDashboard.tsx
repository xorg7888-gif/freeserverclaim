import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Database, 
  RefreshCw, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Hash, 
  Globe, 
  Mail, 
  FileSpreadsheet, 
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { Claim, ClaimStats } from '../types.js';

interface AdminDashboardProps {
  onLogoutAdmin: () => void;
}

export default function AdminDashboard({ onLogoutAdmin }: AdminDashboardProps) {
  // Data lists and stats
  const [claims, setClaims] = useState<Claim[]>([]);
  const [stats, setStats] = useState<ClaimStats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  
  // Filtering & Search
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Loading & error statuses
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Confirmation Modal state
  const [activeModal, setActiveModal] = useState<{
    claim: Claim;
    type: 'approve' | 'reject';
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch stats details from database
  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      if (!res.ok) throw new Error('Status logs fetch failed.');
      const data = await res.json();
      setStats(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  // Fetch list of claims based on active parameters
  const fetchClaimsList = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const url = `/api/admin/claims?status=${statusFilter}&query=${encodeURIComponent(searchQuery)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to retrieve server database registers.');
      const data = await res.json();
      setClaims(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred querying the databases.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger loading sequences
  useEffect(() => {
    fetchStats();
    fetchClaimsList();
  }, [statusFilter, searchQuery]);

  // Execute actual Approve/Reject database updates
  const handleConfirmAction = async () => {
    if (!activeModal) return;
    setIsUpdating(true);
    
    const { claim, type } = activeModal;
    const url = `/api/admin/claims/${claim.id}/${type}`;

    try {
      const res = await responseAndValidation(url);
      if (res.success) {
        // Refresh local views
        await fetchStats();
        await fetchClaimsList();
        setActiveModal(null);
      }
    } catch (err: any) {
      alert(err.message || 'The action failed to complete due to a server fault.');
    } finally {
      setIsUpdating(false);
    }
  };

  const responseAndValidation = async (url: string) => {
    const response = await fetch(url, { method: 'POST' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Server error during administrative mutation.');
    return data;
  };

  // Human date formatting helper
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-10 py-6 px-4 max-w-7xl mx-auto" id="hdx-admin-dashboard">
      
      {/* Top Admin banner and controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-900 pb-6" id="admin-top-bar">
        <div>
          <div className="flex items-center space-x-2 text-purple-400">
            <Shield className="h-5 w-5 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-widest font-mono">SECURE ADMIN INTERFACE</span>
          </div>
          <h2 className="text-2xl font-black text-white mt-1 uppercase tracking-wider">HDX Management Terminal</h2>
          <p className="text-xs text-slate-400 mt-1">
            Authorize voucher queues, manage Sybil IP ranges, and log Minecraft security codes.
          </p>
        </div>

        {/* Admin Log Out option */}
        <button
          onClick={onLogoutAdmin}
          className="flex items-center space-x-2 px-4 py-2 bg-rose-950/20 hover:bg-rose-950/45 text-rose-300 hover:text-white border border-rose-500/20 hover:border-rose-500/40 rounded-xl text-xs font-bold transition-all self-start md:self-auto"
          id="btn-admin-logout"
        >
          <LogOut className="h-4 w-4" />
          <span>Exit Administrative Console</span>
        </button>
      </div>

      {/* Stats Summary Bento Matrix */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6" id="admin-stats-block">
        
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-850 bg-slate-950/50 p-5 space-y-2 relative overflow-hidden" id="card-stat-total">
          <div className="absolute top-0 right-0 h-16 w-16 bg-slate-500/5 blur-xl rounded-full" />
          <p className="text-[10px] tracking-widest uppercase font-black text-slate-400 font-mono">TOTAL DISPATCHES</p>
          <p className="text-3xl font-extrabold text-slate-100 font-mono">{stats.total}</p>
          <span className="text-[10px] text-slate-500 block">All recorded claims events</span>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-amber-500/10 bg-amber-950/5 p-5 space-y-2 relative overflow-hidden" id="card-stat-pending">
          <div className="absolute top-0 right-0 h-16 w-16 bg-amber-500/5 blur-xl rounded-full" />
          <p className="text-[10px] tracking-widest uppercase font-black text-amber-400 font-mono">PENDING CHECKS</p>
          <p className="text-3xl font-extrabold text-amber-400 font-mono">{stats.pending}</p>
          <span className="text-[10px] text-amber-500/80 block">Requires credential verification</span>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-emerald-500/10 bg-emerald-950/5 p-5 space-y-2 relative overflow-hidden" id="card-stat-approved">
          <div className="absolute top-0 right-0 h-16 w-16 bg-emerald-500/5 blur-xl rounded-full" />
          <p className="text-[10px] tracking-widest uppercase font-black text-emerald-400 font-mono">REDEEMABLE VALID OVER</p>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono">{stats.approved}</p>
          <span className="text-[10px] text-emerald-500/80 block">Whitelisted on MC core network</span>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-rose-500/10 bg-rose-950/5 p-5 space-y-2 relative overflow-hidden" id="card-stat-rejected">
          <div className="absolute top-0 right-0 h-16 w-16 bg-rose-500/5 blur-xl rounded-full" />
          <p className="text-[10px] tracking-widest uppercase font-black text-rose-400 font-mono">REJECTED SYBILS</p>
          <p className="text-3xl font-extrabold text-rose-400 font-mono">{stats.rejected}</p>
          <span className="text-[10px] text-rose-500/80 block">Banned / Duplicate IP ranges</span>
        </div>

      </div>

      {/* Main Database Table & Interaction Panel */}
      <div className="rounded-2xl border border-slate-900 bg-slate-950/35 backdrop-blur-sm p-6 space-y-6" id="admin-main-controls-card">
        
        {/* Table Filters header navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-900 pb-5" id="admin-table-filters-container">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2" id="admin-status-tab-group">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  statusFilter === tab 
                    ? 'bg-slate-900 text-cyan-300 border border-cyan-500/30 font-extrabold shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                    : 'text-slate-400 hover:text-white bg-transparent border border-transparent'
                }`}
                id={`btn-tab-filter-${tab}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Inputs */}
          <div className="relative w-full lg:max-w-md" id="admin-search-wrapper">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by registered email, client IP or 6-digit token..."
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/40"
              id="admin-search-input-field"
            />
          </div>

        </div>

        {/* Loading / Error States for table list */}
        {isLoading && (
          <div className="py-20 text-center space-y-3" id="admin-loading-spinner-box">
            <RefreshCw className="h-8 w-8 text-cyan-400 animate-spin mx-auto" />
            <p className="text-xs text-slate-400">Syncing ledger records from physical node...</p>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl border border-red-500/20 bg-red-950/10 text-xs text-red-400 text-center" id="admin-query-error-state">
            {errorMessage}
          </div>
        )}

        {/* Actual claims table list */}
        {!isLoading && !errorMessage && (
          <div className="overflow-x-auto rounded-xl border border-slate-900 bg-slate-950/40" id="admin-claims-table-wrapper">
            <table className="w-full text-left border-collapse" id="admin-claims-data-table">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-[10px] uppercase tracking-widest text-slate-500 font-bold font-mono">
                  <th className="px-6 py-4">Account Holder / Email</th>
                  <th className="px-6 py-4">Client IP Address</th>
                  <th className="px-6 py-4">Generated 6-Digit Token</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Submitted</th>
                  <th className="px-6 py-4 text-right">Verification Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/80 text-xs text-slate-300" id="admin-claims-table-tbody">
                {claims.length > 0 ? (
                  claims.map((claim) => (
                    <tr 
                      key={claim.id} 
                      className="hover:bg-slate-900/25 transition-colors duration-150"
                      id={`client-claim-row-${claim.id}`}
                    >
                      {/* Email */}
                      <td className="px-6 py-4 font-semibold text-slate-200">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          <span className="truncate max-w-[150px] sm:max-w-[200px] inline-block font-sans">{claim.email}</span>
                        </div>
                      </td>

                      {/* IP */}
                      <td className="px-6 py-4 font-mono text-slate-400">
                        <div className="flex items-center space-x-2">
                          <Globe className="h-4 w-4 text-slate-500 mr-0.5" />
                          <span>{claim.ip_address}</span>
                        </div>
                      </td>

                      {/* Token code key */}
                      <td className="px-6 py-4 font-mono font-black text-cyan-400 tracking-wider">
                        <div className="flex items-center space-x-1.5">
                          <Hash className="h-3.5 w-3.5 text-slate-600" />
                          <span>{claim.token}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {claim.status === 'pending' && <span className="inline-flex items-center space-x-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-500/20 font-mono">PENDING</span>}
                        {claim.status === 'approved' && <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20 font-mono">APPROVED</span>}
                        {claim.status === 'rejected' && <span className="inline-flex items-center space-x-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20 font-mono">REJECTED</span>}
                      </td>

                      {/* Created date */}
                      <td className="px-6 py-4 text-slate-400 font-mono text-[10px]">
                        {formatDate(claim.created_at)}
                      </td>

                      {/* Verification control trigger actions */}
                      <td className="px-6 py-4 text-right">
                        {claim.status === 'pending' ? (
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setActiveModal({ claim, type: 'approve' })}
                              className="p-1 px-2.5 rounded bg-emerald-950/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 border border-emerald-400/30 transition-all font-bold text-xs"
                              title="Approve Ticket"
                              id={`btn-approve-claim-${claim.id}`}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setActiveModal({ claim, type: 'reject' })}
                              className="p-1 px-2.5 rounded bg-rose-950/20 text-rose-400 hover:bg-rose-500 hover:text-slate-950 border border-rose-400/20 transition-all font-bold text-xs"
                              title="Reject Ticket"
                              id={`btn-reject-claim-${claim.id}`}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            Locked ({claim.status === 'approved' ? 'Active Whitelist' : 'Sybils Archive'})
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500 text-xs font-medium">
                      No matching registered claiming entries found inside requested databases filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Manual Intercept Confirmation Dialog Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" id="admin-confirmation-modal">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-900 bg-slate-950 p-6 shadow-2xl text-slate-100" id="modal-box shadow shadow-cyan-950/50">
            
            {/* Modal Icon and Layout Header */}
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl border ${
                activeModal.type === 'approve' 
                  ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400' 
                  : 'bg-rose-950/30 border-rose-500/20 text-rose-400'
              }`}>
                <AlertTriangle className="h-6 w-6 animate-pulse" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Confirm Administrative Action
                </h3>
                <p className="text-xs text-slate-400">
                  You are about to modify a permanent claim ticket status. Please review the details beforehand:
                </p>
              </div>
            </div>

            {/* Event claim summary details */}
            <div className="mt-5 bg-slate-900/60 p-4 rounded-xl border border-slate-900 font-mono text-[11px] text-slate-300 space-y-2" id="modal-subject-details">
              <div className="flex justify-between">
                <span className="text-slate-500">CLIENT ACCOUNT:</span>
                <span className="text-slate-200 font-sans font-bold">{activeModal.claim.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CLIENT DEVICE IP:</span>
                <span className="text-slate-200 font-bold">{activeModal.claim.ip_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VOUCHER 6-DIGIT CODE:</span>
                <span className="text-cyan-400 font-bold tracking-widest">{activeModal.claim.token}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">MODIFICATION INBOUND:</span>
                <span className={`font-bold ${activeModal.type === 'approve' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {activeModal.type === 'approve' ? 'APPROVE & WHITELIST' : 'REJECT & ARCHIVE'}
                </span>
              </div>
            </div>

            {/* Dialogue buttons */}
            <div className="mt-6 flex justify-end space-x-3" id="modal-dialog-buttons">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 border border-slate-800 bg-transparent hover:bg-slate-900 hover:text-white rounded-xl text-xs font-bold text-slate-400 transition-all cursor-pointer"
                id="btn-modal-cancel"
              >
                No, Back
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={isUpdating}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-slate-950 transition-all cursor-pointer ${
                  activeModal.type === 'approve'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-gradient-to-r from-rose-400 to-red-400 hover:from-rose-300 hover:to-red-300'
                }`}
                id="btn-modal-confirm"
              >
                {isUpdating ? 'Executing...' : 'Yes, Confirm Action'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
