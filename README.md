# Orvo Lab — Research & Development Portal

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.x-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r160+-black.svg)](https://threejs.org/)

**Orvo Lab** is a modern, high-precision research and development platform designed to track, organize, and showcase frontier scientific investigations across interdisciplinary fields. It provides real-time visibility into active lab inquiries, lead principal investigators, empirical milestones, and mathematical 3D specimens.

---

## Key Features

### 1. Frontier Research Directory
- **Active Programs**: Comprehensive listings across **Quantum Physics**, **Neurotechnology**, **Advanced Materials**, **Synthetic Biology**, **Clean Energy & Fusion**, **Cognitive AI**, and **Autonomous Systems**.
- **Investigator Attribution**: Explicitly details the **Principal Investigator** (credentials, department, facility room, and contact email) along with the roster of co-investigators and research fellows.
- **Deep-Dive Drawer**: In-depth inspection views covering formal hypotheses ($H_1, H_2$), calibrated metrics (with tabular figures), methodology abstracts, preprints, and one-click citation exports.

### 2. Intelligent Search & Discipline Filtering
- **Multi-Vector Search**: Instant search matching across project titles, research disciplines, investigator surnames (e.g., *Thorne*, *Rostova*, *Chen*), lab rooms, or topical tags.
- **Subject Buttons**: Clean, functional filter tabs for rapid switching between scientific subjects.
- **Status Filtering**: Filter by phase (*Active Investigation*, *Computational Synthesis*, *Experimental Testing*, *Peer Review*, *Prototype Validated*).
- **Multi-Axis Sorting**: Sort projects by progress index, activity volume, or alphabetical order.

### 3. Real-Time Telemetry & Experiment Dashboard
- **Aggregate Metrics**: Live tracking of active investigations, progress indices, participating scientists, and logged telemetry entries.
- **Live Experiment Log Feed**: Chronological stream of bench updates, calibration notes, and empirical milestones.
- **Interactive Log Submission**: Allows researchers to post real-time updates and observations directly to any project with instant feed refresh.
- **Project Registration**: Form allowing users to register new ongoing research programs with persistent `localStorage` support.

### 4. Interactive 3D Scientific Specimen Stage
- **Hardware-Accelerated WebGL (Three.js)**: High-fidelity procedural 3D models with physical PBR materials, studio environment lighting (`RoomEnvironment`), and exponential damping kinematics.
- **Specimens Available**:
  - **3D Microwave Qubit Cavity**: Machined copper resonant enclosure with internal standing wave core and gold-plated coaxial pins.
  - **2D Moiré Superlattice**: Hexagonal MoS₂/WSe₂ bilayers with sub-degree rotational twist angle and interlayer exciton polaritons.
  - **Neural Microelectrode Ribbon**: Polyimide flexible substrate ribbon with pure gold sensing pads.
  - **Carbon Nanotube**: Single-walled cylindrical graphene lattice exhibiting ballistic electron transport.
  - **DNA Origami**: Engineered double-helix geometric scaffold with hydrogen bond rungs.
- **Ergonomic Bottom Dock**: Collapsible HUD dock for orbit toggling, speed regulation, wireframe mode, and viewpoint resets without viewport occlusion.

### 5. Minimalist & Accessible UI
- **Design Constitution**: Built with strict zero-pill discipline, unboxed typographic metadata with subtle separators (`·`), and high-contrast typography (`Plus Jakarta Sans` and `JetBrains Mono`).
- **Dark Mode Switch**: Smooth toggle between pristine lab slate and deep space obsidian modes, persisted across sessions.
- **Mobile Responsive**: Adaptive navigation bar, touch-friendly controls, and responsive layout across all device viewports.

---

## Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **3D Graphics**: [Three.js](https://threejs.org/) + `OrbitControls` + `RoomEnvironment`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Motion](https://motion.dev/)

---

## Project Structure

```
├── src/
│   ├── assets/
│   │   └── images/              # High-fidelity scientific photography assets
│   ├── components/
│   │   ├── AddProjectModal.tsx   # Modal for submitting new research projects
│   │   ├── AddUpdateModal.tsx    # Modal for logging real-time experiment updates
│   │   ├── DashboardMetrics.tsx  # Telemetry dashboard & live experiment stream
│   │   ├── Header.tsx            # Navigation bar adhering to 3-zone contract
│   │   ├── HeroSection.tsx       # Institutional hero banner & KPI strip
│   │   ├── ProjectCard.tsx       # Individual research project card
│   │   ├── ProjectDetailModal.tsx# In-depth modal with tabs, metrics & citations
│   │   ├── ProjectList.tsx       # Search bar, filters, and directory grid
│   │   └── ThreeSpecimenViewer.tsx # Interactive 3D specimen stage
│   ├── data/
│   │   └── initialResearchData.ts# Seed research dataset across 7 disciplines
│   ├── types/
│   │   └── research.ts           # TypeScript interfaces for projects & telemetry
│   ├── App.tsx                   # Main application controller & state
│   ├── index.css                 # Global styling, fonts & scrollbars
│   └── main.tsx                  # React entry point
├── index.html                    # Root HTML with Google Fonts & metadata
├── metadata.json                 # AI Studio application metadata
├── package.json                  # Dependencies & scripts
├── tsconfig.json                 # TypeScript compiler configuration
└── vite.config.ts                # Vite build configuration
```

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or bun

### Installation

1. Clone or download the repository.
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the local development server:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### Production Build

Create an optimized production bundle:
```bash
npm run build
```

---

## License

Apache-2.0. Developed for open scientific collaboration at Orvo Lab.
