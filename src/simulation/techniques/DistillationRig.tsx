import { useRef, useEffect, useState } from "react";
import { useLabStore } from "../../state/labStore";
import SubtitleOverlay from "../../components/SubtitleOverlay";

export function DistillationRig() {
  const experiment = useLabStore((s) => s.distillationExperiment);
  const updateExperiment = useLabStore((s) => s.updateDistillationExperiment);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cueText, setCueText] = useState("");

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
  };

  // Auto-play first step on mount
  useEffect(() => {
    playStageVideo("introduction");
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

  const subtitles: Record<string, string> = {
    introduction: "Overview of distillation glassware and goal",
    setup: "Assembling flask, column, thermometer, and condenser",
    cooling: "Starting condenser water for vapor cooling",
    heating: "Applying gentle heat to reach boiling",
    vaporization: "Lower-boiling component vaporizes first",
    condensing: "Vapor contacts the cold condenser and liquefies",
    collecting: "Condensed distillate drips into receiver",
    complete: "Run finished—cool down and observe collected fraction",
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-3 sm:p-5">
      <div className="max-w-5xl w-full bg-slate-950/70 rounded-3xl p-5 sm:p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-lg border border-cyan-300/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-black/40" />

        {/* HUD */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold text-cyan-100">
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30">
            Distillation Simulation
          </span>
          <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30">
            Step: {experiment.step.replace("-", " ")}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Track vapor rise, condense, collect
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
              experiment.step === "introduction"
                ? "📖"
                : experiment.step === "setup"
                ? "⚗️"
                : experiment.step === "cooling"
                ? "❄️"
                : experiment.step === "heating"
                ? "🔥"
                : experiment.step === "vaporization"
                ? "💨"
                : experiment.step === "condensing"
                ? "🌊"
                : experiment.step === "collecting"
                ? "🧪"
                : "✅"
            }
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 relative z-10">
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

        <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/30 border border-purple-400/30 rounded-xl px-5 py-4 text-purple-100 text-sm font-semibold text-center flex items-center justify-center gap-2">
          <span className="text-lg">🌡️</span>
          <span>
            Current Step:{" "}
            <strong className="capitalize text-white">
              {experiment.step}
            </strong>
          </span>
        </div>

        {/* Floating Next Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleNext}
            disabled={experiment.step === "complete"}
            className={`px-6 py-3 rounded-full font-bold text-white text-sm shadow-xl transition-all flex items-center gap-3 ${
              experiment.step === "complete"
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
