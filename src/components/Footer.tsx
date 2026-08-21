import React from 'react';
import { ChcLogo } from './ChcLogo';
import { ShieldCheck, Heart, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  pendingPaymentsCount?: number;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, pendingPaymentsCount = 0 }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Logo */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <ChcLogo size="lg" />
              <div>
                <h4 className="text-sm font-extrabold text-white uppercase tracking-tight">
                  Christ Holy Church International
                </h4>
                <p className="text-xs font-bold text-red-500">
                  No. 2 Benin Ambassadorship
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Official voting portal for <strong>WHO WILL WEAR THE CROWN OF CHRIST HOLY CHURCH INTERNATIONAL NO2 BENIN AMBASSADORSHIP</strong>. A secure, transparent, and auditable ambassadorial contest.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Manual Bank Transfer Verification & Vote Ledger Audited</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#candidates" className="hover:text-amber-400 transition-colors">
                  Meet Candidates
                </a>
              </li>
              <li>
                <a href="#leaderboard" className="hover:text-amber-400 transition-colors">
                  Live Standings
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  How Voting Works
                </a>
              </li>
              <li>
                <a href="#status" className="hover:text-amber-400 transition-colors">
                  Check Vote Status
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Church Office & Admin */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">
              Church Administration
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Christ Holy Church International No. 2 Benin Parish, Edo State, Nigeria.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-850 text-xs font-medium transition-colors cursor-pointer"
                id="footer-admin-login-btn"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Secure Login</span>
                {pendingPaymentsCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white font-extrabold text-[10px] animate-pulse">
                    {pendingPaymentsCount} PENDING
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Christ Holy Church International No. 2 Benin. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Official Ambassadorial Crown Voting System</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
