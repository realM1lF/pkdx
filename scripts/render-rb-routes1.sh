#!/usr/bin/env bash
# Render pret/pokered MUSIC_ROUTES1 → public/audio/rb-routes1.ogg
# Requires: gbsplay, ffmpeg, rgbasm, rgblink, rgbfix, python3, git
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/public/audio/rb-routes1.ogg"
WORK="${TMPDIR:-/tmp}/pkdx-rb-audio-$$"
TOOLS_REPO="$WORK/pokemon-gameboy-extractor-tool"

need() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required tool: $1" >&2
    echo "Arch: yay -S rgbds ffmpeg  (gbsplay: build from source or AUR)" >&2
    exit 1
  }
}

for t in gbsplay ffmpeg rgbasm rgblink rgbfix python3 git; do need "$t"; done

mkdir -p "$ROOT/public/audio"
rm -rf "$WORK"
git clone --depth 1 --recurse-submodules https://github.com/brynnb/pokemon-gameboy-extractor-tool.git "$TOOLS_REPO"

ROM="$WORK/music_routes1.gb"
WAV="$WORK/gbsplay-1.wav"

cd "$TOOLS_REPO"
python3 export_scripts/build_audio_rom.py MUSIC_ROUTES1 --out "$ROM"

TMPDIR="$WORK"
cd "$WORK"
gbsplay -q -q -q -o wav -r 44100 -t 90 -f 3 -T 1 "$ROM"
if [[ ! -f "$WAV" ]]; then
  echo "gbsplay did not produce $WAV" >&2
  exit 1
fi

ffmpeg -y -hide_banner -loglevel error -i "$WAV" -c:a libvorbis -q:a 4 "$OUT"
rm -rf "$WORK"
echo "Wrote $OUT"
