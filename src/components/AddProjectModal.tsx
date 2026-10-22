import React, { useState } from 'react';
import { ResearchProject, SubjectField, ResearchStatus, SpecimenType } from '../types/research';
import { X, Plus, ShieldAlert } from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: ResearchProject) => void;
}

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState<SubjectField>('Quantum Physics');
  const [leadName, setLeadName] = useState('');
  const [credentials, setCredentials] = useState('Ph.D. Applied Physics');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Advanced Quantum Systems');
  const [labRoom, setLabRoom] = useState('Cleanroom Hall C, Bay 102');
  const [status, setStatus] = useState<ResearchStatus>('Active Investigation');
  const [summary, setSummary] = useState('');
  const [hypothesis1, setHypothesis1] = useState('');
  const [specimenType, setSpecimenType] = useState<SpecimenType>('quantum-cavity');
  const [progress, setProgress] = useState(35);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !leadName.trim() || !summary.trim()) {
      setError('Please provide a research title, lead investigator name, and objective summary.');
      return;
    }

    const newProject: ResearchProject = {
      id: `orvo-${Date.now().toString().slice(-5)}`,
      title: title.trim(),
      subject,
      status,
      progressPercentage: progress,
      leadResearcher: {
        name: leadName.trim(),
        role: 'Principal Investigator',
        credentials: credentials.trim() || 'Ph.D.',
        department: department.trim() || `${subject} Core Group`,
        email: email.trim() || `${leadName.toLowerCase().replace(/\s+/g, '.')}@orvolab.org`,
      },
      coInvestigators: [
        { name: 'Dr. Research Fellow', role: 'Senior Analyst' },
        { name: 'Lab Technical Associate', role: 'Instrumentation Specialist' },
      ],
      labRoom: labRoom.trim() || 'Laboratory Suite 101',
      summary: summary.trim(),
      fullDescription: summary.trim(),
      hypotheses: [
        hypothesis1.trim() || 'Primary theoretical model satisfies target experimental thresholds within 95% confidence intervals.',
      ],
      metrics: [
        { label: 'Operational Efficiency', value: '94.2', unit: '%', trend: 'Initial benchmark' },
        { label: 'Signal Resolution', value: '0.04', unit: 'nm', trend: 'Calibrated' },
      ],
      specimenType,
      startedDate: new Date().toISOString().slice(0, 10),
      estimatedCompletion: '2027-12-31',
      updates: [
        {
          id: `up-${Date.now()}`,
          timestamp: 'Just now',
          title: 'Research Charter Approved & Protocol Initiated',
          note: 'Project officially registered into the Orvo Lab active research roster. Initial parameter calibration and cleanroom booking finalized.',
          author: leadName.trim(),
          phase: 'Protocol Registration',
        },
      ],
      publications: [],
      tags: [subject, 'Orvo Lab', 'Active Trial'],
    };

    onAddProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-xs">
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0e17] shadow-2xl p-6 text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Submit Research Investigation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Register a new ongoing research program to the Orvo Lab active directory.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          {/* Title */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Research Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Direct Femtosecond Laser Scribing of Topological Photonic Waveguides"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* Grid: Subject & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Scientific Subject *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as SubjectField)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
              >
                <option value="Quantum Physics">Quantum Physics</option>
                <option value="Neurotechnology">Neurotechnology</option>
                <option value="Advanced Materials">Advanced Materials</option>
                <option value="Synthetic Biology">Synthetic Biology</option>
                <option value="Clean Energy & Fusion">Clean Energy & Fusion</option>
                <option value="Cognitive AI">Cognitive AI</option>
                <option value="Autonomous Systems">Autonomous Systems</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Investigation Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ResearchStatus)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
              >
                <option value="Active Investigation">Active Investigation</option>
                <option value="Computational Synthesis">Computational Synthesis</option>
                <option value="Experimental Testing">Experimental Testing</option>
                <option value="Peer Review">Peer Review</option>
                <option value="Prototype Validated">Prototype Validated</option>
              </select>
            </div>
          </div>

          {/* Lead Investigator Details (Explicit requirement: "kon kr rha hai") */}
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
            <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Principal Investigator (Who is conducting the research)</span>
              <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400">Full Name *</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Dr. Kieran Walsh"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400">Credentials & Degree</label>
                <input
                  type="text"
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  placeholder="e.g. Ph.D. Applied Physics (MIT)"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400">Department / Group</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Nanophotonics Division"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-600 dark:text-slate-400">Laboratory Room / Bay</label>
                <input
                  type="text"
                  value={labRoom}
                  onChange={(e) => setLabRoom(e.target.value)}
                  placeholder="e.g. Bay 4, Optics Wing"
                  className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Summary / Abstract */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Objective & Abstract Summary *
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="State the scientific problem, empirical methodology, and projected technological breakthrough..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* Research Hypothesis */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Primary Empirical Hypothesis
            </label>
            <input
              type="text"
              value={hypothesis1}
              onChange={(e) => setHypothesis1(e.target.value)}
              placeholder="e.g., Coupling coefficient increases monotonically with gate voltage up to 4.2V."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-cyan-500"
            />
          </div>

          {/* 3D Specimen Model & Progress */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                3D Mathematical Specimen Model
              </label>
              <select
                value={specimenType}
                onChange={(e) => setSpecimenType(e.target.value as SpecimenType)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-cyan-500"
              >
                <option value="quantum-cavity">3D Microwave Qubit Cavity</option>
                <option value="superlattice-crystal">2D Moiré Superlattice</option>
                <option value="neural-lattice">Microelectrode Neural Array</option>
                <option value="carbon-nanotube">Carbon Nanotube Lattice</option>
                <option value="dna-origami">DNA Origami Helix</option>
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Initial Progress Index: {progress}%
                </label>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={progress}
                onChange={(e) => setProgress(parseInt(e.target.value))}
                className="w-full accent-cyan-500 h-2 mt-2"
              />
            </div>
          </div>

          {/* Footer Submit Action */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold hover:bg-slate-800 dark:hover:bg-cyan-400 transition-colors shadow-sm"
            >
              Register Investigation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
