import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useState, useEffect } from "react";
import TechniquePanel from "./components/TechniquePanel";
import LabNotebook from "./components/LabNotebook";
import SafetyPanel from "./components/SafetyPanel";
import ObservationPanel from "./components/ObservationPanel";
import WelcomeScreen from "./components/WelcomeScreen";
import { useLabStore } from "./state/labStore";
import { FiltrationRig } from "./simulation/techniques/FiltrationRig";
import { DistillationRig } from "./simulation/techniques/DistillationRig";

function LabRoom() {
  return (
    <group>
      {/* Lab Bench Surface - realistic wood/laminate */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.745, 0]}
        receiveShadow
      >
        <planeGeometry args={[4, 3]} />
        <meshStandardMaterial color="#8b7355" roughness={0.8} />
      </mesh>

      {/* Floor - tile pattern */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#c8c8c8" roughness={0.9} />
      </mesh>

      {/* Back wall - lab environment */}
      <mesh position={[0, 2.5, -3]} receiveShadow>
        <planeGeometry args={[20, 5]} />
        <meshStandardMaterial color="#e8e4d9" />
      </mesh>

      {/* Lab bench structure */}
      <mesh position={[0, 0.37, 0]}>
        <boxGeometry args={[4, 0.05, 3]} />
        <meshStandardMaterial color="#6b5839" />
      </mesh>
    </group>
  );
}

export default function App() {
  const technique = useLabStore((s) => s.technique);
  const [showNotebook, setShowNotebook] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    // Check if user has seen welcome before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (hasSeenWelcome === "true") {
      setShowWelcome(false);
    }
  }, []);

  const handleStartLab = () => {
    localStorage.setItem("hasSeenWelcome", "true");
    setShowWelcome(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header - Lab Title Bar */}
      <header className="bg-gradient-to-r from-blue-700 to-blue-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Virtual Chemistry Lab</h1>
            <p className="text-blue-100 text-sm">
              Separation Techniques for High School
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowNotebook(!showNotebook)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              📓 Lab Guide
            </button>
            <button
              onClick={() => setShowSafety(!showSafety)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 rounded-lg font-semibold transition-colors"
            >
              ⚠️ Safety
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-[380px_1fr_340px] gap-0 overflow-hidden">
        {/* Left Panel - Equipment Controls */}
        <aside className="bg-white border-r border-gray-200 overflow-y-auto shadow-lg">
          <div className="p-5">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
              <h2 className="text-lg font-bold text-blue-900">
                🧪 Equipment Setup
              </h2>
              <p className="text-xs text-blue-700 mt-1">
                Configure your lab apparatus
              </p>
            </div>
            <TechniquePanel />
          </div>
        </aside>

        {/* Center - 3D Lab View */}
        <main className="relative bg-gradient-to-b from-gray-100 to-gray-200">
          <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
            <PerspectiveCamera makeDefault position={[3, 2.5, 4]} fov={55} />
            <ambientLight intensity={0.5} />
            <directionalLight
              castShadow
              position={[8, 12, 6]}
              intensity={1.8}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <pointLight position={[-5, 5, 5]} intensity={0.4} color="#fff5e1" />
            <LabRoom />
            {technique === "filtration" && <FiltrationRig />}
            {technique === "distillation" && <DistillationRig />}
            <OrbitControls
              makeDefault
              minDistance={2}
              maxDistance={8}
              maxPolarAngle={Math.PI / 2}
            />
          </Canvas>

          {/* 3D View Instructions */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg text-sm">
            <p className="font-semibold text-gray-700">🖱️ Mouse Controls:</p>
            <p className="text-gray-600">
              Left click + drag to rotate • Scroll to zoom • Right click + drag
              to pan
            </p>
          </div>
        </main>

        {/* Right Panel - Observations & Data */}
        <aside className="bg-white border-l border-gray-200 overflow-y-auto shadow-lg">
          <ObservationPanel />
        </aside>
      </div>

      {/* Modal Overlays */}
      {showWelcome && <WelcomeScreen onStart={handleStartLab} />}
      {showNotebook && <LabNotebook onClose={() => setShowNotebook(false)} />}
      {showSafety && (
        <SafetyPanel
          onClose={() => setShowSafety(false)}
          technique={technique}
        />
      )}
    </div>
  );
}
