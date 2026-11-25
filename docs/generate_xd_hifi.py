"""Génère des maquettes haute fidélité SVG importables dans Adobe XD."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "livrables" / "ADOBE_XD_PRET_IMPORT"

PRIMARY = "#214E3B"
SECONDARY = "#B45335"
BG = "#F8F5EF"
TEXT = "#252525"
WHITE = "#FFFFFF"
BORDER = "#DDD6C8"


def desktop(title, subtitle, role, zones, filename, folder):
    # zones: list of (label, x, y, w, h, fill)
    parts = [
        f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="1024" viewBox="0 0 1440 1024">
  <rect width="1440" height="1024" fill="{BG}"/>
  <rect width="1440" height="72" fill="{WHITE}"/>
  <rect y="70" width="1440" height="2" fill="{BORDER}"/>
  <rect x="40" y="16" width="40" height="40" rx="8" fill="{PRIMARY}"/>
  <text x="92" y="36" font-family="Georgia, serif" font-size="20" font-weight="700" fill="{PRIMARY}">LivresGourmands.net</text>
  <text x="92" y="54" font-family="Arial" font-size="11" fill="#5C5C5C">Librairie culinaire</text>
  <text x="900" y="42" font-family="Arial" font-size="14" fill="{TEXT}">Accueil</text>
  <text x="980" y="42" font-family="Arial" font-size="14" fill="{TEXT}">Recherche</text>
  <text x="1080" y="42" font-family="Arial" font-size="14" fill="{TEXT}">Panier</text>
  <rect x="1280" y="22" width="110" height="30" rx="6" fill="{PRIMARY}"/>
  <text x="1300" y="42" font-family="Arial" font-size="13" fill="{WHITE}">Connexion</text>
  <text x="40" y="120" font-family="Georgia, serif" font-size="32" fill="{PRIMARY}">{title}</text>
  <text x="40" y="150" font-family="Arial" font-size="14" fill="#5C5C5C">{subtitle} — parcours {role}</text>
'''
    ]
    for label, x, y, w, h, fill in zones:
        parts.append(f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{BORDER}"/>\n')
        parts.append(f'  <text x="{x+16}" y="{y+28}" font-family="Arial" font-size="14" fill="{TEXT}">{label}</text>\n')
    parts.append(f'''  <rect y="960" width="1440" height="64" fill="{PRIMARY}"/>
  <text x="40" y="998" font-family="Arial" font-size="13" fill="{WHITE}">Pied de page — LivresGourmands.net — Étape 3</text>
  <text x="1180" y="998" font-family="Arial" font-size="12" fill="{WHITE}">Haute fidélité 1440px</text>
</svg>
''')
    dest = OUT / folder / filename
    dest.write_text("".join(parts), encoding="utf-8")


def mobile(title, role, zones, filename, folder):
    parts = [
        f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844" viewBox="0 0 390 844">
  <rect width="390" height="844" fill="{BG}"/>
  <rect width="390" height="64" fill="{WHITE}"/>
  <rect y="62" width="390" height="2" fill="{BORDER}"/>
  <rect x="16" y="14" width="36" height="36" rx="8" fill="{PRIMARY}"/>
  <text x="60" y="30" font-family="Georgia, serif" font-size="13" fill="{PRIMARY}">LivresGourmands</text>
  <text x="60" y="46" font-family="Arial" font-size="10" fill="#5C5C5C">Librairie culinaire</text>
  <rect x="340" y="18" width="34" height="28" rx="4" fill="{WHITE}" stroke="{PRIMARY}"/>
  <text x="348" y="38" font-family="Arial" font-size="16" fill="{PRIMARY}">≡</text>
  <text x="16" y="100" font-family="Georgia, serif" font-size="22" fill="{PRIMARY}">{title}</text>
  <text x="16" y="122" font-family="Arial" font-size="11" fill="#5C5C5C">Mobile 390px — {role}</text>
'''
    ]
    for label, x, y, w, h, fill in zones:
        parts.append(f'  <rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{fill}" stroke="{BORDER}"/>\n')
        parts.append(f'  <text x="{x+12}" y="{y+26}" font-family="Arial" font-size="12" fill="{TEXT}">{label}</text>\n')
    parts.append(f'''  <rect y="790" width="390" height="54" fill="{PRIMARY}"/>
  <text x="16" y="822" font-family="Arial" font-size="11" fill="{WHITE}">Footer mobile</text>
</svg>
''')
    dest = OUT / folder / filename
    dest.write_text("".join(parts), encoding="utf-8")


def write_tokens():
    (OUT / "05_Couleurs_Typo" / "CHARTE.md").write_text(
        f"""# Charte pour Adobe XD

