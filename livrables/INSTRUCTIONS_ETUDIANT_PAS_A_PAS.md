# Instructions simples — finaliser la remise (débutant)

Objectif : terminer les livrables manuels pour viser 30/30.  
Les tests techniques sont déjà réussis. **Ne touche pas au code qui marche** sauf si un professeur le demande.

La remise **n’est pas complète** tant que les vrais liens Figma, Adobe XD et la vidéo ne sont pas prêts.

---

## Étape 1 — Ouvre ces dossiers

Ouvre l’Explorateur Windows et va ici :

`C:\Users\2537063\Downloads\Projet_final_-_Etape_3_-_Conception_visuelle_Integration_front-end__back-end\`

Fichiers / dossiers à connaître :

| Quoi | Où |
| --- | --- |
| Wireframes prêts Figma | `livrables\FIGMA_PRET_IMPORT\` |
| Maquettes haute fidélité XD | `livrables\ADOBE_XD_PRET_IMPORT\` |
| PDF conception | `docs\Dossier-conception.pdf` |
| Scénario vidéo | `docs\SCENARIO_DEMONSTRATION.md` |
| Liens à remplir | `livrables\Liens.txt` |
| README projet | `README.md` |

---

## Étape 2 — Figma (critère /2)

1. Ouvre `livrables\FIGMA_PRET_IMPORT\LIRE_MOI_FIGMA.md`.
2. Suis les étapes (créer un fichier Figma, importer Desktop puis Mobile).
3. Clique **Share → Copy link**.
4. Ouvre `livrables\Liens.txt`.
5. Remplace la ligne « À COMPLÉTER » de Figma par ton **vrai lien**.

Tu dois avoir : 21 écrans desktop + 21 écrans mobile.

---

## Étape 3 — Adobe XD (critère /2)

1. Ouvre `livrables\ADOBE_XD_PRET_IMPORT\LIRE_MOI_ADOBE_XD.md`.
2. Importe les maquettes Client, Ami, Administrateur.
3. Branche les clics avec  
   `livrables\ADOBE_XD_PRET_IMPORT\INSTRUCTIONS_INTERACTIONS_XD.md`.
4. Vérifie les **3 parcours** (cases à cocher dans ce fichier).
5. Publie le prototype et copie le **vrai lien**.
6. Colle-le dans `livrables\Liens.txt`.

---

## Étape 4 — Relire le dossier de conception PDF

1. Ouvre `docs\Dossier-conception.pdf`.
2. Vérifie page par page :
   - couverture (noms, cours, enseignante, session)
   - sommaire
   - introduction
   - cahier des charges (sans budget inventé)
   - arborescence
   - wireframes
   - planche / charte
   - maquettes / mockup
   - annexes
3. Si tu vois une faute, note-la et demande une correction du script  
   `docs\generate_dossier_conception.py` puis relance :  
   `python docs\generate_dossier_conception.py`

---

## Étape 5 — Vidéo 4 minutes

1. Ouvre `docs\SCENARIO_DEMONSTRATION.md`.
2. Lis le texte oral à voix haute en t’entraînant.
3. Enregistre l’écran (Xbox Game Bar, OBS, ou ShareX).
4. Ne montre jamais les mots de passe.
5. Ajoute le lien ou le nom du fichier dans `livrables\Liens.txt`.

---

## Étape 6 — GitHub (publication)

Le dossier actuel **n’est pas encore un dépôt Git local**.  
Le dépôt distant déjà connu (étape 2) est :

`https://github.com/hakimhaoui/TP2-Programmation-Web-Avancee`

### Commandes à taper (dans PowerShell)

Place-toi dans le projet :

```powershell
cd "C:\Users\2537063\Downloads\Projet_final_-_Etape_3_-_Conception_visuelle_Integration_front-end__back-end"
```

Initialiser et publier (à faire **une seule fois**, avec ton compte GitHub connecté) :

```powershell
git init
git remote add origin https://github.com/hakimhaoui/TP2-Programmation-Web-Avancee.git
git add .
git status
```

Vérifie que `.env` et `node_modules` **n’apparaissent pas** dans `git status`.

Puis :

```powershell
git commit -m "Etape 3 : frontend React, docs conception et livrables"
git branch -M main
git pull origin main --rebase
git push -u origin main
```

Si `git pull` crée des conflits, arrête-toi et demande de l’aide : **ne fais pas** `push --force` sur main.

Après le push, confirme dans `livrables\Liens.txt` que le lien GitHub est correct.

---

## Étape 7 — Contrôle sécurité avant ZIP

Coche :

- [ ] Pas de dossier `node_modules` dans le ZIP
- [ ] Pas de fichier `.env` dans le ZIP
- [ ] Pas de mot de passe dans le README montré à l’écran de la vidéo
- [ ] `livrables\Liens.txt` contient seulement des **vrais** liens

Le `.gitignore` ignore déjà `node_modules/` et `.env`.

---

## Étape 8 — Construire le ZIP final (seulement à la fin)

Structure attendue du ZIP Léa :

```text
LivresGourmands_Etape3_Remise.zip
├── Liens.txt                 (Figma + XD + GitHub + vidéo)
├── Dossier-conception.pdf
├── README.md                 (optionnel mais recommandé)
└── (optionnel) video.mp4     si tu déposes le fichier plutôt qu’un lien
```

Le code complet reste surtout sur **GitHub** (avec le dossier `frontend/`).

### Quand créer le ZIP ?

Seulement quand :

1. Lien Figma réel collé  
2. Lien Adobe XD réel collé  
3. Vidéo réelle prête  
4. GitHub à jour avec `frontend/`

Sinon, garde le statut **provisoire / incomplet**.

Un modèle de structure est décrit dans  
`livrables\STRUCTURE_ZIP_FINAL\LIRE_MOI_ZIP.md`.

---

## Étape 9 — Auto-contrôle des 17 critères

| # | Critère | Que faire pour le valider |
| --- | --- | --- |
| 1 | Wireframes Figma | Import + lien Share |
| 2 | Prototype Adobe XD | Interactions + 3 parcours + lien |
| 3 | Dossier conception | PDF relu |
| 4–13 | Front / API / états | Déjà validés par les tests |
| 14–15 | Responsive / a11y | Déjà testés ; montre-les dans la vidéo |
| 16 | GitHub + README | Push + README |
| 17 | ZIP + liens + vidéo | ZIP final avec vrais liens |

Tant que 1, 2, 17 (liens/vidéo) manquent, **ne dis pas que la remise est complète**.

---

## Aide rapide si tu es perdu

1. Commence par **Figma** (plus simple).  
2. Ensuite **Adobe XD**.  
3. Ensuite la **vidéo**.  
4. Ensuite **GitHub**.  
5. Ensuite le **ZIP**.
