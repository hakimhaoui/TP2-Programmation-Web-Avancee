# LivresGourmands.net — Étape 3

**Cours :** Programmation Web avancée — 420-WA6-AG  
**Enseignante :** Kahina Tamazouzt  
**Session :** Automne 2026  
**Remise :** 26 novembre 2026, 23 h 59 (Léa)

Conception visuelle + intégration front-end React connectée à l’API REST de l’étape 2.

## Membres de l’équipe

| Membre | Rôles principaux |
| --- | --- |
| **Abdelhakim Haoui** | Front-end React, tests Postman (étape 2), documentation |
| **Mohammed Amine El Marzouki** | Base MySQL, JWT, commandes / stock (étape 2) |

## Technologies

- **Front :** React, Vite, Bootstrap, Bootstrap Icons, Axios, Context API, localStorage, React Router
- **Back :** Node.js, Express, MySQL, JWT, bcrypt
- **Qualité :** Vitest, React Testing Library

## Prérequis

- Node.js LTS + npm
- MySQL 8 (service démarré)
- Navigateur moderne

## Installation back-end

```bash
cd backend
npm install
copy .env.example .env   # Windows
# Éditer DB_PASSWORD, JWT_SECRET, DB_PORT
# Sur cette machine de développement : DB_PORT=3307 (mot de passe root vide)
```

### MySQL

```bash
mysql -u root -p < sql/create_database.sql
mysql -u root -p < sql/create_tables.sql
mysql -u root -p < sql/insert_data.sql
```

> `create_tables.sql` contient des `DROP TABLE` : ne l’exécutez pas sur une base de production.

```bash
npm run dev
# http://localhost:3000/api/health
```

## Installation front-end

```bash
cd frontend
npm install
copy .env.example .env
# VITE_API_URL=http://localhost:3000
npm run dev
# http://localhost:5173
```

Build production : `npm run build`  
Tests : `npm run test`

## Comptes de démonstration (seed)

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Administrateur | admin@librairie.ca | Admin123! |
| Gestionnaire | gestion@librairie.ca | Gestion123! |
| Éditeur | editeur@librairie.ca | Editeur123! |
| Client | client@librairie.ca | Client123! |

Liste cadeaux de test : code `LC-TEST1234`.

## Architecture

```text
/
├── backend/          # API Express (étape 2, conservée)
├── frontend/         # React Vite (étape 3)
│   └── src/
│       ├── components/
│       ├── pages/ (+ admin/)
│       ├── context/  # Auth + Cart
│       ├── services/ # Axios
│       ├── styles/
│       └── utils/
├── sql/
├── docs/             # Audit, plan, conception, vérif, design/
├── postman/
└── livrables/        # Liens + ZIP de remise
```

## Fonctionnalités implémentées

- Accueil : recherche, catégories, carrousel, cartes via `GET /api/ouvrages`
- Fiche produit dynamique (stock, avis, commentaires, quantité)
- Panier Context API + localStorage (isolation par compte, JSON corrompu géré)
- Auth JWT (connexion / inscription / déconnexion / ProtectedRoute)
- Dashboard admin : ouvrages CRUD, commandes, utilisateurs (admin)
- Listes cadeaux (création client + consultation par code)
- Checkout avec synchronisation panier API + commande simulée
- Gestion d’erreurs HTTP en français

## Routes API principales

Voir le détail dans `docs/AUDIT_INITIAL.md`. Préfixe : `/api/...`  
Exemple : `GET /api/ouvrages?search=dune&categorie_id=2&tri=popularite`

## Espace administrateur

1. Connexion avec un compte `editeur`, `gestionnaire` ou `administrateur`
2. Menu **Admin** → tableau de bord
3. Droits DELETE ouvrages / update statuts commandes : gestionnaire ou administrateur
4. Liste utilisateurs : administrateur uniquement  
La protection React **complète** mais ne remplace pas les middlewares serveur.

## Tests réellement exécutés (24 nov. 2026)

| Commande | Résultat |
| --- | --- |
| `frontend` `npm run test:cart:node` | **7/7 PASS** |
| `frontend` `npm run test` | **13/13 PASS** |
| `frontend` `npm run build` | **PASS** |
| `frontend` `npm run test:e2e` | **28/28 PASS** |
| `frontend` `npm run capture:live` | **PASS** → `docs/captures-reelles/` |
| API + MySQL `:3307` | PASS — `/api/health` OK |

Détail : `docs/RAPPORT_VERIFICATION.md`.

## Livrables design

| Livrable | Emplacement | Statut |
| --- | --- | --- |
| Dossier de conception PDF | `docs/Dossier-conception.pdf` | 21 pages + captures Playwright live |
| Wireframes Figma (42) | https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV | Lien réel |
| Prototype interactif Figma | https://www.figma.com/proto/nDpTL4OngsUY3hvtL7VznV/LivresGourmands.net-%E2%80%93-%C3%89tape-3?node-id=0-1&t=fRl4HC7UrcVBkHtB-1 | 20 écrans, 43 interactions ; remplace Adobe XD (accepté) |
| Pack import Figma local | `livrables/FIGMA_PRET_IMPORT/` | SVG locaux |
| Captures live | `docs/captures-reelles/` | Générées via `npm run capture:live` |
| Liens Figma / GitHub / vidéo | `livrables/Liens.txt` | Figma + proto OK ; vidéo à compléter |
| Scénario vidéo | `docs/SCENARIO_DEMONSTRATION.md` | Prêt ; vidéo non enregistrée ici |

Dépôt GitHub étape 2 indiqué : https://github.com/hakimhaoui/TP2-Programmation-Web-Avancee  
(à mettre à jour avec le dossier `frontend/` lorsque l’équipe poussera les changements).

## Limites connues

- Les données seed ne sont pas toutes culinaires (héritage étape 2) ; l’identité visuelle est LivresGourmands.
- Sans mot de passe MySQL valide, l’API ne démarre pas sur cette machine.
- Prototype interactif fourni dans Figma (remplace Adobe XD, accepté par l’enseignante). Vidéo encore à finaliser.
- Paiement : simulation API uniquement (aucun Stripe obligatoire).
- Page « mot de passe oublié » : maquette (endpoint absent de l’API).

## Documentation complémentaire

- `docs/AUDIT_INITIAL.md`
- `docs/PLAN_IMPLEMENTATION.md`
- `docs/EVALUATION_FINALE.md` (estimation ≠ note officielle)
- `APPLIQUER_CORRECTIFS.md` (consigne d’intégration du ZIP correctifs)

## Correctif de vérification intégré

- Figma maquettes : https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV (42 wireframes).
- Prototype Figma (remplace Adobe XD) : 20 écrans, 43 interactions, parcours Client / Ami / Administrateur.
- Panier : store isolé par compte (`cartStore.js`) + `npm run test:cart:node`.
- Captures réelles : `npm run capture:live` (API + front démarrés, MySQL 3307).
- PDF : captures live intégrées dans `docs/Dossier-conception.pdf`.
- Restent à finaliser : vidéo, push GitHub, ZIP Léa.
