import { 
  LayoutDashboard, 
  Terminal, 
  ClipboardCheck, 
  Trophy, 
  Award, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert 
} from 'lucide-react';
import { RankInfo } from '../types';

interface SidebarProps {
  currentTab: string;
  setTab: (tab: string) => void;
  userProgress: {
    username: string;
    xp: number;
  };
  rank: RankInfo;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ 
  currentTab, 
  setTab, 
  userProgress, 
  rank, 
  onLogout,
  isOpen,
  setIsOpen
}: SidebarProps) {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'labs', label: 'Practical Labs', icon: Terminal },
    { id: 'certificate', label: 'Certificate', icon: Award },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleTabClick = (tabId: string) => {
    setTab(tabId);
    setIsOpen(false); // Close mobile menu if open
  };

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden h-16 w-full glass-panel flex items-center justify-between px-4 border-b border-white/5 sticky top-0 z-40" id="mobile-top-header">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-brand-blue/10 rounded-lg border border-brand-blue/20">
            <ShieldAlert className="w-5 h-5 text-brand-blue" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-white block">EV Cyber Academy</span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium">Starter Program 2026</span>
          </div>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-white/5 rounded-lg text-slate-300 transition-colors"
          id="mobile-menu-toggle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <div 
        className={`w-72 border-r border-[#1e293b]/40 bg-[#111218] flex flex-col fixed inset-y-0 left-0 z-50 transform lg:transform-none lg:sticky lg:h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        id="side-bar-navigation"
      >
        {/* Desktop Brand Header */}
        <div className="p-6 hidden lg:flex items-center gap-3 border-b border-[#1e293b]/40" id="brand-header-desktop">
          <div className="p-2.5 bg-brand-blue/10 rounded-xl border border-brand-blue/20">
            <ShieldAlert className="w-6 h-6 text-brand-blue" />
          </div>
          <div>
            <h1 className="font-bold text-base text-white tracking-tight">EV Cyber Academy</h1>
            <p className="text-xs text-slate-400 font-semibold tracking-wide">Starter Program 2026</p>
          </div>
        </div>

        {/* Small Mobile Close bar */}
        <div className="lg:hidden p-4 flex justify-end border-b border-white/5 bg-[#0a0b10]">
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/5 rounded text-slate-400"
            id="mobile-close-btn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-5 flex items-center gap-3 border-b border-[#1e293b]/40 bg-[#15161f]/40" id="user-info-card">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue/20 to-brand-cyan/20 border border-brand-blue/30 flex items-center justify-center font-bold text-brand-cyan text-base shadow-sm">
            {userProgress.username.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <h2 className="font-semibold text-xs text-white truncate" id="sidebar-user-name">{userProgress.username}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`w-2 h-2 rounded-full ${rank.bgClass} inline-block border-[0.5px] ${rank.borderClass}`}></span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide truncate">{rank.name}</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" id="nav-list">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                  isActive 
                    ? 'bg-brand-blue/10 text-white border border-brand-blue/20 shadow-sm shadow-brand-blue/5' 
                    : 'text-slate-400 hover:bg-[#15161f] hover:text-slate-200 border border-transparent'
                }`}
                id={`nav-${item.id}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/3 bottom-1/3 w-1 bg-brand-blue rounded-r" id={`indicator-${item.id}`}></span>
                )}
                <Icon className={`w-4.5 h-4.5 transition-colors ${
                  isActive ? 'text-brand-blue' : 'text-slate-400 group-hover:text-slate-300'
                }`} />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-[#1e293b]/40 mt-auto" id="sidebar-logout-footer">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-brand-rose/80 hover:text-brand-rose hover:bg-brand-rose/5 border border-transparent hover:border-brand-rose/10 transition-colors cursor-pointer"
            id="sidebar-logout-btn"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Logout Account</span>
          </button>
        </div>
      </div>

      {/* Overlay Backdrop for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
          id="mobile-overlay"
        ></div>
      )}
    </>
  );
}