## Couleurs
- Principal : {PRIMARY}
- Secondaire : {SECONDARY}
- Fond : {BG}
- Texte : {TEXT}
- Blanc : {WHITE}
- Bordure : {BORDER}

## Typographies
- Titres : Fraunces / Georgia
- Textes : Source Sans 3 / Arial

## Assets
- logo.svg
- placeholder.svg
- planche_tendance.svg
""",
        encoding="utf-8",
    )


def main():
    write_tokens()

    # CLIENT desktop
    desktop(
        "Accueil", "Catalogue et découverte", "Client",
        [
            ("Hero marque + CTA catalogue", 40, 180, 1360, 160, PRIMARY),
            ("Recherche + filtres catégories", 40, 360, 1360, 80, WHITE),
            ("Carrousel ouvrages", 40, 460, 1360, 180, WHITE),
            ("Carte ouvrage 1", 40, 660, 300, 200, WHITE),
            ("Carte ouvrage 2", 360, 660, 300, 200, WHITE),
            ("Carte ouvrage 3", 680, 660, 300, 200, WHITE),
            ("Carte ouvrage 4", 1000, 660, 300, 200, WHITE),
        ],
        "HF_Desktop_01_Accueil_Client.svg", "01_Client",
    )
    desktop(
        "Fiche ouvrage", "Détail produit + avis", "Client",
        [
            ("Image couverture", 40, 180, 480, 520, PRIMARY),
            ("Titre / auteur / prix / stock", 560, 180, 840, 200, WHITE),
            ("Sélecteur quantité + Ajouter au panier", 560, 400, 840, 100, WHITE),
            ("Avis et commentaires", 560, 520, 840, 260, WHITE),
        ],
        "HF_Desktop_02_Fiche_ouvrage_Client.svg", "01_Client",
    )
    desktop(
        "Panier", "Articles, quantités, total", "Client",
        [
            ("Tableau articles", 40, 180, 1000, 520, WHITE),
            ("Sous-totaux + total", 1060, 180, 340, 200, WHITE),
            ("Bouton Livraison et règlement", 1060, 400, 340, 60, SECONDARY),
            ("Créer liste cadeaux", 1060, 480, 340, 60, WHITE),
        ],
        "HF_Desktop_03_Panier_Client.svg", "01_Client",
    )
    desktop(
        "Livraison et règlement", "Checkout simulé", "Client",
        [
            ("Mode de livraison", 40, 180, 700, 200, WHITE),
            ("Mode de règlement (simulation)", 780, 180, 620, 200, WHITE),
            ("Avertissement : aucun paiement réel", 40, 420, 1360, 80, WHITE),
            ("Confirmer la commande", 40, 540, 320, 56, SECONDARY),
        ],
        "HF_Desktop_04_Checkout_Client.svg", "01_Client",
    )
    desktop(
        "Confirmation d'achat", "Commande simulée enregistrée", "Client",
        [
            ("Message de succès", 40, 180, 1360, 120, WHITE),
            ("Récapitulatif commande", 40, 320, 900, 280, WHITE),
            ("Mes commandes / Accueil", 980, 320, 420, 120, WHITE),
        ],
        "HF_Desktop_05_Confirmation_Client.svg", "01_Client",
    )
    desktop(
        "Connexion", "Accès compte", "Client",
        [
            ("Formulaire email + mot de passe", 420, 220, 600, 320, WHITE),
            ("Bouton Se connecter", 420, 560, 600, 52, PRIMARY),
            ("Lien inscription / mot de passe oublié", 420, 640, 600, 60, WHITE),
        ],
        "HF_Desktop_06_Connexion_Client.svg", "01_Client",
    )

    # AMI
    desktop(
        "Saisie du code personnel", "Accès liste cadeaux", "Ami",
        [
            ("Champ code personnel", 420, 260, 600, 100, WHITE),
            ("Bouton Consulter la liste", 420, 400, 600, 52, PRIMARY),
            ("Aide : code reçu par message", 420, 480, 600, 80, WHITE),
        ],
        "HF_Desktop_01_Code_Ami.svg", "02_Ami",
    )
    desktop(
        "Consultation des cadeaux", "Liste partagée", "Ami",
        [
            ("Nom de la liste + description", 40, 180, 1360, 100, WHITE),
            ("Tableau des ouvrages disponibles", 40, 300, 1360, 420, WHITE),
            ("Ajouter au panier (si compte client)", 40, 740, 360, 52, SECONDARY),
        ],
        "HF_Desktop_02_Liste_Ami.svg", "02_Ami",
    )

    # ADMIN
    desktop(
        "Dashboard administrateur", "Vue d'ensemble", "Administrateur",
        [
            ("Menu latéral admin", 0, 72, 240, 888, PRIMARY),
            ("Carte stats ouvrages", 280, 180, 340, 140, WHITE),
            ("Carte stats commandes", 640, 180, 340, 140, WHITE),
            ("Raccourcis CRUD / commandes", 280, 360, 1100, 200, WHITE),
        ],
        "HF_Desktop_01_Dashboard_Admin.svg", "03_Administrateur",
    )
    desktop(
        "Liste des ouvrages", "Gestion catalogue", "Administrateur",
        [
            ("Menu latéral", 0, 72, 240, 888, PRIMARY),
            ("Bouton Ajouter", 1180, 120, 200, 44, SECONDARY),
            ("Tableau ouvrages (id, titre, prix, stock)", 280, 180, 1120, 620, WHITE),
        ],
        "HF_Desktop_02_Liste_ouvrages_Admin.svg", "03_Administrateur",
    )
    desktop(
        "Ajout / modification ouvrage", "Formulaire CRUD", "Administrateur",
        [
            ("Menu latéral", 0, 72, 240, 888, PRIMARY),
            ("Formulaire titre, auteur, prix, stock, catégorie", 280, 160, 900, 620, WHITE),
            ("Enregistrer", 280, 810, 200, 48, PRIMARY),
        ],
        "HF_Desktop_03_Formulaire_ouvrage_Admin.svg", "03_Administrateur",
    )
    desktop(
        "Commandes administrateur", "Suivi des commandes", "Administrateur",
        [
            ("Menu latéral", 0, 72, 240, 888, PRIMARY),
            ("Tableau commandes + statut", 280, 160, 1120, 640, WHITE),
        ],
        "HF_Desktop_04_Commandes_Admin.svg", "03_Administrateur",
    )

    # Mobile variants for 3 starts
    mobile("Accueil", "Client", [
        ("Hero", 16, 140, 358, 120, PRIMARY),
        ("Recherche", 16, 280, 358, 48, WHITE),
        ("Carte 1", 16, 350, 358, 140, WHITE),
        ("Carte 2", 16, 510, 358, 140, WHITE),
    ], "HF_Mobile_01_Accueil_Client.svg", "01_Client")
    mobile("Panier", "Client", [
        ("Article 1", 16, 140, 358, 120, WHITE),
        ("Article 2", 16, 280, 358, 120, WHITE),
        ("Total + CTA", 16, 420, 358, 100, WHITE),
    ], "HF_Mobile_02_Panier_Client.svg", "01_Client")
    mobile("Code ami", "Ami", [
        ("Champ code", 16, 160, 358, 80, WHITE),
        ("Consulter", 16, 260, 358, 48, PRIMARY),
    ], "HF_Mobile_01_Code_Ami.svg", "02_Ami")
    mobile("Dashboard", "Admin", [
        ("Menu admin", 16, 140, 358, 80, PRIMARY),
        ("Stats", 16, 240, 358, 120, WHITE),
        ("Liste ouvrages", 16, 380, 358, 200, WHITE),
    ], "HF_Mobile_01_Dashboard_Admin.svg", "03_Administrateur")

    print("High-fidelity SVGs generated in", OUT)


if __name__ == "__main__":
    main()
