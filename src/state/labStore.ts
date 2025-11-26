import { create } from "zustand";

export type Technique =
  | "filtration"
  | "evaporation"
  | "distillation"
  | "chromatography"
  | "centrifugation"
  | "decantation"
  | "sublimation"
  | "extraction";

export type CommonParams = {
  ambientTemperatureC: number;
  ambientPressureAtm: number;
};

// Experiment state for filtration
export type FiltrationExperimentState = {
  step:
    | "setup"
    | "folding-paper"
    | "mixing"
    | "ready"
    | "pouring"
    | "filtering"
    | "complete";
  solidCompound: string | null;
  liquidCompound: string | null;
  mixingProgress: number;
  pouringProgress: number;
  liquidLevel: number;
  filtrateLevel: number;
  cakeThickness: number;
  isRunning: boolean;
  paperFoldProgress: number; // 0 to 1 for folding animation
};

// Experiment state for evaporation
export type EvaporationExperimentState = {
  step: "materials" | "mixing" | "setup" | "heating" | "complete";
  isRunning: boolean;
};

// Experiment state for distillation
export type DistillationExperimentState = {
  step:
    | "introduction"
    | "setup"
    | "cooling"
    | "heating"
    | "vaporization"
    | "condensing"
    | "collecting"
    | "complete";
  isRunning: boolean;
};

export type TechniqueParams = {
  filtration: {
    poreSizeMicron: number;
    vacuumMbar: number;
    slurryViscosityCP: number;
    filterAreaCm2: number;
  };
  distillation: {
    heatRateW: number;
    condenserEfficiency: number;
    refluxRatio: number;
    mixtureCompA: number;
  };
  chromatography: {
    mobileFlowMlMin: number;
    particleSizeMicron: number;
    columnLengthCm: number;
    temperatureC: number;
  };
  centrifugation: {
    rpm: number;
    radiusCm: number;
    timeMin: number;
  };
  decantation: {
    settlingTimeMin: number;
    densityDiff: number;
    viscosityCP: number;
  };
  sublimation: {
    plateTempC: number;
    chamberPressureMbar: number;
  };
  extraction: {
    solventToFeedRatio: number;
    mixingTimeMin: number;
    settlingTimeMin: number;
    kDistribution: number;
  };
};

type LabState = {
  technique: Technique;
  common: CommonParams;
  params: TechniqueParams;

  filtrationExperiment: FiltrationExperimentState;
  evaporationExperiment: EvaporationExperimentState;
  distillationExperiment: DistillationExperimentState;
  setTechnique: (t: Technique) => void;
  updateParams: <K extends keyof TechniqueParams>(
    key: K,
    patch: Partial<TechniqueParams[K]>
  ) => void;
  updateCommon: (patch: Partial<CommonParams>) => void;
  updateFiltrationExperiment: (
    patch: Partial<FiltrationExperimentState>
  ) => void;
  resetFiltrationExperiment: () => void;
  updateEvaporationExperiment: (
    patch: Partial<EvaporationExperimentState>
  ) => void;
  resetEvaporationExperiment: () => void;
  updateDistillationExperiment: (
    patch: Partial<DistillationExperimentState>
  ) => void;
  resetDistillationExperiment: () => void;
};

export const useLabStore = create<LabState>((set) => ({
  technique: "filtration",
  common: {
    ambientTemperatureC: 22,
    ambientPressureAtm: 1,
  },
  params: {
    filtration: {
      poreSizeMicron: 10,
      vacuumMbar: 300,
      slurryViscosityCP: 2,
      filterAreaCm2: 50,
    },
    distillation: {
      heatRateW: 200,
      condenserEfficiency: 0.85,
      refluxRatio: 1.5,
      mixtureCompA: 0.5,
    },
    chromatography: {
      mobileFlowMlMin: 1.2,
      particleSizeMicron: 5,
      columnLengthCm: 15,
      temperatureC: 25,
    },
    centrifugation: {
      rpm: 8000,
      radiusCm: 7.5,
      timeMin: 10,
    },
    decantation: {
      settlingTimeMin: 30,
      densityDiff: 0.3,
      viscosityCP: 1.2,
    },
    sublimation: {
      plateTempC: 80,
      chamberPressureMbar: 15,
    },
    extraction: {
      solventToFeedRatio: 1.5,
      mixingTimeMin: 5,
      settlingTimeMin: 10,
      kDistribution: 2.0,
    },
  },
  filtrationExperiment: {
    step: "setup",
    solidCompound: null,
    liquidCompound: null,
    mixingProgress: 0,
    pouringProgress: 0,
    liquidLevel: 0,
    filtrateLevel: 0,
    cakeThickness: 0.01,
    isRunning: false,
    paperFoldProgress: 0,
  },
  evaporationExperiment: {
    step: "materials",
    isRunning: false,
  },
  distillationExperiment: {
    step: "introduction",
    isRunning: false,
  },
  setTechnique: (t) => set({ technique: t }),
  updateParams: (key, patch) =>
    set((s) => ({
      params: { ...s.params, [key]: { ...s.params[key], ...patch } },
    })),
  updateCommon: (patch) => set((s) => ({ common: { ...s.common, ...patch } })),
  updateFiltrationExperiment: (patch) =>
    set((s) => ({
      filtrationExperiment: { ...s.filtrationExperiment, ...patch },
    })),
  resetFiltrationExperiment: () =>
    set({
      filtrationExperiment: {
        step: "setup",
        solidCompound: null,
        liquidCompound: null,
        mixingProgress: 0,
        pouringProgress: 0,
        liquidLevel: 0,
        filtrateLevel: 0,
        cakeThickness: 0.01,
        isRunning: false,
        paperFoldProgress: 0,
      },
    }),
  updateEvaporationExperiment: (patch) =>
    set((s) => ({
      evaporationExperiment: { ...s.evaporationExperiment, ...patch },
    })),
  resetEvaporationExperiment: () =>
    set({
      evaporationExperiment: {
        step: "materials",
        isRunning: false,
      },
    }),
  updateDistillationExperiment: (patch) =>
    set((s) => ({
      distillationExperiment: { ...s.distillationExperiment, ...patch },
    })),
  resetDistillationExperiment: () =>
    set({
      distillationExperiment: {
        step: "introduction",
        isRunning: false,
      },
    }),
}));
