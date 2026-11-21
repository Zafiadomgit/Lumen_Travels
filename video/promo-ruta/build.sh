#!/bin/sh
# promo-ruta · Lumen Travels. Un solo comando: ./build.sh  (16:9 y 9:16, con y sin música)
# Requiere la librería Lemo-Opuscar ya instalada (sh <skill>/scripts/setup.sh deps music) y ffmpeg.
set -e
HERE=$(cd "$(dirname "$0")" && pwd)
LIB=${LIB:-/root/lemo-opuscar}          # ruta que imprime setup.sh en su última línea (LIB=...)
export LIB
[ -f "$LIB/core/render/video.mjs" ] || { echo "Define LIB con la carpeta de la librería Lemo-Opuscar"; exit 1; }
OUT=${OUT:-$HERE/out}                   # carpeta de los MP4 finales
WORK=${WORK:-$HERE/.work}               # intermedios pesados (no van al repositorio)
FPS=30
mkdir -p "$OUT" "$WORK"
cd "$LIB"

# 1) imagen: cada cuadro es render(t) en un Chrome sin cabeza
node core/render/video.mjs "$HERE" --fps $FPS --workers 3 --out "$WORK/v169.mp4"
node core/render/video.mjs "$HERE" --fps $FPS --workers 3 --size 1080x1920 --out "$WORK/v916.mp4"

# 2) música sintetizada (numpy + pluck.py de la librería, sin muestras) → out/mix.wav
"$LIB/.venv/bin/python" "$HERE/mix.py"

# 3) máster de audio: filtro suave + loudnorm a -14 LUFS en dos pasadas (ffmpeg 6 vale: el audio mide 30,0 s exactos)
AF="highpass=f=60,equalizer=f=250:t=q:w=1:g=-3,treble=g=3:f=4000"
M=$(ffmpeg -hide_banner -nostats -i "$HERE/out/mix.wav" -af "$AF,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$M" | sed -n "s/.*\"$1\" *: *\"\([^\"]*\)\".*/\1/p"; }
LN="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true"
ffmpeg -y -loglevel error -i "$HERE/out/mix.wav" -af "$AF,$LN,atrim=0:30,apad=whole_dur=30" -ar 48000 -ac 2 "$WORK/master.wav"

# 4) MP4 finales: H.264 + AAC (con música) y H.264 sin audio (para quien lo prefiera mudo)
for F in 169 916; do
  N=$([ $F = 169 ] && echo 16x9 || echo 9x16)
  ffmpeg -y -loglevel error -i "$WORK/v$F.mp4" -i "$WORK/master.wav" -map 0:v -map 1:a -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p \
    -movflags +faststart -c:a aac -b:a 160k -t 30 "$OUT/lumen-travels-promo-$N.mp4"
  ffmpeg -y -loglevel error -i "$WORK/v$F.mp4" -an -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart -t 30 "$WORK/lumen-travels-promo-$N-sin-musica.mp4"
done
mv -f "$HERE/out/mix.wav" "$WORK/mix.wav"
ls -la "$OUT" "$WORK"/*.mp4
