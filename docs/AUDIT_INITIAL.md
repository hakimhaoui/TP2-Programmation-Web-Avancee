# Audit initial — LivresGourmands.net (Étape 3)

**Date :** 24 novembre 2026  
**Cours :** 420-WA6-AG — Programmation Web avancée  
**Enseignante :** Kahina Tamazouzt  
**Équipe vérifiée :** Abdelhakim Haoui, Mohammed Amine El Marzouki  
**Dépôt GitHub indiqué (étape 2) :** https://github.com/hakimhaoui/TP2-Programmation-Web-Avancee  

---

## 1. État du workspace au démarrage

Le dossier de travail Étape 3 ne contenait **que** les trois PDF de référence :

1. `Ennoncé Etape 3 - Conception visuelle et Integration front-end back-end.pdf`
2. `Etape 3 Introduction au maquettage - projet Final.pdf`
3. `Dossier-conception-bonnevaux.pdf`

Aucun `frontend/`, aucun `backend/`, aucun `package.json` n’étaient présents dans ce workspace.

**Action réalisée :** reprise non destructive du livrable Étape 2 situé dans  
`C:\Users\2537063\Downloads\TP2_Etape02_Haoui_ElMarzouki`  
(copie de `backend/`, `sql/`, `docs/`, `postman/`, `README.md`, `.gitignore` — **sans** `node_modules`, **sans** exposition de secrets dans la documentation).

Un prototype React Étape 1 existe séparément (`AbdelhakimHaouiStudentTasks`) : React + Vite + React Router **sans** Bootstrap ni Axios. Il n’est **pas** le frontend attendu pour l’étape 3.

---

## 2. Documents officiels (extraction texte)

| Document | Pages | Extraction | Notes visuelles |
| --- | --- | --- | --- |
| Énoncé Étape 3 | 5 | OK (`docs_extracted/Ennonce_Etape3.txt`) | Grille /30 lisible |
| Introduction au maquettage | 7 | OK | Les captures d’écrans exemples ne sont pas extractibles en texte |
| Dossier Chloé Bonnevaux | 27 | Partielle | Structure modèle OK ; couleurs/images/budget WordPress **à ne pas copier** |

### Exigences prioritaires (énoncé)

**Livrables :** ZIP (liens Figma + XD + PDF conception), dossier `frontend/`, React structuré, lien GitHub, vidéo démo, README.

**Pages React minimales :**

1. Accueil (nav, catégories, carrousel, cartes, filtres)
2. Produit (détails dynamiques + avis + ajouter au panier)
3. Panier (Context API + localStorage)
4. Dashboard admin (CRUD ouvrages, commandes, routes protégées)
5. Accessibilité / responsive

**API :** Axios, `GET /api/ouvrages`, gestion d’erreurs claire, sync panier API possible.

---

## 3. Backend existant (Étape 2) — à conserver

### Technologies

- Node.js, Express 4.19, mysql2, JWT, bcrypt, express-validator, cors, dotenv
- Port par défaut : **3000**
- Base : **`librairie`**

### Structure

```
backend/
  config/db.js
  controllers/ (auth, avis, categorie, commande, liste, ouvrage, panier, user)
  middleware/ (auth, roles, validate, errorHandler)
  repositories/
  routes/
  services/ (commandeService, listeService)
  validators/
  app.js, server.js
```

### Scripts npm backend

| Script | Présent | Remarque |
| --- | --- | --- |
| `start` / `dev` | Oui | `node` / `node --watch` |
| `test` / `lint` | **Non** | Aucun test automatisé Étape 2 |
| `cleanup:paniers` | Oui | |

### Rôles réellement utilisés (ENUM MySQL)

| Rôle | Usage |
| --- | --- |
| `client` | Panier, commandes, listes, avis |
| `editeur` | CRUD ouvrages (pas DELETE), validation commentaires |
| `gestionnaire` | CRUD + DELETE ouvrages/catégories, commandes |
| `administrateur` | Tout + liste utilisateurs |

**Pas de rôle `staff` ni `ami` en base.**  
« Ami » = parcours métier via **code de partage** d’une liste de cadeaux (`GET /api/listes/:code`), pas un rôle JWT.

### Endpoints vérifiés dans le code

| Méthode | Route | Accès |
| --- | --- | --- |
| GET | `/` | Public |
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public (rôle forcé `client`) |
| POST | `/api/auth/login` | Public |
| GET | `/api/users/me` | JWT |
| GET | `/api/users` | administrateur |
| PUT | `/api/users/:id` | propriétaire ou admin |
| GET | `/api/categories` | Public |
| POST/PUT/DELETE | `/api/categories[/:id]` | gestionnaire, administrateur |
| GET | `/api/ouvrages` | Public, **stock > 0** |
| GET | `/api/ouvrages/:id` | Public ; stock 0 → 404 sauf personnel |
| POST/PUT | `/api/ouvrages[/:id]` | editeur, gestionnaire, administrateur |
| DELETE | `/api/ouvrages/:id` | gestionnaire, administrateur |
| POST | `/api/ouvrages/:id/avis` | client ayant acheté |
| POST | `/api/ouvrages/:id/commentaires` | JWT (rôles listés) |
| PUT | `/api/commentaires/:id/valider` | editeur+ |
| GET/POST/PUT/DELETE | `/api/panier...` | **client uniquement** |
| POST/GET/PUT | `/api/commandes...` | client / staff selon route |
| POST/GET/POST | `/api/listes...` | client / public code |

