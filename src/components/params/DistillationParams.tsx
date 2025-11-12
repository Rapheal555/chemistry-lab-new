import { useLabStore } from "../../state/labStore";
import { useMemo, useState } from "react";

export default function DistillationParams() {
  const p = useLabStore((s) => s.params.distillation);
  const update = useLabStore((s) => s.updateParams);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const fields = useMemo(
    () => [
      {
        key: "heatRateW" as const,
        label: "Heating Power",
        unit: "Watts",
        step: 10,
        min: 0,
        max: 500,
        tooltip:
          "Power of the heating element. More heat = faster boiling, but too fast can cause splashing. Hotplate ≈ 100-300W",
      },
      {
        key: "condenserEfficiency" as const,
        label: "Condenser Cooling",
        unit: "%",
        step: 0.05,
        min: 0,
        max: 1,
        tooltip:
          "How well the condenser cools vapor back to liquid. 100% = perfect cooling, 50% = some vapor escapes",
        isPercent: true,
      },
      {
        key: "refluxRatio" as const,
        label: "Reflux Ratio",
        unit: "",
        step: 0.1,
        min: 0,
        max: 5,
        tooltip:
          "Ratio of liquid returning to column vs collected. Higher = better separation but slower collection. 0 = collect everything",
      },
      {
        key: "mixtureCompA" as const,
        label: "Starting Composition",
        unit: "% A",
        step: 0.05,
        min: 0,
        max: 1,
        tooltip:
          "Percentage of volatile component A in starting mixture. Component A has lower boiling point and distills first",
        isPercent: true,
      },
    ],
    []
  );

  return (
    <div className="space-y-4">
      {fields.map((f) => (
        <div
          key={f.key}
          className="bg-white p-3 rounded-lg border border-gray-200"
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">
              {f.label}
            </label>
            <button
              onMouseEnter={() => setShowTooltip(f.key)}
              onMouseLeave={() => setShowTooltip(null)}
              className="text-blue-500 hover:text-blue-700 text-xs font-bold w-5 h-5 rounded-full border-2 border-blue-500"
            >
              ?
            </button>
          </div>

          {showTooltip === f.key && (
            <div className="bg-blue-50 border border-blue-200 p-2 rounded text-xs text-blue-800 mb-2">
              {f.tooltip}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="range"
              min={f.min}
              max={f.max}
              step={f.step}
              value={p[f.key] as number}
              onChange={(e) =>
                update("distillation", {
                  [f.key]: Number(e.target.value),
                } as any)
              }
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <input
              type="number"
              min={f.min}
              max={f.max}
              step={f.step}
              value={p[f.key] as number}
              onChange={(e) =>
                update("distillation", {
                  [f.key]: Number(e.target.value),
                } as any)
              }
              className="w-20 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-gray-600 w-14">
              {f.isPercent
                ? `${((p[f.key] as number) * 100).toFixed(0)}%`
                : f.unit}
            </span>
          </div>
        </div>
      ))}

      <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded">
        <p className="text-xs font-semibold text-orange-800 mb-1">
          ⚠️ Safety Reminder:
        </p>
        <p className="text-xs text-orange-700">
          Never heat a closed system! Always ensure cooling water is running
          before applying heat.
        </p>
      </div>

      <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
        <p className="text-xs font-semibold text-green-800 mb-1">
          💡 Quick Tip:
        </p>
        <p className="text-xs text-green-700">
          Pure substances distill at constant temperature. Monitor your
          thermometer!
        </p>
      </div>
    </div>
  );
}
