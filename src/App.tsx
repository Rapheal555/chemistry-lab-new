import { useState, useEffect } from "react";
import TechniquePanel from "./components/TechniquePanel";
import LabNotebook from "./components/LabNotebook";
import SafetyPanel from "./components/SafetyPanel";
import ObservationPanel from "./components/ObservationPanel";
import WelcomeScreen from "./components/WelcomeScreen";
import { useLabStore } from "./state/labStore";
import { FiltrationRig } from "./simulation/techniques/FiltrationRig";
import { EvaporationRig } from "./simulation/techniques/EvaporationRig";
import { DistillationRig } from "./simulation/techniques/DistillationRig";

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

        {/* Center - Video Lab View */}
        <main className="relative bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
          {technique === "filtration" && <FiltrationRig />}
          {technique === "evaporation" && <EvaporationRig />}
          {technique === "distillation" && <DistillationRig />}
          {!technique && (
            <div className="text-center text-white">
              <div className="text-6xl mb-4">🔬</div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome to Virtual Chemistry Lab
              </h2>
              <p className="text-gray-300">
                Select a technique from the left panel to begin
              </p>
            </div>
          )}
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
