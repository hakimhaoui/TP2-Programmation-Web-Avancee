"""Maquettes XD haute fidélité détaillées (proches du React réel)."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "livrables" / "ADOBE_XD_PRET_IMPORT"
P, S, BG, T, W, B = "#214E3B", "#B45335", "#F8F5EF", "#252525", "#FFFFFF", "#DDD6C8"


def nav(w=1440):
    return f'''
  <rect width="{w}" height="72" fill="{W}"/>
  <rect y="70" width="{w}" height="2" fill="{B}"/>
  <rect x="40" y="16" width="40" height="40" rx="8" fill="{P}"/>
  <text x="54" y="42" font-family="Georgia" font-size="18" fill="{W}" text-anchor="middle">L</text>
  <text x="92" y="36" font-family="Georgia" font-size="18" font-weight="700" fill="{P}">LivresGourmands.net</text>
  <text x="92" y="54" font-family="Arial" font-size="11" fill="#5C5C5C">Librairie culinaire</text>
  <text x="860" y="42" font-family="Arial" font-size="14" fill="{T}">Accueil</text>
  <text x="940" y="42" font-family="Arial" font-size="14" fill="{T}">Recherche</text>
  <text x="1040" y="42" font-family="Arial" font-size="14" fill="{T}">Listes cadeaux</text>
  <text x="1170" y="42" font-family="Arial" font-size="14" fill="{T}">Panier</text>
  <rect x="1280" y="22" width="110" height="30" rx="6" fill="{P}"/>
  <text x="1298" y="42" font-family="Arial" font-size="13" fill="{W}">Connexion</text>'''


def footer(y=960):
    return f'''
  <rect y="{y}" width="1440" height="64" fill="#163528"/>
  <text x="40" y="{y+28}" font-family="Arial" font-size="13" fill="{BG}">LivresGourmands.net — Institut Grasset</text>
  <text x="40" y="{y+48}" font-family="Arial" font-size="11" fill="#c9c2b5">Accueil · Recherche · Panier · Connexion</text>'''


def card(x, y, title, author, price, cat):
    return f'''
  <rect x="{x}" y="{y}" width="300" height="260" rx="8" fill="{W}" stroke="{B}"/>
  <rect x="{x}" y="{y}" width="300" height="140" fill="{P}"/>
  <text x="{x+150}" y="{y+70}" text-anchor="middle" font-family="Georgia" font-size="14" fill="{W}">LivresGourmands</text>
  <text x="{x+150}" y="{y+95}" text-anchor="middle" font-family="Arial" font-size="11" fill="{W}">Image non disponible</text>
  <text x="{x+16}" y="{y+170}" font-family="Georgia" font-size="15" fill="{T}">{title}</text>
  <text x="{x+16}" y="{y+192}" font-family="Arial" font-size="12" fill="#5C5C5C">{author}</text>
  <rect x="{x+16}" y="{y+205}" width="90" height="20" rx="4" fill="#F0EBE1" stroke="{B}"/>
  <text x="{x+24}" y="{y+219}" font-family="Arial" font-size="10" fill="{T}">{cat}</text>
  <text x="{x+16}" y="{y+245}" font-family="Arial" font-size="14" font-weight="700" fill="{S}">{price}</text>'''


def save(folder, name, body, w=1440, h=1024):
    path = OUT / folder / name
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(
        f'<?xml version="1.0" encoding="UTF-8"?>\n'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">\n'
        f'  <rect width="{w}" height="{h}" fill="{BG}"/>\n{body}\n</svg>\n',
        encoding="utf-8",
    )


def client_screens():
    # Accueil
    body = nav() + f'''
  <rect y="72" width="1440" height="220" fill="{P}"/>
  <text x="80" y="130" font-family="Arial" font-size="12" fill="#d7e5dc">LIBRAIRIE CULINAIRE EN LIGNE</text>
  <text x="80" y="175" font-family="Georgia" font-size="42" fill="{W}">LivresGourmands.net</text>
  <text x="80" y="215" font-family="Arial" font-size="16" fill="#e8f0eb">Explorez des ouvrages, filtrez par catégorie et commandez en quelques clics.</text>
  <rect x="80" y="235" width="160" height="36" rx="6" fill="{S}"/>
  <text x="100" y="258" font-family="Arial" font-size="13" fill="{W}">Voir le catalogue</text>
  <rect x="80" y="320" width="520" height="44" rx="6" fill="{W}" stroke="{B}"/>
  <text x="96" y="347" font-family="Arial" font-size="13" fill="#888">Rechercher un titre ou un auteur…</text>
  <rect x="610" y="320" width="140" height="44" rx="6" fill="{P}"/>
  <text x="640" y="347" font-family="Arial" font-size="13" fill="{W}">Rechercher</text>
  <text x="80" y="400" font-family="Georgia" font-size="18" fill="{P}">Catégories</text>
  <rect x="80" y="415" width="70" height="28" rx="6" fill="{P}"/><text x="92" y="434" font-family="Arial" font-size="12" fill="{W}">Toutes</text>
  <rect x="160" y="415" width="80" height="28" rx="6" fill="{W}" stroke="{P}"/><text x="172" y="434" font-family="Arial" font-size="12" fill="{P}">Histoire</text>
  <rect x="250" y="415" width="110" height="28" rx="6" fill="{W}" stroke="{P}"/><text x="262" y="434" font-family="Arial" font-size="12" fill="{P}">Informatique</text>
  <rect x="370" y="415" width="70" height="28" rx="6" fill="{W}" stroke="{P}"/><text x="388" y="434" font-family="Arial" font-size="12" fill="{P}">Roman</text>
  <rect x="450" y="415" width="120" height="28" rx="6" fill="{W}" stroke="{P}"/><text x="462" y="434" font-family="Arial" font-size="12" fill="{P}">Science-Fiction</text>
  <text x="80" y="490" font-family="Georgia" font-size="20" fill="{P}">Catalogue</text>
  {card(80, 510, "Dune", "Frank Herbert", "24,95 $", "Science-Fiction")}
  {card(400, 510, "Clean Code", "Robert C. Martin", "49,95 $", "Informatique")}
  {card(720, 510, "Le Petit Prince", "Saint-Exupéry", "14,95 $", "Roman")}
  {card(1040, 510, "Histoire du Québec", "J. Lacoursière", "39,95 $", "Histoire")}
''' + footer()
    save("01_Client", "HF_Desktop_01_Accueil_Client.svg", body)

    # Fiche
    body = nav() + f'''
  <text x="80" y="110" font-family="Arial" font-size="12" fill="#666">Accueil / Le Petit Prince</text>
  <rect x="80" y="130" width="420" height="520" rx="8" fill="{P}"/>
  <text x="290" y="370" text-anchor="middle" font-family="Georgia" font-size="20" fill="{W}">LivresGourmands</text>
  <text x="290" y="400" text-anchor="middle" font-family="Arial" font-size="14" fill="{W}">Image non disponible</text>
  <text x="540" y="170" font-family="Georgia" font-size="32" fill="{T}">Le Petit Prince</text>
  <text x="540" y="205" font-family="Arial" font-size="15" fill="#5C5C5C">par Antoine de Saint-Exupéry</text>
  <rect x="540" y="225" width="70" height="22" rx="4" fill="#F0EBE1" stroke="{B}"/>
  <text x="552" y="240" font-family="Arial" font-size="11" fill="{T}">Roman</text>
  <text x="540" y="290" font-family="Arial" font-size="28" font-weight="700" fill="{S}">14,95 $</text>
  <text x="540" y="330" font-family="Arial" font-size="14" fill="{T}">Conte philosophique.</text>
  <text x="540" y="365" font-family="Arial" font-size="13" fill="{T}">Stock : 10</text>
  <text x="540" y="390" font-family="Arial" font-size="13" fill="{T}">ISBN : 9782070612758</text>
  <text x="540" y="415" font-family="Arial" font-size="13" fill="{T}">Note moyenne : 5.0 (1 avis)</text>
  <rect x="540" y="450" width="44" height="36" rx="6" fill="{W}" stroke="{B}"/><text x="556" y="473" font-family="Arial" font-size="18">−</text>
  <rect x="594" y="450" width="64" height="36" rx="6" fill="{W}" stroke="{B}"/><text x="620" y="473" font-family="Arial" font-size="16">1</text>
  <rect x="668" y="450" width="44" height="36" rx="6" fill="{W}" stroke="{B}"/><text x="684" y="473" font-family="Arial" font-size="18">+</text>
  <rect x="740" y="450" width="200" height="36" rx="6" fill="{S}"/>
  <text x="770" y="473" font-family="Arial" font-size="14" fill="{W}">Ajouter au panier</text>
  <text x="540" y="540" font-family="Georgia" font-size="18" fill="{P}">Avis</text>
  <rect x="540" y="555" width="820" height="80" rx="8" fill="{W}" stroke="{B}"/>
  <text x="560" y="585" font-family="Arial" font-size="13" fill="{T}">Excellent — note 5/5</text>
  <text x="560" y="610" font-family="Arial" font-size="13" fill="#5C5C5C">Un classique à relire.</text>
''' + footer()
    save("01_Client", "HF_Desktop_02_Fiche_ouvrage_Client.svg", body)

    # Panier
    body = nav() + f'''
  <text x="80" y="120" font-family="Georgia" font-size="28" fill="{P}">Panier</text>
  <rect x="80" y="150" width="900" height="420" rx="8" fill="{W}" stroke="{B}"/>
  <text x="110" y="190" font-family="Arial" font-size="13" fill="#666">OUVRAGE</text>
  <text x="520" y="190" font-family="Arial" font-size="13" fill="#666">PRIX</text>
  <text x="650" y="190" font-family="Arial" font-size="13" fill="#666">QTÉ</text>
  <text x="780" y="190" font-family="Arial" font-size="13" fill="#666">SOUS-TOTAL</text>
  <line x1="100" y1="210" x2="960" y2="210" stroke="{B}"/>
  <rect x="110" y="230" width="48" height="64" fill="{P}"/>
  <text x="175" y="255" font-family="Arial" font-size="14" fill="{T}">Dune</text>
  <text x="175" y="275" font-family="Arial" font-size="12" fill="#666">Frank Herbert</text>
  <text x="520" y="260" font-family="Arial" font-size="14" fill="{T}">24,95 $</text>
  <rect x="640" y="242" width="70" height="32" rx="4" fill="{W}" stroke="{B}"/><text x="668" y="263" font-family="Arial" font-size="14">2</text>
  <text x="790" y="260" font-family="Arial" font-size="14" fill="{T}">49,90 $</text>
  <rect x="900" y="242" width="60" height="28" rx="4" fill="{W}" stroke="#9B2C2C"/><text x="908" y="261" font-family="Arial" font-size="11" fill="#9B2C2C">Suppr.</text>
  <rect x="1020" y="150" width="340" height="260" rx="8" fill="{W}" stroke="{B}"/>
  <text x="1045" y="195" font-family="Georgia" font-size="18" fill="{P}">Récapitulatif</text>
  <text x="1045" y="240" font-family="Arial" font-size="14" fill="{T}">Articles : 2</text>
  <text x="1045" y="275" font-family="Arial" font-size="20" font-weight="700" fill="{S}">Total : 49,90 $</text>
  <rect x="1045" y="310" width="290" height="40" rx="6" fill="{S}"/>
  <text x="1095" y="335" font-family="Arial" font-size="14" fill="{W}">Livraison et règlement</text>
  <rect x="1045" y="365" width="290" height="36" rx="6" fill="{W}" stroke="{P}"/>
  <text x="1100" y="388" font-family="Arial" font-size="13" fill="{P}">Créer liste cadeaux</text>
''' + footer()
    save("01_Client", "HF_Desktop_03_Panier_Client.svg", body)

    # Checkout
    body = nav() + f'''
  <text x="80" y="120" font-family="Georgia" font-size="28" fill="{P}">Livraison et règlement</text>
  <rect x="80" y="160" width="700" height="280" rx="8" fill="{W}" stroke="{B}"/>
  <text x="110" y="205" font-family="Arial" font-size="15" fill="{T}">Mode de livraison</text>
  <rect x="110" y="225" width="620" height="40" rx="6" fill="{W}" stroke="{B}"/>
  <text x="130" y="250" font-family="Arial" font-size="13" fill="{T}">Standard</text>
  <text x="110" y="310" font-family="Arial" font-size="15" fill="{T}">Mode de règlement</text>
  <rect x="110" y="330" width="620" height="40" rx="6" fill="{W}" stroke="{B}"/>
  <text x="130" y="355" font-family="Arial" font-size="13" fill="{T}">Paiement simulé (API)</text>
  <rect x="820" y="160" width="540" height="280" rx="8" fill="{W}" stroke="{B}"/>
  <text x="850" y="210" font-family="Georgia" font-size="18" fill="{P}">Total indicatif</text>
  <text x="850" y="260" font-family="Arial" font-size="28" fill="{S}">49,90 $</text>
  <text x="850" y="300" font-family="Arial" font-size="12" fill="#666">Le total réel est recalculé côté serveur.</text>
  <rect x="850" y="340" width="480" height="44" rx="6" fill="{S}"/>
  <text x="960" y="367" font-family="Arial" font-size="14" fill="{W}">Confirmer la commande simulée</text>
''' + footer()
    save("01_Client", "HF_Desktop_04_Checkout_Client.svg", body)

    # Confirmation
    body = nav() + f'''
  <text x="80" y="130" font-family="Georgia" font-size="28" fill="{P}">Confirmation d'achat</text>
  <rect x="80" y="170" width="1280" height="80" rx="8" fill="#E7F6EE" stroke="#1F6B45"/>
  <text x="110" y="218" font-family="Arial" font-size="15" fill="#1F6B45">Votre commande simulée a été enregistrée.</text>
  <rect x="80" y="280" width="700" height="220" rx="8" fill="{W}" stroke="{B}"/>
  <text x="110" y="330" font-family="Arial" font-size="14" fill="{T}">N° commande : 1</text>
  <text x="110" y="365" font-family="Arial" font-size="14" fill="{T}">Statut : payee</text>
  <text x="110" y="400" font-family="Arial" font-size="14" fill="{T}">Total serveur : 14,95 $</text>
  <rect x="110" y="440" width="180" height="36" rx="6" fill="{P}"/>
  <text x="135" y="463" font-family="Arial" font-size="13" fill="{W}">Mes commandes</text>
''' + footer()
    save("01_Client", "HF_Desktop_05_Confirmation_Client.svg", body)

    # Connexion
    body = nav() + f'''
  <text x="520" y="160" font-family="Georgia" font-size="28" fill="{P}">Connexion</text>
  <rect x="420" y="190" width="600" height="360" rx="8" fill="{W}" stroke="{B}"/>
  <text x="460" y="250" font-family="Arial" font-size="14" fill="{T}">Courriel</text>
  <rect x="460" y="265" width="520" height="42" rx="6" fill="{W}" stroke="{B}"/>
  <text x="475" y="292" font-family="Arial" font-size="13" fill="#999">client@librairie.ca</text>
  <text x="460" y="350" font-family="Arial" font-size="14" fill="{T}">Mot de passe</text>
  <rect x="460" y="365" width="520" height="42" rx="6" fill="{W}" stroke="{B}"/>
  <text x="475" y="392" font-family="Arial" font-size="13" fill="#999">••••••••</text>
  <rect x="460" y="440" width="520" height="44" rx="6" fill="{P}"/>
  <text x="660" y="467" text-anchor="middle" font-family="Arial" font-size="14" fill="{W}">Se connecter</text>
  <text x="460" y="515" font-family="Arial" font-size="13" fill="{P}">Pas encore de compte ? S'inscrire</text>
''' + footer()
    save("01_Client", "HF_Desktop_06_Connexion_Client.svg", body)

    # Mobile accueil + panier
    m = f'''
  <rect width="390" height="64" fill="{W}"/><rect y="62" width="390" height="2" fill="{B}"/>
  <rect x="16" y="14" width="36" height="36" rx="8" fill="{P}"/>
  <text x="60" y="30" font-family="Georgia" font-size="13" fill="{P}">LivresGourmands</text>
  <text x="60" y="46" font-family="Arial" font-size="10" fill="#666">Librairie culinaire</text>
  <rect x="340" y="18" width="34" height="28" rx="4" fill="{W}" stroke="{P}"/>
  <text x="348" y="38" font-family="Arial" font-size="16" fill="{P}">≡</text>
  <rect y="64" width="390" height="150" fill="{P}"/>
  <text x="20" y="110" font-family="Georgia" font-size="24" fill="{W}">LivresGourmands.net</text>
  <text x="20" y="145" font-family="Arial" font-size="12" fill="#e8f0eb">Catalogue culinaire en ligne</text>
  <rect x="20" y="165" width="140" height="30" rx="6" fill="{S}"/>
  <text x="35" y="185" font-family="Arial" font-size="12" fill="{W}">Voir le catalogue</text>
  <rect x="16" y="240" width="358" height="40" rx="6" fill="{W}" stroke="{B}"/>
  <text x="28" y="265" font-family="Arial" font-size="12" fill="#888">Rechercher…</text>
  <rect x="16" y="300" width="358" height="180" rx="8" fill="{W}" stroke="{B}"/>
  <rect x="16" y="300" width="358" height="100" fill="{P}"/>
  <text x="195" y="350" text-anchor="middle" font-family="Georgia" font-size="14" fill="{W}">Dune</text>
  <text x="32" y="430" font-family="Arial" font-size="13" fill="{T}">Frank Herbert · 24,95 $</text>
  <rect x="16" y="500" width="358" height="180" rx="8" fill="{W}" stroke="{B}"/>
  <rect x="16" y="500" width="358" height="100" fill="{P}"/>
  <text x="195" y="550" text-anchor="middle" font-family="Georgia" font-size="14" fill="{W}">Clean Code</text>
  <text x="32" y="630" font-family="Arial" font-size="13" fill="{T}">R. C. Martin · 49,95 $</text>
  <rect y="790" width="390" height="54" fill="#163528"/>
  <text x="16" y="822" font-family="Arial" font-size="11" fill="{BG}">Footer mobile</text>
'''
    save("01_Client", "HF_Mobile_01_Accueil_Client.svg", m, 390, 844)


def ami_screens():
    body = nav() + f'''
  <text x="420" y="160" font-family="Georgia" font-size="28" fill="{P}">Listes de cadeaux</text>
  <text x="420" y="195" font-family="Arial" font-size="14" fill="#666">Parcours ami : saisissez le code reçu.</text>
  <rect x="420" y="230" width="600" height="280" rx="8" fill="{W}" stroke="{B}"/>
  <text x="460" y="290" font-family="Arial" font-size="14" fill="{T}">Code personnel</text>
  <rect x="460" y="310" width="520" height="44" rx="6" fill="{W}" stroke="{B}"/>
  <text x="480" y="338" font-family="Arial" font-size="14" fill="#999">LC-TEST1234</text>
  <rect x="460" y="390" width="520" height="44" rx="6" fill="{P}"/>
  <text x="620" y="417" text-anchor="middle" font-family="Arial" font-size="14" fill="{W}">Consulter la liste</text>
''' + footer()
    save("02_Ami", "HF_Desktop_01_Code_Ami.svg", body)

    body = nav() + f'''
  <text x="80" y="120" font-family="Georgia" font-size="26" fill="{P}">Anniversaire de Client Test</text>
  <text x="80" y="150" font-family="Arial" font-size="13" fill="#666">Mes envies de lecture · Code LC-TEST1234</text>
  <rect x="80" y="180" width="1280" height="420" rx="8" fill="{W}" stroke="{B}"/>
  <text x="120" y="230" font-family="Arial" font-size="12" fill="#666">OUVRAGE</text>
  <text x="520" y="230" font-family="Arial" font-size="12" fill="#666">QTÉ</text>
  <text x="680" y="230" font-family="Arial" font-size="12" fill="#666">PRIX</text>
  <text x="860" y="230" font-family="Arial" font-size="12" fill="#666">STATUT</text>
  <line x1="100" y1="250" x2="1340" y2="250" stroke="{B}"/>
  <text x="120" y="295" font-family="Arial" font-size="14" fill="{P}">Clean Code</text>
  <text x="530" y="295" font-family="Arial" font-size="14" fill="{T}">1</text>
  <text x="680" y="295" font-family="Arial" font-size="14" fill="{T}">49,95 $</text>
  <text x="860" y="295" font-family="Arial" font-size="14" fill="{T}">Disponible</text>
  <rect x="1100" y="275" width="180" height="32" rx="6" fill="{S}"/>
  <text x="1125" y="296" font-family="Arial" font-size="12" fill="{W}">Ajouter au panier</text>
''' + footer()
    save("02_Ami", "HF_Desktop_02_Liste_Ami.svg", body)

    m = f'''
  <rect width="390" height="64" fill="{W}"/><rect y="62" width="390" height="2" fill="{B}"/>
  <text x="20" y="40" font-family="Georgia" font-size="16" fill="{P}">Code ami</text>
  <text x="20" y="110" font-family="Georgia" font-size="22" fill="{P}">Saisie du code</text>
  <rect x="16" y="140" width="358" height="48" rx="6" fill="{W}" stroke="{B}"/>
  <text x="28" y="170" font-family="Arial" font-size="13" fill="#999">LC-TEST1234</text>
  <rect x="16" y="210" width="358" height="44" rx="6" fill="{P}"/>
  <text x="120" y="237" font-family="Arial" font-size="14" fill="{W}">Consulter la liste</text>
  <rect y="790" width="390" height="54" fill="#163528"/>
'''
    save("02_Ami", "HF_Mobile_01_Code_Ami.svg", m, 390, 844)


def admin_screens():
    side = f'''
  <rect y="72" width="240" height="888" fill="#163528"/>
  <text x="24" y="120" font-family="Georgia" font-size="16" fill="{W}">Espace admin</text>
  <rect x="16" y="150" width="208" height="36" rx="6" fill="rgba(255,255,255,0.12)"/>
  <text x="28" y="173" font-family="Arial" font-size="13" fill="{W}">Tableau de bord</text>
  <text x="28" y="220" font-family="Arial" font-size="13" fill="#d7e5dc">Ouvrages</text>
  <text x="28" y="260" font-family="Arial" font-size="13" fill="#d7e5dc">Ajouter un ouvrage</text>
  <text x="28" y="300" font-family="Arial" font-size="13" fill="#d7e5dc">Commandes</text>
  <text x="28" y="340" font-family="Arial" font-size="13" fill="#d7e5dc">Utilisateurs</text>'''

    body = f'''
  <rect width="1440" height="72" fill="{W}"/><rect y="70" width="1440" height="2" fill="{B}"/>
  <text x="40" y="42" font-family="Georgia" font-size="16" fill="{P}">LivresGourmands.net — Admin</text>
  {side}
  <text x="280" y="120" font-family="Georgia" font-size="24" fill="{P}">Tableau de bord</text>
  <text x="280" y="150" font-family="Arial" font-size="13" fill="#666">Connecté en tant qu'administrateur</text>
  <rect x="280" y="180" width="320" height="120" rx="8" fill="{W}" stroke="{B}"/>
  <text x="300" y="220" font-family="Arial" font-size="12" fill="#666">Ouvrages en stock</text>
  <text x="300" y="265" font-family="Arial" font-size="32" fill="{P}">4</text>
  <rect x="620" y="180" width="320" height="120" rx="8" fill="{W}" stroke="{B}"/>
  <text x="640" y="220" font-family="Arial" font-size="12" fill="#666">Commandes visibles</text>
  <text x="640" y="265" font-family="Arial" font-size="32" fill="{P}">1</text>
  <rect x="280" y="340" width="200" height="40" rx="6" fill="{P}"/>
  <text x="310" y="365" font-family="Arial" font-size="13" fill="{W}">Gérer les ouvrages</text>
  <rect x="500" y="340" width="200" height="40" rx="6" fill="{W}" stroke="{P}"/>
  <text x="530" y="365" font-family="Arial" font-size="13" fill="{P}">Voir les commandes</text>
'''
    save("03_Administrateur", "HF_Desktop_01_Dashboard_Admin.svg", body)

    body = f'''
  <rect width="1440" height="72" fill="{W}"/><rect y="70" width="1440" height="2" fill="{B}"/>
  <text x="40" y="42" font-family="Georgia" font-size="16" fill="{P}">LivresGourmands.net — Admin</text>
  {side}
  <text x="280" y="120" font-family="Georgia" font-size="24" fill="{P}">Ouvrages</text>
  <rect x="1180" y="100" width="140" height="36" rx="6" fill="{S}"/>
  <text x="1215" y="123" font-family="Arial" font-size="13" fill="{W}">Ajouter</text>
  <rect x="280" y="160" width="1120" height="520" rx="8" fill="{W}" stroke="{B}"/>
  <text x="310" y="200" font-family="Arial" font-size="12" fill="#666">ID</text>
  <text x="380" y="200" font-family="Arial" font-size="12" fill="#666">TITRE</text>
  <text x="780" y="200" font-family="Arial" font-size="12" fill="#666">PRIX</text>
  <text x="900" y="200" font-family="Arial" font-size="12" fill="#666">STOCK</text>
  <text x="1050" y="200" font-family="Arial" font-size="12" fill="#666">ACTIONS</text>
  <line x1="300" y1="220" x2="1380" y2="220" stroke="{B}"/>
  <text x="310" y="260" font-family="Arial" font-size="13" fill="{T}">1</text>
  <text x="380" y="260" font-family="Arial" font-size="13" fill="{T}">Le Petit Prince</text>
  <text x="780" y="260" font-family="Arial" font-size="13" fill="{T}">14,95 $</text>
  <text x="910" y="260" font-family="Arial" font-size="13" fill="{T}">10</text>
  <rect x="1050" y="242" width="80" height="28" rx="4" fill="{W}" stroke="{P}"/><text x="1065" y="261" font-family="Arial" font-size="11" fill="{P}">Modifier</text>
  <rect x="1145" y="242" width="90" height="28" rx="4" fill="{W}" stroke="#9B2C2C"/><text x="1158" y="261" font-family="Arial" font-size="11" fill="#9B2C2C">Supprimer</text>
  <text x="310" y="310" font-family="Arial" font-size="13" fill="{T}">2</text>
  <text x="380" y="310" font-family="Arial" font-size="13" fill="{T}">Dune</text>
  <text x="780" y="310" font-family="Arial" font-size="13" fill="{T}">24,95 $</text>
  <text x="915" y="310" font-family="Arial" font-size="13" fill="{T}">5</text>
'''
    save("03_Administrateur", "HF_Desktop_02_Liste_ouvrages_Admin.svg", body)

    body = f'''
  <rect width="1440" height="72" fill="{W}"/><rect y="70" width="1440" height="2" fill="{B}"/>
  <text x="40" y="42" font-family="Georgia" font-size="16" fill="{P}">LivresGourmands.net — Admin</text>
  {side}
  <text x="280" y="120" font-family="Georgia" font-size="24" fill="{P}">Ajouter un ouvrage</text>
  <rect x="280" y="150" width="900" height="700" rx="8" fill="{W}" stroke="{B}"/>
  <text x="320" y="200" font-family="Arial" font-size="13" fill="{T}">Titre *</text>
  <rect x="320" y="210" width="800" height="40" rx="6" fill="{W}" stroke="{B}"/>
  <text x="320" y="290" font-family="Arial" font-size="13" fill="{T}">Auteur *</text>
  <rect x="320" y="300" width="800" height="40" rx="6" fill="{W}" stroke="{B}"/>
  <text x="320" y="380" font-family="Arial" font-size="13" fill="{T}">Prix *</text>
  <rect x="320" y="390" width="240" height="40" rx="6" fill="{W}" stroke="{B}"/>
  <text x="580" y="380" font-family="Arial" font-size="13" fill="{T}">Stock *</text>
  <rect x="580" y="390" width="240" height="40" rx="6" fill="{W}" stroke="{B}"/>
  <text x="320" y="470" font-family="Arial" font-size="13" fill="{T}">Catégorie</text>
  <rect x="320" y="480" width="400" height="40" rx="6" fill="{W}" stroke="{B}"/>
  <text x="335" y="505" font-family="Arial" font-size="13" fill="#666">Roman</text>
  <text x="320" y="560" font-family="Arial" font-size="13" fill="{T}">Description</text>
  <rect x="320" y="570" width="800" height="120" rx="6" fill="{W}" stroke="{B}"/>
  <rect x="320" y="720" width="160" height="40" rx="6" fill="{P}"/>
  <text x="355" y="745" font-family="Arial" font-size="13" fill="{W}">Enregistrer</text>
  <rect x="500" y="720" width="120" height="40" rx="6" fill="{W}" stroke="#666"/>
  <text x="530" y="745" font-family="Arial" font-size="13" fill="#666">Annuler</text>
'''
    save("03_Administrateur", "HF_Desktop_03_Formulaire_ouvrage_Admin.svg", body)

    body = f'''
  <rect width="1440" height="72" fill="{W}"/><rect y="70" width="1440" height="2" fill="{B}"/>
  <text x="40" y="42" font-family="Georgia" font-size="16" fill="{P}">LivresGourmands.net — Admin</text>
  {side}
  <text x="280" y="120" font-family="Georgia" font-size="24" fill="{P}">Commandes</text>
  <rect x="280" y="160" width="1120" height="420" rx="8" fill="{W}" stroke="{B}"/>
  <text x="310" y="200" font-family="Arial" font-size="12" fill="#666">ID</text>
  <text x="380" y="200" font-family="Arial" font-size="12" fill="#666">CLIENT</text>
  <text x="560" y="200" font-family="Arial" font-size="12" fill="#666">TOTAL</text>
  <text x="720" y="200" font-family="Arial" font-size="12" fill="#666">DATE</text>
  <text x="960" y="200" font-family="Arial" font-size="12" fill="#666">STATUT</text>
  <line x1="300" y1="220" x2="1380" y2="220" stroke="{B}"/>
  <text x="310" y="260" font-family="Arial" font-size="13" fill="{T}">1</text>
  <text x="390" y="260" font-family="Arial" font-size="13" fill="{T}">4</text>
  <text x="560" y="260" font-family="Arial" font-size="13" fill="{T}">14,95 $</text>
  <text x="720" y="260" font-family="Arial" font-size="13" fill="{T}">2026-10-22</text>
  <rect x="960" y="242" width="160" height="32" rx="4" fill="{W}" stroke="{B}"/>
  <text x="980" y="263" font-family="Arial" font-size="12" fill="{T}">payee ▾</text>
'''
    save("03_Administrateur", "HF_Desktop_04_Commandes_Admin.svg", body)

    m = f'''
  <rect width="390" height="64" fill="{W}"/>
  <text x="16" y="40" font-family="Georgia" font-size="15" fill="{P}">Admin</text>
  <rect x="16" y="90" width="358" height="50" rx="8" fill="#163528"/>
  <text x="30" y="120" font-family="Arial" font-size="13" fill="{W}">Tableau de bord</text>
  <rect x="16" y="160" width="170" height="100" rx="8" fill="{W}" stroke="{B}"/>
  <text x="30" y="200" font-family="Arial" font-size="11" fill="#666">Ouvrages</text>
  <text x="30" y="235" font-family="Arial" font-size="28" fill="{P}">4</text>
  <rect x="204" y="160" width="170" height="100" rx="8" fill="{W}" stroke="{B}"/>
  <text x="218" y="200" font-family="Arial" font-size="11" fill="#666">Commandes</text>
  <text x="218" y="235" font-family="Arial" font-size="28" fill="{P}">1</text>
  <rect x="16" y="290" width="358" height="200" rx="8" fill="{W}" stroke="{B}"/>
  <text x="30" y="330" font-family="Arial" font-size="14" fill="{T}">Raccourcis</text>
  <rect x="30" y="360" width="150" height="36" rx="6" fill="{P}"/>
  <text x="50" y="383" font-family="Arial" font-size="12" fill="{W}">Ouvrages</text>
  <rect x="200" y="360" width="150" height="36" rx="6" fill="{W}" stroke="{P}"/>
  <text x="220" y="383" font-family="Arial" font-size="12" fill="{P}">Commandes</text>
'''
    save("03_Administrateur", "HF_Mobile_01_Dashboard_Admin.svg", m, 390, 844)


def write_interactions():
    (OUT / "INSTRUCTIONS_INTERACTIONS_XD.md").write_text(
        Path(ROOT / "livrables" / "ADOBE_XD_PRET_IMPORT" / "INSTRUCTIONS_INTERACTIONS_XD.md").read_text(encoding="utf-8")
        if (OUT / "INSTRUCTIONS_INTERACTIONS_XD.md").exists()
        else "# Voir livrables/ADOBE_XD_PRET_IMPORT/INSTRUCTIONS_INTERACTIONS_XD.md\n",
        encoding="utf-8",
    )


def main():
    client_screens()
    ami_screens()
    admin_screens()
    # Charte already present
    print("XD detailed screens regenerated")


if __name__ == "__main__":
    main()
