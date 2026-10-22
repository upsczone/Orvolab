export type SubjectField = 
  | 'Quantum Physics'
  | 'Neurotechnology'
  | 'Advanced Materials'
  | 'Synthetic Biology'
  | 'Clean Energy & Fusion'
  | 'Cognitive AI'
  | 'Autonomous Systems';

export type ResearchStatus = 
  | 'Active Investigation'
  | 'Computational Synthesis'
  | 'Experimental Testing'
  | 'Peer Review'
  | 'Prototype Validated';

export type SpecimenType = 
  | 'quantum-cavity'
  | 'neural-lattice'
  | 'superlattice-crystal'
  | 'carbon-nanotube'
  | 'dna-origami';

export interface Researcher {
  name: string;
  role: string;
  credentials: string;
  department: string;
  email: string;
  avatarSeed?: string;
}

export interface ProjectUpdate {
  id: string;
  timestamp: string;
  title: string;
  note: string;
  author: string;
  phase: string;
}

export interface Publication {
  title: string;
  journal: string;
  year: number;
  doi: string;
}

export interface MetricItem {
  label: string;
  value: string;
  unit?: string;
  trend?: string;
}

export interface ResearchProject {
  id: string;
  title: string;
  subject: SubjectField;
  status: ResearchStatus;
  progressPercentage: number;
  leadResearcher: Researcher;
  coInvestigators: Array<{ name: string; role: string }>;
  labRoom: string;
  summary: string;
  fullDescription: string;
  hypotheses: string[];
  metrics: MetricItem[];
  imagePath?: string;
  specimenType: SpecimenType;
  startedDate: string;
  estimatedCompletion: string;
  updates: ProjectUpdate[];
  publications: Publication[];
  tags: string[];
}
