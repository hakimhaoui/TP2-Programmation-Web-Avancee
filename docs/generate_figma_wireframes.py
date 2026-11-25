"""
Régénère 42 wireframes SVG (21 desktop + 21 mobile) fidèles au front React actuel.
Style wireframe : gris / blanc / noir (basse fidélité), structure = site réel.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "livrables" / "FIGMA_PRET_IMPORT"
DESK = OUT / "01_Desktop_1440"
MOB = OUT / "02_Mobile_390"
COMP = OUT / "03_Composants"

# Couleurs wireframe sobres
BG, SURF, INK, MUTE, LINE, FILL = "#F5F5F5", "#FFFFFF", "#222222", "#666666", "#BBBBBB", "#E8E8E8"
ACCENT = "#333333"  # boutons wireframe


def esc(t):
    return (t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;"))


def text(x, y, t, size=14, fill=INK, anchor="start", weight="normal", family="Arial"):
    w = f' font-weight="{weight}"' if weight != "normal" else ""
    return f'<text x="{x}" y="{y}" font-family="{family}" font-size="{size}" fill="{fill}" text-anchor="{anchor}"{w}>{esc(t)}</text>'


def rect(x, y, w, h, fill=SURF, stroke=LINE, rx=4):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}"/>'


def line(x1, y1, x2, y2):
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{LINE}" stroke-width="1"/>'


def btn(x, y, w, h, label, primary=True):
    fill = ACCENT if primary else SURF
    col = SURF if primary else INK
    return rect(x, y, w, h, fill, ACCENT if not primary else fill, 6) + text(x + w / 2, y + h / 2 + 5, label, 13, col, "middle")


def nav_d(w=1440):
    return f'''
  {rect(0, 0, w, 72, SURF, LINE, 0)}
  {rect(40, 16, 40, 40, FILL, LINE, 8)}
  {text(60, 42, "LG", 14, INK, "middle", "bold")}
  {text(92, 34, "LivresGourmands.net", 16, INK, weight="bold")}
  {text(92, 52, "Librairie en ligne", 11, MUTE)}
  {text(820, 42, "Accueil", 14, INK)}
  {text(900, 42, "Recherche", 14, INK)}
  {text(1000, 42, "Listes cadeaux", 14, INK)}
  {text(1140, 42, "Panier", 14, INK)}
  {btn(1280, 22, 110, 30, "Connexion", True)}
  {line(0, 72, w, 72)}'''


def nav_m(w=390):
    return f'''
  {rect(0, 0, w, 56, SURF, LINE, 0)}
  {rect(12, 10, 36, 36, FILL, LINE, 8)}
  {text(30, 33, "LG", 12, INK, "middle", "bold")}
  {text(56, 28, "LivresGourmands", 13, INK, weight="bold")}
  {text(56, 42, "Librairie en ligne", 9, MUTE)}
  {rect(340, 16, 30, 24, SURF, LINE, 4)}
  {text(355, 33, "☰", 14, INK, "middle")}
  {line(0, 56, w, 56)}'''


def footer_d(y=980, w=1440):
    return f'''
  {rect(0, y, w, 64, FILL, LINE, 0)}
  {text(40, y + 28, "LivresGourmands.net — Institut Grasset — 420-WA6-AG", 12, MUTE)}
  {text(40, y + 48, "Accueil · Recherche · Panier · Connexion", 11, MUTE)}'''


def footer_m(y=780, w=390):
    return f'''
  {rect(0, y, w, 60, FILL, LINE, 0)}
  {text(16, y + 24, "LivresGourmands.net", 11, MUTE)}
  {text(16, y + 42, "Accueil · Panier · Connexion", 10, MUTE)}'''


def card_book(x, y, title, author, price, w=300, h=250):
    return f'''
  {rect(x, y, w, h, SURF, LINE, 8)}
  {rect(x, y, w, 140, FILL, LINE, 0)}
  {text(x + w / 2, y + 75, "Couverture", 12, MUTE, "middle")}
  {text(x + 14, y + 170, title, 14, INK, weight="bold")}
  {text(x + 14, y + 190, author, 12, MUTE)}
  {text(x + 14, y + 220, price, 14, INK, weight="bold")}
  {text(x + w - 14, y + 220, "Stock", 11, MUTE, "end")}'''


def save(path: Path, w, h, body, title):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
        f'  <title>{esc(title)}</title>\n'
        f'  <rect width="{w}" height="{h}" fill="{BG}"/>\n'
        f'{body}\n</svg>\n',
        encoding="utf-8",
    )


# ——— Desktop screens ———
def d_accueil():
    body = nav_d() + f'''
  {rect(0, 72, 1440, 220, FILL, LINE, 0)}
  {text(80, 130, "LIBRAIRIE EN LIGNE", 12, MUTE)}
  {text(80, 175, "LivresGourmands.net", 40, INK, weight="bold")}
  {text(80, 215, "Explorez des ouvrages, filtrez par catégorie et commandez.", 16, MUTE)}
  {btn(80, 235, 160, 36, "Voir le catalogue")}
  {btn(260, 235, 140, 36, "Se connecter", False)}
  {rect(80, 320, 520, 44, SURF, LINE, 6)}
  {text(96, 348, "Rechercher un titre ou un auteur…", 13, MUTE)}
  {btn(620, 320, 140, 44, "Rechercher")}
  {text(80, 400, "Catégories", 16, INK, weight="bold")}
  {btn(80, 415, 70, 28, "Toutes")}
  {btn(160, 415, 90, 28, "Histoire", False)}
  {btn(260, 415, 110, 28, "Informatique", False)}
  {btn(380, 415, 80, 28, "Roman", False)}
  {text(80, 480, "À la une (carrousel)", 16, INK, weight="bold")}
  {rect(80, 495, 1280, 200, SURF, LINE, 8)}
  {rect(80, 495, 420, 200, FILL, LINE, 0)}
  {text(290, 600, "Couverture", 14, MUTE, "middle")}
  {text(540, 560, "Dune", 24, INK, weight="bold")}
  {text(540, 590, "Frank Herbert", 14, MUTE)}
  {btn(540, 620, 140, 36, "Voir la fiche")}
  {text(80, 730, "Catalogue", 18, INK, weight="bold")}
  {card_book(80, 750, "Dune", "Frank Herbert", "24,95 $")}
  {card_book(400, 750, "Clean Code", "R. C. Martin", "49,95 $")}
  {card_book(720, 750, "Le Petit Prince", "Saint-Exupéry", "14,95 $")}
  {card_book(1040, 750, "Histoire du Québec", "J. Lacoursière", "39,95 $")}
''' + footer_d(1020)
    save(DESK / "Desktop_01_accueil_Accueil.svg", 1440, 1100, body, "Accueil")


def d_recherche_simple():
    body = nav_d() + f'''
  {text(80, 120, "Recherche", 28, INK, weight="bold")}
  {rect(80, 150, 900, 48, SURF, LINE, 6)}
  {text(100, 180, "Titre ou auteur…", 14, MUTE)}
  {btn(1000, 150, 140, 48, "Rechercher")}
  {text(80, 240, "Astuce : utilisez aussi les filtres de catégories sur l’accueil.", 13, MUTE)}
''' + footer_d()
    save(DESK / "Desktop_02_recherche_simple_Recherche_simple.svg", 1440, 1024, body, "Recherche simple")


def d_recherche_avancee():
    body = nav_d() + f'''
  {text(80, 120, "Recherche avancée", 28, INK, weight="bold")}
  {rect(80, 150, 600, 360, SURF, LINE, 8)}
  {text(100, 190, "Titre", 13, MUTE)}{rect(100, 200, 520, 40, SURF, LINE, 4)}
  {text(100, 270, "Auteur", 13, MUTE)}{rect(100, 280, 520, 40, SURF, LINE, 4)}
  {text(100, 350, "Catégorie", 13, MUTE)}{rect(100, 360, 520, 40, SURF, LINE, 4)}
  {text(100, 430, "Tri", 13, MUTE)}{rect(100, 440, 520, 40, SURF, LINE, 4)}
  {btn(100, 500, 160, 40, "Appliquer")}
''' + footer_d()
    save(DESK / "Desktop_03_recherche_avancee_Recherche_avancee.svg", 1440, 1024, body, "Recherche avancée")


def d_resultats():
    body = nav_d() + f'''
  {text(80, 120, "Résultats de recherche", 28, INK, weight="bold")}
  {text(80, 150, 'Recherche : "dune" — 1 résultat', 14, MUTE)}
  {card_book(80, 180, "Dune", "Frank Herbert", "24,95 $", 340, 260)}
''' + footer_d()
    save(DESK / "Desktop_04_resultats_recherche_Resultats_recherche.svg", 1440, 1024, body, "Résultats")


def d_fiche():
    body = nav_d() + f'''
  {text(80, 110, "Accueil / Dune", 12, MUTE)}
  {rect(80, 130, 420, 520, FILL, LINE, 8)}
  {text(290, 400, "Couverture", 16, MUTE, "middle")}
  {text(540, 170, "Dune", 32, INK, weight="bold")}
  {text(540, 205, "par Frank Herbert", 15, MUTE)}
  {rect(540, 225, 110, 22, FILL, LINE, 4)}{text(552, 240, "Science-Fiction", 11, INK)}
  {text(540, 290, "24,95 $", 28, INK, weight="bold")}
  {text(540, 330, "Roman de science-fiction.", 14, INK)}
  {text(540, 365, "Stock : 5", 13, MUTE)}
  {text(540, 390, "ISBN : 9782266154512", 13, MUTE)}
  {rect(540, 430, 44, 36, SURF, LINE, 6)}{text(562, 453, "−", 18, INK, "middle")}
  {rect(594, 430, 64, 36, SURF, LINE, 6)}{text(626, 453, "1", 16, INK, "middle")}
  {rect(668, 430, 44, 36, SURF, LINE, 6)}{text(690, 453, "+", 18, INK, "middle")}
  {btn(540, 490, 200, 44, "Ajouter au panier")}
  {text(540, 580, "Avis et commentaires", 16, INK, weight="bold")}
  {rect(540, 600, 700, 80, SURF, LINE, 6)}
  {text(560, 640, "Note moyenne + commentaires validés (API)", 13, MUTE)}
''' + footer_d()
    save(DESK / "Desktop_05_fiche_ouvrage_Fiche_ouvrage.svg", 1440, 1024, body, "Fiche ouvrage")


def d_connexion():
    body = nav_d() + f'''
  {text(520, 160, "Connexion", 28, INK, weight="bold")}
  {rect(480, 190, 480, 320, SURF, LINE, 8)}
  {text(510, 240, "Courriel", 13, MUTE)}{rect(510, 250, 420, 40, SURF, LINE, 4)}
  {text(510, 320, "Mot de passe", 13, MUTE)}{rect(510, 330, 420, 40, SURF, LINE, 4)}
  {btn(510, 400, 420, 44, "Se connecter")}
  {text(510, 470, "Pas encore de compte ? Inscription", 13, MUTE)}
''' + footer_d()
    save(DESK / "Desktop_06_connexion_Connexion.svg", 1440, 1024, body, "Connexion")


def d_inscription():
    body = nav_d() + f'''
  {text(500, 140, "Inscription", 28, INK, weight="bold")}
  {rect(460, 170, 520, 520, SURF, LINE, 8)}
  {text(490, 220, "Nom", 13, MUTE)}{rect(490, 230, 460, 40, SURF, LINE, 4)}
  {text(490, 300, "Courriel", 13, MUTE)}{rect(490, 310, 460, 40, SURF, LINE, 4)}
  {text(490, 380, "Mot de passe", 13, MUTE)}{rect(490, 390, 460, 40, SURF, LINE, 4)}
  {text(490, 460, "Confirmation", 13, MUTE)}{rect(490, 470, 460, 40, SURF, LINE, 4)}
  {btn(490, 540, 460, 44, "Créer mon compte")}
''' + footer_d()
    save(DESK / "Desktop_07_inscription_Inscription.svg", 1440, 1024, body, "Inscription")


def d_mdp():
    body = nav_d() + f'''
  {text(460, 180, "Mot de passe oublié", 28, INK, weight="bold")}
  {rect(460, 220, 520, 220, SURF, LINE, 8)}
  {text(490, 270, "Courriel", 13, MUTE)}{rect(490, 280, 460, 40, SURF, LINE, 4)}
  {btn(490, 350, 460, 44, "Envoyer le lien")}
  {text(490, 420, "Maquette (endpoint API non fourni)", 12, MUTE)}
''' + footer_d()
    save(DESK / "Desktop_08_mot_de_passe_oublie_Mot_de_passe_oublie.svg", 1440, 1024, body, "Mot de passe oublié")


def d_commentaires():
    body = nav_d() + f'''
  {text(80, 120, "Commentaires — Le Petit Prince", 24, INK, weight="bold")}
  {rect(80, 160, 900, 120, SURF, LINE, 8)}
  {text(100, 200, "Excellent — Un classique à relire. (avis API)", 14, INK)}
  {text(100, 230, "Note : 5 / 5", 13, MUTE)}
  {rect(80, 300, 900, 100, SURF, LINE, 8)}
  {text(100, 350, "Très beau livre, je recommande. (commentaire validé)", 14, INK)}
''' + footer_d()
    save(DESK / "Desktop_09_commentaires_Commentaires.svg", 1440, 1024, body, "Commentaires")


def d_panier():
    body = nav_d() + f'''
  {text(80, 120, "Panier", 28, INK, weight="bold")}
  {rect(80, 160, 900, 100, SURF, LINE, 8)}
  {rect(100, 175, 70, 70, FILL, LINE, 4)}
  {text(190, 205, "Dune — Frank Herbert", 16, INK, weight="bold")}
  {text(190, 230, "24,95 $ × quantité", 13, MUTE)}
  {btn(700, 190, 40, 36, "−", False)}{rect(750, 190, 50, 36, SURF, LINE, 4)}{text(775, 213, "1", 14, INK, "middle")}{btn(810, 190, 40, 36, "+", False)}
  {btn(880, 190, 80, 36, "Retirer", False)}
  {rect(1020, 160, 320, 220, SURF, LINE, 8)}
  {text(1040, 200, "Résumé", 16, INK, weight="bold")}
  {text(1040, 240, "Sous-total : 24,95 $", 14, INK)}
  {btn(1040, 290, 280, 44, "Livraison et règlement")}
''' + footer_d()
    save(DESK / "Desktop_10_panier_Panier.svg", 1440, 1024, body, "Panier")


def d_liste_create():
    body = nav_d() + f'''
  {text(80, 120, "Créer une liste cadeaux", 28, INK, weight="bold")}
  {rect(80, 170, 700, 280, SURF, LINE, 8)}
  {text(110, 220, "Nom de la liste", 13, MUTE)}{rect(110, 230, 640, 40, SURF, LINE, 4)}
  {text(110, 300, "Description", 13, MUTE)}{rect(110, 310, 640, 60, SURF, LINE, 4)}
  {btn(110, 400, 220, 44, "Créer la liste")}
''' + footer_d()
    save(DESK / "Desktop_11_creation_liste_cadeaux_Creation_liste_cadeaux.svg", 1440, 1024, body, "Création liste cadeaux")


def d_code_ami():
    body = nav_d() + f'''
  {text(80, 120, "Listes cadeaux", 28, INK, weight="bold")}
  {text(80, 155, "Parcours ami — saisir un code personnel", 14, MUTE)}
  {rect(80, 190, 640, 200, SURF, LINE, 8)}
  {text(110, 240, "Code personnel", 13, MUTE)}{rect(110, 250, 560, 44, SURF, LINE, 4)}
  {text(130, 278, "ex. LC-TEST1234", 13, MUTE)}
  {btn(110, 320, 180, 44, "Consulter")}
''' + footer_d()
    save(DESK / "Desktop_12_saisie_code_personnel_Saisie_code_personnel.svg", 1440, 1024, body, "Saisie code")


def d_consult_cadeaux():
    body = nav_d() + f'''
  {text(80, 120, "Consultation liste cadeaux", 28, INK, weight="bold")}
  {text(80, 155, "Code : LC-TEST1234", 14, MUTE)}
  {rect(80, 190, 1000, 90, SURF, LINE, 8)}
  {text(110, 240, "Clean Code — quantités souhaitées (API listes cadeaux)", 15, INK)}
''' + footer_d()
    save(DESK / "Desktop_13_consultation_cadeaux_Consultation_cadeaux.svg", 1440, 1024, body, "Consultation cadeaux")


def d_livraison():
    body = nav_d() + f'''
  {text(80, 120, "Livraison et règlement", 28, INK, weight="bold")}
  {rect(80, 170, 700, 420, SURF, LINE, 8)}
  {text(110, 220, "Adresse", 13, MUTE)}{rect(110, 230, 640, 40, SURF, LINE, 4)}
  {text(110, 300, "Ville", 13, MUTE)}{rect(110, 310, 640, 40, SURF, LINE, 4)}
  {text(110, 380, "Mode de livraison", 13, MUTE)}{rect(110, 390, 640, 40, SURF, LINE, 4)}
  {btn(110, 470, 260, 44, "Paiement externe")}
''' + footer_d()
    save(DESK / "Desktop_14_livraison_reglement_Livraison_et_reglement.svg", 1440, 1024, body, "Livraison")


def d_paiement():
    body = nav_d() + f'''
  {text(80, 120, "Paiement externe (simulation)", 28, INK, weight="bold")}
  {rect(80, 180, 700, 280, SURF, LINE, 8)}
  {text(110, 240, "Maquette bancaire — aucun paiement réel", 14, MUTE)}
  {text(110, 280, "Titulaire / N° carte / Expiration (champs fictifs)", 13, MUTE)}
  {rect(110, 300, 640, 40, SURF, LINE, 4)}
  {btn(110, 370, 220, 44, "Confirmer")}
''' + footer_d()
    save(DESK / "Desktop_15_paiement_externe_Paiement_externe.svg", 1440, 1024, body, "Paiement")


def d_confirmation():
    body = nav_d() + f'''
  {text(80, 160, "Confirmation d’achat", 28, INK, weight="bold")}
  {rect(80, 200, 800, 200, SURF, LINE, 8)}
  {text(110, 260, "Merci ! Votre commande a été enregistrée (simulation API).", 16, INK)}
  {text(110, 300, "Référence : SIM-…", 14, MUTE)}
  {btn(110, 340, 180, 40, "Mes commandes", False)}
''' + footer_d()
    save(DESK / "Desktop_16_confirmation_achat_Confirmation_achat.svg", 1440, 1024, body, "Confirmation")


def d_commandes():
    body = nav_d() + f'''
  {text(80, 120, "Mes commandes", 28, INK, weight="bold")}
  {rect(80, 170, 1280, 60, FILL, LINE, 0)}
  {text(100, 205, "Référence", 13, INK, weight="bold")}
  {text(400, 205, "Statut", 13, INK, weight="bold")}
  {text(700, 205, "Total", 13, INK, weight="bold")}
  {rect(80, 230, 1280, 70, SURF, LINE, 0)}
  {text(100, 270, "SIM-SEED-0001", 14, INK)}
  {text(400, 270, "payée", 14, MUTE)}
  {text(700, 270, "14,95 $", 14, INK)}
''' + footer_d()
    save(DESK / "Desktop_17_mes_commandes_Mes_commandes.svg", 1440, 1024, body, "Mes commandes")


def d_dashboard():
    body = nav_d() + f'''
  {rect(0, 72, 240, 952, SURF, LINE, 0)}
  {text(30, 120, "Admin", 16, INK, weight="bold")}
  {text(30, 160, "Tableau de bord", 14, INK)}
  {text(30, 195, "Ouvrages", 14, MUTE)}
  {text(30, 230, "Commandes", 14, MUTE)}
  {text(30, 265, "Utilisateurs", 14, MUTE)}
  {text(280, 130, "Tableau de bord", 28, INK, weight="bold")}
  {rect(280, 170, 280, 120, SURF, LINE, 8)}{text(300, 230, "Ouvrages", 16, INK)}{text(300, 255, "N (API)", 13, MUTE)}
  {rect(590, 170, 280, 120, SURF, LINE, 8)}{text(610, 230, "Commandes", 16, INK)}{text(610, 255, "N (API)", 13, MUTE)}
  {rect(900, 170, 280, 120, SURF, LINE, 8)}{text(920, 230, "Utilisateurs", 16, INK)}{text(920, 255, "N (API)", 13, MUTE)}
''' + footer_d()
    save(DESK / "Desktop_18_dashboard_admin_Dashboard_admin.svg", 1440, 1024, body, "Dashboard admin")


def d_admin_liste():
    body = nav_d() + f'''
  {text(80, 120, "Ouvrages", 28, INK, weight="bold")}
  {btn(1200, 100, 160, 40, "Ajouter")}
  {rect(80, 160, 1280, 50, FILL, LINE, 0)}
  {text(100, 190, "Titre", 13, INK, weight="bold")}{text(500, 190, "Auteur", 13, INK, weight="bold")}{text(850, 190, "Prix", 13, INK, weight="bold")}{text(1000, 190, "Actions", 13, INK, weight="bold")}
  {rect(80, 210, 1280, 60, SURF, LINE, 0)}{text(100, 245, "Dune", 14, INK)}{text(500, 245, "Frank Herbert", 14, MUTE)}{text(850, 245, "24,95 $", 14, INK)}{text(1000, 245, "Modifier · Supprimer", 13, MUTE)}
  {rect(80, 270, 1280, 60, SURF, LINE, 0)}{text(100, 305, "Clean Code", 14, INK)}{text(500, 305, "R. C. Martin", 14, MUTE)}{text(850, 305, "49,95 $", 14, INK)}{text(1000, 305, "Modifier · Supprimer", 13, MUTE)}
''' + footer_d()
    save(DESK / "Desktop_19_liste_ouvrages_admin_Liste_ouvrages_admin.svg", 1440, 1024, body, "Liste ouvrages admin")


def d_admin_form():
    body = nav_d() + f'''
  {text(80, 120, "Ajout / modification d’ouvrage", 26, INK, weight="bold")}
  {rect(80, 160, 800, 520, SURF, LINE, 8)}
  {text(110, 210, "Titre", 13, MUTE)}{rect(110, 220, 740, 40, SURF, LINE, 4)}
  {text(110, 290, "Auteur", 13, MUTE)}{rect(110, 300, 740, 40, SURF, LINE, 4)}
  {text(110, 370, "Prix", 13, MUTE)}{rect(110, 380, 340, 40, SURF, LINE, 4)}
  {text(480, 370, "Stock", 13, MUTE)}{rect(480, 380, 370, 40, SURF, LINE, 4)}
  {text(110, 450, "URL image", 13, MUTE)}{rect(110, 460, 740, 40, SURF, LINE, 4)}
  {btn(110, 540, 180, 44, "Enregistrer")}{btn(310, 540, 140, 44, "Annuler", False)}
''' + footer_d()
    save(DESK / "Desktop_20_ajout_modif_ouvrage_Ajout_modification_ouvrage.svg", 1440, 1024, body, "Formulaire ouvrage")


def d_admin_cmd():
    body = nav_d() + f'''
  {text(80, 120, "Commandes", 28, INK, weight="bold")}
  {rect(80, 170, 1280, 50, FILL, LINE, 0)}
  {text(100, 200, "Référence", 13, INK, weight="bold")}{text(400, 200, "Client", 13, INK, weight="bold")}{text(700, 200, "Statut", 13, INK, weight="bold")}{text(1000, 200, "Total", 13, INK, weight="bold")}
  {rect(80, 220, 1280, 70, SURF, LINE, 0)}
  {text(100, 260, "SIM-SEED-0001", 14, INK)}{text(400, 260, "Client Test", 14, MUTE)}{text(700, 260, "payée", 14, MUTE)}{text(1000, 260, "14,95 $", 14, INK)}
''' + footer_d()
    save(DESK / "Desktop_21_commandes_admin_Commandes_admin.svg", 1440, 1024, body, "Commandes admin")


# ——— Mobile adaptations (simplified vertical) ———
def mobile_from_desktop(name_d, name_m, title, builder_extra=None):
    """Generic mobile shell + content block."""
    w, h = 390, 844
    body = nav_m(w)
    if builder_extra:
        body += builder_extra
    else:
        body += f'''
  {text(20, 90, title, 20, INK, weight="bold")}
  {rect(16, 110, 358, 560, SURF, LINE, 8)}
  {text(30, 150, "Contenu équivalent à la version desktop", 12, MUTE)}
  {text(30, 180, "(structure React / Bootstrap responsive)", 12, MUTE)}
'''
    body += footer_m(h - 60, w)
    save(MOB / name_m, w, h, body, title)


def m_accueil():
    body = nav_m() + f'''
  {rect(0, 56, 390, 160, FILL, LINE, 0)}
  {text(20, 100, "LivresGourmands.net", 22, INK, weight="bold")}
  {text(20, 130, "Librairie en ligne", 12, MUTE)}
  {btn(20, 150, 150, 36, "Catalogue")}
  {rect(16, 240, 358, 40, SURF, LINE, 6)}{text(28, 265, "Rechercher…", 12, MUTE)}
  {text(16, 310, "Catalogue", 16, INK, weight="bold")}
  {card_book(16, 330, "Dune", "F. Herbert", "24,95 $", 170, 220)}
  {card_book(204, 330, "Clean Code", "Martin", "49,95 $", 170, 220)}
''' + footer_m()
    save(MOB / "Mobile_01_accueil_Accueil.svg", 390, 844, body, "Accueil mobile")


def m_simple(num, slug, title, lines):
    body = nav_m() + f'''
  {text(16, 90, title, 20, INK, weight="bold")}
  {rect(16, 110, 358, 520, SURF, LINE, 8)}
'''
    y = 150
    for line in lines:
        body += text(30, y, line, 13, MUTE if line.startswith("(") else INK)
        y += 28
    body += footer_m()
    fname = f"Mobile_{num:02d}_{slug}.svg"
    save(MOB / fname, 390, 844, body, title)


def build_all():
    DESK.mkdir(parents=True, exist_ok=True)
    MOB.mkdir(parents=True, exist_ok=True)
    COMP.mkdir(parents=True, exist_ok=True)

    # Desktop
    d_accueil(); d_recherche_simple(); d_recherche_avancee(); d_resultats(); d_fiche()
    d_connexion(); d_inscription(); d_mdp(); d_commentaires(); d_panier()
    d_liste_create(); d_code_ami(); d_consult_cadeaux(); d_livraison(); d_paiement()
    d_confirmation(); d_commandes(); d_dashboard(); d_admin_liste(); d_admin_form(); d_admin_cmd()

    # Mobile
    m_accueil()
    m_simple(2, "recherche_simple_Recherche_simple", "Recherche", ["Champ titre / auteur", "Bouton Rechercher"])
    m_simple(3, "recherche_avancee_Recherche_avancee", "Recherche avancée", ["Titre", "Auteur", "Catégorie", "Tri", "Appliquer"])
    m_simple(4, "resultats_recherche_Resultats_recherche", "Résultats", ["Liste de cartes ouvrages", "(données API)"])
    m_simple(5, "fiche_ouvrage_Fiche_ouvrage", "Fiche ouvrage", ["Image", "Titre / auteur / prix", "Quantité + / −", "Ajouter au panier", "Avis"])
    m_simple(6, "connexion_Connexion", "Connexion", ["Courriel", "Mot de passe", "Se connecter"])
    m_simple(7, "inscription_Inscription", "Inscription", ["Nom", "Courriel", "Mot de passe", "Créer mon compte"])
    m_simple(8, "mot_de_passe_oublie_Mot_de_passe_oublie", "Mot de passe oublié", ["Courriel", "Envoyer le lien", "(maquette)"])
    m_simple(9, "commentaires_Commentaires", "Commentaires", ["Liste avis / commentaires API"])
    m_simple(10, "panier_Panier", "Panier", ["Articles", "Quantité", "Total", "Livraison et règlement"])
    m_simple(11, "creation_liste_cadeaux_Creation_liste_cadeaux", "Créer liste cadeaux", ["Nom", "Description", "Créer"])
    m_simple(12, "saisie_code_personnel_Saisie_code_personnel", "Code personnel", ["Code", "Consulter", "Parcours ami"])
    m_simple(13, "consultation_cadeaux_Consultation_cadeaux", "Liste cadeaux", ["Items de la liste"])
    m_simple(14, "livraison_reglement_Livraison_et_reglement", "Livraison", ["Adresse", "Mode", "Paiement"])
    m_simple(15, "paiement_externe_Paiement_externe", "Paiement", ["Simulation bancaire"])
    m_simple(16, "confirmation_achat_Confirmation_achat", "Confirmation", ["Commande enregistrée"])
    m_simple(17, "mes_commandes_Mes_commandes", "Mes commandes", ["Tableau commandes client"])
    m_simple(18, "dashboard_admin_Dashboard_admin", "Dashboard admin", ["Menu latéral", "Stats ouvrages / commandes"])
    m_simple(19, "liste_ouvrages_admin_Liste_ouvrages_admin", "Ouvrages admin", ["Liste", "Modifier / Supprimer", "Ajouter"])
    m_simple(20, "ajout_modif_ouvrage_Ajout_modification_ouvrage", "Formulaire ouvrage", ["Titre", "Auteur", "Prix", "Stock", "Enregistrer"])
    m_simple(21, "commandes_admin_Commandes_admin", "Commandes admin", ["Liste des commandes API"])

    # Logo component (copy from frontend if possible)
    logo_src = ROOT / "frontend" / "src" / "assets" / "logo.svg"
    if logo_src.exists():
        (COMP / "logo_LivresGourmands.svg").write_text(logo_src.read_text(encoding="utf-8"), encoding="utf-8")

    print("Wireframes régénérés :", len(list(DESK.glob("*.svg"))), "desktop +", len(list(MOB.glob("*.svg"))), "mobile")


if __name__ == "__main__":
    build_all()
