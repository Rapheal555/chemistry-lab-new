import { useLabStore } from "../state/labStore";
import { useState, useEffect } from "react";

export default function ObservationPanel() {
  const technique = useLabStore((s) => s.technique);
  const params = useLabStore((s) => s.params);
  const common = useLabStore((s) => s.common);
  const filtrationExp = useLabStore((s) => s.filtrationExperiment);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setTimeElapsed((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getObservations = () => {
    switch (technique) {
      case "filtration": {
        const p = params.filtration;
        const stepDescriptions: Record<string, string> = {
          setup: "Select compounds to create your mixture",
          mixing: "Compounds are being mixed together",
          ready: "Mixture is ready - pour into filter when ready",
          pouring: "Pouring mixture into the filtration apparatus",
          filtering: "Filtration in progress - observe the separation",
          complete: "Filtration complete! Solid and liquid separated",
        };

        return {
          description:
            stepDescriptions[filtrationExp.step] || "Preparing experiment...",
          observations: [
            `Experiment Step: ${filtrationExp.step}`,
            filtrationExp.solidCompound
              ? `Solid: ${filtrationExp.solidCompound}`
              : "No solid selected",
            filtrationExp.liquidCompound
              ? `Liquid: ${filtrationExp.liquidCompound}`
              : "No liquid selected",
            filtrationExp.isRunning
              ? "▶️ Filtration active"
              : "⏸️ Filtration paused",
            filtrationExp.liquidLevel > 0
              ? `Liquid in funnel: ${(filtrationExp.liquidLevel * 100).toFixed(
                  0
                )}%`
              : "Funnel empty",
            filtrationExp.filtrateLevel > 0
              ? `Filtrate collected: ${(
                  (filtrationExp.filtrateLevel / 0.5) *
                  100
                ).toFixed(0)}%`
              : "No filtrate yet",
            `Filter pore size: ${p.poreSizeMicron} µm`,
            `Applied vacuum: ${p.vacuumMbar} mbar`,
            p.vacuumMbar > 500
              ? "✓ Fast filtration expected"
              : "⚠ Slow filtration - consider increasing vacuum",
          ],
          tips: [
            "Follow the step-by-step process on the left panel",
            "Watch the 3D view to see the separation happen",
            "Adjust equipment settings before pouring the mixture",
            "Higher vacuum = faster filtration rate",
          ],
        };
      }
      case "distillation": {
        const p = params.distillation;
        return {
          description: "Observing distillation process...",
          observations: [
            `Heat rate: ${p.heatRateW} W`,
            `Condenser efficiency: ${(p.condenserEfficiency * 100).toFixed(
              0
            )}%`,
            `Reflux ratio: ${p.refluxRatio}`,
            `Feed composition: ${(p.mixtureCompA * 100).toFixed(
              0
            )}% component A`,
            p.heatRateW > 150
              ? "✓ Good heating rate"
              : "⚠ Low heat - slow distillation",
            p.condenserEfficiency > 0.7
              ? "✓ Efficient condensation"
              : "⚠ Increase cooling",
          ],
          tips: [
            "Watch vapor rising through the column",
            "Observe liquid condensing and dripping into receiver",
            "The boiling liquid should bubble gently, not violently",
            "Monitor temperature - it should remain stable during pure component collection",
          ],
        };
      }
      case "chromatography": {
        const p = params.chromatography;
        return {
          description: "Observing chromatography separation...",
          observations: [
            `Mobile phase flow: ${p.mobileFlowMlMin} mL/min`,
            `Particle size: ${p.particleSizeMicron} µm`,
            `Column length: ${p.columnLengthCm} cm`,
            `Temperature: ${p.temperatureC}°C`,
            p.mobileFlowMlMin > 0.5 && p.mobileFlowMlMin < 3
              ? "✓ Optimal flow rate"
              : "⚠ Check flow rate",
            p.particleSizeMicron < 10
              ? "✓ High resolution expected"
              : "⚠ Lower resolution",
          ],
          tips: [
            "Components with stronger affinity to stationary phase move slower",
            "Watch for band formation as components separate",
            "Longer column = better separation but slower",
            "Temperature affects separation efficiency",
          ],
        };
      }
      default:
        return {
          description: `Setting up ${technique} experiment...`,
          observations: [
            "Select parameters from the left panel",
            "Adjust equipment settings",
            "Observe the 3D model",
          ],
          tips: [
            "Read the lab guide for detailed instructions",
            "Check safety precautions before starting",
          ],
        };
    }
  };

  const obs = getObservations();

  return (
    <div className="p-5 h-full flex flex-col">
      {/* Header */}
      <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
        <h2 className="text-lg font-bold text-green-900 flex items-center gap-2">
          👁️ Observations
        </h2>
        <p className="text-xs text-green-700 mt-1">Record what you see</p>
      </div>

      {/* Timer */}
      <div className="bg-blue-100 rounded-lg p-4 mb-4">
        <div className="text-sm font-semibold text-blue-900 mb-2">
          Experiment Timer
        </div>
        <div className="text-3xl font-bold text-blue-700 mb-3">
          {formatTime(timeElapsed)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-2 px-3 rounded font-semibold transition-colors ${
              isRunning
                ? "bg-orange-500 hover:bg-orange-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {isRunning ? "⏸ Pause" : "▶ Start"}
          </button>
          <button
            onClick={() => {
              setTimeElapsed(0);
              setIsRunning(false);
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold transition-colors"
          >
            ↺
          </button>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="bg-amber-50 rounded-lg p-3 mb-4">
        <h3 className="font-bold text-amber-900 text-sm mb-2">
          🌡️ Lab Conditions
        </h3>
        <div className="text-xs space-y-1 text-amber-800">
          <div className="flex justify-between">
            <span>Temperature:</span>
            <span className="font-semibold">
              {common.ambientTemperatureC}°C
            </span>
          </div>
          <div className="flex justify-between">
            <span>Pressure:</span>
            <span className="font-semibold">
              {common.ambientPressureAtm} atm
            </span>
          </div>
        </div>
      </div>

      {/* Observations List */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="font-bold text-gray-800 text-sm mb-2">
          📝 What to Observe:
        </h3>
        <p className="text-sm text-blue-600 mb-3 italic">{obs.description}</p>

        <div className="space-y-2 mb-4">
          {obs.observations.map((item, i) => {
            const isPositive = item.startsWith("✓");
            const isWarning = item.startsWith("⚠");
            return (
              <div
                key={i}
                className={`text-sm p-2 rounded ${
                  isPositive
                    ? "bg-green-50 text-green-800"
                    : isWarning
                    ? "bg-yellow-50 text-yellow-800"
                    : "bg-gray-50 text-gray-700"
                }`}
              >
                {item}
              </div>
            );
          })}
        </div>

        <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
          <h4 className="font-bold text-purple-900 text-sm mb-2">💡 Tips:</h4>
          <ul className="text-xs space-y-1.5 text-purple-800">
            {obs.tips.map((tip, i) => (
              <li key={i} className="flex gap-2">
                <span>•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Lab Notes */}
      <div className="mt-4">
        <h3 className="font-bold text-gray-800 text-sm mb-2">📓 Your Notes:</h3>
        <textarea
          className="w-full h-24 p-2 text-sm border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your observations here...&#10;What do you see happening?&#10;What patterns do you notice?"
        />
      </div>
    </div>
  );
}
