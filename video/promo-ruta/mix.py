"""Banda sonora de promo-ruta: 100 % sintetizada con numpy y el modelado de cuerdas de Lemo-Opuscar (pluck.py).
Sin muestras ni descargas: no hay material de terceros. Se escribe out/mix.wav (48 kHz, estéreo, 30 s exactos).
Corre desde la librería: $LIB/.venv/bin/python mix.py  (build.sh lo hace)."""
import os, sys
LIB = os.environ.get('LIB', os.path.expanduser('~/lemo-opuscar'))
sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import pluck as P
from core.audio import sfx as X
from core.audio.sfx import SR, add

HERE = os.path.dirname(os.path.abspath(__file__))
DUR = 30.0
buf = np.zeros((int(DUR * SR) + SR * 3, 2), np.float32)
pad = np.zeros_like(buf)

# misma línea de tiempo que index.html (segundos)
SC = [('hero', 0.0), ('mapa', 4.5), ('s0', 10.5), ('s1', 14.0), ('s2', 17.5), ('s3', 21.0), ('fin', 24.5)]
ENDS = [4.5, 10.5, 14.0, 17.5, 21.0, 24.5, 30.0]
EIGHTH = 0.25                         # corchea a 120 bpm; la rejilla se reinicia en cada escena, así cada corte cae en tiempo

# acordes en sol mayor: bajo, arpegio (de grave a agudo), cima para la melodía
CH = {
    'G':  dict(b='G2',  a=['G3', 'D4', 'G4', 'B4'],  top='D5'),
    'Em': dict(b='E2',  a=['E3', 'B3', 'E4', 'G4'],  top='B4'),
    'D':  dict(b='D3',  a=['D3', 'A3', 'D4', 'F#4'], top='A4'),
    'C':  dict(b='C3',  a=['C3', 'G3', 'C4', 'E4'],  top='E5'),
}
# (inicio, fin, acorde) por tramo armónico
HARM = [(0, 4.5, 'G'), (4.5, 7.5, 'Em'), (7.5, 10.5, 'D'), (10.5, 14.0, 'C'), (14.0, 17.5, 'D'),
        (17.5, 21.0, 'Em'), (21.0, 23.0, 'C'), (23.0, 24.5, 'D'), (24.5, 30.0, 'G')]
PAT = [0, 1, 2, 3, 2, 1, 2, 1]        # patrón de arpegio, una nota por corchea

def guitar(t, pitch, v, pan=-.15, dur=.5): add(buf, P.pluck('nylon_guitar', pitch, dur, v), t, 1.0, pan)
def bass(t, pitch, v=.55):               add(buf, P.pluck('upright_bass_pizz', pitch, .6, v), t, 1.0, 0.0)
def kal(t, pitch, v=.5, pan=.25):        add(buf, P.pluck('kalimba', pitch, None, v), t, 1.0, pan)
def harp(t, pitches, v=.6, spread=.05):  add(buf, P.strum('harp', pitches, 2.5, v, spread=spread), t, 1.0, -.25)
def box(t, pitch, v=.35, pan=.4):        add(buf, P.pluck('music_box', pitch, None, v), t, 1.0, pan)

# --- apertura (0–4,5 s): kalimba sola y un arpa, mucho aire
harp(0.0, ['G3', 'D4', 'B4'], .45, .08)
for t, p, v in [(0.35, 'D5', .42), (1.15, 'B4', .40), (1.95, 'G4', .40), (2.95, 'A4', .38), (3.75, 'B4', .42)]: kal(t, p, v)
harp(2.25, ['D3', 'A3', 'D4'], .35, .08)

# --- arpegios de guitarra por tramo armónico (desde el mapa, 4,5 s, hasta el final)
for (a, b, c) in HARM:
    if a < 4.5 - 1e-6: continue
    ch = CH[c]; vol = .36 if a < 10.5 else .42
    if a >= 24.5: vol = .40
    n = int((min(b, 28.5) - a) / EIGHTH)
    for i in range(n):
        t = a + i * EIGHTH
        v = vol * (1.12 if i % 4 == 0 else .9) * (1 + .04 * np.sin(i * 1.7))
        guitar(t, ch['a'][PAT[i % 8]], v)
    bass(a, ch['b'], .45)
    if b - a > 2.0: bass(a + 1.5, ch['b'], .32)

