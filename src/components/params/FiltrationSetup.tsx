import { useLabStore } from "../../state/labStore";

// Common filtration experiments
const compounds = {
  solids: [
    {
      id: "sand",
      name: "Sand (SiO₂)",
      color: "#d4a574",
      description: "Coarse particles, easy to filter",
      particleSize: "Large (0.5-2mm)",
    },
    {
      id: "chalk",
      name: "Chalk Powder (CaCO₃)",
      color: "#f0f0f0",
      description: "Fine powder, forms thick cake",
      particleSize: "Medium (10-100µm)",
    },
    {
      id: "coffee",
      name: "Coffee Grounds",
      color: "#3e2723",
      description: "Medium particles, aromatic",
      particleSize: "Medium (200-800µm)",
    },
    {
      id: "clay",
      name: "Clay Particles",
      color: "#8b7355",
      description: "Very fine, slow to filter",
      particleSize: "Fine (1-5µm)",
    },
  ],
  liquids: [
    {
      id: "water",
      name: "Water (H₂O)",
      color: "#60a5fa",
      description: "Low viscosity, common solvent",
      viscosity: "Low (1 cP)",
    },
    {
      id: "saltwater",
      name: "Salt Water",
      color: "#4a90e2",
      description: "Slightly denser than water",
      viscosity: "Low (1.1 cP)",
    },
    {
      id: "oil",
      name: "Cooking Oil",
      color: "#ffd700",
      description: "Higher viscosity, immiscible",
      viscosity: "High (50 cP)",
    },
  ],
};

