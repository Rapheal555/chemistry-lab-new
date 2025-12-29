import { useLabStore } from "../state/labStore";
import { useState, useEffect } from "react";

type ObservationPanelProps = {
  compact?: boolean;
};

export default function ObservationPanel({ compact = false }: ObservationPanelProps) {
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
    <div className={`p-5 h-full flex flex-col ${compact ? "gap-3" : ""}`}>
      {/* Header */}
      <div className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-white/10 p-3 mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 drop-shadow">
          👁️ Lab HUD
        </h2>
        {!compact && (
          <p className="text-xs text-slate-200 mt-1">
            Quick status for the current rig.
          </p>
        )}
      </div>

      {/* Timer */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 mb-4 shadow-inner">
        <div className="flex items-center justify-between text-xs text-slate-200">
          <span className="font-semibold">Experiment Timer</span>
          <span className="text-[11px] text-slate-400">Run + pause</span>
        </div>
        <div className="text-3xl font-black text-cyan-300 mb-3">
          {formatTime(timeElapsed)}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all shadow ${
              isRunning
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                : "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
            }`}
          >
            {isRunning ? "⏸ Pause" : "▶ Start"}
          </button>
          <button
            onClick={() => {
              setTimeElapsed(0);
              setIsRunning(false);
            }}
            className="px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/15 rounded-lg font-semibold text-white transition-colors"
          >
            ↺
          </button>
        </div>
      </div>

      {/* Current Conditions */}
      <div className="bg-slate-900/60 border border-white/10 rounded-xl p-3 mb-4">
        <div className="flex items-center justify-between text-xs text-slate-200">
          <span className="font-semibold flex items-center gap-1">
            🌡️ Lab Conditions
          </span>
          <span className="text-slate-400">ambient</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-white mt-2">
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-cyan-100">
              Temperature
            </p>
            <p className="font-bold">{common.ambientTemperatureC}°C</p>
          </div>
          <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wide text-emerald-100">
              Pressure
            </p>
            <p className="font-bold">{common.ambientPressureAtm} atm</p>
          </div>
        </div>
      </div>

      {/* Observations List */}
      <div className="flex-1 overflow-y-auto">
        <h3 className="font-bold text-white text-sm mb-2">
          📝 Observe:
        </h3>
        <p className="text-sm text-cyan-100/90 mb-3 italic">
          {obs.description}
        </p>

        <div className="grid grid-cols-1 gap-2 mb-4">
          {obs.observations.map((item, i) => {
            const isPositive = item.startsWith("✓");
            const isWarning = item.startsWith("⚠");
            return (
              <div
                key={i}
                className={`text-sm p-3 rounded-lg border ${
                  isPositive
                    ? "bg-emerald-500/10 text-emerald-100 border-emerald-400/30"
                    : isWarning
                    ? "bg-amber-500/10 text-amber-100 border-amber-400/30"
                    : "bg-white/5 text-white border-white/10"
                }`}
              >
                {item}
              </div>
            );
          })}
        </div>

        <div className="bg-white/5 rounded-lg p-3 border border-white/10">
          <h4 className="font-bold text-white text-sm mb-2">💡 Tips:</h4>
          <ul className="text-xs space-y-1.5 text-slate-100">
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
      {!compact && (
        <div className="mt-4">
          <h3 className="font-bold text-white text-sm mb-2">
            📓 Field Notes:
          </h3>
          <textarea
            className="w-full h-24 p-3 text-sm border border-white/10 bg-slate-900/60 text-white rounded resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Log your observations here..."
          />
        </div>
      )}
    </div>
  );
}
