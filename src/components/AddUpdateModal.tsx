import React, { useState } from 'react';
import { ResearchProject, ProjectUpdate } from '../types/research';
import { X, Activity, Check } from 'lucide-react';

interface AddUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ResearchProject[];
  defaultProject?: ResearchProject | null;
  onAddUpdate: (projectId: string, update: ProjectUpdate) => void;
}

export const AddUpdateModal: React.FC<AddUpdateModalProps> = ({
  isOpen,
  onClose,
  projects,
  defaultProject,
  onAddUpdate,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    defaultProject ? defaultProject.id : projects[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState(defaultProject?.leadResearcher.name || '');
  const [phase, setPhase] = useState('Laboratory Testing');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const currentSelectedProject = projects.find((p) => p.id === selectedProjectId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !note.trim()) {
      setError('Please provide an update headline and laboratory note.');
      return;
    }

    const newUpdate: ProjectUpdate = {
      id: `up-${Date.now()}`,
      timestamp: 'Just now',
      title: title.trim(),
      note: note.trim(),
      author: author.trim() || currentSelectedProject?.leadResearcher.name || 'Staff Scientist',
      phase,
    };

    onAddUpdate(selectedProjectId, newUpdate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] shadow-2xl p-6 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Post Experiment Update
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log real-time bench data, trial milestones, or findings.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Target Project Selection */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Assign to Investigation *
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => {
                setSelectedProjectId(e.target.value);
                const p = projects.find((proj) => proj.id === e.target.value);
                if (p) setAuthor(p.leadResearcher.name);
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  [{p.subject}] {p.title.slice(0, 48)}...
                </option>
              ))}
            </select>
          </div>

          {/* Update Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Update Headline / Finding *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Laser Coherence Metrology Trial Passed 12h Threshold"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* Author & Phase */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Scientist / Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Dr. Aris Thorne"
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Experimental Phase
              </label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
              >
                <option value="Calibration & Metrology">Calibration & Metrology</option>
                <option value="Fabrication & Lithography">Fabrication & Lithography</option>
                <option value="Bench Trial">Bench Trial</option>
                <option value="Data Synthesis">Data Synthesis</option>
                <option value="Preprint Review">Preprint Review</option>
              </select>
            </div>
          </div>

          {/* Notes textarea */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Detailed Empirical Note *
            </label>
            <textarea
              required
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Record sensor readouts, observed physical phenomena, or deviations from hypothesis..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* Submit buttons */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold hover:bg-slate-800 dark:hover:bg-cyan-400"
            >
              Log Real-Time Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
