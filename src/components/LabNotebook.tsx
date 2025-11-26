import { useLabStore } from "../state/labStore";

interface LabNotebookProps {
  onClose: () => void;
}

const techniqueInfo = {
  filtration: {
    title: "Filtration",
    objective: "Separate solid particles from a liquid using a porous barrier",
    principle:
      "Filtration works by passing a mixture through a filter medium with pores smaller than the solid particles. The liquid (filtrate) passes through while solids are retained on the filter.",
    realWorld:
      "Coffee makers, water purification, kidney function, air filters",
    procedure: [
      "Set up the filtration apparatus (funnel and flask)",
      "Place filter paper in the funnel",
      "Apply vacuum if needed to speed up the process",
      "Pour the mixture slowly into the funnel",
      "Observe the filtrate collecting in the flask",
      "Examine the residue (solid) left on the filter",
    ],
    safety: [
      "Wear safety goggles",
      "Handle glassware carefully",
      "Check vacuum pressure",
    ],
  },
  distillation: {
    title: "Distillation",
    objective: "Separate liquids based on differences in boiling points",
    principle:
      "Distillation separates components by heating a mixture. The component with the lower boiling point vaporizes first, then condenses back to liquid in a separate container.",
    realWorld:
      "Oil refining, alcohol production, water purification, perfume making",
    procedure: [
      "Set up distillation apparatus with flask, column, and condenser",
      "Add the liquid mixture to the boiling flask",
      "Turn on cooling water in the condenser",
      "Apply heat gradually to the flask",
      "Observe vapor rising and condensing",
      "Collect distillate in the receiver flask",
      "Monitor temperature throughout the process",
    ],
    safety: [
      "Never heat a closed system",
      "Use heat-resistant gloves",
      "Ensure proper ventilation",
      "Monitor temperature carefully",
    ],
  },
  chromatography: {
    title: "Chromatography",
    objective:
      "Separate mixtures based on different affinities to mobile and stationary phases",
    principle:
      "Components travel at different rates through a stationary phase when carried by a mobile phase, based on their molecular properties.",
    realWorld:
      "Drug testing, food coloring analysis, forensics, quality control",
    procedure: [
      "Prepare the column with stationary phase",
      "Apply the sample mixture",
      "Run mobile phase through the column",
      "Observe component separation",
      "Collect fractions",
      "Analyze separated components",
    ],
    safety: [
      "Handle solvents in fume hood",
      "Wear gloves",
      "Dispose of waste properly",
    ],
  },
  centrifugation: {
    title: "Centrifugation",
    objective: "Separate components based on density using centrifugal force",
    principle:
      "Rapid spinning creates centrifugal force that causes denser particles to move outward and settle at the bottom.",
    realWorld:
      "Blood separation, cream separation, lab testing, uranium enrichment",
    procedure: [
      "Place samples in centrifuge tubes",
      "Balance tubes in pairs",
      "Secure lid of centrifuge",
      "Set speed (RPM) and time",
      "Start centrifuge",
      "Wait for complete stop",
      "Carefully remove separated layers",
    ],
    safety: [
      "Always balance tubes",
      "Never open while spinning",
      "Check for cracks in tubes",
    ],
  },
  decantation: {
    title: "Decantation",
    objective:
      "Separate immiscible liquids or settled solids by careful pouring",
    principle:
      "After settling, the less dense liquid or clear supernatant is carefully poured off, leaving the denser material behind.",
    realWorld: "Wine making, wastewater treatment, oil-water separation",
    procedure: [
      "Let mixture settle undisturbed",
      "Observe formation of layers",
      "Tilt container slowly",
      "Pour off top layer carefully",
      "Stop before disturbing bottom layer",
      "Collect separated components",
    ],
    safety: [
      "Handle containers carefully",
      "Pour slowly to avoid splashing",
      "Use appropriate PPE",
    ],
  },
  sublimation: {
    title: "Sublimation",
    objective: "Separate a sublimable solid from non-sublimable impurities",
    principle:
      "Some substances can transition directly from solid to gas (and back) without becoming liquid. This property is used for purification.",
    realWorld:
      "Freeze-drying, dry ice, moth balls, pharmaceutical purification",
    procedure: [
      "Place mixture in sublimation apparatus",
      "Apply gentle heat",
      "Reduce pressure if needed",
      "Pure substance sublimes and deposits on cold surface",
      "Collect purified solid",
      "Impurities remain in original container",
    ],
    safety: [
      "Use in well-ventilated area",
      "Control temperature carefully",
      "Handle vacuum equipment properly",
    ],
  },
  extraction: {
    title: "Liquid-Liquid Extraction",
    objective:
      "Transfer a solute from one solvent to another based on solubility differences",
    principle:
      "A solute preferentially dissolves in the solvent where it is more soluble. Shaking allows transfer between immiscible solvents.",
    realWorld:
      "Coffee/tea making, perfume extraction, pharmaceutical production, oil extraction",
    procedure: [
      "Add two immiscible solvents to separatory funnel",
      "Add mixture to be extracted",
      "Shake gently (vent pressure)",
      "Allow layers to separate",
      "Open stopcock to drain bottom layer",
      "Collect both phases separately",
    ],
    safety: [
      "Vent pressure regularly",
      "Use appropriate solvents",
      "Wear gloves and goggles",
      "Work in fume hood",
    ],
  },
  evaporation: {
    title: "Evaporation",
    objective: "Separate a dissolved solid from a liquid by heating",
    principle:
      "Evaporation removes the liquid solvent by heating, leaving the solid residue behind. The liquid evaporates into the air while the solid remains.",
    realWorld:
      "Salt production from seawater, concentrating solutions, recovering dissolved solids, crystallization",
    procedure: [
      "Gather materials to be mixed",
      "Mix the solution thoroughly",
      "Set up evaporating apparatus with tripod and burner",
      "Light the burner and heat the solution",
      "Observe liquid evaporating",
      "Continue until solid residue remains",
    ],
    safety: [
      "Never leave heating unattended",
      "Use heat-resistant equipment",
      "Avoid splashing hot liquids",
      "Allow apparatus to cool before handling",
    ],
  },
};

