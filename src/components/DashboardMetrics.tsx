import React, { useState } from 'react';
import { ResearchProject, SubjectField } from '../types/research';
import { Activity, Clock, Plus, BarChart2, CheckCircle2, FlaskConical, Users, ArrowUpRight } from 'lucide-react';

interface DashboardMetricsProps {
  projects: ResearchProject[];
  onSelectProject: (project: ResearchProject) => void;
  onOpenAddUpdate: (project?: ResearchProject) => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  projects,
  onSelectProject,
  onOpenAddUpdate,
}) => {
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('All');

  // Compute aggregate statistics
  const totalProjects = projects.length;
  const activeCount = projects.filter((p) => p.status === 'Active Investigation' || p.status === 'Experimental Testing').length;
  const avgProgress = Math.round(
    projects.reduce((acc, curr) => acc + curr.progressPercentage, 0) / (totalProjects || 1)
  );

  // Collect all updates sorted by reverse chronological order
  const allUpdates = projects
    .flatMap((p) =>
      p.updates.map((u) => ({
        ...u,
        projectId: p.id,
        projectTitle: p.title,
        projectSubject: p.subject,
        leadName: p.leadResearcher.name,
      }))
    )
    .sort((a, b) => b.id.localeCompare(a.id));

  const filteredUpdates =
    selectedSubjectFilter === 'All'
      ? allUpdates
      : allUpdates.filter((u) => u.projectSubject === selectedSubjectFilter);

  // Group by subjects
  const subjectBreakdown = projects.reduce((acc, curr) => {
    acc[curr.subject] = (acc[curr.subject] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-8">
      {/* Editorial Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="text-xs font-mono tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            Real-Time Laboratory Dashboard
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Operational Telemetry & Experiment Stream
          </h2>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Centralized monitoring of active investigations, milestone velocity, and field findings.
          </div>
        </div>

        <button
          onClick={() => onOpenAddUpdate()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-cyan-400 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Post Experiment Log</span>
        </button>
      </div>

      {/* 4 Primary Metric Displays (Strict 60-30-10, Tabular Figures) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] transition-all">
          <div className="text-[11px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-400">
            Active Investigations
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {totalProjects}
            </span>
            <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
              {activeCount} bench live
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>Interdisciplinary Teams</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">100% active</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] transition-all">
          <div className="text-[11px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-400">
            Average Progress Index
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {avgProgress}
            </span>
            <span className="text-sm font-mono text-slate-400">%</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>Milestones Met</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">72 / 96</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] transition-all">
          <div className="text-[11px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-400">
            Scientific Disciplines
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {Object.keys(subjectBreakdown).length}
            </span>
            <span className="text-xs font-mono text-slate-400">Sub-fields</span>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>Lead Investigators</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{totalProjects} Ph.D./M.D.</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] transition-all">
          <div className="text-[11px] font-mono tracking-wider uppercase text-slate-400 dark:text-slate-400">
            Recorded Telemetry Logs
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-bold text-slate-900 dark:text-white tabular-nums">
              {allUpdates.length}
            </span>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
              Live Feed
            </span>
          </div>
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2">
            <span>Latest Timestamp</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">Continuous</span>
          </div>
        </div>
      </div>

      {/* Grid: Real-time Update Feed & Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Real-time Update Stream (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>Real-Time Research Logs</span>
            </h3>

            {/* Filter by field */}
            <div className="flex items-center gap-1 overflow-x-auto text-xs">
              {['All', 'Quantum Physics', 'Neurotechnology', 'Advanced Materials', 'Synthetic Biology'].map(
                (subj) => (
                  <button
                    key={subj}
                    onClick={() => setSelectedSubjectFilter(subj)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                      selectedSubjectFilter === subj
                        ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {subj}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-[#0b0e17] overflow-hidden">
            {filteredUpdates.map((update) => {
              const matchedProject = projects.find((p) => p.id === update.projectId);
              return (
                <div
                  key={update.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      {/* Zero-pill unboxed metadata */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-400">
                        <span className="font-medium text-cyan-600 dark:text-cyan-400">
                          {update.projectSubject}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{update.phase}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{update.timestamp}</span>
                      </div>

                      <h4 className="text-base font-semibold text-slate-900 dark:text-white">
                        {update.title}
                      </h4>

                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                        {update.note}
                      </p>
                    </div>

                    {matchedProject && (
                      <button
                        onClick={() => onSelectProject(matchedProject)}
                        className="shrink-0 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="View Full Investigation"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/60 pt-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Logged by {update.author}
                      </span>
                    </div>

                    {matchedProject && (
                      <button
                        onClick={() => onSelectProject(matchedProject)}
                        className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                      >
                        Project: {update.projectTitle.slice(0, 36)}...
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Portfolio Velocity & Distribution (1 col) */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-500" />
            <span>Research Distribution</span>
          </h3>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Departmental resource allocation across Orvo Lab core disciplines:
            </div>

            <div className="space-y-3.5">
              {Object.entries(subjectBreakdown).map(([subject, count]) => {
                const pct = Math.round((count / totalProjects) * 100);
                return (
                  <div key={subject} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {subject}
                      </span>
                      <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                        {count} {count === 1 ? 'project' : 'projects'} ({pct}%)
                      </span>
                    </div>
                    {/* Minimalist Progress Track */}
                    <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-600 dark:bg-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-xs font-mono text-slate-400 mb-2">Empirical Standards:</div>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                <li>Double-blind peer review before external preprint release</li>
                <li>Cryogenic & laser metrology recalibrated every 24h</li>
                <li>Open open-source telemetry for public datasets</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
