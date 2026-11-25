# Commandes Git pour publier l’étape 3

## Dépôt distant déjà connu

https://github.com/hakimhaoui/TP2-Programmation-Web-Avancee

> Vérifie que tu as les droits d’écriture sur ce dépôt.  
> Aucun autre lien GitHub n’a été inventé.

## Première publication depuis ce dossier

```powershell
cd "C:\Users\2537063\Downloads\Projet_final_-_Etape_3_-_Conception_visuelle_Integration_front-end__back-end"

git init
git remote add origin https://github.com/hakimhaoui/TP2-Programmation-Web-Avancee.git

git add .
git status
```

Contrôle obligatoire avant commit :

- `.env` ne doit **pas** être listé
- `node_modules` ne doit **pas** être listé

```powershell
git commit -m "Etape 3 : integration React, conception et livrables"
git branch -M main
git pull origin main --rebase
git push -u origin main
```

## Si le dépôt distant a déjà de l’historique

Préfère cloner le dépôt dans un autre dossier, puis copier `frontend/`, `docs/`, `livrables/` sans `.env`, puis commit/push depuis le clone.

## Interdit

- `git push --force` sur `main`
- commit de secrets
- inventer une autre URL GitHub
