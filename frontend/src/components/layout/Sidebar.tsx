import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  MessageSquare,
  Map,
  Mic,
  Settings,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../utils/helpers';
import { apiClient } from '../../services/api';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'My Profile', path: '/profile', icon: User },
  { label: 'Resume', path: '/resume', icon: FileText },
  { label: 'Jobs', path: '/jobs', icon: Briefcase },
  { label: 'Roadmap', path: '/roadmap', icon: Map },
  { label: 'Interview', path: '/interview', icon: Mic },
  { label: 'Career Chat', path: '/chat', icon: MessageSquare },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = apiClient.getCurrentUser();

  const handleLogout = () => {
    apiClient.logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300',
        'glass border-r border-white/5',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-[15px] text-white tracking-tight animate-fade-in">
            Career Copilot
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
              (item.path === '/jobs' && location.pathname.startsWith('/jobs/'));
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200',
                    'hover:bg-white/5 group relative',
                    isActive
                      ? 'bg-brand-500/10 text-brand-400'
                      : 'text-surface-200 hover:text-white'
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-brand-400" />
                  )}
                  <Icon
                    className={cn(
                      'w-[18px] h-[18px] shrink-0 transition-colors',
                      isActive ? 'text-brand-400' : 'text-surface-300 group-hover:text-white'
                    )}
                  />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-white/5 p-3 space-y-1">
        {!collapsed && currentUser && (
          <div className="px-3 py-2 flex items-center gap-2.5 rounded-xl bg-surface-800/60 border border-white/5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-white truncate">{currentUser.name}</div>
              <div className="text-[11px] text-surface-400 truncate">{currentUser.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-surface-300 
            hover:text-white hover:bg-white/5 transition-all w-full"
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px] shrink-0" />
          ) : (
            <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] text-surface-300 
            hover:text-danger-400 hover:bg-danger-500/10 transition-all w-full text-left"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
