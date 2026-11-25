# LivresGourmands.net — Étapes 2 et 3

**Cours :** Programmation Web avancée — 420-WA6-AG  
**Enseignante :** Kahina Tamazouzt  
**Session :** Automne 2026  
**Remise étape 3 :** 26 novembre 2026, 23 h 59 (Léa)

API REST (étape 2) + front-end React (étape 3) pour une librairie en ligne.

## Équipe

| Membre | Rôles |
| --- | --- |
| **Abdelhakim Haoui** | Front-end React, documentation, tests |
| **Mohammed Amine El Marzouki** | MySQL, JWT, commandes / stock (étape 2) |

## Technologies

- **Front :** React, Vite, Bootstrap, Axios, Context API, localStorage, React Router  
- **Back :** Node.js, Express, MySQL, JWT, bcrypt  
- **Tests :** Vitest, Playwright  

## Prérequis

- Node.js LTS + npm  
- MySQL 8 démarré  
- Sur cette machine de développement : **MySQL écoute le port `3307`** (mot de passe root vide)  

## Installation back-end

```bash
cd backend
npm install
copy .env.example .env
```

Dans `backend/.env` (exemple local) :

```env
PORT=3000
DB_HOST=127.0.0.1
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=librairie
JWT_SECRET=choisir_une_cle_longue
```

Créer / peupler la base (adapter le port si besoin) :

```bash
mysql -u root -P 3307 -h 127.0.0.1 < sql/create_database.sql
mysql -u root -P 3307 -h 127.0.0.1 librairie < sql/create_tables.sql
mysql -u root -P 3307 -h 127.0.0.1 librairie < sql/insert_data.sql
```

> `create_tables.sql` contient des `DROP TABLE` : ne pas l’exécuter en production.

```bash
npm run dev
# Vérifier : http://localhost:3000/api/health
```

## Installation front-end

```bash
cd frontend
npm install
copy .env.example .env
```

Dans `frontend/.env` :

```env
VITE_API_URL=http://localhost:3000
```

```bash
npm run dev
# http://localhost:5173
```

Autres commandes front :

```bash
npm run build
npm run test
npm run test:cart:node
npm run test:e2e
```

## Comptes de démonstration (seed)

| Rôle | Email | Mot de passe |
| --- | --- | --- |
| Administrateur | admin@librairie.ca | Admin123! |
| Gestionnaire | gestion@librairie.ca | Gestion123! |
| Éditeur | editeur@librairie.ca | Editeur123! |
| Client | client@librairie.ca | Client123! |

Liste cadeaux de test : `LC-TEST1234`.

## Architecture

```text
/
├── backend/     # API Express (étape 2)
├── frontend/    # React Vite (étape 3)
├── sql/         # Scripts MySQL
├── docs/        # Conception, vérifications, captures
├── postman/     # Collection étape 2
└── livrables/   # Liens de remise
```

## Fonctionnalités (étape 3)

- Accueil, recherche, catégories, carrousel, catalogue API  
- Fiche produit, panier (Context + localStorage), checkout simulé  
- Listes cadeaux (client + consultation par code)  
- Espace admin (ouvrages CRUD, commandes, utilisateurs selon rôle)  
- Messages d’erreur en français  

## Liens de conception

- **Figma maquettes (42 écrans) :** https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV  
- **Adobe XD :**

## Vidéo de démonstration

**Statut : terminée.**  
Fichier : `LivresGourmands_Etape3_Demonstration.mp4` (remise Léa / ZIP final)  
~4 min 47 s, 1080p, sous-titres français incrustés.

## Dépôt GitHub

https://github.com/hakimhaoui/TP2-Programmation-Web-Avancee

## Limites

- Données seed variées (héritage étape 2) ; identité visuelle LivresGourmands.  
- Paiement : simulation API uniquement.  
- Page « mot de passe oublié » : maquette (pas d’endpoint API).  
