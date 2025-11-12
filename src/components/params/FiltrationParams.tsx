import { useLabStore } from "../../state/labStore";
import { useMemo, useState } from "react";

export default function FiltrationParams() {
  const p = useLabStore((s) => s.params.filtration);
  const update = useLabStore((s) => s.updateParams);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const fields = useMemo(
    () =>
      [
        {
          key: "poreSizeMicron",
          label: "Filter Pore Size",
          unit: "µm",
          step: 1,
          min: 0.1,
          max: 100,
          tooltip:
            "Size of holes in filter paper. Smaller = catches finer particles but slower flow. Coffee filter ≈ 20µm",
        },
        {
          key: "vacuumMbar",
          label: "Vacuum Pressure",
          unit: "mbar",
          step: 10,
          min: 0,
          max: 1000,
          tooltip:
            "Suction applied to speed up filtration. 0 = gravity only, 1000 = strong vacuum pump",
        },
        {
          key: "slurryViscosityCP",
          label: "Mixture Thickness",
          unit: "cP",
          step: 0.1,
          min: 0.1,
          max: 10,
          tooltip:
            "How thick/syrupy the mixture is. Water ≈ 1cP, honey ≈ 2000cP. Thicker = slower filtration",
        },
        {
          key: "filterAreaCm2",
          label: "Filter Paper Area",
          unit: "cm²",
          step: 5,
          min: 1,
          max: 200,
          tooltip:
            "Surface area of filter. Larger area = faster filtration. Small funnel ≈ 50cm²",
        },
      ] as const,
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
                update("filtration", { [f.key]: Number(e.target.value) } as any)
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
                update("filtration", { [f.key]: Number(e.target.value) } as any)
              }
              className="w-20 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs font-semibold text-gray-600 w-10">
              {f.unit}
            </span>
          </div>
        </div>
      ))}

      <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
        <p className="text-xs font-semibold text-green-800 mb-1">
          💡 Quick Tip:
        </p>
        <p className="text-xs text-green-700">
          Try increasing vacuum pressure for faster filtration, but be careful -
          too much pressure can tear the filter!
        </p>
      </div>
    </div>
  );
}
