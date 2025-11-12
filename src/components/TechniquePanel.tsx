import { useLabStore, type Technique } from "../state/labStore";
import FiltrationSetup from "./params/FiltrationSetup";
import FiltrationParams from "./params/FiltrationParams";
import DistillationParams from "./params/DistillationParams";

const techniques: {
  key: Technique;
  label: string;
  icon: string;
  desc: string;
}[] = [
  {
    key: "filtration",
    label: "Filtration",
    icon: "🔬",
    desc: "Separate solid particles from liquid using filter paper",
  },
  {
    key: "distillation",
    label: "Distillation / Evaporation",
    icon: "🌡️",
    desc: "Separate liquids by boiling point or evaporate solvent",
  },
];

export default function TechniquePanel() {
  const technique = useLabStore((s) => s.technique);
  const setTechnique = useLabStore((s) => s.setTechnique);
  const common = useLabStore((s) => s.common);
  const updateCommon = useLabStore((s) => s.updateCommon);

  const currentTechnique = techniques.find((t) => t.key === technique);

  return (
    <div className="space-y-5">
      {/* Technique Selector */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">
          Select Separation Technique
        </label>
        <div className="space-y-2">
          {techniques.map((t) => (
            <button
              key={t.key}
              onClick={() => setTechnique(t.key)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                technique === t.key
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">{t.icon}</span>
                <span className="font-semibold text-gray-800">{t.label}</span>
              </div>
              <p className="text-xs text-gray-600 ml-7">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Current Technique Info */}
      {currentTechnique && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{currentTechnique.icon}</span>
            <h3 className="font-bold text-lg">Current Setup</h3>
          </div>
          <p className="text-sm opacity-90">{currentTechnique.label}</p>
        </div>
      )}

      {/* Environmental Conditions */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
          Lab Environment
        </h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Room Temperature (C)
            </label>
            <input
              type="number"
              value={common.ambientTemperatureC}
              onChange={(e) =>
                updateCommon({ ambientTemperatureC: Number(e.target.value) })
              }
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={0}
              max={40}
            />
            <p className="text-xs text-gray-500 mt-1">Typical lab: 20-25C</p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">
              Atmospheric Pressure (atm)
            </label>
            <input
              type="number"
              step={0.01}
              value={common.ambientPressureAtm}
              onChange={(e) =>
                updateCommon({ ambientPressureAtm: Number(e.target.value) })
              }
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={0.5}
              max={1.5}
            />
            <p className="text-xs text-gray-500 mt-1">Standard: 1.0 atm</p>
          </div>
        </div>
      </div>

      {/* Technique-Specific Parameters */}
      <div className="border-t-2 border-gray-300 pt-4">
        {technique === "filtration" && (
          <div className="space-y-4">
            <FiltrationSetup />
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                Equipment Settings
              </h3>
              <FiltrationParams />
            </div>
          </div>
        )}
        {technique === "distillation" && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              Distillation Parameters
            </h3>
            <DistillationParams />
          </div>
        )}
      </div>
    </div>
  );
}
