"""
Generate WebVTT subtitles for all MP4 clips in public/videos using Whisper.
Runs locally/offline. Requires Python, openai-whisper, and imageio-ffmpeg.
"""

import os
import shutil
from glob import glob

import imageio_ffmpeg
import whisper


def ensure_ffmpeg_on_path():
    """Ensure ffmpeg.exe is available on PATH using imageio-ffmpeg's bundled binary."""
    ffmpeg_exe = imageio_ffmpeg.get_ffmpeg_exe()
    bin_dir = os.path.dirname(ffmpeg_exe)
    # Whisper calls "ffmpeg" directly; place a copy named ffmpeg.exe in the same folder.
    ffmpeg_alias = os.path.join(bin_dir, "ffmpeg.exe")
    if not os.path.exists(ffmpeg_alias):
        shutil.copy(ffmpeg_exe, ffmpeg_alias)
    os.environ["PATH"] = bin_dir + os.pathsep + os.environ.get("PATH", "")


def to_vtt(segments):
    """Convert whisper segments to VTT string."""
    lines = ["WEBVTT", ""]
    for i, seg in enumerate(segments, 1):
        start = seg["start"]
        end = seg["end"]
        text = seg["text"].strip()
        lines.append(f"{i}")
        lines.append(f"{format_ts(start)} --> {format_ts(end)}")
        lines.append(text)
        lines.append("")  # blank line between cues
    return "\n".join(lines)


def format_ts(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    # WebVTT uses "." for fractional seconds (SRT uses ",")
    return f"{hours:02d}:{minutes:02d}:{secs:06.3f}"


def main():
    ensure_ffmpeg_on_path()
    model = whisper.load_model("small")  # balance speed/quality

    video_paths = sorted(
        glob(os.path.join("public", "videos", "**", "*.mp4"), recursive=True)
    )
    if not video_paths:
        print("No videos found in public/videos")
        return

    for path in video_paths:
        out_path = path[:-4] + ".vtt"
        print(f"Transcribing {path} -> {out_path}")
        result = model.transcribe(
            path,
            language="en",
            verbose=False,
            fp16=False,
        )
        vtt = to_vtt(result["segments"])
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(vtt)
    print("Done.")


if __name__ == "__main__":
    main()

