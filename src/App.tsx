import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ProjectList } from './components/ProjectList';
import { DashboardMetrics } from './components/DashboardMetrics';
import { ThreeSpecimenViewer } from './components/ThreeSpecimenViewer';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { AddProjectModal } from './components/AddProjectModal';
import { AddUpdateModal } from './components/AddUpdateModal';
import { INITIAL_RESEARCH_PROJECTS } from './data/initialResearchData';
import { ResearchProject, ProjectUpdate, SpecimenType } from './types/research';
import { Atom, Compass, Activity, ArrowRight, Shield, Layers, Box } from 'lucide-react';

const STORAGE_KEY_PROJECTS = 'orvo_lab_projects_v1';
const STORAGE_KEY_THEME = 'orvo_lab_theme';

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_THEME);
    if (saved !== null) {
      return saved === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Projects state with LocalStorage persistence
  const [projects, setProjects] = useState<ResearchProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed reading saved projects', e);
    }
    return INITIAL_RESEARCH_PROJECTS;
  });

  // Navigation and view tabs
  const [activeView, setActiveView] = useState<'directory' | 'dashboard' | 'specimen' | 'timeline'>('directory');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');

  // Modals state
  const [selectedProject, setSelectedProject] = useState<ResearchProject | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isAddUpdateOpen, setIsAddUpdateOpen] = useState<boolean>(false);
  const [targetUpdateProject, setTargetUpdateProject] = useState<ResearchProject | null>(null);

  // Synchronize Dark Theme class on <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY_THEME, 'light');
    }
  }, [isDark]);

  // Save projects to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed saving projects to localStorage', e);
    }
  }, [projects]);

  const handleToggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleAddProject = (newProject: ResearchProject) => {
    setProjects((prev) => [newProject, ...prev]);
    // Switch to directory to show the newly added project
    setActiveView('directory');
    setSelectedProject(newProject);
  };

  const handleAddUpdate = (projectId: string, update: ProjectUpdate) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            updates: [update, ...p.updates],
          };
        }
        return p;
      })
    );

    // If modal is currently inspecting this project, update selectedProject reference too
    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) =>
        prev
          ? {
              ...prev,
              updates: [update, ...prev.updates],
            }
          : null
      );
    }
  };

  const handleOpen3DSpecimen = (project: ResearchProject) => {
    setSelectedProject(project);
    setActiveView('specimen');
    // Scroll smoothly to specimen section
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#07090E] dark:text-slate-100 transition-colors">
      {/* Strict Top Bar Contract Header */}
      <Header
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        activeView={activeView}
        onSelectView={setActiveView}
        activeProjectsCount={projects.length}
      />

      {/* Hero Section */}
      <HeroSection
        onExploreProjects={() => {
          setActiveView('directory');
          const element = document.getElementById('research-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenDashboard={() => {
          setActiveView('dashboard');
          const element = document.getElementById('research-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpen3D={() => {
          setActiveView('specimen');
          const element = document.getElementById('research-section');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Main Content Viewport */}
      <main id="research-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* VIEW 1: DIRECTORY (Projects Listing) */}
        {activeView === 'directory' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Active Research Investigations
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Full directory of current scientific explorations, subject domains, and designated principal investigators.
                </p>
              </div>
            </div>

            <ProjectList
              projects={projects}
              onSelectProject={(p) => setSelectedProject(p)}
              onOpen3D={handleOpen3DSpecimen}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
            />
          </div>
        )}

        {/* VIEW 2: REAL-TIME DASHBOARD */}
        {activeView === 'dashboard' && (
          <DashboardMetrics
            projects={projects}
            onSelectProject={(p) => setSelectedProject(p)}
            onOpenAddUpdate={(p) => {
              setTargetUpdateProject(p || null);
              setIsAddUpdateOpen(true);
            }}
          />
        )}

        {/* VIEW 3: 3D SPECIMEN STAGE */}
        {activeView === 'specimen' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-mono uppercase text-cyan-600 dark:text-cyan-400">
                  Interactive Precision Stage
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                  3D Mathematical & Molecular Specimen Visualizer
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Interact with real-time procedural geometries representing quantum cavities, 2D superlattices, and neural microelectrode ribbons.
                </p>
              </div>

              {selectedProject && (
                <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  Current investigation: <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedProject.title.slice(0, 32)}...</span>
                </div>
              )}
            </div>

            <ThreeSpecimenViewer
              initialSpecimen={selectedProject?.specimenType || 'quantum-cavity'}
              selectedProjectTitle={selectedProject?.title}
              isDark={isDark}
            />

            {/* Specimen Description Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17]">
                <div className="font-semibold text-slate-900 dark:text-white">Qubit Cavity</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">
                  Machined copper 3D resonant microwave enclosure housing single-mode electromagnetic standing waves with coaxial coupling pins.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17]">
                <div className="font-semibold text-slate-900 dark:text-white">2D Superlattice</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">
                  Hexagonal MoS₂/WSe₂ bilayers with sub-degree rotational twist angle generating periodic Moiré exciton polariton traps.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17]">
                <div className="font-semibold text-slate-900 dark:text-white">Microelectrode Ribbon</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">
                  Sub-cellular flexible polyimide neural probe equipped with biocompatible pure gold recording micro-pads.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17]">
                <div className="font-semibold text-slate-900 dark:text-white">Carbon Nanotube</div>
                <div className="text-slate-500 dark:text-slate-400 mt-1">
                  Single-walled cylindrical graphene lattice exhibiting ballistic electron transport and ultra-high tensile resilience.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: EXPERIMENT TIMELINE LOG */}
        {activeView === 'timeline' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Laboratory Experiment Chronology
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Continuous log of experimental trials, fabrication runs, and empirical observations across all lab benches.
                </p>
              </div>

              <button
                onClick={() => {
                  setTargetUpdateProject(null);
                  setIsAddUpdateOpen(true);
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-cyan-400 transition-colors inline-flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Log New Experiment Entry</span>
              </button>
            </div>

            <div className="space-y-4">
              {projects
                .flatMap((p) =>
                  p.updates.map((u) => ({
                    ...u,
                    project: p,
                  }))
                )
                .sort((a, b) => b.id.localeCompare(a.id))
                .map((log) => (
                  <div
                    key={log.id}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                          {log.project.subject}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{log.phase}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{log.timestamp}</span>
                      </div>

                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Investigator: {log.author}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white">
                      {log.title}
                    </h4>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {log.note}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800/60 mt-3">
                      <span className="text-slate-400 font-mono">
                        Facility: {log.project.labRoom}
                      </span>

                      <button
                        onClick={() => setSelectedProject(log.project)}
                        className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium inline-flex items-center gap-1"
                      >
                        <span>View Project: {log.project.title.slice(0, 36)}...</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onOpenAddUpdate={(proj) => {
          setTargetUpdateProject(proj);
          setIsAddUpdateOpen(true);
        }}
        isDark={isDark}
      />

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddProject={handleAddProject}
      />

      <AddUpdateModal
        isOpen={isAddUpdateOpen}
        onClose={() => setIsAddUpdateOpen(false)}
        projects={projects}
        defaultProject={targetUpdateProject}
        onAddUpdate={handleAddUpdate}
      />

      {/* Clean Editorial Footer (Compliant with Frontend Design Rule B - No Ornamental Fake Telemetry Tickers) */}
      <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#07090E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 flex items-center justify-center font-bold text-xs">
                  <Atom className="w-3.5 h-3.5" />
                </div>
                <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                  Orvo Lab
                </span>
                <span className="text-xs font-mono text-slate-400">· Research & Development</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                Interdisciplinary scientific investigations across quantum physics, neurotechnology, advanced materials, and cognitive systems.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
              <button onClick={() => setActiveView('directory')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Directory
              </button>
              <button onClick={() => setActiveView('dashboard')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Live Dashboard
              </button>
              <button onClick={() => setActiveView('specimen')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                3D Specimen Stage
              </button>
              <button onClick={() => setActiveView('timeline')} className="hover:text-slate-900 dark:hover:text-white transition-colors">
                Experiment Logs
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Orvo Lab. Dedicated to open scientific discovery and peer-reviewed rigor.
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span>Cleanroom Standard ISO 14644-1 Class 5</span>
              <span>·</span>
              <span>Open Science Framework</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
