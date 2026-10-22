import React from 'react';
import { ArrowDown, Box, Activity, Search } from 'lucide-react';

interface HeroSectionProps {
  onExploreProjects: () => void;
  onOpenDashboard: () => void;
  onOpen3D: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreProjects,
  onOpenDashboard,
  onOpen3D,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="relative border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090E] overflow-hidden transition-colors">
      {/* Background Subtle Optics Refraction Overlay */}
      <div className="absolute inset-0 opacity-15 dark:opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/orvo_lab_hero_optics_1792695951125.jpg"
          alt="Orvo Lab Precision Optics Bench"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover filter saturate-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-[#07090E] via-transparent to-white dark:to-[#07090E]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 md:pt-16 md:pb-20">
        <div className="max-w-3xl space-y-6">
          {/* Zero-Pill Unboxed Scientific Metadata Kicker */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
              ORVO LAB
            </span>
            <span aria-hidden="true">·</span>
            <span>Empirical R&D Division</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Investigation Roster</span>
            <span aria-hidden="true">·</span>
            <span>Open Research Protocol</span>
          </div>

          {/* Refined Display Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-balance">
            Frontier Scientific Research & Discovery.
          </h1>

          {/* Editorial Lead Prose */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Orvo Lab conducts and coordinates active investigations across Quantum Physics, Neurotechnology, 2D Superlattices, Fusion Energy, and Cognitive AI. Track ongoing bench trials, principal investigators, and live experiment telemetry in real time.
          </p>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreProjects}
              className="px-5 py-2.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-cyan-400 transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore Active Research</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenDashboard}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] text-slate-800 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-500" />
              <span>Real-Time Dashboard</span>
            </button>

            <button
              onClick={onOpen3D}
              className="px-4 py-2.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] text-slate-800 dark:text-slate-200 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
            >
              <Box className="w-3.5 h-3.5 text-cyan-500" />
              <span>3D Specimen Stage</span>
            </button>
          </div>
        </div>

        {/* 4-Item Precision Metric Strip (Placed below hero split as per Frontend Design skill) */}
        <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs">
          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Active Programs
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              8 Projects
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
              100% bench verified
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Principal Investigators
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              34 Scientists
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
              Leading global labs
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Scientific Disciplines
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              7 Fields
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
              Cross-disciplinary
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Verification Mode
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-white mt-1 tabular-nums">
              Live Feed
            </div>
            <div className="text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous empirical updates
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
