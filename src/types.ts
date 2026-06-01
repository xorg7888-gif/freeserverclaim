/**
 * Shared Type Definitions for HDX-CLOUD
 */

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Claim {
  id: number;
  user_id: number;
  email: string;
  ip_address: string;
  token: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  rejected_at: string | null;
}

export interface ClaimStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export interface AuthState {
  user: { id: number; email: string } | null;
  isAdmin: boolean;
  statusChecked: boolean;
}
