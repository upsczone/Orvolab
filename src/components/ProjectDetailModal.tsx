import React, { useState, useEffect } from 'react';
import { ResearchProject } from '../types/research';
import { ThreeSpecimenViewer } from './ThreeSpecimenViewer';
import {
  X,
  User,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Activity,
  Box,
  Share2,
  Copy,
  Check,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: ResearchProject | null;
  onClose: () => void;
  onOpenAddUpdate: (project: ResearchProject) => void;
  isDark: boolean;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  onOpenAddUpdate,
  isDark,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'updates' | 'specimen' | 'team'>('overview');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleCopyCitation = () => {
    const citation = `${project.leadResearcher.name} et al. (${project.startedDate.slice(0, 4)}). "${project.title}". Orvo Lab R&D Division. Project ID: ${project.id}.`;
    navigator.clipboard.writeText(citation);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs transition-opacity">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] shadow-2xl text-slate-900 dark:text-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0b0e17]/95 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-cyan-600 dark:text-cyan-400">
              {project.subject}
            </span>
            <span aria-hidden="true">·</span>
            <span>{project.labRoom}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono">ID: {project.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Banner or Graphical Top (if image available) */}
        {project.imagePath && (
          <div className="relative h-56 sm:h-64 w-full bg-slate-900 overflow-hidden shrink-0">
            <img
              src={project.imagePath}
              alt={project.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 flex flex-col justify-end text-white">
              <span className="text-xs font-mono text-cyan-300 uppercase tracking-wider mb-1">
                {project.status} · {project.progressPercentage}% Validated
              </span>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight max-w-2xl">
                {project.title}
              </h2>
            </div>
          </div>
        )}

        {/* Title area if no image */}
        {!project.imagePath && (
          <div className="px-6 pt-6 pb-2">
            <div className="text-xs font-mono uppercase text-cyan-600 dark:text-cyan-400 mb-1">
              {project.status} · {project.progressPercentage}% Validated
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {project.title}
            </h2>
          </div>
        )}

        {/* Tab Navigation (Buttons with click handlers) */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex items-center gap-6 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Overview & Methodology
          </button>

          <button
            onClick={() => setActiveTab('updates')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'updates'
                ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-500" />
            <span>Experiment Logs ({project.updates.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('specimen')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'specimen'
                ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-cyan-500" />
            <span>3D Interactive Specimen</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`py-3 border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'team'
                ? 'border-cyan-500 text-slate-900 dark:text-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            Investigators & Citations
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Research Summary & Objective
                </h4>
                <p className="text-base text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                  {project.fullDescription}
                </p>
              </div>

              {/* Empirical Metrics Cards */}
              <div className="space-y-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Calibrated Performance Metrics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60"
                    >
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {metric.label}
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                          {metric.value}
                        </span>
                        {metric.unit && (
                          <span className="text-xs font-mono text-slate-400 uppercase">
                            {metric.unit}
                          </span>
                        )}
                      </div>
                      {metric.trend && (
                        <div className="text-xs text-cyan-600 dark:text-cyan-400 mt-1">
                          {metric.trend}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Research Hypotheses */}
              <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Empirical Hypotheses Under Investigation
                </h4>
                <ul className="space-y-2">
                  {project.hypotheses.map((h, i) => (
                    <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                      <span className="font-mono text-cyan-600 dark:text-cyan-400 text-xs mt-0.5 font-bold">
                        H{i + 1}.
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-slate-400 font-mono">Date Initiated:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {project.startedDate}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-mono">Target Horizon:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {project.estimatedCompletion}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-mono">Facility:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {project.labRoom}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 font-mono">Peer Publications:</div>
                  <div className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">
                    {project.publications.length} journal paper
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE EXPERIMENT LOGS */}
          {activeTab === 'updates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Chronological Bench Updates
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real-time research notes and experiment logs registered for this investigation.
                  </p>
                </div>

                <button
                  onClick={() => onOpenAddUpdate(project)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-cyan-400 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Log Update</span>
                </button>
              </div>

              <div className="space-y-4">
                {project.updates.map((update, idx) => (
                  <div
                    key={update.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-600 dark:text-cyan-400">
                          {update.phase}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{update.timestamp}</span>
                      </div>
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {update.author}
                      </span>
                    </div>

                    <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                      {update.title}
                    </h5>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {update.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 3D SPECIMEN VIEWER */}
          {activeTab === 'specimen' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Interactive 3D mathematical and molecular model of this project's core specimen.
                </span>
                <span className="font-mono text-cyan-600 dark:text-cyan-400">
                  Left-drag: Orbit · Scroll: Zoom
                </span>
              </div>

              <ThreeSpecimenViewer
                initialSpecimen={project.specimenType}
                selectedProjectTitle={project.title}
                isDark={isDark}
              />
            </div>
          )}

          {/* TAB 4: INVESTIGATORS & CITATIONS */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {/* Lead Investigator Bio */}
              <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                <div className="text-xs font-mono uppercase text-slate-400">
                  Principal Investigator
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 flex items-center justify-center font-bold font-mono text-base shrink-0">
                    {project.leadResearcher.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {project.leadResearcher.name}
                    </h4>
                    <div className="text-xs text-cyan-600 dark:text-cyan-400 font-medium">
                      {project.leadResearcher.role} · {project.leadResearcher.department}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {project.leadResearcher.credentials}
                    </div>
                    <div className="text-xs font-mono text-slate-600 dark:text-slate-300 mt-2">
                      Direct Contact: {project.leadResearcher.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Co-Investigators Roster */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Co-Investigators & Research Fellows
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.coInvestigators.map((co, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {co.name}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {co.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preprints & Peer Review Publications */}
              <div className="space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Scientific Publications & Preprints
                </h4>
                {project.publications.map((pub, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] space-y-1 text-xs"
                  >
                    <div className="font-semibold text-slate-900 dark:text-white">
                      "{pub.title}"
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                      <span>{pub.journal} ({pub.year})</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-cyan-600 dark:text-cyan-400">
                        DOI: {pub.doi}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Citation Copy Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleCopyCitation}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:border-cyan-500 transition-colors"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Citation Copied to Clipboard</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Standard Citation</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
