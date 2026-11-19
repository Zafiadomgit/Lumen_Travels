"""Procesa el arte de Lumen Travels: escenas WebP, og-image y hoja de contacto.

Uso:
  python3 -I docs/arte/procesar-arte.py <carpeta-raw> <hoja-de-contacto.png> <PlusJakartaSans-700.ttf> <PlusJakartaSans-500.ttf>

<carpeta-raw> contiene los PNG originales descargados del canvas de ElevenLabs con estos nombres:
  hero.png, medellin.png, bogota.png, cartagena.png, santa-marta.png, tayrona.png
Procesa los que encuentre y marca como pendientes los que falten. Necesita Pillow y cairosvg.
"""
import io
import pathlib
import re
import sys

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[2]
ART = ROOT / "site/landing/assets/art"
SPRITE = ROOT / "site/landing/assets/icons/sprite.svg"

CREAM, INK, MUTED, LINE, GOLD = "#f6f4ef", "#141218", "#635b4f", "#e6e0d4", "#9a6a10"
VERTICALS = ["medellin", "bogota", "cartagena", "santa-marta", "tayrona"]

MARK_SVG = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="g" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#e2742a"/>
<stop offset=".55" stop-color="#f2a93b"/><stop offset="1" stop-color="#ffd27a"/></linearGradient></defs>
<circle cx="32" cy="32" r="28" fill="#141218"/>
<path d="M32 14c8 9 12 15 12 21.5a12 12 0 0 1-24 0C20 29 24 23 32 14z" fill="url(#g)"/>
<path d="M32 30c3 3.5 4.5 6 4.5 8.5a4.5 4.5 0 0 1-9 0c0-2.5 1.5-5 4.5-8.5z" fill="#fff4dc"/></svg>"""


def svg_to_image(svg, size):
    import cairosvg
    png = cairosvg.svg2png(bytestring=svg.encode(), output_width=size, output_height=size)
    return Image.open(io.BytesIO(png)).convert("RGBA")


def crop_ratio(im, rw, rh):
    w, h = im.size
    if w / h > rw / rh:
        nw = round(h * rw / rh)
        x = (w - nw) // 2
        return im.crop((x, 0, x + nw, h))
    nh = round(w * rh / rw)
    y = (h - nh) // 2
    return im.crop((0, y, w, y + nh))


def save_webp(im, path, max_kb):
    """Guarda en WebP con la mejor calidad que quepa en max_kb."""
    for q in range(86, 40, -3):
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=q, method=6)
        if buf.tell() <= max_kb * 1024:
            break
    path.write_bytes(buf.getvalue())
    return q, buf.tell()


def scenes(raw):
    done = {}
    src = raw / "hero.png"
    if src.exists():
        im = crop_ratio(Image.open(src).convert("RGB"), 16, 9)
        for w, kb in ((2400, 220), (1200, 90)):
            out = ART / f"hero-{w}.webp"
            q, b = save_webp(im.resize((w, round(w * 9 / 16)), Image.LANCZOS), out, kb)
            print(f"{out.name}: q{q} {b // 1024} KB")
        done["hero"] = im
    for name in VERTICALS:
        src = raw / f"{name}.png"
        if not src.exists():
            print(f"pendiente: {name}")
            continue
        im = crop_ratio(Image.open(src).convert("RGB"), 4, 5)
        for w, kb in ((1200, 220), (640, 90)):
            out = ART / f"{name}-{w}.webp"
            q, b = save_webp(im.resize((w, w * 5 // 4), Image.LANCZOS), out, kb)
            print(f"{out.name}: q{q} {b // 1024} KB")
        done[name] = im
    return done


def og_image(hero, bold, medium):
    W, H = 1200, 630
    if hero is not None:
        base = crop_ratio(hero, W, H).resize((W, H), Image.LANCZOS).convert("RGBA")
    else:  # provisional, sin arte: papel crema con una luz cálida
        base = Image.new("RGBA", (W, H), CREAM)
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(glow).ellipse((700, 120, 1300, 720), fill=(232, 163, 58, 70))
        base.alpha_composite(glow.filter(ImageFilter.GaussianBlur(120)))
    # velo crema arriba a la izquierda para que el texto se lea sobre el cielo
    veil = Image.new("L", (W, H), 0)
    vd = ImageDraw.Draw(veil)
    for y in range(H):
        a = max(0.0, 1 - y / (H * 0.62))
        vd.line([(0, y), (W, y)], fill=int(235 * a ** 1.4))
    cream = Image.new("RGBA", (W, H), CREAM)
    base = Image.composite(cream, base, veil)
    d = ImageDraw.Draw(base)
    mark = svg_to_image(MARK_SVG, 84)
    x, y = 64, 58
    base.alpha_composite(mark, (x, y))
    f1 = ImageFont.truetype(str(bold), 50)
    f2 = ImageFont.truetype(str(medium), 50)
    tx, ty = x + 84 + 22, y + 15
    d.text((tx, ty), "Lumen Travels", font=f1, fill=INK)
    tx += d.textlength("Lumen Travels", font=f1)
    d.text((tx, ty), " · Tu ruta, tu gente.", font=f2, fill=MUTED)
    out = ART / "og-image.jpg"
    rgb = base.convert("RGB")
    for q in range(90, 50, -4):
        buf = io.BytesIO()
        rgb.save(buf, "JPEG", quality=q, optimize=True, progressive=True)
        if buf.tell() <= 200 * 1024:
            break
    out.write_bytes(buf.getvalue())
    print(f"og-image.jpg: q{q} {buf.tell() // 1024} KB{' (provisional, sin arte)' if hero is None else ''}")


def contact_sheet(done, out, bold, medium):
    W, pad, gap = 2400, 96, 32
    f_t = ImageFont.truetype(str(bold), 44)
    f_s = ImageFont.truetype(str(medium), 26)
    vw = (W - 2 * pad - 4 * gap) // 5
    vh = vw * 5 // 4
    hw = W - 2 * pad
    hh = hw * 9 // 16
    H = pad + 80 + hh + 60 + vh + 60 + 60 + 2 * (72 + 48) + pad
    sheet = Image.new("RGB", (W, H), CREAM)
    d = ImageDraw.Draw(sheet)
    d.text((pad, pad), "Lumen Travels · arte de la landing", font=f_t, fill=INK)
    y = pad + 80

    def slot(key, box):
        x0, y0, x1, y1 = box
        if key in done:
            sheet.paste(done[key].resize((x1 - x0, y1 - y0), Image.LANCZOS), (x0, y0))
        else:
            d.rectangle(box, fill="#efebe3")
            d.text((x0 + 24, y0 + 24), f"{key}: pendiente", font=f_s, fill=MUTED)
        d.rectangle(box, outline=LINE, width=2)

    slot("hero", (pad, y, pad + hw, y + hh))
    y += hh + 60
    for i, name in enumerate(VERTICALS):
        x = pad + i * (vw + gap)
        slot(name, (x, y, x + vw, y + vh))
        d.text((x, y + vh + 14), name, font=f_s, fill=MUTED)
    y += vh + 60 + 60
    sprite = SPRITE.read_text()
    syms = re.findall(r'<symbol id="([^"]+)" viewBox="0 0 24 24">(.*?)</symbol>', sprite, re.S)
    per_row = 12
    cell = (W - 2 * pad) // per_row
    for i, (sid, body) in enumerate(syms):
        col = GOLD if sid in ("ic-shield", "ic-sparkle", "ic-sos") else INK
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="{col}" '
               f'stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">{body}</svg>')
        ic = svg_to_image(svg, 56)
        r, c = divmod(i, per_row)
        x = pad + c * cell
        yy = y + r * (72 + 48)
        sheet.paste(ic, (x, yy), ic)
        d.text((x, yy + 66), sid.replace("ic-", ""), font=ImageFont.truetype(str(medium), 20), fill=MUTED)
    sheet.save(out)
    print(f"hoja: {out}")


if __name__ == "__main__":
    raw, sheet_out, bold, medium = (pathlib.Path(a) for a in sys.argv[1:5])
    ART.mkdir(parents=True, exist_ok=True)
    done = scenes(raw)
    og_image(done.get("hero"), bold, medium)
    contact_sheet(done, sheet_out, bold, medium)
