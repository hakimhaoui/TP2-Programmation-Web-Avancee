# Provenance et droits d’utilisation des images

**Date :** 25 novembre 2026  
**Projet :** LivresGourmands.net — Étape 3 (démo pédagogique)

## Principe

Les couvertures et le bandeau d’accueil sont des **visuels originaux générés pour la démonstration scolaire**.  
Ils **ne reproduisent pas** les jaquettes commerciales des éditeurs. Aucune image d’éditeur, d’Amazon, de Goodreads ou d’un autre étudiant n’a été copiée.

## Inventaire

| Fichier | Usage | Provenance | Droit d’usage |
| --- | --- | --- | --- |
| `frontend/public/covers/petit-prince.jpg` | Couverture démo « Le Petit Prince » | Illustration originale générée pour ce TP | Usage pédagogique / projet académique |
| `frontend/public/covers/dune.jpg` | Couverture démo « Dune » | Illustration originale générée pour ce TP | Usage pédagogique / projet académique |
| `frontend/public/covers/clean-code.jpg` | Couverture démo « Clean Code » | Illustration originale générée pour ce TP | Usage pédagogique / projet académique |
| `frontend/public/covers/histoire-quebec.jpg` | Couverture démo « Histoire du Québec » | Illustration originale générée pour ce TP | Usage pédagogique / projet académique |
| `frontend/public/hero-slider.jpg` | Fond du hero accueil | Illustration originale générée pour ce TP | Usage pédagogique / projet académique |
| `frontend/src/assets/book-placeholder.svg` | Remplacement si `image_url` absent | Asset local du projet | Projet |
| `frontend/src/assets/logo.svg` | Logo site | Asset local du projet | Projet |

## Base de données

Les champs `ouvrages.image_url` pointent vers des chemins relatifs servis par le front Vite (`/covers/...`).  
Exemple : `/covers/dune.jpg` → `http://localhost:5173/covers/dune.jpg`.

## Limites

- Titres et auteurs des ouvrages seed restent ceux de l’étape 2 (données de test).
- Les couvertures sont **stylisées / fictives** pour éviter le plagiat d’œuvres graphiques protégées.
- Ne pas redistribuer ces images comme « vraies » couvertures commerciales.
