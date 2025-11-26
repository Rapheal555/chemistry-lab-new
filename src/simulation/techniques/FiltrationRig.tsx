import { useRef, useEffect } from "react";
import { useLabStore } from "../../state/labStore";

export function FiltrationRig() {
  const experiment = useLabStore((s) => s.filtrationExperiment);
  const updateExperiment = useLabStore((s) => s.updateFiltrationExperiment);

  const videoRef = useRef<HTMLVideoElement>(null);

  const stageVideos: Record<string, string> = {
    "folding-paper": "/videos/filtration/elements-to-be-mixed.mp4",
    mixing: "/videos/filtration/mixing.mp4",
    ready: "/videos/filtration/mixing.mp4",
    setup: "/videos/filtration/aparatus-overview.mp4",
    pouring: "/videos/filtration/pour-and-filter.mp4",
    filtering: "/videos/filtration/pour-and-filter.mp4",
  };

  // Auto-play first step on mount
  useEffect(() => {
    playStageVideo("folding-paper");
  }, []);

  const handleVideoEnded = () => {
    // Video ended - user must manually click next step
    console.log("Video ended. Click a button to play next step.");
  };

  const playStageVideo = (
    stage:
      | "folding-paper"
      | "mixing"
      | "ready"
      | "setup"
      | "pouring"
      | "filtering"
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
      "folding-paper" | "mixing" | "setup" | "pouring"
    > = ["folding-paper", "mixing", "setup", "pouring"];
    const currentIndex = stepSequence.findIndex(
      (s) =>
        s === experiment.step ||
        (s === "mixing" && experiment.step === "ready") ||
        (s === "pouring" && experiment.step === "filtering")
    );
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

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => playStageVideo("folding-paper")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "folding-paper"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl"></span>
            <span>Sand and Water</span>
          </button>

          <button
            onClick={() => playStageVideo("mixing")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "mixing" || experiment.step === "ready"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl"></span>
            <span>Mix Sand and Water</span>
          </button>
          <button
            onClick={() => playStageVideo("setup")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "setup"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl"></span>
            <span>Apparatus Overview</span>
          </button>
          <button
            onClick={() => playStageVideo("pouring")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "pouring" || experiment.step === "filtering"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl"></span>
            <span>Pour & Filter</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-2 border-purple-400/40 rounded-xl px-5 py-4 text-purple-300 text-sm font-semibold text-center flex items-center justify-center gap-2">
          <span className="text-lg"></span>
          <span>
            Current Step:{" "}
            <strong className="capitalize text-purple-200">
              {experiment.step.replace("-", " ")}
            </strong>
          </span>
        </div>

        {/* Floating Next Button */}
        <button
          onClick={handleNext}
          disabled={
            experiment.step === "pouring" || experiment.step === "filtering"
          }
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-full font-bold text-white text-base shadow-2xl transition-all flex items-center gap-3 ${
            experiment.step === "pouring" || experiment.step === "filtering"
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
