# Interactions Adobe XD — LivresGourmands.net

Prototype haute fidélité à réaliser dans Adobe XD à partir des maquettes React / assets de `docs/design/`.

**Statut :** ressources et spécifications prêtes. **Aucun fichier `.xd` natif ni lien cloud inventé** — Adobe XD n’est pas automatisé dans cet environnement.

## Points de départ (3 parcours)

| Point de départ | Écran initial | Rôle |
| --- | --- | --- |
| A — Client | Accueil | client / visiteur |
| B — Ami | Saisie code personnel | ami (pas un rôle JWT) |
| C — Administrateur | Connexion admin | administrateur |

## Tableau des interactions

| Écran de départ | Élément cliquable | Écran destination | Type | Transition | Résultat attendu | Rôle |
| --- | --- | --- | --- | --- | --- | --- |
| Accueil | Logo | Accueil | Tap | Dissolve 0,2 s | Retour haut de page | Tous |
| Accueil | Champ recherche + bouton | Résultats recherche | Tap | Push gauche | Affiche résultats filtrés | Tous |
| Accueil | Filtre catégorie | Accueil (catalogue filtré) | Tap | None | Cartes mises à jour | Tous |
| Accueil | Carte ouvrage | Fiche ouvrage | Tap | Push gauche | Détails produit | Tous |
| Accueil | Connexion | Connexion | Tap | Dissolve | Formulaire login | Visiteur |
| Accueil | Panier | Panier | Tap | Push gauche | Liste articles | Client |
| Fiche ouvrage | + / − quantité | Fiche ouvrage | Tap | None | Quantité mise à jour | Client |
| Fiche ouvrage | Ajouter au panier | Panier (ou toast) | Tap | Dissolve | Article ajouté | Client |
| Panier | Modifier quantité | Panier | Tap | None | Sous-total recalculé | Client |
| Panier | Supprimer | Panier | Tap | None | Article retiré | Client |
| Panier | Livraison et règlement | Livraison / règlement | Tap | Push | Choix livraison | Client |
| Livraison | Paiement externe | Paiement externe | Tap | Slide up | Maquette bancaire | Client |
| Livraison | Confirmer commande | Confirmation | Tap | Dissolve | Commande simulée | Client |
| Accueil | Listes cadeaux | Saisie code | Tap | Push | Formulaire code | Ami/Tous |
| Saisie code | Consulter | Consultation cadeaux | Tap | Push | Liste items | Ami |
| Consultation cadeaux | Ajouter au panier | Panier | Tap | Dissolve | Item ajouté si client | Ami→Client |
| Panier | Créer liste cadeaux | Création liste | Tap | Push | Formulaire + code | Client |
| Connexion | Se connecter (admin) | Dashboard admin | Tap | Dissolve | Accès protégé | Admin |
| Dashboard | Ouvrages | Liste ouvrages | Tap | Push | CRUD liste | Admin |
| Liste ouvrages | Ajouter | Formulaire ouvrage | Tap | Push | Création | Admin |
| Liste ouvrages | Modifier | Formulaire ouvrage | Tap | Push | Édition | Admin |
| Liste ouvrages | Supprimer | Modale confirmation | Tap | Overlay | Confirmation | Admin |
| Dashboard | Commandes | Commandes admin | Tap | Push | Liste commandes | Admin |

## Procédure manuelle Adobe XD

1. Ouvrir Adobe XD (desktop).
2. Créer un document **Web** 1440×1024 et un artboard **Mobile** 390×844.
3. Importer les SVG haute fidélité de `livrables/ADOBE_XD_PRET_IMPORT/` (interfaces détaillées alignées sur React).
4. Vérifier chaque écran, bouton et formulaire des 3 parcours (Client, Ami, Admin).
5. Mode Prototype : relier les hotspots selon le tableau ci-dessus.
6. Définir 3 home artboards (Client, Ami, Admin).
7. Partager un lien XD **réel** et le coller dans `livrables/Liens.txt` (ne pas considérer le prototype comme terminé sans ce lien).

## Ressources importables

- **Maquettes haute fidélité détaillées (prioritaire)** : `livrables/ADOBE_XD_PRET_IMPORT/01_Client/`, `02_Ami/`, `03_Administrateur/`
- Wireframes structurels : `docs/design/wireframes/desktop/*.svg` et `mobile/*.svg`
- Assets : `livrables/ADOBE_XD_PRET_IMPORT/04_Assets/` + `frontend/src/assets/logo.svg`
- Charte : `frontend/src/styles/theme.css` + `livrables/ADOBE_XD_PRET_IMPORT/05_Couleurs_Typo/`
- Captures React réelles : `docs/design/captures/`
