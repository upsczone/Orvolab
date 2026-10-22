import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { SpecimenType } from '../types/research';
import { RotateCw, Maximize2, Eye, Compass, Layers, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';

interface ThreeSpecimenViewerProps {
  initialSpecimen?: SpecimenType;
  selectedProjectTitle?: string;
  isDark?: boolean;
  className?: string;
}

export const ThreeSpecimenViewer: React.FC<ThreeSpecimenViewerProps> = ({
  initialSpecimen = 'quantum-cavity',
  selectedProjectTitle,
  isDark = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSpecimen, setCurrentSpecimen] = useState<SpecimenType>(initialSpecimen);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotationSpeed, setRotationSpeed] = useState<number>(1.0);
  const [hudCollapsed, setHudCollapsed] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  // Synchronize when prop changes
  useEffect(() => {
    if (initialSpecimen) {
      setCurrentSpecimen(initialSpecimen);
    }
  }, [initialSpecimen]);

  // Keep internal mutable refs for animation loop
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const specimenGroupRef = useRef<THREE.Group | null>(null);
  const wireframeRef = useRef<boolean>(wireframe);
  wireframeRef.current = wireframe;
  const autoRotateRef = useRef<boolean>(autoRotate);
  autoRotateRef.current = autoRotate;
  const rotationSpeedRef = useRef<number>(rotationSpeed);
  rotationSpeedRef.current = rotationSpeed;
  const isDarkRef = useRef<boolean>(isDark);
  isDarkRef.current = isDark;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Detect Software WebGL
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const bgColor = isDarkRef.current ? 0x07090e : 0xf8fafc;
    scene.background = new THREE.Color(bgColor);
    scene.fog = new THREE.FogExp2(bgColor, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(3.8, 2.8, 4.6);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // Environment Lighting (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point lights
    const hemiLight = new THREE.HemisphereLight(0xe2e8f0, 0x0f172a, 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(5, 8, 4);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x06b6d4, 1.4);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Coordinate floor grid & subtle contact plane
    const gridHelper = new THREE.GridHelper(10, 20, 0x06b6d4, isDarkRef.current ? 0x1e293b : 0xcbd5e1);
    gridHelper.position.y = -1.0;
    scene.add(gridHelper);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxDistance = 14;
    controls.minDistance = 1.5;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // Specimen group
    const specimenGroup = new THREE.Group();
    scene.add(specimenGroup);
    specimenGroupRef.current = specimenGroup;

    // Build procedural 3D model according to specimen type
    buildSpecimen(specimenGroup, currentSpecimen, wireframeRef.current);

    // Animation frame handling
    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotateRef.current && specimenGroupRef.current) {
        specimenGroupRef.current.rotation.y += delta * 0.35 * rotationSpeedRef.current;
      }

      controls.update();
      renderer.render(scene, camera);

      // Track zoom level for HUD
      const dist = camera.position.distanceTo(controls.target);
      const zoomPct = Math.round((6 / dist) * 100);
      setZoomLevel(Math.min(Math.max(zoomPct, 40), 220));
    };

    frameId = requestAnimationFrame(animate);

    // Resize observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      // Dispose meshes
      disposeGroup(specimenGroup);
    };
  }, []);

  // Update background and fog when dark mode changes
  useEffect(() => {
    if (sceneRef.current) {
      const bgColor = isDark ? 0x07090e : 0xf8fafc;
      sceneRef.current.background = new THREE.Color(bgColor);
      sceneRef.current.fog = new THREE.FogExp2(bgColor, 0.04);
    }
  }, [isDark]);

  // Re-build specimen geometry when currentSpecimen or wireframe changes
  useEffect(() => {
    if (specimenGroupRef.current) {
      disposeGroup(specimenGroupRef.current);
      buildSpecimen(specimenGroupRef.current, currentSpecimen, wireframe);
    }
  }, [currentSpecimen, wireframe]);

  const handleResetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(3.8, 2.8, 4.6);
      controlsRef.current.target.set(0, 0.2, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className={`relative w-full h-[480px] md:h-[560px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#07090E] ${className}`}>
      {/* 3D Canvas Mount Point */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Specimen Telemetry Label */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none select-none">
        <div className="flex flex-col">
          <div className="text-[11px] font-mono tracking-wider uppercase text-cyan-600 dark:text-cyan-400">
            3D Specimen Telemetry Stage
          </div>
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span>{formatSpecimenTitle(currentSpecimen)}</span>
            <span className="text-xs font-mono text-slate-400">· {zoomLevel}% Magnification</span>
          </div>
          {selectedProjectTitle && (
            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm truncate mt-0.5">
              Assigned: {selectedProjectTitle}
            </div>
          )}
        </div>
      </div>

      {/* Top Right Quick Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
        <button
          onClick={handleResetCamera}
          title="Reset Viewpoint"
          className="p-1.5 text-xs font-mono text-slate-600 dark:text-slate-300 bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-md hover:border-cyan-500 transition-colors shadow-sm flex items-center gap-1"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-500" />
          <span className="hidden sm:inline">Reset</span>
        </button>
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          title="Toggle Auto Rotation"
          className={`p-1.5 text-xs font-mono rounded-md border transition-colors shadow-sm flex items-center gap-1 ${
            autoRotate
              ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-400/60'
              : 'bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
        >
          <RotateCw className="w-3.5 h-3.5 text-cyan-500" />
          <span className="hidden sm:inline">{autoRotate ? 'Orbit: On' : 'Orbit: Off'}</span>
        </button>
      </div>

      {/* Bottom Center Unified Control Dock (Strictly following Three.js guidelines) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-[94%] max-w-2xl select-none transition-all duration-300">
        {/* Collapse / Expand Tab */}
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setHudCollapsed(!hudCollapsed)}
            className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono tracking-tight text-slate-600 dark:text-slate-300 bg-white/95 dark:bg-slate-900/95 border border-b-0 border-slate-200 dark:border-slate-800 rounded-t-md hover:text-cyan-600 dark:hover:text-cyan-400 shadow-sm"
          >
            {hudCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{hudCollapsed ? 'Show Stage HUD' : 'Collapse HUD'}</span>
          </button>
        </div>

        {!hudCollapsed && (
          <div className="p-3 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl backdrop-blur-none flex flex-col gap-2.5">
            {/* Specimen Switcher */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-mono text-slate-400 shrink-0">Model:</span>
              <div className="flex items-center gap-1">
                {(['quantum-cavity', 'superlattice-crystal', 'neural-lattice', 'carbon-nanotube', 'dna-origami'] as SpecimenType[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setCurrentSpecimen(type)}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                      currentSpecimen === type
                        ? 'bg-slate-900 text-white dark:bg-cyan-500 dark:text-slate-950 font-semibold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {formatSpecimenShort(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Parameter & Display Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2 text-xs">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setWireframe(!wireframe)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                    wireframe
                      ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-300 font-medium'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Wireframe</span>
                </button>

                <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span>Speed:</span>
                  <input
                    type="range"
                    min="0.2"
                    max="2.5"
                    step="0.1"
                    value={rotationSpeed}
                    onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                    className="w-20 accent-cyan-500 cursor-pointer h-1"
                  />
                  <span>{rotationSpeed.toFixed(1)}x</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
                <span>Empirical Precision 10⁻¹² m</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper: Format Specimen Titles
function formatSpecimenTitle(type: SpecimenType): string {
  switch (type) {
    case 'quantum-cavity':
      return '3D Superconducting Microwave Qubit Cavity';
    case 'superlattice-crystal':
      return '2D Moiré Superlattice Hexagonal Crystal';
    case 'neural-lattice':
      return 'Sub-Cellular Neural Microelectrode Ribbon';
    case 'carbon-nanotube':
      return 'Chiral Single-Walled Carbon Nanotube';
    case 'dna-origami':
      return 'Engineered Synthetic DNA Origami Nanostructure';
  }
}

function formatSpecimenShort(type: SpecimenType): string {
  switch (type) {
    case 'quantum-cavity':
      return 'Qubit Cavity';
    case 'superlattice-crystal':
      return 'Superlattice';
    case 'neural-lattice':
      return 'Neural Array';
    case 'carbon-nanotube':
      return 'Nanotube';
    case 'dna-origami':
      return 'DNA Origami';
  }
}

// Procedural Geometry Generator for each Specimen Model
function buildSpecimen(group: THREE.Group, type: SpecimenType, isWireframe: boolean) {
  switch (type) {
    case 'quantum-cavity':
      buildQuantumCavity(group, isWireframe);
      break;
    case 'superlattice-crystal':
      buildSuperlattice(group, isWireframe);
      break;
    case 'neural-lattice':
      buildNeuralLattice(group, isWireframe);
      break;
    case 'carbon-nanotube':
      buildCarbonNanotube(group, isWireframe);
      break;
    case 'dna-origami':
      buildDnaOrigami(group, isWireframe);
      break;
  }
}

function buildQuantumCavity(group: THREE.Group, isWireframe: boolean) {
  // Primary Cavity: Machined copper / aluminum cylinder enclosure
  const cylinderGeo = new THREE.CylinderGeometry(1.2, 1.2, 1.8, 32, 1, true);
  const cylinderMat = new THREE.MeshPhysicalMaterial({
    color: 0xd97706, // Polished copper
    metalness: 0.9,
    roughness: 0.2,
    wireframe: isWireframe,
    side: THREE.DoubleSide,
  });
  const cylinder = new THREE.Mesh(cylinderGeo, cylinderMat);
  group.add(cylinder);

  // Top and bottom flange rings
  const flangeGeo = new THREE.TorusGeometry(1.25, 0.12, 16, 40);
  const flangeMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // Stainless steel
    metalness: 0.85,
    roughness: 0.3,
    wireframe: isWireframe,
  });
  const topFlange = new THREE.Mesh(flangeGeo, flangeMat);
  topFlange.rotation.x = Math.PI / 2;
  topFlange.position.y = 0.9;
  group.add(topFlange);

  const bottomFlange = new THREE.Mesh(flangeGeo, flangeMat);
  bottomFlange.rotation.x = Math.PI / 2;
  bottomFlange.position.y = -0.9;
  group.add(bottomFlange);

  // Internal Microwave Resonant Core: Floating blue photonic sphere with internal field rings
  const coreGeo = new THREE.SphereGeometry(0.55, 32, 32);
  const coreMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4, // Laser cyan
    emissive: 0x0891b2,
    emissiveIntensity: 0.4,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.7,
    transparent: true,
    opacity: 0.85,
    wireframe: isWireframe,
  });
  const core = new THREE.Mesh(coreGeo, coreMat);
  group.add(core);

  // Coaxial Coupling Pins
  const pinGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.4, 16);
  const pinMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Gold plated
    metalness: 0.95,
    roughness: 0.15,
    wireframe: isWireframe,
  });
  const pin1 = new THREE.Mesh(pinGeo, pinMat);
  pin1.position.set(0, 1.1, 0);
  group.add(pin1);

  const pin2 = new THREE.Mesh(pinGeo, pinMat);
  pin2.rotation.z = Math.PI / 2;
  pin2.position.set(1.4, 0, 0);
  group.add(pin2);
}

