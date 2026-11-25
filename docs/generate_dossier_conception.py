"""Dossier de conception PDF — version sobre (peu de couleurs), modèle Bonnevaux."""
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib.colors import HexColor, black, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image, HRFlowable,
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.pdfgen import canvas as pdfcanvas

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "Dossier-conception.pdf"
CAP = ROOT / "design" / "captures"
LIVE = ROOT / "captures-reelles"

# Palette minimale : noir / gris / un vert discret pour titres
INK = HexColor("#1A1A1A")
MUTE = HexColor("#555555")
LINE = HexColor("#CCCCCC")
ACCENT = HexColor("#2F4F3E")  # un seul accent, sobre


class NumberedCanvas(pdfcanvas.Canvas):
    def __init__(self, *args, **kwargs):
        pdfcanvas.Canvas.__init__(self, *args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        total = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_header_footer(total)
            pdfcanvas.Canvas.showPage(self)
        pdfcanvas.Canvas.save(self)

    def draw_header_footer(self, total):
        if self._pageNumber == 1:
            return
        self.saveState()
        self.setStrokeColor(LINE)
        self.setLineWidth(0.6)
        self.line(1.5 * cm, A4[1] - 1.1 * cm, A4[0] - 1.5 * cm, A4[1] - 1.1 * cm)
        self.setFillColor(MUTE)
        self.setFont("Helvetica", 8)
        self.drawString(1.5 * cm, A4[1] - 0.85 * cm, "LivresGourmands.net — Dossier de conception")
        self.line(1.5 * cm, 1.2 * cm, A4[0] - 1.5 * cm, 1.2 * cm)
        self.drawString(1.5 * cm, 0.85 * cm, "Institut Grasset · 420-WA6-AG · Automne 2026")
        self.drawRightString(A4[0] - 1.5 * cm, 0.85 * cm, f"{self._pageNumber} / {total}")
        self.restoreState()


def styles():
    s = getSampleStyleSheet()
    s.add(ParagraphStyle(name="CoverTitle", fontName="Helvetica-Bold", fontSize=20, leading=26, alignment=TA_CENTER, textColor=INK, spaceAfter=10))
    s.add(ParagraphStyle(name="CoverSub", fontName="Helvetica", fontSize=11, leading=15, alignment=TA_CENTER, textColor=INK, spaceAfter=4))
    s.add(ParagraphStyle(name="H1FR", fontName="Helvetica-Bold", fontSize=13, leading=17, textColor=INK, spaceBefore=4, spaceAfter=8))
    s.add(ParagraphStyle(name="H2FR", fontName="Helvetica-Bold", fontSize=11, leading=14, textColor=INK, spaceBefore=8, spaceAfter=4))
    s.add(ParagraphStyle(name="BodyFR", fontName="Helvetica", fontSize=10, leading=14, alignment=TA_JUSTIFY, textColor=INK, spaceAfter=6))
    s.add(ParagraphStyle(name="Caption", fontName="Helvetica-Oblique", fontSize=8, leading=10, textColor=MUTE, spaceAfter=8, alignment=TA_CENTER))
    s.add(ParagraphStyle(name="TOC", fontName="Helvetica", fontSize=10, leading=15, textColor=INK, spaceAfter=2))
    s.add(ParagraphStyle(name="Small", fontName="Helvetica", fontSize=8.5, leading=11, textColor=MUTE, spaceAfter=3))
    return s


def img_from(folder, name, max_w=15.5 * cm, max_h=9.5 * cm):
    path = folder / name
    st = styles()
    if not path.exists():
        return Paragraph(f"[Image manquante : {name}]", st["Caption"])
    im = Image(str(path))
    im.hAlign = "CENTER"
    ratio = min(max_w / im.imageWidth, max_h / im.imageHeight)
    im.drawWidth = im.imageWidth * ratio
    im.drawHeight = im.imageHeight * ratio
    return im


def cap(name, max_w=15.5 * cm, max_h=9.5 * cm):
    return img_from(CAP, name, max_w, max_h)


def live(name, max_w=15.5 * cm, max_h=9.5 * cm):
    return img_from(LIVE, name, max_w, max_h)


def rule():
    return HRFlowable(width="100%", thickness=0.6, color=LINE, spaceBefore=2, spaceAfter=10)


def toc_line(title, page, st):
    dots = "." * max(4, 68 - len(title) - len(str(page)))
    return Paragraph(f"{title} {dots} {page}", st["TOC"])


def build():
    st = styles()
    story = []

    # ——— Couverture ———
    story.append(Spacer(1, 3.2 * cm))
    story.append(Paragraph("DOSSIER DE CONCEPTION", st["CoverTitle"]))
    story.append(Paragraph("DU SITE WEB", st["CoverTitle"]))
    story.append(Spacer(1, 0.4 * cm))
    story.append(rule())
    story.append(Paragraph("<b>LivresGourmands.net</b>", st["CoverSub"]))
    story.append(Paragraph("Étape 3 — Conception visuelle et intégration front-end", st["CoverSub"]))
    story.append(Spacer(1, 1.2 * cm))
    story.append(Paragraph("Institut Grasset", st["CoverSub"]))
    story.append(Paragraph("Programmation Web avancée — 420-WA6-AG", st["CoverSub"]))
    story.append(Paragraph("Enseignante : Kahina Tamazouzt", st["CoverSub"]))
    story.append(Paragraph("Session Automne 2026", st["CoverSub"]))
    story.append(Spacer(1, 1.4 * cm))
    story.append(Paragraph("Abdelhakim Haoui", st["CoverSub"]))
    story.append(Paragraph("Mohammed Amine El Marzouki", st["CoverSub"]))
    story.append(Spacer(1, 1.0 * cm))
    story.append(Paragraph("Remise : 26 novembre 2026", st["CoverSub"]))
    story.append(PageBreak())

    # ——— Sommaire ———
    story.append(Paragraph("SOMMAIRE", st["H1FR"]))
    story.append(rule())
    for line in [
        ("I. Introduction", 3),
        ("II. Cahier des charges", 4),
        ("III. Arborescence du site", 5),
        ("IV. Wireframes", 6),
        ("V. Planche de tendance", 8),
        ("VI. Charte graphique", 9),
        ("VII. Maquettes (captures de l’application)", 10),
        ("VIII. Mockups responsive", 14),
        ("Annexes", 17),
    ]:
        story.append(toc_line(*line, st))
    story.append(Spacer(1, 0.6 * cm))
    story.append(Paragraph(
        "Document sobre, centré sur la structure et les preuves visuelles. "
        "Les captures des sections VII et VIII proviennent de Playwright sur l’application réelle.",
        st["Small"],
    ))
    story.append(PageBreak())

    # ——— I ———
    story.append(Paragraph("I. Introduction", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph(
        "Ce dossier présente la conception visuelle et l’intégration front-end de LivresGourmands.net, "
        "reliée à l’API REST de l’étape 2 (Node.js / Express / MySQL). La démarche suit le modèle "
        "Chloé Bonnevaux : analyse, cahier des charges, arborescence, wireframes, tendance, charte, "
        "maquettes et mockups.",
        st["BodyFR"],
    ))
    story.append(Paragraph("1.1 Démarche", st["H2FR"]))
    story.append(Paragraph(
        "1) Analyse des documents du cours et audit de l’API.<br/>"
        "2) Conception des parcours client, ami et administrateur.<br/>"
        "3) Intégration React (Vite, Bootstrap, Axios, Context API, localStorage).<br/>"
        "4) Vérification par tests et captures de l’application connectée.",
        st["BodyFR"],
    ))
    story.append(PageBreak())

    # ——— II ———
    story.append(Paragraph("II. Cahier des charges", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph("2.1 Présentation", st["H2FR"]))
    story.append(Paragraph(
        "LivresGourmands.net est une librairie en ligne pédagogique. Elle propose un catalogue d’ouvrages, "
        "des fiches produit, un panier, des listes cadeaux et un espace d’administration. "
        "Les données de test incluent plusieurs catégories (roman, histoire, informatique, science-fiction).",
        st["BodyFR"],
    ))
    story.append(Paragraph("2.2 Objectifs et publics", st["H2FR"]))
    story.append(Paragraph(
        "<b>Client</b> : consulter, filtrer, commander (simulation).<br/>"
        "<b>Ami</b> : consulter une liste cadeaux via un code.<br/>"
        "<b>Administrateur</b> : gérer ouvrages, commandes et utilisateurs selon les rôles.",
        st["BodyFR"],
    ))
    story.append(Paragraph("2.3 Spécifications", st["H2FR"]))
    story.append(Paragraph(
        "Front : React, Vite, Bootstrap, React Router, Axios, Context API, localStorage.<br/>"
        "Back : Express, MySQL (port local 3307), JWT.<br/>"
        "Sécurité : routes protégées côté React + contrôles API.",
        st["BodyFR"],
    ))
    story.append(Paragraph("2.4 Budget", st["H2FR"]))
    story.append(Paragraph(
        "Projet académique. Aucun budget commercial. Outils étudiants (Figma, GitHub).",
        st["BodyFR"],
    ))
    story.append(PageBreak())

    # ——— III ———
    story.append(Paragraph("III. Arborescence du site", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph(
        "Organisation des pages selon les rôles : public, client, ami, administrateur.",
        st["BodyFR"],
    ))
    story.append(cap("arborescence.png", 15.5 * cm, 11 * cm))
    story.append(Paragraph("Figure 1 — Arborescence fonctionnelle", st["Caption"]))
    story.append(PageBreak())

    # ——— IV ———
    story.append(Paragraph("IV. Wireframes", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph(
        "Maquettes basse fidélité (Figma) : 42 écrans, desktop et mobile, "
        "alignées sur le site React actuel (logo LG, accueil, panier, admin…). "
        "Lien : https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV",
        st["BodyFR"],
    ))
    story.append(Paragraph("4.1 Desktop — Accueil", st["H2FR"]))
    story.append(cap("wireframe_accueil_desktop.png", 15.5 * cm, 10 * cm))
    story.append(Paragraph("Figure 2 — Wireframe desktop Accueil", st["Caption"]))
    story.append(PageBreak())

    story.append(Paragraph("4.2 Mobile — Accueil", st["H2FR"]))
    story.append(cap("wireframe_accueil_mobile.png", 7.5 * cm, 13 * cm))
    story.append(Paragraph("Figure 3 — Wireframe mobile Accueil", st["Caption"]))
    story.append(Paragraph(
        "Les autres écrans (recherche, panier, listes cadeaux, administration) sont dans le fichier Figma.",
        st["BodyFR"],
    ))
    story.append(PageBreak())

    # ——— V ———
    story.append(Paragraph("V. Planche de tendance", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph(
        "Direction visuelle sobre : lecture, papier, librairie. "
        "Typographies Fraunces (titres) et Source Sans 3 (texte). Une seule couleur dominante pour l’identité.",
        st["BodyFR"],
    ))
    story.append(cap("planche_tendance.png", 15.5 * cm, 10.5 * cm))
    story.append(Paragraph("Figure 4 — Planche de tendance", st["Caption"]))
    story.append(PageBreak())

    # ——— VI ———
    story.append(Paragraph("VI. Charte graphique", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph("6.1 Logo", st["H2FR"]))
    story.append(cap("logo_capture.png", 4 * cm, 2.2 * cm))
    story.append(Paragraph("Figure 5 — Logo LG (pictogramme livre)", st["Caption"]))

    story.append(Paragraph("6.2 Couleurs (référence simple)", st["H2FR"]))
    story.append(Paragraph(
        "Principale : #214E3B (vert sombre)<br/>"
        "Secondaire : #B45335 (terracotta, actions)<br/>"
        "Fond : #F8F5EF · Texte : #252525 · Bordure : #DDD6C8",
        st["BodyFR"],
    ))
    story.append(Paragraph(
        "Dans ce dossier PDF, les couleurs sont réduites au minimum pour privilégier la clarté du document.",
        st["Small"],
    ))

    story.append(Paragraph("6.3 Typographie et boutons", st["H2FR"]))
    story.append(Paragraph(
        "Titres : Fraunces / Georgia. Texte : Source Sans 3 / Segoe UI.<br/>"
        "Boutons : primaire (vert), secondaire (terracotta), contour (bordure sombre). "
        "Les erreurs sont toujours accompagnées d’un texte, pas seulement d’une couleur.",
        st["BodyFR"],
    ))
    story.append(PageBreak())

    # ——— VII Captures ———
    story.append(Paragraph("VII. Maquettes — captures de l’application", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph(
        "Captures Playwright sur le site connecté à l’API (localhost:5173 ↔ localhost:3000).",
        st["BodyFR"],
    ))
    story.append(Paragraph("7.1 Accueil", st["H2FR"]))
    story.append(live("accueil-1440.png", 15.5 * cm, 9.5 * cm))
    story.append(Paragraph("Figure 6 — Accueil React", st["Caption"]))
    story.append(PageBreak())

    story.append(Paragraph("7.2 Fiche ouvrage", st["H2FR"]))
    story.append(live("produit-1440.png", 15.5 * cm, 10 * cm))
    story.append(Paragraph("Figure 7 — Fiche produit", st["Caption"]))
    story.append(PageBreak())

    story.append(Paragraph("7.3 Panier", st["H2FR"]))
    story.append(live("panier-1440.png", 15.5 * cm, 9 * cm))
    story.append(Paragraph("Figure 8 — Panier client", st["Caption"]))
    story.append(Paragraph("7.4 Liste cadeaux (ami)", st["H2FR"]))
    story.append(live("code-ami-1440.png", 15.5 * cm, 8 * cm))
    story.append(Paragraph("Figure 9 — Saisie du code personnel", st["Caption"]))
    story.append(PageBreak())

    story.append(Paragraph("7.5 Administration", st["H2FR"]))
    story.append(live("admin-1440.png", 15.5 * cm, 8.5 * cm))
    story.append(Paragraph("Figure 10 — Tableau de bord", st["Caption"]))
    story.append(live("ouvrages-admin-1440.png", 15.5 * cm, 7.5 * cm))
    story.append(Paragraph("Figure 11 — Gestion des ouvrages", st["Caption"]))
    story.append(PageBreak())

    # ——— VIII ———
    story.append(Paragraph("VIII. Mockups responsive", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph("8.1 Ordinateur (1440 px)", st["H2FR"]))
    story.append(live("accueil-1440.png", 15.5 * cm, 9 * cm))
    story.append(Paragraph("Figure 12 — Vue ordinateur", st["Caption"]))
    story.append(PageBreak())

    story.append(Paragraph("8.2 Tablette (768 px)", st["H2FR"]))
    story.append(live("accueil-768.png", 11 * cm, 13 * cm))
    story.append(Paragraph("Figure 13 — Vue tablette", st["Caption"]))
    story.append(PageBreak())

    story.append(Paragraph("8.3 Téléphone (390 px)", st["H2FR"]))
    story.append(live("accueil-390.png", 7.5 * cm, 13 * cm))
    story.append(Paragraph("Figure 14 — Vue téléphone", st["Caption"]))
    story.append(PageBreak())

    # ——— Annexes ———
    story.append(Paragraph("Annexes", st["H1FR"]))
    story.append(rule())
    story.append(Paragraph(
        "<b>A.</b> Architecture : backend Express + frontend React Vite · MySQL port 3307.<br/>"
        "<b>B.</b> Figma maquettes : https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV<br/>"
        "<b>C.</b> Adobe XD :<br/>"
        "<b>D.</b> Captures : docs/captures-reelles/<br/>"
        "<b>E.</b> Vidéo : LivresGourmands_Etape3_Demonstration.mp4",
        st["BodyFR"],
    ))

    doc = SimpleDocTemplate(
        str(OUT),
        pagesize=A4,
        leftMargin=1.7 * cm,
        rightMargin=1.7 * cm,
        topMargin=1.8 * cm,
        bottomMargin=1.7 * cm,
        title="Dossier de conception — LivresGourmands.net",
        author="Haoui & El Marzouki",
    )
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF généré : {OUT}")


if __name__ == "__main__":
    build()
