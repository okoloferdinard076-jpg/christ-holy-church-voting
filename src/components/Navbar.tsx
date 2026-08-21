import React from 'react';
import { ChcLogo } from './ChcLogo';
import { Vote, Trophy, Search, HelpCircle, Shield, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  onOpenVoteModal: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn?: boolean;
  pendingPaymentsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'home',
  setActiveTab,
  onOpenVoteModal,
  onOpenAdmin,
  isAdminLoggedIn,
  pendingPaymentsCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'candidates', label: 'Candidates' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'how-it-works', label: 'How Voting Works' },
    { id: 'status', label: 'Check Vote Status', icon: Search },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
  ];

  const handleNavClick = (id: string) => {
    if (setActiveTab) {
      setActiveTab(id);
    }
    setMobileMenuOpen(false);
    // Smooth scroll to element if on home
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-950/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand Identity */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            id="brand-logo-button"
          >
            <ChcLogo size="md" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold text-blue-950 uppercase tracking-tight group-hover:text-blue-800 transition-colors">
                Christ Holy Church International
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-red-600 tracking-wide">
                No. 2 Benin Ambassadorship
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" id="desktop-nav">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  id={`nav-${item.id}`}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-900 shadow-xs'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4 text-blue-800" />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* CTA & Admin Access */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenVoteModal}
              id="header-vote-now-btn"
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center gap-2 cursor-pointer"
            >
              <Vote className="w-4 h-4 text-amber-400" />
              <span>Vote Now</span>
            </button>

            {/* Admin Portal Button with Real-time Notification Badge */}
            <button
              onClick={onOpenAdmin}
              id="header-admin-btn"
              title={
                pendingPaymentsCount > 0
                  ? `${pendingPaymentsCount} pending transaction${pendingPaymentsCount > 1 ? 's' : ''} awaiting approval`
                  : 'Administrator Portal'
              }
              className={`relative px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-amber-50 border-amber-300 text-amber-950 hover:bg-amber-100'
                  : 'border-slate-200 text-slate-700 hover:text-blue-950 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-4 h-4 text-blue-950" />
              <span>{isAdminLoggedIn ? 'Admin Active' : 'Admin'}</span>

              {/* Real-time Notification Badge */}
              {pendingPaymentsCount > 0 && (
                <span
                  id="admin-nav-pending-badge"
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black tracking-tight shadow-sm animate-pulse ml-0.5"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  <span>{pendingPaymentsCount}</span>
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onOpenVoteModal}
              className="px-3.5 py-2 rounded-lg bg-blue-900 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Vote className="w-3.5 h-3.5 text-amber-400" />
              Vote
            </button>

            {/* Mobile Admin Quick Badge Icon */}
            <button
              onClick={onOpenAdmin}
              id="mobile-admin-quick-btn"
              className="relative p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
              {pendingPaymentsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-black border-2 border-white animate-pulse">
                  {pendingPaymentsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
              id="mobile-menu-toggle"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-3 cursor-pointer ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-900 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 text-blue-800" />}
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVoteModal();
              }}
              className="w-full py-3 bg-blue-900 text-white rounded-xl font-bold text-center text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Vote className="w-4 h-4 text-amber-400" />
              Vote Now (₦50 / vote)
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold text-center hover:bg-slate-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-blue-950" />
              <span>Administrator Portal</span>
              {pendingPaymentsCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black animate-pulse">
                  {pendingPaymentsCount} PENDING
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
