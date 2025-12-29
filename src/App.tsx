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
  const [showSetupMobile, setShowSetupMobile] = useState(false);
  const [showObservationsMobile, setShowObservationsMobile] = useState(false);

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

  const heroGradient =
    "bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-emerald-400/20 border border-white/10";

  return (
    <div className="min-h-screen w-full flex flex-col text-slate-50">
      {/* Header - Lab Title Bar */}
      <header className="backdrop-blur bg-slate-900/70 border-b border-white/10 px-4 sm:px-6 py-4 shadow-2xl">
        <div className="flex items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
              Virtual Lab • Grades 10-12
            </p>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight text-white drop-shadow">
              Separation Techniques Simulator
            </h1>
            <p className="text-sm text-slate-200">
              Hands-on, cinematic walkthroughs for filtration, evaporation, and
              distillation.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setShowNotebook(!showNotebook)}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold transition-colors"
            >
              📓 Lab Guide
            </button>
            <button
              onClick={() => setShowSafety(!showSafety)}
              className="px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold transition-colors shadow-lg shadow-amber-400/40"
            >
              ⚠️ Safety
            </button>
          </div>
        </div>

        {/* Mobile quick access */}
        <div className="mt-4 grid grid-cols-2 gap-3 lg:hidden">
          <button
            onClick={() => setShowSetupMobile((v) => !v)}
            className={`rounded-xl px-4 py-3 text-left font-semibold ${heroGradient}`}
          >
            <p className="text-xs text-cyan-100">Setup</p>
            <p className="text-lg text-white">Equipment & Controls</p>
          </button>
          <button
            onClick={() => setShowObservationsMobile((v) => !v)}
            className={`rounded-xl px-4 py-3 text-left font-semibold ${heroGradient}`}
          >
            <p className="text-xs text-emerald-100">Observe</p>
            <p className="text-lg text-white">Data & Notes</p>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-col gap-4 lg:gap-6 px-4 sm:px-6 py-4">
        {/* Desktop layout */}
        <div className="hidden lg:grid grid-cols-[360px_1fr_340px] gap-4 xl:gap-6 min-h-[calc(100vh-200px)]">
          {/* Left Panel - Equipment Controls */}
          <aside className="bg-slate-900/70 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur">
            <div className="p-5">
              <div className="bg-cyan-500/10 border border-cyan-400/30 p-4 mb-4 rounded-xl">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-2xl">🧪</span> Experiment Setup
                </h2>
                <p className="text-xs text-cyan-100 mt-1">
                  Tune apparatus settings before you run the simulation.
                </p>
              </div>
              <TechniquePanel />
            </div>
          </aside>

          {/* Center - Video Lab View */}
          <main className="relative bg-slate-950/80 border border-white/10 rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
            {technique === "filtration" && <FiltrationRig />}
            {technique === "evaporation" && <EvaporationRig />}
            {technique === "distillation" && <DistillationRig />}
            {!technique && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white bg-gradient-to-b from-slate-900 via-slate-950 to-black">
                <div className="text-6xl mb-4 drop-shadow">🔬</div>
                <h2 className="text-2xl font-bold mb-2">
                  Welcome to Virtual Chemistry Lab
                </h2>
                <p className="text-slate-200">
                  Select a technique from the left panel to begin.
                </p>
              </div>
            )}
          </main>

          {/* Right Panel - Observations & Data */}
          <aside className="bg-slate-900/70 border border-white/10 rounded-2xl overflow-hidden shadow-2xl backdrop-blur">
            <ObservationPanel />
          </aside>
        </div>

        {/* Mobile / Tablet layout */}
        <div className="lg:hidden flex flex-col gap-4">
          {/* Simulation first for focus */}
          <div className="bg-slate-950/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            {technique === "filtration" && <FiltrationRig />}
            {technique === "evaporation" && <EvaporationRig />}
            {technique === "distillation" && <DistillationRig />}
          </div>

          {/* Collapsible panels */}
          {showSetupMobile && (
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-cyan-100 uppercase tracking-wide">
                    Setup
                  </p>
                  <h3 className="text-lg font-bold text-white">
                    Equipment & Controls
                  </h3>
                </div>
                <button
                  onClick={() => setShowSetupMobile(false)}
                  className="text-sm text-slate-200 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="p-4">
                <TechniquePanel />
              </div>
            </div>
          )}

          {showObservationsMobile && (
            <div className="bg-slate-900/80 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-100 uppercase tracking-wide">
                    Observe
                  </p>
                  <h3 className="text-lg font-bold text-white">
                    Data & Notes
                  </h3>
                </div>
                <button
                  onClick={() => setShowObservationsMobile(false)}
                  className="text-sm text-slate-200 hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="p-4">
                <ObservationPanel compact />
              </div>
            </div>
          )}
        </div>
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
