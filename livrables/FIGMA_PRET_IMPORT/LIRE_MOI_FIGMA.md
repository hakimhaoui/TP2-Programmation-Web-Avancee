# Remplacer les maquettes dans Figma (fichier existant)

**Ne crée pas un nouveau fichier Figma.**  
Utilise le fichier déjà créé :

https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV

Les SVG de ce dossier ont été **régénérés** pour coller au site React réel  
(logo LG, librairie en ligne, hero, carrousel, catalogue, panier, admin…).

## Contenu

| Dossier | Contenu |
| --- | --- |
| `01_Desktop_1440/` | 21 wireframes ordinateur |
| `02_Mobile_390/` | 21 wireframes téléphone |
| `03_Composants/` | Logo LG |
| `04_Inventaire/` | Liste des 42 écrans |

## Étapes (mettre à jour le Figma existant)

1. Ouvre le lien Figma ci-dessus.
2. Dans chaque page (Desktop / Mobile), **supprime** les anciens cadres incorrects (ou déplace-les hors cadre).
3. Menu **File → Place image / Place** (ou glisser-déposer) :
   - tous les SVG de `01_Desktop_1440/` dans la page Desktop ;
   - tous les SVG de `02_Mobile_390/` dans la page Mobile.
4. Aligne-les dans l’ordre 01 → 21.
5. Pour le **prototype** : mode Prototype → reconnecte les hotspots des 3 parcours (Client, Ami, Admin) comme avant.
6. **Share** → vérifie que le lien est accessible à l’enseignante.
7. Les liens dans `livrables/Liens.txt` restent les mêmes (pas de nouveau fichier).

## Important

- Style = **wireframes** (gris / blanc), pas haute fidélité colorée.
- Structure = pages React du projet (accueil, fiche, panier, admin…).
- Sans mise à jour dans le fichier Figma cloud, Léa voit encore l’ancienne version.