function buildSuperlattice(group: THREE.Group, isWireframe: boolean) {
  // Hexagonal 2D atomic grid
  const rows = 9;
  const cols = 9;
  const spacing = 0.32;
  const atomGeo = new THREE.SphereGeometry(0.07, 16, 16);

  const atomMat1 = new THREE.MeshStandardMaterial({
    color: 0x0284c7, // Molybdenum
    metalness: 0.7,
    roughness: 0.2,
    wireframe: isWireframe,
  });
  const atomMat2 = new THREE.MeshStandardMaterial({
    color: 0xe11d48, // Selenium / Sulfur
    metalness: 0.6,
    roughness: 0.3,
    wireframe: isWireframe,
  });

  const layer1 = new THREE.Group();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = (c - cols / 2) * spacing + (r % 2 === 0 ? spacing / 2 : 0);
      const z = (r - rows / 2) * spacing * 0.866;
      const mesh = new THREE.Mesh(atomGeo, (r + c) % 2 === 0 ? atomMat1 : atomMat2);
      mesh.position.set(x, 0.2, z);
      layer1.add(mesh);
    }
  }
  group.add(layer1);

  // Twisted Second Layer (Moiré pattern angle)
  const layer2 = layer1.clone();
  layer2.position.y = -0.4;
  layer2.rotation.y = 0.08; // 4.5 degree twist
  group.add(layer2);

  // Connecting inter-layer exciton bond lines
  const bondPoints = [];
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      bondPoints.push(new THREE.Vector3(i * spacing * 1.5, 0.2, j * spacing * 1.5));
      bondPoints.push(new THREE.Vector3(i * spacing * 1.5, -0.4, j * spacing * 1.5));
    }
  }
  const bondGeo = new THREE.BufferGeometry().setFromPoints(bondPoints);
  const bondMat = new THREE.LineBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.35,
  });
  const bondLines = new THREE.LineSegments(bondGeo, bondMat);
  group.add(bondLines);
}

