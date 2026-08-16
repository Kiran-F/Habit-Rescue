import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  LifeBuoy, 
  BarChart3, 
  Calendar as CalendarIcon, 
  Sparkles, 
  RotateCcw,
  LogOut,
  Menu,
  X,
  Sprout,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHabits } from '../../context/HabitContext';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isDemoUser, logoutUser } = useAuth();
  const { recoveryPlans, resetToDemoData } = useHabits();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const activeRescueCount = recoveryPlans.filter(p => p.status === 'active' || p.status === 'pending_approval').length;

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Habits', path: '/habits', icon: CheckCircle2 },
    { 
      name: 'Rescue Center', 
      path: '/rescue', 
      icon: LifeBuoy, 
      badge: activeRescueCount > 0 ? activeRescueCount : null 
    },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'Weekly Review', path: '/weekly-review', icon: Sparkles }
  ];

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-slate-200 dark:border-[#293730] bg-white/95 dark:bg-[#141917]/95 backdrop-blur-md transition-colors duration-300 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Clean Logo */}
        <Link to={currentUser ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#659F84] to-[#E07A5F] p-0.5 shadow-md">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-[#141917]">
              <Sprout className="h-4 w-4 text-[#659F84]" />
            </div>
          </div>
          <span className="font-heading text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Habit Rescue
          </span>
        </Link>

        {/* Desktop Links */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#659F84] text-white dark:text-[#141917] font-bold shadow-md shadow-[#659F84]/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#202B25]'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-white dark:text-[#141917]' : 'text-[#659F84]'}`} />
                  {link.name}
                  {link.badge && (
                    <span className="ml-1 rounded-full bg-[#E07A5F] text-white px-1.5 py-0.2 text-[10px] font-bold">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-[#293730] bg-slate-100 dark:bg-[#202B25] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-[#E9C46A]" />
            ) : (
              <Moon className="h-4 w-4 text-[#659F84]" />
            )}
          </button>

          {currentUser ? (
            <>
              {isDemoUser && (
                <button
                  onClick={resetToDemoData}
                  className="hidden lg:flex items-center gap-1 text-xs font-semibold text-[#E07A5F] bg-[#E07A5F]/15 border border-[#E07A5F]/40 px-3 py-1.5 rounded-xl"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Demo Reset
                </button>
              )}

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#202B25] border border-slate-200 dark:border-[#659F84]/40 text-xs font-semibold text-[#40755C] dark:text-[#84B59F]">
                Resilience: {currentUser.resilienceScore || 100}%
              </div>

              <div className="flex items-center gap-2 border-l border-slate-200 dark:border-[#293730] pl-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#659F84] to-[#E07A5F] flex items-center justify-center font-bold text-xs text-white dark:text-[#141917]">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'A'}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-red-500 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                Log In
              </Link>
              <Link to="/register" className="px-4 py-2 text-xs font-bold text-white dark:text-[#141917] bg-[#659F84] hover:bg-[#52796F] rounded-xl shadow-md">
                Get Started
              </Link>
            </div>
          )}

          {currentUser && (
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-500 dark:text-slate-400">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && currentUser && (
        <div className="md:hidden border-b border-slate-200 dark:border-[#293730] bg-white dark:bg-[#141917] px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl ${
                  isActive ? 'bg-[#659F84] text-white dark:text-[#141917]' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#202B25]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {link.name}
                </div>
                {link.badge && (
                  <span className="rounded-full bg-[#E07A5F] text-white px-2 py-0.5 text-[10px] font-bold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