export default function LabNotebook({ onClose }: LabNotebookProps) {
  const technique = useLabStore((s) => s.technique);
  const info = techniqueInfo[technique as keyof typeof techniqueInfo];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden">
        {/* Notebook Header */}
        <div className="bg-gradient-to-r from-amber-100 to-amber-50 border-b-2 border-amber-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                📓 Lab Notebook
              </h2>
              <h3 className="text-xl font-semibold text-blue-700">
                {info.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Notebook Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
          {/* Objective */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-blue-600 mb-2 flex items-center">
              🎯 Objective
            </h4>
            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
              {info.objective}
            </p>
          </div>

          {/* Scientific Principle */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-purple-600 mb-2 flex items-center">
              🔬 Scientific Principle
            </h4>
            <p className="text-gray-700 bg-purple-50 p-3 rounded-lg leading-relaxed">
              {info.principle}
            </p>
          </div>

          {/* Real-World Applications */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-green-600 mb-2 flex items-center">
              🌍 Real-World Applications
            </h4>
            <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
              {info.realWorld}
            </p>
          </div>

          {/* Procedure */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-orange-600 mb-3 flex items-center">
              📋 Procedure
            </h4>
            <ol className="space-y-2">
              {info.procedure.map((step: string, i: number) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-700 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Safety Precautions */}
          <div className="mb-4">
            <h4 className="text-lg font-bold text-red-600 mb-3 flex items-center">
              ⚠️ Safety Precautions
            </h4>
            <ul className="space-y-2">
              {info.safety.map((item: string, i: number) => (
                <li
                  key={i}
                  className="flex gap-2 items-start bg-red-50 p-3 rounded-lg"
                >
                  <span className="text-red-500 font-bold">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Close and Start Experiment
          </button>
        </div>
      </div>
    </div>
  );
}