# --- melodía de kalimba: un gesto por escena, cae con el texto (≈ +0,5 s)
MEL = {
    'mapa': [(4.5 + .9, 'D5', .45), (4.5 + 1.4, 'B4', .40), (4.5 + 2.4, 'E5', .42), (4.5 + 3.4, 'D5', .40), (4.5 + 4.4, 'A4', .40), (4.5 + 5.0, 'F#5', .42)],
    's0': [(10.5 + .5, 'G5', .5), (10.5 + 1.1, 'E5', .42), (10.5 + 2.2, 'D5', .40)],
    's1': [(14.0 + .5, 'A5', .5), (14.0 + 1.1, 'F#5', .42), (14.0 + 2.2, 'D5', .40)],
    's2': [(17.5 + .5, 'B5', .5), (17.5 + 1.1, 'G5', .42), (17.5 + 2.2, 'E5', .40)],
    's3': [(21.0 + .5, 'G5', .5), (21.0 + 1.1, 'E5', .42), (21.0 + 2.2, 'C5', .40), (21.0 + 3.0, 'D5', .38)],
    'fin': [(24.5 + .9, 'D5', .5), (24.5 + 1.5, 'G5', .5), (24.5 + 2.2, 'B5', .45), (24.5 + 3.0, 'D6', .45), (24.5 + 3.9, 'G5', .5)],
}
for k, notes in MEL.items():
    for t, p, v in notes: kal(t, p, v)

# --- los cortes: golpe de cuerda grave + una cima de caja de música en cada escena nueva
for name, t0 in SC[1:]:
    box(t0 + .02, {'mapa': 'G5', 's0': 'E6', 's1': 'D6', 's2': 'B5', 's3': 'G5', 'fin': 'G6'}[name], .34)

# --- cierre: arpa en el acorde de sol y respiración final
harp(24.5, ['G3', 'D4', 'G4', 'B4', 'D5'], .6, .06)
bass(24.5, 'G2', .7)
harp(27.4, ['G3', 'D4', 'B4', 'G5'], .45, .09)
bass(27.4, 'G2', .5)

# --- colchón: pad suave de senos por acorde (ataque y relevo lentos)
def pad_note(a, b, midi, g):
    n = int((b - a + 1.2) * SR); t = np.arange(n) / SR; f = 440 * 2 ** ((midi - 69) / 12)
    y = sum(np.sin(2 * np.pi * f * (1 + d) * t + ph) for d, ph in [(0, 0), (.0035, 1.1), (-.003, 2.3)]) / 3
    y += .25 * np.sin(2 * np.pi * 2 * f * t)
    env = np.minimum(1, t / .9) * np.minimum(1, np.maximum(0, (b - a + 1.2 - t)) / 1.1)
    add(pad, (y * env * g).astype(np.float32), a, 1.0, 0.0)
PADN = {'G': [55, 62, 71], 'Em': [52, 59, 67], 'D': [50, 57, 66], 'C': [48, 55, 64]}
for (a, b, c) in HARM:
    if a >= 28.5: continue
    for m in PADN[c]: pad_note(a, min(b, 29.0), m, .016 if a < 24.5 else .022)
pad = X.lp(pad.T, 1800).T.astype(np.float32)
buf += pad

# --- pincel sobre papel: un susurro de ruido en cada barrido de pantalla (0,8 s) y al pintar la ruta
def brush(t, d=.8, g=.05, pan0=-.5, pan1=.5):
    n = X.bp(X.noise(d), 2200, 5200) * np.sin(np.linspace(0, np.pi, int(round(d * SR)))) ** 2
    # barrido estéreo
    steps = 8
    for k in range(steps):
        s0, s1 = int(len(n) * k / steps), int(len(n) * (k + 1) / steps)
        add(buf, n[s0:s1].astype(np.float32), t + s0 / SR, g, pan0 + (pan1 - pan0) * k / (steps - 1))
for t0 in [0.0, 4.5, 10.5, 14.0, 17.5, 21.0, 24.5]: brush(max(t0 - .2, 0), .9, .028)
brush(5.0, 4.9, .016, -.6, .6)           # la pincelada de la ruta, mientras se dibuja
for t0, d in [(.8, .55), (25.35, .55), (26.0, .6)]: brush(t0, d, .02, -.3, .3)   # subrayados dorados

# --- sala corta y fundido
buf = buf[:int((DUR + 2) * SR)]
try:
    from core.audio import sampler as S
    wet = S.room(buf, size=.5, mix=.22)
    buf = wet[:len(buf)].astype(np.float32)
except Exception as e:
    print('room skipped:', e)
buf = buf[:int(DUR * SR)]
buf = X.hp(buf.T, 55, 4).T.astype(np.float32)   # sin subgraves: no se oyen en un celular
fade = np.ones(len(buf), np.float32); k = int(1.6 * SR); fade[-k:] = np.linspace(1, 0, k) ** 1.5
buf *= fade[:, None]
pk = np.abs(buf).max(); buf *= .85 / pk if pk > 0 else 1
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'mix.wav'), buf, SR, subtype='PCM_16')
print('mix.wav', len(buf) / SR, 's, pico', float(np.abs(buf).max()))
