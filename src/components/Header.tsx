import React, { useState } from 'react';
import { Sun, Moon, Plus, Menu, X, Atom, Activity } from 'lucide-react';

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenAddModal: () => void;
  activeView: 'directory' | 'dashboard' | 'specimen' | 'timeline';
  onSelectView: (view: 'directory' | 'dashboard' | 'specimen' | 'timeline') => void;
  activeProjectsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onToggleTheme,
  onOpenAddModal,
  activeView,
  onSelectView,
  activeProjectsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#07090E]/95 backdrop-blur-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element in display face, no subtext pill) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSelectView('directory');
            }}
            className="group flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 flex items-center justify-center transition-transform group-hover:scale-105">
              <Atom className="w-4.5 h-4.5" />
            </div>
            <span>Orvo Lab</span>
          </a>
          <span className="hidden lg:inline text-xs font-mono text-slate-400 dark:text-slate-500">
            · R&D Institute
          </span>
        </div>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => onSelectView('directory')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeView === 'directory'
                ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Research Directory
          </button>

          <button
            onClick={() => onSelectView('dashboard')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 flex items-center gap-1.5 ${
              activeView === 'dashboard'
                ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span>Live Dashboard</span>
          </button>

          <button
            onClick={() => onSelectView('specimen')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeView === 'specimen'
                ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            3D Specimen Stage
          </button>

          <button
            onClick={() => onSelectView('timeline')}
            className={`whitespace-nowrap transition-colors py-1 border-b-2 ${
              activeView === 'timeline'
                ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Experiment Log
          </button>
        </nav>

        {/* Zone 3: Dark Mode toggle + Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
          >
            {isDark ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-700" />}
          </button>

          <button
            onClick={onOpenAddModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-cyan-400 transition-all shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Research</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => {
              onSelectView('directory');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              activeView === 'directory'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Research Directory ({activeProjectsCount})
          </button>

          <button
            onClick={() => {
              onSelectView('dashboard');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex items-center justify-between ${
              activeView === 'dashboard'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            <span>Live Dashboard</span>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">Live</span>
          </button>

          <button
            onClick={() => {
              onSelectView('specimen');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              activeView === 'specimen'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            3D Specimen Stage
          </button>

          <button
            onClick={() => {
              onSelectView('timeline');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              activeView === 'timeline'
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Experiment Log
          </button>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                onOpenAddModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Submit Research Project</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
