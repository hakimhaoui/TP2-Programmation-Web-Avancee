# Scénario vidéo — 4 minutes (texte oral / sous-titres)

**Statut :** vidéo finale `livrables/video/LivresGourmands_Etape3_Demonstration.mp4`  
**Durée cible :** ~4 minutes · **1080p** · sous-titres français (si pas de voix off)  
**À ne jamais montrer :** fichiers `.env`, mots de passe en clair, jetons JWT, interface Cursor.

## Préparer avant d’enregistrer

1. Démarrer MySQL + API (`backend` → `npm run dev`).
2. Démarrer le front (`frontend` → `npm run dev`).
3. Ouvrir Figma maquettes.
4. Ouvrir `docs/Dossier-conception.pdf`.
5. Comptes seed prêts (ne pas afficher le mot de passe à l’écran) :
   - client@librairie.ca
   - admin@librairie.ca

## Liens Figma officiels

- Maquettes : https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV  

## Minute par minute

### 0:00 – 0:20 — Présentation
« Bonjour. Nous sommes Abdelhakim Haoui et Mohammed Amine El Marzouki.  
Voici notre projet LivresGourmands.net pour l’étape 3 du cours 420-WA6-AG.  
Nous allons montrer les maquettes Figma, le dossier de conception, puis le site React relié à l’API. »

### 0:20 – 0:50 — Figma (wireframes)
« Voici nos wireframes Figma.  
À gauche, la version ordinateur. À droite, la version mobile.  
On retrouve l’accueil, la fiche produit, le panier et l’espace administrateur. »

### 0:50 – 1:20 — Dossier de conception (suite wireframes / PDF)
« On parcourt rapidement les écrans clés dans Figma, puis on ouvre le dossier PDF. »

### 1:20 – 1:45 — Dossier de conception
« Voici le dossier de conception PDF.  
Il suit la structure du modèle fourni : introduction, cahier des charges, arborescence, wireframes, planche de tendance et charte graphique. »

### 1:45 – 2:20 — Accueil React + API
« Voici le site React.  
Le logo et la navigation sont visibles.  
Les ouvrages affichés viennent réellement de l’API `/api/ouvrages`.  
On voit les prix, les stocks et les catégories. »

### 2:20 – 2:50 — Fiche produit + panier
« J’ouvre une fiche produit.  
J’ajoute au panier, je modifie la quantité.  
J’actualise la page : le panier est toujours là grâce à localStorage. »

### 2:50 – 3:30 — Administrateur
« Je me connecte en administrateur.  
Voici le tableau de bord, la liste des ouvrages, le formulaire CRUD, et la consultation des commandes.  
Les droits sont aussi vérifiés côté serveur. »

### 3:30 – 3:50 — Responsive
« Je réduis la fenêtre.  
Sur mobile, le menu hamburger apparaît et les cartes s’empilent correctement. »

### 3:50 – 4:00 — Conclusion
« Merci. Le code est sur GitHub, le dossier de conception est fourni, et les liens Figma (maquettes + prototype) sont dans le fichier Liens.txt. »

## Après l’enregistrement

1. Déposer `LivresGourmands_Etape3_Demonstration.mp4` (Bureau + `livrables/video/`).
2. Mettre à jour `livrables/Liens.txt`.
3. Vérifier qu’aucun secret n’apparaît à l’écran.
