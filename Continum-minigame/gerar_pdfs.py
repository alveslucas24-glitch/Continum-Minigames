#!/usr/bin/env python3
"""Gera PDFs pesquisáveis a partir dos arquivos de texto do Project Gutenberg."""
from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, PageBreak, KeepTogether
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parent
SRC = ROOT / "fontes"
OUT = ROOT / "livros"
OUT.mkdir(exist_ok=True)
BOOKS = [
    (55752, "dom-casmurro.pdf", "Dom Casmurro", "Machado de Assis"),
    (54829, "memorias-postumas.pdf", "Memórias Póstumas de Brás Cubas", "Machado de Assis"),
    (67740, "iracema.pdf", "Iracema", "José de Alencar"),
    (67724, "o-guarani-vol-1.pdf", "O Guarani — Volume I", "José de Alencar"),
    (67725, "o-guarani-vol-2.pdf", "O Guarani — Volume II", "José de Alencar"),
    (55682, "quincas-borba.pdf", "Quincas Borba", "Machado de Assis"),
    (68541, "o-atheneu.pdf", "O Atheneu (Crônica de saudades)", "Raul Pompéia"),
    (69187, "o-cortico.pdf", "O Cortiço", "Aluísio Azevedo"),
    (59620, "queda-que-as-mulheres-tem.pdf", "Quéda que as Mulheres Têm para os Tolos", "Victor Hénaux · tradução de Machado de Assis"),
]
FONT = Path("/usr/share/fonts/truetype/dejavu")
pdfmetrics.registerFont(TTFont("DejaVu", str(FONT / "DejaVuSerif.ttf")))
pdfmetrics.registerFont(TTFont("DejaVu-Bold", str(FONT / "DejaVuSerif-Bold.ttf")))
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name="BookTitle", fontName="DejaVu-Bold", fontSize=24, leading=30, alignment=TA_CENTER, spaceAfter=15, textColor=colors.HexColor("#2e2923")))
styles.add(ParagraphStyle(name="BookAuthor", fontName="DejaVu", fontSize=13, leading=18, alignment=TA_CENTER, spaceAfter=16, textColor=colors.HexColor("#78563e")))
styles.add(ParagraphStyle(name="BookCredit", fontName="DejaVu", fontSize=8, leading=12, alignment=TA_CENTER, textColor=colors.HexColor("#786f62")))
styles.add(ParagraphStyle(name="BookBody", fontName="DejaVu", fontSize=10.3, leading=16.2, alignment=TA_LEFT, spaceAfter=7, firstLineIndent=18, textColor=colors.HexColor("#26231f")))
styles.add(ParagraphStyle(name="BookHeading", fontName="DejaVu-Bold", fontSize=12, leading=17, alignment=TA_CENTER, spaceBefore=13, spaceAfter=9, textColor=colors.HexColor("#5b3c2d")))

def extract_text(path: Path) -> str:
    raw = path.read_text(encoding="utf-8", errors="replace")
    start = re.search(r"\*\*\* START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK .*?\*\*\*", raw, re.I)
    end = re.search(r"\*\*\* END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK .*?\*\*\*", raw, re.I)
    if not start or not end or end.start() <= start.end():
        raise ValueError(f"Marcadores de texto integral ausentes: {path.name}")
    text = raw[start.end():end.start()]
    return text.replace("\r\n", "\n").replace("\r", "\n").strip()

def footer(canvas, doc, ebook_id):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#d8ccba"))
    canvas.line(46, 36, A4[0]-46, 36)
    canvas.setFont("DejaVu", 7)
    canvas.setFillColor(colors.HexColor("#766c60"))
    canvas.drawString(46, 23, f"Texto de domínio público · Project Gutenberg #{ebook_id}")
    canvas.drawRightString(A4[0]-46, 23, str(doc.page))
    canvas.restoreState()

for ebook_id, filename, title, author in BOOKS:
    text = extract_text(SRC / f"pg{ebook_id}.txt")
    pdf = OUT / filename
    story = [Spacer(1, 105), Paragraph(escape(title), styles["BookTitle"]), Paragraph(escape(author), styles["BookAuthor"]), Spacer(1, 18), Paragraph(f"Texto integral digitalizado pelo Project Gutenberg · eBook #{ebook_id}.", styles["BookCredit"]), Paragraph("PDF local de leitura preparado para esta cópia do Continum.", styles["BookCredit"]), PageBreak()]
    for part in re.split(r"\n\s*\n", text):
        block = " ".join(line.strip() for line in part.splitlines() if line.strip()).strip()
        if not block:
            continue
        if len(block) < 90 and (block.isupper() or re.match(r"^(CAP[IÍ]TULO|CHAPTER|PARTE|LIVRO|PROLOGO|PRÓLOGO|EP[IÍ]LOGO|INTRODU[CÇ][AÃ]O|ADVERT[EÊ]NCIA|NOTA\b)", block, re.I)):
            story.append(KeepTogether([Paragraph(escape(block), styles["BookHeading"])]))
        else:
            story.append(Paragraph(escape(block), styles["BookBody"]))
    doc = SimpleDocTemplate(str(pdf), pagesize=A4, rightMargin=48, leftMargin=48, topMargin=54, bottomMargin=52, title=title, author=author, subject=f"Project Gutenberg eBook #{ebook_id}", creator="Continum local public-domain reader")
    doc.build(story, onFirstPage=lambda c,d,i=ebook_id: footer(c,d,i), onLaterPages=lambda c,d,i=ebook_id: footer(c,d,i))
    reader = PdfReader(str(pdf))
    if len(reader.pages) < 2 or not reader.pages[1].extract_text().strip():
        raise RuntimeError(f"PDF incompleto ou sem texto extraível: {filename}")
    print(f"{filename}: {len(reader.pages)} páginas, {pdf.stat().st_size:,} bytes")
