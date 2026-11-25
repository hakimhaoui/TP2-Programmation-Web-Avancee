# Comment créer le prototype Adobe XD (débutant)

## Contenu de ce dossier

| Dossier | Contenu |
| --- | --- |
| `01_Client/` | Maquettes haute fidélité du parcours client |
| `02_Ami/` | Maquettes haute fidélité du parcours ami |
| `03_Administrateur/` | Maquettes haute fidélité du parcours admin |
| `04_Assets/` | Logo, placeholder, planche |
| `05_Couleurs_Typo/` | Charte couleurs / polices |

## Étapes dans Adobe XD

1. Ouvre **Adobe XD**.
2. Crée un document **Web** 1440 × 1024.
3. Importe les SVG de `01_Client/` (File → Import).
4. Crée aussi des artboards **Mobile** 390 × 844 et importe les fichiers `HF_Mobile_*.svg`.
5. Répète pour `02_Ami/` et `03_Administrateur/`.
6. Définis **3 points de départ** (Home) :
   - Client → `HF_Desktop_01_Accueil_Client`
   - Ami → `HF_Desktop_01_Code_Ami`
   - Admin → `HF_Desktop_01_Dashboard_Admin`
7. Passe en mode **Prototype** (onglet en haut).
8. Relie les écrans avec les interactions du fichier `INSTRUCTIONS_INTERACTIONS_XD.md` (dans ce même dossier).
9. Clique **Share → Create link** (ou Publier le prototype).
10. Colle le lien **réel** dans `livrables/Liens.txt`.

## Important

- Ne renomme jamais un SVG ou un HTML en `.xd`.
- Un prototype React ne remplace pas Adobe XD pour ce cours.
- Sans lien XD réel, le critère n’est pas terminé.
