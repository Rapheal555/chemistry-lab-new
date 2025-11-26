import { useRef, useEffect } from "react";
import { useLabStore } from "../../state/labStore";

export function EvaporationRig() {
  const experiment = useLabStore((s) => s.evaporationExperiment);
  const updateExperiment = useLabStore((s) => s.updateEvaporationExperiment);

  const videoRef = useRef<HTMLVideoElement>(null);

  const stageVideos: Record<string, string> = {
    materials: "/videos/evaporation/materials-to-be-mixed.mp4",
    mixing: "/videos/evaporation/mix-together.mp4",
    setup: "/videos/evaporation/salt-water-and-the-tropod-and-burner.mp4",
    heating: "/videos/evaporation/ligth-the-burner-and-evaporate.mp4",
  };

  // Auto-play first step on mount
  useEffect(() => {
    playStageVideo("materials");
  }, []);

  const handleVideoEnded = () => {
    // Video ended - user must manually click next step
    console.log("Video ended. Click a button to play next step.");
  };

  const playStageVideo = (
    stage: "materials" | "mixing" | "setup" | "heating"
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
    const stepSequence: Array<"materials" | "mixing" | "setup" | "heating"> = [
      "materials",
      "mixing",
      "setup",
      "heating",
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

        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => playStageVideo("materials")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "materials"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl">🧪</span>
            <span>Materials to Mix</span>
          </button>

          <button
            onClick={() => playStageVideo("mixing")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "mixing"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl">🌀</span>
            <span>Mix Together</span>
          </button>

          <button
            onClick={() => playStageVideo("setup")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "setup"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl">⚗️</span>
            <span>Setup Apparatus</span>
          </button>

          <button
            onClick={() => playStageVideo("heating")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "heating"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl">🔥</span>
            <span>Light & Evaporate</span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-2 border-purple-400/40 rounded-xl px-5 py-4 text-purple-300 text-sm font-semibold text-center flex items-center justify-center gap-2">
          <span className="text-lg">💧</span>
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
          disabled={experiment.step === "heating"}
          className={`fixed bottom-8 right-8 px-6 py-4 rounded-full font-bold text-white text-base shadow-2xl transition-all flex items-center gap-3 ${
            experiment.step === "heating"
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
