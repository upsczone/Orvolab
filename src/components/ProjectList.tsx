import React, { useState, useMemo } from 'react';
import { ResearchProject, SubjectField, ResearchStatus } from '../types/research';
import { ProjectCard } from './ProjectCard';
import { Search, Filter, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';

interface ProjectListProps {
  projects: ResearchProject[];
  onSelectProject: (project: ResearchProject) => void;
  onOpen3D: (project: ResearchProject) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onSelectProject,
  onOpen3D,
  searchTerm,
  onSearchChange,
  selectedSubject,
  onSelectSubject,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'progress-desc' | 'progress-asc' | 'title' | 'updates'>('updates');

  const subjectsList = [
    'All',
    'Quantum Physics',
    'Neurotechnology',
    'Advanced Materials',
    'Synthetic Biology',
    'Clean Energy & Fusion',
    'Cognitive AI',
    'Autonomous Systems',
  ];

  const statusesList = [
    'All',
    'Active Investigation',
    'Computational Synthesis',
    'Experimental Testing',
    'Peer Review',
    'Prototype Validated',
  ];

  // Filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Subject filter
      if (selectedSubject !== 'All' && project.subject !== selectedSubject) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'All' && project.status !== selectedStatus) {
        return false;
      }

      // Search term filter (matches Title, Subject, Lead Researcher name, co-investigators, or tags)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(query);
        const matchesSubject = project.subject.toLowerCase().includes(query);
        const matchesLead = project.leadResearcher.name.toLowerCase().includes(query);
        const matchesDept = project.leadResearcher.department.toLowerCase().includes(query);
        const matchesRoom = project.labRoom.toLowerCase().includes(query);
        const matchesTags = project.tags.some((t) => t.toLowerCase().includes(query));
        const matchesCoInvestigator = project.coInvestigators.some((c) =>
          c.name.toLowerCase().includes(query)
        );

        if (
          !matchesTitle &&
          !matchesSubject &&
          !matchesLead &&
          !matchesDept &&
          !matchesRoom &&
          !matchesTags &&
          !matchesCoInvestigator
        ) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'progress-desc') {
        return b.progressPercentage - a.progressPercentage;
      } else if (sortBy === 'progress-asc') {
        return a.progressPercentage - b.progressPercentage;
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else {
        // Most recent updates first
        return b.updates.length - a.updates.length;
      }
    });
  }, [projects, selectedSubject, selectedStatus, searchTerm, sortBy]);

  const handleResetFilters = () => {
    onSearchChange('');
    onSelectSubject('All');
    setSelectedStatus('All');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by subject, research title, or investigator name (e.g. Thorne, Quantum, Rostova)..."
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status and Sort Controls */}
          <div className="flex items-center gap-2.5 shrink-0 text-xs">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono hidden sm:inline">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs focus:outline-hidden focus:border-cyan-500"
              >
                {statusesList.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs focus:outline-hidden focus:border-cyan-500"
              >
                <option value="updates">Most Active (Logs)</option>
                <option value="progress-desc">Progress: High to Low</option>
                <option value="progress-asc">Progress: Low to High</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Interactive Subject Filter Buttons (Functional Tabs, conforming to design constitution) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
          <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider shrink-0 mr-1">
            Subject:
          </span>
          {subjectsList.map((subj) => (
            <button
              key={subj}
              onClick={() => onSelectSubject(subj)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedSubject === subj
                  ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Count & Active Filters Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div>
          Showing{' '}
          <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
            {filteredProjects.length}
          </span>{' '}
          of{' '}
          <span className="font-mono text-slate-800 dark:text-slate-200">
            {projects.length}
          </span>{' '}
          research investigations
        </div>

        {(searchTerm || selectedSubject !== 'All' || selectedStatus !== 'All') && (
          <button
            onClick={handleResetFilters}
            className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium flex items-center gap-1"
          >
            <span>Reset filters</span>
          </button>
        )}
      </div>

      {/* Grid of Projects */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelectProject={onSelectProject}
              onOpen3D={onOpen3D}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              No matching research investigations found
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              No active research matches "{searchTerm}". Try refining your keywords, clearing subject filters, or search by a researcher's surname.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-cyan-400 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
