type Props = {
  cueText?: string;
  fallback?: string;
  icon?: string;
};

export default function SubtitleOverlay({ cueText, fallback, icon }: Props) {
  const text = cueText || fallback || "";
  // Key on text so it remounts when text changes and CSS transitions replay
  return (
    <div className="absolute left-4 right-4 bottom-6 pointer-events-none flex justify-center z-20">
      <div
        key={text}
        className="flex items-center gap-3 max-w-3xl px-5 py-3 rounded-2xl bg-gradient-to-r from-black/70 to-slate-900/80 border border-white/10 text-white text-sm font-semibold shadow-lg backdrop-blur-lg transform transition duration-300 ease-out"
      >
        {icon && <div className="text-2xl select-none">{icon}</div>}
        <div className="leading-tight">{text}</div>
      </div>
    </div>
  );
}