export default function FiltrationSetup() {
  const experiment = useLabStore((s) => s.filtrationExperiment);
  const updateExperiment = useLabStore((s) => s.updateFiltrationExperiment);
  const resetExperiment = useLabStore((s) => s.resetFiltrationExperiment);

  const handleMix = () => {
    if (!experiment.solidCompound || !experiment.liquidCompound) return;
    // First, prepare filter paper
    updateExperiment({ step: "folding-paper", paperFoldProgress: 0 });
  };

  const handleStartMixing = () => {
    updateExperiment({ step: "mixing", mixingProgress: 0 });

    // Animate mixing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      if (progress >= 100) {
        updateExperiment({ step: "ready", mixingProgress: 100 });
        clearInterval(interval);
      } else {
        updateExperiment({ mixingProgress: progress });
      }
    }, 50);
  };

  const handlePour = () => {
    updateExperiment({ step: "pouring", pouringProgress: 0 });

    // Animate pouring
    let progress = 0;
    const interval = setInterval(() => {
      progress += 3;
      const liquidLevel = (progress / 100) * 0.8;

      if (progress >= 100) {
        updateExperiment({
          step: "filtering",
          pouringProgress: 100,
          liquidLevel: 0.8,
          isRunning: true,
        });
        clearInterval(interval);
      } else {
        updateExperiment({
          pouringProgress: progress,
          liquidLevel,
        });
      }
    }, 40);
  };

  const handleReset = () => {
    resetExperiment();
  };

  const selectedSolid = compounds.solids.find(
    (s) => s.id === experiment.solidCompound
  );
  const selectedLiquid = compounds.liquids.find(
    (l) => l.id === experiment.liquidCompound
  );

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg border-2 border-blue-200">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-lg">
        <h3 className="font-bold text-lg">🧪 Experiment Setup</h3>
        <p className="text-sm opacity-90">
          Step{" "}
          {[
            "setup",
            "mixing",
            "ready",
            "pouring",
            "filtering",
            "complete",
          ].indexOf(experiment.step) + 1}{" "}
          of 6
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex gap-2">
        {["setup", "mixing", "ready", "pouring", "filtering", "complete"].map(
          (step, idx) => (
            <div
              key={step}
              className={`flex-1 h-2 rounded-full transition-all ${
                [
                  "setup",
                  "mixing",
                  "ready",
                  "pouring",
                  "filtering",
                  "complete",
                ].indexOf(experiment.step) >= idx
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}
            />
          )
        )}
      </div>

      {/* Step 1: Select Compounds */}
      {experiment.step === "setup" && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              📝 Step 1: Choose compounds to separate
            </p>
            <p className="text-xs text-blue-700">
              Select one solid and one liquid to create your mixture
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Solid Compound:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {compounds.solids.map((solid) => (
                <button
                  key={solid.id}
                  onClick={() => updateExperiment({ solidCompound: solid.id })}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    experiment.solidCompound === solid.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: solid.color }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">
                        {solid.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {solid.description}
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        {solid.particleSize}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Select Liquid Compound:
            </label>
            <div className="grid grid-cols-1 gap-2">
              {compounds.liquids.map((liquid) => (
                <button
                  key={liquid.id}
                  onClick={() =>
                    updateExperiment({ liquidCompound: liquid.id })
                  }
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    experiment.liquidCompound === liquid.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: liquid.color }}
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">
                        {liquid.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {liquid.description}
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        {liquid.viscosity}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleMix}
            disabled={!experiment.solidCompound || !experiment.liquidCompound}
            className={`w-full py-3 px-4 rounded-lg font-bold text-white transition-all ${
              experiment.solidCompound && experiment.liquidCompound
                ? "bg-green-500 hover:bg-green-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {experiment.solidCompound && experiment.liquidCompound
              ? "📄 Prepare Filter Paper →"
              : "⚠️ Select both compounds first"}
          </button>
        </div>
      )}

      {/* Step 2: Folding Filter Paper */}
      {experiment.step === "folding-paper" && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              📄 Folding Filter Paper...
            </p>
            <p className="text-xs text-blue-700 mb-3">
              Watch the 3D view as the filter paper is folded into a cone shape
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  width: `${(experiment.paperFoldProgress || 0) * 100}%`,
                }}
              >
                {Math.round((experiment.paperFoldProgress || 0) * 100)}%
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-2">
              💡 Tip: Real filter paper is folded in half twice to create a cone
              for better flow
            </p>
          </div>
        </div>
      )}

      {/* Step 3: Mixing */}
      {experiment.step === "mixing" && (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <p className="text-sm font-semibold text-purple-900 mb-2">
              🥄 Mixing compounds...
            </p>
            <p className="text-xs text-purple-700 mb-3">
              Combining {selectedSolid?.name} with {selectedLiquid?.name}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-full transition-all duration-300 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${experiment.mixingProgress}%` }}
              >
                {experiment.mixingProgress}%
              </div>
            </div>
            <button
              onClick={handleStartMixing}
              className="w-full mt-3 py-2 px-4 rounded-lg font-bold bg-purple-500 hover:bg-purple-600 text-white transition-all"
            >
              🥄 Start Mixing
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Ready to Pour */}
      {experiment.step === "ready" && (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-sm font-semibold text-green-900 mb-2">
              ✅ Mixture Ready!
            </p>
            <p className="text-xs text-green-700">
              Your mixture of {selectedSolid?.name} and {selectedLiquid?.name}{" "}
              is prepared and ready to filter.
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs font-semibold text-yellow-900 mb-1">
              💡 Before you pour:
            </p>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>• Check that filter paper is in place</li>
              <li>• Ensure vacuum is connected (if using)</li>
              <li>• Collection flask is positioned</li>
              <li>• Pour slowly and carefully</li>
            </ul>
          </div>

          <button
            onClick={handlePour}
            className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold transition-all"
          >
            🫗 Pour Mixture into Filter →
          </button>
        </div>
      )}

      {/* Step 4: Pouring */}
      {experiment.step === "pouring" && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-semibold text-blue-900 mb-2">
              🫗 Pouring mixture...
            </p>
            <p className="text-xs text-blue-700 mb-3">
              Watch the 3D view as the mixture enters the funnel
            </p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full transition-all duration-300 flex items-center justify-center text-white text-xs font-bold"
                style={{ width: `${experiment.pouringProgress}%` }}
              >
                {experiment.pouringProgress}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Filtering */}
      {(experiment.step === "filtering" || experiment.step === "complete") && (
        <div className="space-y-4">
          <div
            className={`p-4 rounded-lg border ${
              experiment.step === "complete"
                ? "bg-green-50 border-green-200"
                : "bg-orange-50 border-orange-200"
            }`}
          >
            <p
              className={`text-sm font-semibold mb-2 ${
                experiment.step === "complete"
                  ? "text-green-900"
                  : "text-orange-900"
              }`}
            >
              {experiment.step === "complete"
                ? "🎉 Filtration Complete!"
                : "⏳ Filtration in Progress..."}
            </p>
            <p
              className={`text-xs mb-2 ${
                experiment.step === "complete"
                  ? "text-green-700"
                  : "text-orange-700"
              }`}
            >
              {experiment.step === "complete"
                ? `Successfully separated ${selectedSolid?.name} from ${selectedLiquid?.name}!`
                : "Watch the liquid pass through the filter while solids are retained"}
            </p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="font-semibold text-gray-700">Residue (Solid)</p>
                <p className="text-gray-600">{selectedSolid?.name}</p>
              </div>
              <div className="bg-white p-2 rounded border border-gray-200">
                <p className="font-semibold text-gray-700">Filtrate (Liquid)</p>
                <p className="text-gray-600">{selectedLiquid?.name}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold transition-all"
          >
            🔄 Start New Experiment
          </button>
        </div>
      )}
    </div>
  );
}
