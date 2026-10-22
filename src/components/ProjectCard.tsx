import React from 'react';
import { ResearchProject } from '../types/research';
import { User, MapPin, ArrowRight, Box, Clock, CheckCircle2 } from 'lucide-react';

interface ProjectCardProps {
  project: ResearchProject;
  onSelectProject: (project: ResearchProject) => void;
  onOpen3D: (project: ResearchProject) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSelectProject,
  onOpen3D,
}) => {
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md">
      {/* Top Image or Technical Geometric Header */}
      {project.imagePath ? (
        <div className="relative h-44 w-full overflow-hidden bg-slate-900 border-b border-slate-100 dark:border-slate-800">
          <img
            src={project.imagePath}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-2.5 left-4 right-4 flex items-center justify-between text-xs text-white/90">
            <span className="font-mono text-[11px] text-cyan-300">
              {project.labRoom}
            </span>
            <span className="font-mono text-[11px] text-slate-300">
              Est. {project.estimatedCompletion}
            </span>
          </div>
        </div>
      ) : (
        <div className="h-3 bg-gradient-to-r from-cyan-500/20 via-slate-300/20 dark:via-slate-700/20 to-cyan-500/10" />
      )}

      {/* Main Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Unboxed Metadata (Zero-Pill discipline) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-cyan-700 dark:text-cyan-400">
              {project.subject}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.status}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">{project.progressPercentage}% Complete</span>
          </div>

          {/* Research Title */}
          <h3
            onClick={() => onSelectProject(project)}
            className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-700 dark:group-hover:text-cyan-400 cursor-pointer transition-colors leading-snug line-clamp-2"
          >
            {project.title}
          </h3>

          {/* Abstract / Summary */}
          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
            {project.summary}
          </p>
        </div>

        {/* Lead Investigator & Team Section (Explicit requirement: "kon kr rha hai") */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 font-mono text-xs font-semibold">
              {project.leadResearcher.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Principal Investigator
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                {project.leadResearcher.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {project.leadResearcher.credentials}
              </div>
            </div>
          </div>

          {/* Co-investigators summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>
              Team: {project.coInvestigators.length} Co-Investigators
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              {project.updates.length} experiment logs
            </span>
          </div>

          {/* Progress Bar (Tabular math) */}
          <div className="space-y-1">
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-slate-900 dark:bg-cyan-500 rounded-full transition-all duration-300"
                style={{ width: `${project.progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 flex items-center justify-between gap-3 text-xs">
        <button
          onClick={() => onOpen3D(project)}
          className="inline-flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors font-medium"
        >
          <Box className="w-3.5 h-3.5" />
          <span>3D Specimen</span>
        </button>

        <button
          onClick={() => onSelectProject(project)}
          className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <span>Investigation Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