function buildNeuralLattice(group: THREE.Group, isWireframe: boolean) {
  // Flexible polyimide substrate ribbon
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.8, -0.6, -0.8),
    new THREE.Vector3(-0.8, -0.1, -0.2),
    new THREE.Vector3(0.4, 0.4, 0.4),
    new THREE.Vector3(1.8, 0.8, 0.1),
  ]);

  const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.35, 12, false);
  const tubeMat = new THREE.MeshPhysicalMaterial({
    color: 0xb45309, // Translucent amber polyimide
    metalness: 0.1,
    roughness: 0.3,
    transmission: 0.5,
    transparent: true,
    opacity: 0.85,
    wireframe: isWireframe,
  });
  const substrate = new THREE.Mesh(tubeGeo, tubeMat);
  group.add(substrate);

  // Microelectrode array pads on the surface
  const padGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16);
  const padMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15, // Pure gold
    metalness: 0.95,
    roughness: 0.15,
    wireframe: isWireframe,
  });

  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    const pt = curve.getPoint(t);
    const pad = new THREE.Mesh(padGeo, padMat);
    pad.position.copy(pt);
    pad.position.y += 0.22;
    group.add(pad);
  }
}

function buildCarbonNanotube(group: THREE.Group, isWireframe: boolean) {
  const radius = 0.9;
  const height = 2.4;
  const radialSegments = 16;
  const heightSegments = 20;

  const geo = new THREE.CylinderGeometry(radius, radius, height, radialSegments, heightSegments, true);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    metalness: 0.8,
    roughness: 0.25,
    wireframe: true, // Nanotube hexagonal lattice read
  });
  const cylinder = new THREE.Mesh(geo, mat);
  group.add(cylinder);

  // Carbon atom vertex spheres
  const atomGeo = new THREE.SphereGeometry(0.045, 12, 12);
  const atomMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.5,
    roughness: 0.4,
  });

  const pos = geo.attributes.position;
  const count = Math.min(pos.count, 120);
  for (let i = 0; i < count; i += 2) {
    const sphere = new THREE.Mesh(atomGeo, atomMat);
    sphere.position.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    group.add(sphere);
  }
}

