import React, { useState, useEffect } from 'react';
import { User, AdminDashboardStats, Candidate, PaymentSettings } from '../types';
import { adminLogin, fetchAdminStats } from '../services/api';
import { AdminDashboard } from './admin/AdminDashboard';
import { PaymentReviews } from './admin/PaymentReviews';
import { CandidateManager } from './admin/CandidateManager';
import { PaymentSettingsManager } from './admin/PaymentSettingsManager';
import { AuditLogViewer } from './admin/AuditLogViewer';
import { ReportsView } from './admin/ReportsView';
import { ChcLogo } from './ChcLogo';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  Settings,
  ShieldCheck,
  FileSpreadsheet,
  LogOut,
  Lock,
  ArrowLeft,
  Key,
} from 'lucide-react';

interface AdminPortalProps {
  onClose: () => void;
  candidates: Candidate[];
  paymentSettings: PaymentSettings;
  onRefreshData: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  onClose,
  candidates,
  paymentSettings,
  onRefreshData,
}) => {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('chc_admin_token');
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('chc_admin_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login Form States
  const [emailInput, setEmailInput] = useState('medicreceptor@gmail.com');
  const [passwordInput, setPasswordInput] = useState('CHC2BENIN@YOUTH');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'payments' | 'candidates' | 'settings' | 'audit' | 'reports'
  >('dashboard');
  const [paymentFilterPreset, setPaymentFilterPreset] = useState<string>('ALL');

  // Dashboard Stats
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);

  const loadStats = async () => {
    if (!token) return;
    try {
      const data = await fetchAdminStats(token);
      setStats(data);
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('token') || err.message?.includes('Unauthorized')) {
        handleLogout();
      }
    }
  };

  useEffect(() => {
    if (token) {
      loadStats();
    }
  }, [token]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await adminLogin(emailInput.trim(), passwordInput.trim());
      setToken(res.token);
      setCurrentUser(res.user);
      localStorage.setItem('chc_admin_token', res.token);
      localStorage.setItem('chc_admin_user', JSON.stringify(res.user));
    } catch (err: any) {
      setLoginError(err.message || 'Invalid administrator credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('chc_admin_token');
    localStorage.removeItem('chc_admin_user');
  };

  const navigateToPayments = (filter: string = 'ALL') => {
    setPaymentFilterPreset(filter);
    setActiveTab('payments');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 overflow-y-auto flex flex-col" id="admin-portal">
      {/* Top Admin Bar */}
      <header className="bg-blue-950 border-b border-blue-900/80 px-4 sm:px-6 py-3 text-white flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-900 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Return to Public Site"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit to Voting Portal</span>
          </button>

          <div className="h-5 w-px bg-blue-800 hidden sm:block" />

          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <ChcLogo size="sm" className="shrink-0" />
            <div className="min-w-0">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider block leading-tight truncate">
                Christ Holy Church No. 2 Benin
              </span>
              <span className="text-[9px] sm:text-[10px] text-amber-400 font-bold block truncate">
                Official Election Administration System
              </span>
            </div>
          </div>
        </div>

        {token && currentUser && (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-emerald-400 font-mono font-semibold">
                {currentUser.role}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Logout from admin session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col bg-slate-100">
        {!token ? (
          /* Login Screen */
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-blue-950 text-white flex items-center justify-center mx-auto shadow-md">
                  <Lock className="w-7 h-7 text-amber-400" />
                </div>
                <h2 className="text-xl font-black text-blue-950">
                  Administrator Portal
                </h2>
                <p className="text-xs text-slate-500">
                  Sign in with authorized church official credentials to review transactions and manage candidates.
                </p>
              </div>

              {loginError && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Official Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-900 text-sm font-medium"
                    placeholder="medicreceptor@gmail.com"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-blue-900 text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>{loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}</span>
                  </button>
                </div>
              </form>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900 space-y-1">
                <span className="font-bold">Official Admin Credentials:</span>
                <div>Email: <code className="font-mono font-bold">medicreceptor@gmail.com</code></div>
                <div>Password: <code className="font-mono font-bold">CHC2BENIN@YOUTH</code></div>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard Layout */
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <nav className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-2 sm:p-4 flex md:flex-col overflow-x-auto gap-1 shrink-0">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setPaymentFilterPreset('ALL');
                  setActiveTab('payments');
                }}
                className={`flex items-center justify-between gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === 'payments'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <CreditCard className="w-4 h-4" />
                  <span>Payment Reviews</span>
                </div>
                {stats && stats.pendingPaymentsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                    {stats.pendingPaymentsCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('candidates')}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === 'candidates'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Candidates</span>
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === 'reports'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Reports & Export</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === 'settings'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Bank & Vote Settings</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeTab === 'audit'
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Audit Logs</span>
              </button>
            </nav>

            {/* Sub-View Content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {activeTab === 'dashboard' && (
                <AdminDashboard
                  stats={stats}
                  onNavigateToPayments={navigateToPayments}
                  onNavigateToCandidates={() => setActiveTab('candidates')}
                  onNavigateToSettings={() => setActiveTab('settings')}
                />
              )}

              {activeTab === 'payments' && (
                <PaymentReviews
                  token={token}
                  candidates={candidates}
                  initialStatusFilter={paymentFilterPreset}
                  onStatsUpdated={() => {
                    loadStats();
                    onRefreshData();
                  }}
                />
              )}

              {activeTab === 'candidates' && (
                <CandidateManager
                  token={token}
                  candidates={candidates}
                  onRefresh={() => {
                    loadStats();
                    onRefreshData();
                  }}
                />
              )}

              {activeTab === 'reports' && (
                <ReportsView token={token} stats={stats} candidates={candidates} />
              )}

              {activeTab === 'settings' && (
                <PaymentSettingsManager
                  token={token}
                  settings={paymentSettings}
                  onUpdated={(newSettings) => {
                    loadStats();
                    onRefreshData();
                  }}
                />
              )}

              {activeTab === 'audit' && <AuditLogViewer token={token} />}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
