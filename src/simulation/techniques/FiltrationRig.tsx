import { useRef, useEffect, useState } from "react";
import { useLabStore } from "../../state/labStore";
import SubtitleOverlay from "../../components/SubtitleOverlay";

export function FiltrationRig() {
  const experiment = useLabStore((s) => s.filtrationExperiment);
  const updateExperiment = useLabStore((s) => s.updateFiltrationExperiment);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [cueText, setCueText] = useState("");

  const stageVideos: Record<string, string> = {
    "folding-paper": "/videos/filtration/elements-to-be-mixed.mp4",
    mixing: "/videos/filtration/mixing.mp4",
    ready: "/videos/filtration/mixing.mp4",
    setup: "/videos/filtration/aparatus-overview.mp4",
    pouring: "/videos/filtration/pour-and-filter.mp4",
    filtering: "/videos/filtration/pour-and-filter.mp4",
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
  };

  useEffect(() => {
    // Ensure we start on the first step but don't autoplay silently; user triggers play via button
    playStageVideo("folding-paper");
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
    console.log("Video ended. Click a button to play next step.");
  };

  const handleNext = () => {
    const stepSequence: Array<"folding-paper" | "mixing" | "setup" | "pouring"> = [
      "folding-paper",
      "mixing",
      "setup",
      "pouring",
    ];
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

  const subtitles: Record<string, string> = {
    "folding-paper": "Folding filter paper into a cone for smooth flow",
    mixing: "Combining solid and liquid to form a slurry",
    ready: "Mixture ready—position funnel and collection flask",
    setup: "Checking apparatus: funnel, clamp, flask, vacuum line",
    pouring: "Pouring the mixture into the filter carefully",
    filtering: "Liquid passes through; solids stay on the paper",
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-3 sm:p-5">
      <div className="max-w-5xl w-full bg-slate-950/70 rounded-3xl p-5 sm:p-6 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-lg border border-cyan-300/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/5 via-transparent to-black/40" />

        {/* HUD */}
        <div className="relative z-10 flex flex-wrap items-center gap-2 mb-4 text-xs font-semibold text-cyan-100">
          <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30">
            Filtration Simulation
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/30">
            Step: {experiment.step.replace("-", " ")}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Video-guided • Observe equipment flow
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
                onLoadedMetadata={() => {
                  const track = videoRef.current?.textTracks?.[0];
                  if (track) track.mode = "showing";
                }}
              >
                {subtitlePath && (
                  <track kind="subtitles" src={subtitlePath} srcLang="en" label="English" default />
                )}
              </video>
            );
          })()}

          <SubtitleOverlay cueText={cueText} fallback={subtitles[experiment.step]} icon={
            experiment.step === "folding-paper" ? "🧻" : experiment.step === "mixing" ? "🌀" : experiment.step === "setup" ? "⚗️" : "🔽"
          } />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 relative z-10">
          <button
            onClick={() => playStageVideo("folding-paper")}
            className={`px-5 py-4 rounded-xl font-bold text-white text-sm transition-all flex items-center justify-center gap-2 border-2 ${
              experiment.step === "folding-paper"
                ? "bg-gradient-to-br from-indigo-600 to-purple-600 border-purple-400"
                : "bg-slate-700/30 border-transparent hover:bg-slate-700/60"
            }`}
          >
            <span className="text-xl" />
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
            <span className="text-xl" />
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
            <span className="text-xl" />
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
            <span className="text-xl" />
            <span>Pour & Filter</span>
          </button>
        </div>

          <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/30 border border-purple-400/30 rounded-xl px-5 py-4 text-purple-100 text-sm font-semibold text-center flex items-center justify-center gap-2">
            <span className="text-lg">🧭</span>
            <span>
              Current Step: <strong className="capitalize text-white">{experiment.step.replace("-", " ")}</strong>
            </span>
          </div>

        {/* Floating Next Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleNext}
            disabled={experiment.step === "pouring" || experiment.step === "filtering"}
            className={`px-6 py-3 rounded-full font-bold text-white text-sm shadow-xl transition-all flex items-center gap-3 ${
              experiment.step === "pouring" || experiment.step === "filtering"
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
