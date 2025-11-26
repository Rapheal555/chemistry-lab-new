import { useRef, useEffect } from "react";
import { useLabStore } from "../../state/labStore";

export function DistillationRig() {
  const experiment = useLabStore((s) => s.distillationExperiment);
  const updateExperiment = useLabStore((s) => s.updateDistillationExperiment);

  const videoRef = useRef<HTMLVideoElement>(null);

  const stageVideos: Record<string, string> = {
    introduction: "/videos/distillation/1-introduction.mp4",
    setup: "/videos/distillation/2-setup-the-aparatus.mp4",
    cooling: "/videos/distillation/3-cool-the-condenser.mp4",
    heating: "/videos/distillation/4-heat-the-substance.mp4",
    vaporization: "/videos/distillation/5-vaporization.mp4",
    condensing: "/videos/distillation/6-vapour-enters-the-condenser.mp4",
    collecting: "/videos/distillation/7-collect-the-distillate.mp4",
    complete: "/videos/distillation/8-complete-the-distillation.mp4",
  };

  // Auto-play first step on mount
  useEffect(() => {
    playStageVideo("introduction");
  }, []);

  const handleVideoEnded = () => {
    // Video ended - user must manually click next step
    console.log("Video ended. Click a button to play next step.");
  };

  const playStageVideo = (
    stage:
      | "introduction"
      | "setup"
      | "cooling"
      | "heating"
      | "vaporization"
      | "condensing"
      | "collecting"
      | "complete"
  ) => {
    updateExperiment({ step: stage });
    const videoPath = stageVideos[stage];
    if (videoPath && videoRef.current) {
      videoRef.current.src = videoPath;
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch((err) => {
        console.log("Video play prevented:", err);
      });
    }
  };

  const handleNext = () => {
    const stepSequence: Array<
      | "introduction"
      | "setup"
      | "cooling"
      | "heating"
      | "vaporization"
      | "condensing"
      | "collecting"
      | "complete"
    > = [
      "introduction",
      "setup",
      "cooling",
      "heating",
      "vaporization",
      "condensing",
      "collecting",
      "complete",
    ];
    const currentIndex = stepSequence.findIndex((s) => s === experiment.step);
    if (currentIndex < stepSequence.length - 1) {
      playStageVideo(stepSequence[currentIndex + 1]);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-5">
      <div className="max-w-4xl w-full bg-slate-900/95 rounded-3xl p-6 shadow-2xl backdrop-blur-sm border border-white/10">
        <div className="bg-black rounded-2xl overflow-hidden mb-5 shadow-inner">
          <video
            ref={videoRef}
            className="w-full"
            style={{
              height: "450px",
              objectFit: "contain",
              pointerEvents: "none",
            }}
            playsInline
            onEnded={handleVideoEnded}
            onContextMenu={(e) => e.preventDefault()}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate"
          />
        </div>

        <div className="grid grid-cols-4 gap-3 mb-5">
          <button
            onClick={() => playStageVideo("introduction")}
            className={`px-4 py-3 rounded-xl font-bold text-white text-xs transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              experiment.step === "introduction"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-lg">📖</span>
            <span>Introduction</span>
          </button>

          <button
            onClick={() => playStageVideo("setup")}
            className={`px-4 py-3 rounded-xl font-bold text-white text-xs transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              experiment.step === "setup"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-lg">⚗️</span>
            <span>Setup Aparatus</span>
          </button>

          <button
            onClick={() => playStageVideo("cooling")}
            className={`px-4 py-3 rounded-xl font-bold text-white text-xs transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              experiment.step === "cooling"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-lg">❄️</span>
            <span>Cool the Condenser</span>
          </button>

          <button
            onClick={() => playStageVideo("heating")}
            className={`px-4 py-3 rounded-xl font-bold text-white text-xs transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              experiment.step === "heating"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-lg">🔥</span>
            <span>Heat the substance</span>
          </button>

          <button
            onClick={() => playStageVideo("vaporization")}
            className={`px-4 py-3 rounded-xl font-bold text-white text-xs transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              experiment.step === "vaporization"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-lg">💨</span>
            <span>Vaporize</span>
          </button>

          <button
            onClick={() => playStageVideo("condensing")}
            className={`px-4 py-3 rounded-xl font-bold text-white text-xs transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              experiment.step === "condensing"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-lg">🌊</span>
            <span>Condense the vapor</span>
          </button>

          <button
            onClick={() => playStageVideo("collecting")}
            className={`px-4 py-3 rounded-xl font-bold text-white text-xs transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              experiment.step === "collecting"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-lg">🧪</span>
            <span>Collect the distillate</span>
          </button>

          <button
            onClick={() => playStageVideo("complete")}
            className={`px-4 py-3 rounded-xl font-bold text-white text-xs transition-all flex flex-col items-center justify-center gap-1 border-2 ${
              experiment.step === "complete"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-lg">✅</span>
            <span>Complete the distillation</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-2 border-purple-400/40 rounded-xl px-5 py-4 text-purple-300 text-sm font-semibold text-center flex items-center justify-center gap-2">
          <span className="text-lg">🌡️</span>
          <span>
            Current Step:{" "}
            <strong className="capitalize text-purple-200">
              {experiment.step}
            </strong>
          </span>
        </div>

        {/* Floating Next Button */}
        <button
          onClick={handleNext}
          disabled={experiment.step === "complete"}
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-full font-bold text-white text-base shadow-2xl transition-all flex items-center gap-3 ${
            experiment.step === "complete"
              ? "bg-gray-600 cursor-not-allowed opacity-50"
              : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-110"
          }`}
        >
          <span>Next Step</span>
          <span className="text-2xl">→</span>
        </button>
      </div>
    </div>
  );
}
