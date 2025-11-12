import type { Technique } from "../state/labStore";

interface SafetyPanelProps {
  onClose: () => void;
  technique: Technique;
}

const safetyInfo = {
  general: [
    "Always wear safety goggles in the lab",
    "Tie back long hair and remove loose jewelry",
    "Wear closed-toe shoes",
    "Know the location of fire extinguisher and eye wash station",
    "Never eat or drink in the lab",
    "Report all accidents to your teacher immediately",
    "Read all instructions before beginning",
    "Clean up spills immediately",
  ],
  filtration: [
    "Handle glassware carefully to avoid breakage",
    "Be cautious with vacuum equipment - never exceed recommended pressure",
    "Support the funnel properly to prevent tipping",
    "Dispose of filter paper and residue as instructed",
  ],
  distillation: [
    "Never heat a closed system - explosion risk!",
    "Use heat-resistant gloves when handling hot equipment",
    "Ensure condenser cooling water is running before heating",
    "Never leave distillation unattended",
    "Turn off heat before turning off cooling water",
    "Allow apparatus to cool before disassembly",
  ],
  chromatography: [
    "Work in well-ventilated area (fume hood if available)",
    "Many solvents are flammable - keep away from flames",
    "Wear chemical-resistant gloves",
    "Avoid skin contact with mobile phase solvents",
    "Dispose of solvents in designated waste containers",
  ],
  centrifugation: [
    "Always balance centrifuge tubes in pairs",
    "Never open centrifuge while in operation",
    "Check tubes for cracks before use",
    "Do not exceed maximum speed rating",
    "Wait for complete stop before opening lid",
    "Report unusual vibrations immediately",
  ],
  decantation: [
    "Pour slowly to avoid splashing",
    "Use both hands when handling large containers",
    "Be aware of chemical compatibility",
    "Clean up drips immediately to prevent slips",
  ],
  sublimation: [
    "Use in well-ventilated area",
    "Some sublimed substances may be toxic",
    "Be careful with heating equipment",
    "Handle vacuum equipment properly",
    "Allow apparatus to cool before handling",
  ],
  extraction: [
    "Vent separatory funnel regularly to release pressure",
    "Some solvents are hazardous - check MSDS",
    "Work in fume hood",
    "Wear chemical-resistant gloves and goggles",
    "Secure stopper when shaking",
    "Point funnel away from yourself and others when venting",
  ],
};

export default function SafetyPanel({ onClose, technique }: SafetyPanelProps) {
  const specificSafety = safetyInfo[technique] || [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden border-4 border-yellow-400">
        {/* Safety Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                ⚠️ Safety First!
              </h2>
              <p className="text-gray-800 font-medium">
                Laboratory Safety Guidelines
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-700 hover:text-gray-900 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Safety Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-180px)]">
          {/* General Safety */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center gap-2">
              🛡️ General Lab Safety
            </h3>
            <div className="space-y-2">
              {safetyInfo.general.map((rule, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start bg-red-50 p-3 rounded-lg border-l-4 border-red-500"
                >
                  <span className="text-red-600 text-xl">•</span>
                  <span className="text-gray-800">{rule}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technique-Specific Safety */}
          {specificSafety.length > 0 && (
            <div className="mb-4">
              <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center gap-2">
                🔬 {technique.charAt(0).toUpperCase() + technique.slice(1)}
                -Specific Safety
              </h3>
              <div className="space-y-2">
                {specificSafety.map((rule, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start bg-orange-50 p-3 rounded-lg border-l-4 border-orange-500"
                  >
                    <span className="text-orange-600 text-xl font-bold">!</span>
                    <span className="text-gray-800 font-medium">{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Procedures */}
          <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
              🚨 In Case of Emergency:
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>
                • <strong>Spill:</strong> Alert others, contain if safe, notify
                teacher
              </li>
              <li>
                • <strong>Fire:</strong> Evacuate area, alert others, use
                extinguisher if trained
              </li>
              <li>
                • <strong>Chemical contact:</strong> Rinse with water for 15+
                minutes, seek help
              </li>
              <li>
                • <strong>Injury:</strong> Stop work immediately, notify teacher
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-yellow-50 border-t-2 border-yellow-200 px-6 py-4">
          <div className="flex items-center gap-3 mb-3">
            <input type="checkbox" id="safety-confirm" className="w-5 h-5" />
            <label
              htmlFor="safety-confirm"
              className="text-sm font-medium text-gray-800"
            >
              I have read and understood all safety guidelines
            </label>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Close Safety Information
          </button>
        </div>
      </div>
    </div>
  );
}