Filtres ouvrages : `search`, `categorie_id`, `categorie`, `tri` (`popularite|prix_asc|prix_desc|recent|titre`), `page`, `limit`.

Réponse liste typique :

```json
{ "page": 1, "limit": 20, "resultats": N, "ouvrages": [ /* ... */ ] }
```

Champs ouvrage utiles : `id`, `titre`, `auteur`, `isbn`, `description`, `prix`, `stock`, `popularite`, `image_url`, `date_publication`, `categorie_id`, `categorie_nom`, `note_moyenne`, `nombre_avis`, `avis[]`, `commentaires[]`.

### Règles métier stock

- Liste publique : `stock > 0` uniquement.
- Détail public : stock ≤ 0 → **404** (sauf editeur/gestionnaire/admin).
- Panier : quantité totale ≤ stock, sinon **409**.
- Commande : transaction MySQL décrémente le stock (service dédié).
- Seed : ouvrage « Livre en rupture » (stock 0) pour tester le masquage.

### Authentification JWT

- Header : `Authorization: Bearer <token>`
- Payload : `{ id, email, role }`
- Messages : 401 « Authentification requise » / « Token invalide ou expire »
- Secrets : `.env` (non versionné) — **jamais** exposés au frontend.

### Comptes de démo (seed SQL)

| Email | Mot de passe | Rôle |
| --- | --- | --- |
| admin@librairie.ca | Admin123! | administrateur |
| gestion@librairie.ca | Gestion123! | gestionnaire |
| editeur@librairie.ca | Editeur123! | editeur |
| client@librairie.ca | Client123! | client |

Code liste cadeaux seed : `LC-TEST1234`.

---

## 4. Données seed vs marque LivresGourmands

Les catégories seed (`Roman`, `Science-Fiction`, `Informatique`, `Histoire`) et titres ne sont **pas** culinaires.  
Le frontend portera l’identité **LivresGourmands.net** ; les données affichées resteront celles de l’API (pas de faux catalogue JS).  
Évolution possible via CRUD admin (sans écraser la base de production).

---

## 5. Frontend avant Étape 3

| Élément | État |
| --- | --- |
| Dossier `frontend/` attendu | **Absent** |
| React + Bootstrap + Axios + Context + localStorage + Router | **À créer** |
| Charte graphique projet | Non définie dans le dépôt ; palette proposée dans le brief étudiant |

---

## 6. Tests exécutés avant modification

| Test | Résultat |
| --- | --- |
| Présence scripts `npm test` backend | **Aucun** |
| `npm install` backend | OK (avertissements bcrypt / audit connus) |
| Connexion MySQL | **FAIL** — service `MySQL80` écoute sur **3306** ; `.env` avait `DB_PORT=3307` et `DB_PASSWORD` vide ; `Access denied for user 'root'@'localhost'` |
| `GET /api/ouvrages` live | **NOT RUN** (API non démarrable sans credentials MySQL valides) |

**Blocage documenté :** fournir le mot de passe MySQL root (ou un utilisateur dédié) dans `backend/.env` pour débloquer T01–T05 et suivants.

Port corrigé localement vers `3306` dans la copie workspace ; mot de passe toujours manquant.

---

## 7. CORS / ports / préfixes

- CORS ouvert (`app.use(cors())`) — OK pour Vite (ex. `http://localhost:5173`).
- Préfixe API unique : `/api/...` — le client Axios devra utiliser `VITE_API_URL=http://localhost:3000` **sans** doubler `/api`.
- Images : champ `image_url` souvent null dans le seed → **image de remplacement locale** obligatoire.

---

## 8. Sécurité (constat initial)

- `.gitignore` exclut déjà `node_modules/` et `.env`.
- Pas de Stripe dans ce backend (paiement **simulé**).
- Requêtes SQL paramétrées via mysql2 (repositories).
- Panier et commandes vérifient la propriété utilisateur.

---

## 9. Synthèse des écarts pour l’Étape 3

| Critère grille | État initial |
| --- | --- |
| Wireframes Figma | Non fournis |
| Prototype Adobe XD | Non fourni |
| Dossier de conception | À produire (modèle Bonnevaux) |
| Structure frontend | Absente |
| Accueil / produit / panier / admin | Absents |
| Axios + `/api/ouvrages` | Absents |
| Context + localStorage | Absents |
| Responsive / a11y | À faire |
| GitHub / README / ZIP / vidéo | Partiels (README étape 2 seulement) |

---

## 10. Décisions d’implémentation (sans invention)

1. **Ne pas reconstruire** le backend Étape 2.
2. Créer `frontend/` React + Vite + Bootstrap + Axios.
3. Panier : Context + localStorage **obligatoires** ; sync optionnelle avec `/api/panier` pour rôle `client`.
4. Admin : routes protégées pour `administrateur` (et affichage CRUD compatible editeur/gestionnaire selon API).
5. Ami : pages liste cadeaux via code (`/api/listes/:code`), pas un rôle inventé.
6. Aucun faux endpoint, aucune fausse colonne MySQL.
7. Livrables Figma/XD : ressources SVG + instructions si les outils cloud ne sont pas liés ; **ne jamais inventer d’URL**.
