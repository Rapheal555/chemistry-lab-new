import { useLabStore, type Technique } from "../state/labStore";
import FiltrationSetup from "./params/FiltrationSetup";
import FiltrationParams from "./params/FiltrationParams";

const techniques: {
  key: Technique;
  label: string;
  icon: string;
  accent: string;
  hint: string;
}[] = [
  {
    key: "filtration",
    label: "Filtration",
    icon: "🧪",
    accent: "from-cyan-400 to-blue-600",
    hint: "Paper + vacuum separate solid from liquid",
  },
  {
    key: "evaporation",
    label: "Evaporation",
    icon: "🔥",
    accent: "from-amber-400 to-orange-600",
    hint: "Heat off solvent, leave crystals",
  },
  {
    key: "distillation",
    label: "Distillation",
    icon: "🌡️",
    accent: "from-fuchsia-400 to-purple-600",
    hint: "Boil → condense → collect pure fraction",
  },
];

export default function TechniquePanel() {
  const technique = useLabStore((s) => s.technique);
  const setTechnique = useLabStore((s) => s.setTechnique);
  const common = useLabStore((s) => s.common);
  const updateCommon = useLabStore((s) => s.updateCommon);

  return (
    <div className="space-y-5">
      {/* Technique Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
            Technique bay
          </p>
          <p className="text-[11px] text-slate-400">Tap to switch rigs</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techniques.map((t) => (
            <button
              key={t.key}
              onClick={() => setTechnique(t.key)}
              className={`relative overflow-hidden rounded-2xl border border-white/10 p-4 text-left transition-all shadow-lg backdrop-blur ${
                technique === t.key
                  ? "ring-2 ring-cyan-300/70 bg-white/5"
                  : "bg-white/2 hover:bg-white/10"
              }`}
            >
              <div
                className={`absolute inset-0 opacity-40 bg-gradient-to-br ${t.accent}`}
              />
              <div className="relative flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-950/60 border border-white/20 flex items-center justify-center text-2xl">
                  {t.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-lg leading-tight">
                    {t.label}
                  </p>
                  <p className="text-[12px] text-slate-100/80">{t.hint}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Environmental Conditions */}
      <div className="rounded-2xl p-4 border border-white/10 bg-slate-950/50 shadow-inner space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-200">
          <span className="font-semibold text-white">Lab Environment</span>
          <span className="text-slate-400">Applies to all rigs</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-slate-100">
          <label className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wide text-[10px] text-cyan-100">
                Room Temp
              </span>
              <span className="text-[11px] text-slate-300">
                {common.ambientTemperatureC}°C
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={40}
              value={common.ambientTemperatureC}
              onChange={(e) =>
                updateCommon({ ambientTemperatureC: Number(e.target.value) })
              }
              className="w-full accent-cyan-400"
            />
          </label>
          <label className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wide text-[10px] text-emerald-100">
                Pressure
              </span>
              <span className="text-[11px] text-slate-300">
                {common.ambientPressureAtm.toFixed(2)} atm
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.01}
              value={common.ambientPressureAtm}
              onChange={(e) =>
                updateCommon({ ambientPressureAtm: Number(e.target.value) })
              }
              className="w-full accent-emerald-400"
            />
          </label>
        </div>
      </div>

      {/* Technique-Specific Parameters */}
      <div className="space-y-4">
        {technique === "filtration" && (
          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg">
              <div className="flex items-center justify-between mb-2 text-sm text-white">
                <span className="font-semibold flex items-center gap-2">
                  🧪 Filtration Run
                </span>
                <span className="text-slate-200 text-xs">
                  Build mixture → run
                </span>
              </div>
              <FiltrationSetup />
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-inner">
              <div className="flex items-center justify-between mb-3 text-sm text-white">
                <span className="font-semibold flex items-center gap-2">
                  🎚️ Equipment Dials
                </span>
                <span className="text-[11px] text-slate-300">
                  Adjust before pouring
                </span>
              </div>
              <FiltrationParams />
            </div>
          </div>
        )}
        {technique === "evaporation" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg text-white space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <span>🔥</span>
              <span>Evaporation Sequence</span>
            </div>
            <p className="text-sm text-slate-200">
              Watch materials → mix → setup → heat. Use stage buttons on the
              simulation deck to advance.
            </p>
          </div>
        )}
        {technique === "distillation" && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg text-white space-y-2">
            <div className="flex items-center gap-2 font-semibold">
              <span>🌡️</span>
              <span>Distillation Sequence</span>
            </div>
            <p className="text-sm text-slate-200">
              Follow the condenser-first workflow. Use stage tiles on the deck
              to move from intro to collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
