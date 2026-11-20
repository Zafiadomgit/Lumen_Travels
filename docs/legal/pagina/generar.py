"""Convierte docs/legal/politica-privacidad.md en site/landing/privacidad.html (texto copiado tal cual)."""
import re, html, sys
SRC, OUT = sys.argv[1], sys.argv[2]
md = open(SRC, encoding='utf-8').read()

def part(start, end):
    a = md.index(start); b = md.index(end, a)
    body = md[a:b].strip()
    body = re.sub(r'\n---\s*\n---\s*$', '', body.strip())
    return body.rstrip('-\n ')

es = part('# Política de privacidad y Tratamiento', '# ENGLISH VERSION')
en = part('# Lumen Travels Privacy Policy', '# ANEXO A')
es = re.sub(r'\n---\n---$', '', es).rstrip('-\n ')
en = re.sub(r'\n---\n---$', '', en).rstrip('-\n ')

IDS = ['responsable', 'datos', 'medicion', 'finalidades', 'encargados', 'transferencias', 'conservacion',
       'derechos', 'gdpr', 'menores', 'seguridad', 'cambios', 'contacto']
PENDING = r'\[[A-ZÁÉÍÓÚÑ][^\]\n]*\]'

def inline(t):
    t = html.escape(t, quote=False)
    def code(m):
        c = m.group(1)
        if re.fullmatch(PENDING, c) or c == '[...]':
            return '<mark class="pending">%s</mark>' % c
        return '<code>%s</code>' % c
    parts = re.split(r'(`[^`]+`)', t)
    out = []
    for p in parts:
        if p.startswith('`') and p.endswith('`') and len(p) > 1:
            out.append(code(re.match(r'`(.*)`', p))); continue
        p = re.sub(PENDING, lambda m: '<mark class="pending">%s</mark>' % m.group(0), p)
        p = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', p)
        p = re.sub(r'(?<![\*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\*)', r'<em>\1</em>', p)
        p = re.sub(r'(https?://[^\s<)]+[^\s<).,])', r'<a href="\1" rel="noopener">\1</a>', p)
        p = re.sub(r'(?<![\w/.>])([\w.+-]+@[\w-]+\.[\w.]+\w)', r'<a href="mailto:\1">\1</a>', p)
        out.append(p)
    return ''.join(out)

def convert(text, prefix, lang):
    lines = text.split('\n')
    out, toc = [], []
    i, sec, in_summary = 0, 0, False
    para = []
    def flush():
        if para:
            out.append('<p>%s</p>' % '<br>'.join(inline(x) for x in para)); para.clear()
    while i < len(lines):
        ln = lines[i]
        s = ln.strip()
        if not s:
            flush(); i += 1; continue
        if s == '---':
            flush()
            if in_summary:
                out.append('</section>'); in_summary = False
            i += 1; continue
        m = re.match(r'(#{1,3}) (.*)', s)
        if m:
            flush()
            lvl, title = len(m.group(1)), m.group(2)
            if lvl == 1:
                out.append('<h1 class="legal-title">%s</h1>' % inline(title))
            elif lvl == 2:
                n = re.match(r'(\d+)\. ', title)
                if n:
                    sid = prefix + IDS[int(n.group(1)) - 1]
                else:
                    sid = prefix + 'resumen'
                    out.append('<section class="legal-summary" aria-labelledby="%s">' % sid); in_summary = True
                toc.append((sid, title))
                out.append('<h2 id="%s">%s</h2>' % (sid, inline(title)))
            else:
                out.append('<h3>%s</h3>' % inline(title))
            i += 1; continue
        if s.startswith('>'):
            flush(); q = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                q.append(lines[i].strip().lstrip('>').strip()); i += 1
            out.append('<p class="legal-note">%s</p>' % '<br>'.join(inline(x) for x in q)); continue
        if s.startswith('|'):
            flush(); rows = []
            while i < len(lines) and lines[i].strip().startswith('|'):
                rows.append([c.strip() for c in lines[i].strip().strip('|').split('|')]); i += 1
            head, body = rows[0], [r for r in rows[1:] if not re.fullmatch(r'[-: ]+', ''.join(r))]
            t = ['<div class="legal-table" role="region" tabindex="0" aria-label="%s"><table>' % html.escape(head[0]), '<thead><tr>']
            t += ['<th scope="col">%s</th>' % inline(c) for c in head]
            t.append('</tr></thead><tbody>')
            for r in body:
                t.append('<tr>' + ''.join(('<th scope="row">%s</th>' if k == 0 else '<td>%s</td>') % inline(c) for k, c in enumerate(r)) + '</tr>')
            t.append('</tbody></table></div>')
            out.append(''.join(t)); continue
        if re.match(r'(- |\d+\. )', s):
            flush()
            ordered = bool(re.match(r'\d+\. ', s))
            items = []
            while i < len(lines) and re.match(r'(- |\d+\. )', lines[i].strip()):
                items.append(re.sub(r'^(- |\d+\. )', '', lines[i].strip())); i += 1
            tag = 'ol' if ordered else 'ul'
            out.append('<%s>%s</%s>' % (tag, ''.join('<li>%s</li>' % inline(x) for x in items), tag)); continue
        para.append(s); i += 1
    flush()
    if in_summary: out.append('</section>')
    return '\n'.join(out), toc

es_html, es_toc = convert(es, '', 'es')
en_html, en_toc = convert(en, 'en-', 'en')

def toc_html(toc, label, summary):
    items = ''.join('<li><a href="#%s">%s</a></li>' % (sid, inline(t)) for sid, t in toc)
    return ('<nav class="legal-toc" aria-label="%s"><details class="toc-box"><summary>%s</summary><ol>%s</ol></details></nav>'
            % (label, summary, items))

def article(lang, body, toc, label, summary):
    return ('<article class="legal" lang="%s" data-l="%s">\n%s\n<div class="legal-body">\n%s\n</div>\n</article>'
            % (lang, lang, toc_html(toc, label, summary), body))

tpl = open(sys.argv[3], encoding='utf-8').read()
page = tpl.replace('{{ES}}', article('es', es_html, es_toc, 'Índice de la política', 'Índice'))
page = page.replace('{{EN}}', article('en', en_html, en_toc, 'Policy contents', 'Contents'))
open(OUT, 'w', encoding='utf-8').write(page)
print('ok', len(page) // 1024, 'KB', len(es_toc), len(en_toc))
