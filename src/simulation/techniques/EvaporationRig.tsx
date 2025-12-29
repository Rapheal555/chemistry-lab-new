import { useRef, useEffect, useState } from "react";
import { useLabStore } from "../../state/labStore";
import SubtitleOverlay from "../../components/SubtitleOverlay";

export function EvaporationRig() {
  const experiment = useLabStore((s) => s.evaporationExperiment);
  const updateExperiment = useLabStore((s) => s.updateEvaporationExperiment);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cueText, setCueText] = useState("");

  const stageVideos: Record<string, string> = {
    materials: "/videos/evaporation/materials-to-be-mixed.mp4",
    mixing: "/videos/evaporation/mix-together.mp4",
    setup: "/videos/evaporation/salt-water-and-the-tropod-and-burner.mp4",
    heating: "/videos/evaporation/ligth-the-burner-and-evaporate.mp4",
  };

  const playStageVideo = (
    stage: "materials" | "mixing" | "setup" | "heating"
  ) => {
    updateExperiment({ step: stage });
  };

  // Auto-play first step on mount
  useEffect(() => {
    playStageVideo("materials");
  }, []);

  useEffect(() => {
    const videoPath = stageVideos[experiment.step];
    if (videoRef.current && videoPath) {
      videoRef.current.load();
      videoRef.current
        .play()
        .catch((err) => console.log("Video play prevented:", err));
    }
  }, [experiment.step]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const track = video.textTracks?.[0];
    if (track) track.mode = "showing";
    const handleCueChange = () => {
      const active = track?.activeCues?.[0] as VTTCue | undefined;
      setCueText(active?.text || "");
    };
    handleCueChange();
    track?.addEventListener("cuechange", handleCueChange);
    return () => track?.removeEventListener("cuechange", handleCueChange);
  }, [experiment.step]);

  const handleVideoEnded = () => {
    // Video ended - user must manually click next step
    console.log("Video ended. Click a button to play next step.");
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

  const subtitles: Record<string, string> = {
    materials: "Gathering salt, water, tripod, wire gauze, and burner",
    mixing: "Dissolving salt in water to form a solution",
    setup: "Placing evaporating dish over gentle heat source",
    heating: "Heating to evaporate solvent and reveal the solid",
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-3 sm:p-5">
      <div className="max-w-5xl w-full bg-slate-950/70 rounded-3xl p-5 sm:p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-lg border border-cyan-300/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-black/40" />

        {/* HUD */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold text-cyan-100">
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30">
            Evaporation Simulation
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30">
            Step: {experiment.step.replace("-", " ")}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Watch heat drive solvent off
          </span>
        </div>

        <div className="bg-black rounded-2xl overflow-hidden mb-5 shadow-inner relative border border-white/10">
          {(() => {
            const videoPath = stageVideos[experiment.step];
            const subtitlePath = videoPath?.replace(".mp4", ".vtt");
            return (
              <video
                key={videoPath}
                ref={videoRef}
                className="w-full"
                src={videoPath}
                style={{
                  minHeight: "260px",
                  height: "420px",
                  objectFit: "cover",
                  pointerEvents: "none",
                }}
                playsInline
                onEnded={handleVideoEnded}
                onContextMenu={(e) => e.preventDefault()}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate"
              >
                {subtitlePath && (
                  <track
                    kind="subtitles"
                    src={subtitlePath}
                    srcLang="en"
                    label="English"
                    default
                  />
                )}
              </video>
            );
          })()}
          <SubtitleOverlay
            cueText={cueText}
            fallback={subtitles[experiment.step]}
            icon={
              experiment.step === "materials"
                ? "🧪"
                : experiment.step === "mixing"
                ? "🌀"
                : experiment.step === "heating"
                ? "🔥"
                : "💧"
            }
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 relative z-10">
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

        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/30 border border-purple-400/30 rounded-xl px-5 py-4 text-purple-100 text-sm font-semibold text-center flex items-center justify-center gap-2">
          <span className="text-lg">💧</span>
          <span>
            Current Step:{" "}
            <strong className="capitalize text-white">
              {experiment.step.replace("-", " ")}
            </strong>
          </span>
        </div>

        {/* Floating Next Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleNext}
            disabled={experiment.step === "heating"}
            className={`px-6 py-3 rounded-full font-bold text-white text-sm shadow-xl transition-all flex items-center gap-3 ${
              experiment.step === "heating"
                ? "bg-slate-700 cursor-not-allowed opacity-60"
                : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-500/30"
            }`}
          >
            <span>Next Step</span>
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