function buildDnaOrigami(group: THREE.Group, isWireframe: boolean) {
  // Double helix procedural scaffold
  const turns = 3;
  const radius = 0.6;
  const height = 2.4;
  const points1 = [];
  const points2 = [];
  const steps = 60;

  const sphereGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const mat1 = new THREE.MeshStandardMaterial({ color: 0x06b6d4, metalness: 0.5, roughness: 0.2, wireframe: isWireframe });
  const mat2 = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, metalness: 0.5, roughness: 0.2, wireframe: isWireframe });
  const rungMat = new THREE.LineBasicMaterial({ color: 0x94a3b8 });

  const rungPoints = [];

  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2 * turns;
    const y = (i / steps) * height - height / 2;
    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    const s1 = new THREE.Mesh(sphereGeo, mat1);
    s1.position.set(x1, y, z1);
    group.add(s1);

    const s2 = new THREE.Mesh(sphereGeo, mat2);
    s2.position.set(x2, y, z2);
    group.add(s2);

    if (i % 3 === 0) {
      rungPoints.push(new THREE.Vector3(x1, y, z1));
      rungPoints.push(new THREE.Vector3(x2, y, z2));
    }
  }

  const rungGeo = new THREE.BufferGeometry().setFromPoints(rungPoints);
  const rungs = new THREE.LineSegments(rungGeo, rungMat);
  group.add(rungs);
}

// Cleanup helper
function disposeGroup(group: THREE.Group) {
  while (group.children.length > 0) {
    const obj = group.children[0];
    group.remove(obj);
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.geometry?.dispose();
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material?.dispose();
      }
    }
  }
}
