# Librairie en ligne — Étape 02 (API REST et MySQL)

**Cours :** Programmation Web avancée — 420-WA6-AG  
**Enseignante :** Kahina TAMAZOUZT  
**Session :** Automne 2026  
**Remise :** 22 octobre 2026, 23 h 59

## 1. Présentation

Ce projet réalise une API REST pour une librairie en ligne. Il permet de gérer les ouvrages, catégories, utilisateurs, paniers, commandes, listes de cadeaux, avis et commentaires. Les comptes utilisent JWT et bcrypt. Les opérations critiques sur le stock sont exécutées dans des transactions MySQL.

## 2. Membres et répartition des tâches

Le projet est réalisé en équipe de **deux étudiants** :

- **Abdelhakim Haoui**
- **Mohammed Amine El Marzouki**

| Membre | Tâches et responsabilités |
| --- | --- |
| **Mohammed Amine El Marzouki** | • Conception et implémentation de la base de données MySQL<br>• Création des tables, relations, contraintes et scripts SQL<br>• Développement de l'authentification JWT et bcrypt<br>• Gestion des rôles et sécurité<br>• Implémentation des commandes, transactions et gestion du stock<br>• Application des règles métier |
| **Abdelhakim Haoui** | • Développement des opérations CRUD des ouvrages et catégories<br>• Tests des endpoints API avec Postman<br>• Préparation du README et de la documentation technique<br>• Vérification des fonctionnalités<br>• Organisation des fichiers et préparation du dépôt GitHub |

> **Note :** cette répartition est **proposée par l'équipe**. Elle devra être **confirmée selon les contributions réellement effectuées** par chaque membre avant la remise.

## 3. Technologies

- Node.js, Express, JavaScript
- MySQL (mysql2/promise, InnoDB)
- JWT (`jsonwebtoken`), bcrypt
- `express-validator`, `dotenv`, `cors`
- Git / GitHub, Postman

## 4. Structure du projet

```text
kahina/
├── backend/
│   ├── config/            # connexion MySQL
│   ├── controllers/       # logique HTTP
│   ├── middleware/        # JWT, rôles, validation, erreurs
│   ├── repositories/      # accès aux tables
│   ├── routes/            # routes /api/...
│   ├── services/          # commandes transactionnelles, listes cadeaux
│   ├── validators/        # vérification des entrées
│   ├── scripts/           # nettoyage des paniers
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── sql/
│   ├── create_database.sql
│   ├── create_tables.sql
│   └── insert_data.sql
├── docs/
│   ├── schema_relationnel.pdf / .png / .dot
│   ├── dictionnaire_donnees.pdf
│   ├── rapport_etape_02.pdf
│   └── VERIFICATION_AVANT_REMISE.md
├── postman/
│   ├── Librairie_Etape02.postman_collection.json
│   └── Librairie_Local.postman_environment.json
├── .gitignore
└── README.md
```

## 5. Installation et exécution (backend)

### Prérequis

Node.js, npm, MySQL et Postman. Il faut que le serveur MySQL soit démarré avant l'API.

### Base MySQL

Dans un terminal avec MySQL accessible :

```bash
mysql -u root -p < sql/create_database.sql
mysql -u root -p < sql/create_tables.sql
mysql -u root -p < sql/insert_data.sql
```

Avec MySQL Workbench, ouvrir et exécuter les trois fichiers dans cet ordre.

**Attention :** `create_tables.sql` contient des `DROP TABLE IF EXISTS`. Le relancer **supprime les anciennes données**.

### Démarrer le serveur

```bash
cd backend
npm install
```

Créer le fichier `backend/.env` à partir de `.env.example` :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TON_MOT_DE_PASSE_MYSQL
DB_NAME=librairie
JWT_SECRET=UNE_LONGUE_CLE_ALEATOIRE_SECRETE
JWT_EXPIRE=24h
PANIER_INACTIF_JOURS=7
```

Puis :

```bash
npm run dev
```

Ou `npm start`. URL : `http://localhost:3000`. Test initial : `GET http://localhost:3000/api/health`.

Si votre MySQL écoute sur un autre port (par exemple 3307), ajuster `DB_PORT`. Ne jamais publier `.env` sur GitHub.

### Frontend

**Aucun frontend n'est présent dans l'archive fournie.** Cette livraison décrit et démarre le backend uniquement. Si un frontend fait partie de l'Étape 01, ses instructions d'exécution devront être ajoutées après son intégration.

## 6. Comptes de démonstration

Le script `sql/insert_data.sql` fournit les comptes suivants **uniquement pour les tests locaux** :

| Rôle | Email | Mot de passe de test |
| --- | --- | --- |
| Administrateur | `admin@librairie.ca` | `Admin123!` |
| Gestionnaire | `gestion@librairie.ca` | `Gestion123!` |
| Éditeur | `editeur@librairie.ca` | `Editeur123!` |
| Client | `client@librairie.ca` | `Client123!` |

Les hash de mots de passe figurent dans la base ; les mots de passe ci-dessus servent aux scénarios de démonstration. **Ne jamais les utiliser en production.**

## 7. Routes de l'API

| Méthode | Route | Accès |
| --- | --- | --- |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/users/me` | JWT |
| GET | `/api/users` | Administrateur |
| PUT | `/api/users/:id` | Propriétaire ou administrateur |
| GET | `/api/categories` | Public |
| POST / PUT / DELETE | `/api/categories` / `/api/categories/:id` | Gestionnaire ou administrateur |
| GET | `/api/ouvrages` | Public, stock supérieur à 0 |
| GET | `/api/ouvrages/:id` | Public |
| POST / PUT | `/api/ouvrages` / `/api/ouvrages/:id` | Éditeur, gestionnaire, administrateur |
| DELETE | `/api/ouvrages/:id` | Gestionnaire ou administrateur |
| GET | `/api/panier` | Client |
| POST | `/api/panier/items` | Client |
| PUT / DELETE | `/api/panier/items/:id` | Client propriétaire |
| POST | `/api/commandes` | Client |
| GET | `/api/commandes` | JWT (client : ses commandes ; gestionnaire/admin : toutes) |
| GET | `/api/commandes/:id` | Propriétaire, gestionnaire, admin |
| PUT | `/api/commandes/:id/status` | Gestionnaire, admin |
| POST | `/api/listes` | Client |
| GET | `/api/listes/:code` | Public, avec code partagé |
| POST | `/api/listes/:id/items` | Propriétaire ou admin |
| POST | `/api/listes/:id/acheter` | Client |
| POST | `/api/ouvrages/:id/avis` | Client ayant acheté |
| POST | `/api/ouvrages/:id/commentaires` | JWT |
| PUT | `/api/commentaires/:id/valider` | Éditeur, gestionnaire, admin |

### Filtres des ouvrages

`GET /api/ouvrages?search=dune&categorie_id=2&tri=popularite&page=1&limit=10`  
Valeurs de `tri` : `popularite`, `prix_asc`, `prix_desc`, `recent`, `titre`.

### Exemple d'inscription

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Client Exemple","email":"exemple@test.ca","mot_de_passe":"MotDePasse123!"}'
```

### Exemple de connexion

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client@librairie.ca","mot_de_passe":"Client123!"}'
```

Copier le champ `token` reçu. Pour une route protégée :

```bash
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer VOTRE_JWT"
```

### Exemple d'ajout au panier

```bash
curl -X POST http://localhost:3000/api/panier/items \
  -H "Authorization: Bearer VOTRE_JWT" \
  -H "Content-Type: application/json" \
  -d '{"ouvrage_id":2,"quantite":1}'
```

### Exemple de création de commande

```bash
curl -X POST http://localhost:3000/api/commandes \
  -H "Authorization: Bearer VOTRE_JWT" \
  -H "Content-Type: application/json" \
  -d '{"mode_paiement":"simulation"}'
```

La commande effectue un **paiement simulé**. Aucun numéro de carte n'est demandé ou stocké.

## 8. Principales règles métier

- Les listes publiques d'ouvrages filtrent les ouvrages dont le stock vaut zéro.
- Une commande utilise une transaction MySQL avec vérification et décrémentation du stock ; si le stock est insuffisant, une erreur est renvoyée.
- Un client ne peut déposer un avis que s'il possède une commande non annulée contenant l'ouvrage. Un seul avis est autorisé par couple client/ouvrage.
- Un nouveau commentaire est non validé ; un rôle autorisé peut le valider ou le rejeter.
- Une liste de cadeaux utilise un code de partage unique.
- Un script séparé permet de supprimer les paniers inactifs.

### Nettoyage des paniers

```bash
cd backend
npm run cleanup:paniers
```

Ce script est manuel. Pour l'automatiser, le planifier avec cron ou le Planificateur de tâches Windows. La durée d'inactivité se configure avec `PANIER_INACTIF_JOURS`.

## 9. Tests Postman

1. Importer `postman/Librairie_Etape02.postman_collection.json`.
2. Importer `postman/Librairie_Local.postman_environment.json`.
3. Sélectionner l'environnement **Librairie - Local**.
4. Démarrer MySQL et le backend.
5. Exécuter d'abord les requêtes `Connexion` pour enregistrer les tokens des quatre rôles.
6. Tester ensuite les routes publiques, le panier, les commandes et les modérations.
7. Pour les requêtes qui créent des ressources, la collection mémorise certains identifiants dans l'environnement.

**Attention :** les demandes POST, PUT et DELETE modifient la base. Réinitialiser les données de test avant une nouvelle campagne si nécessaire.

## 10. Documentation et limites

- `docs/schema_relationnel.pdf` : schéma des tables, PK/FK, relations et cardinalités.
- `docs/dictionnaire_donnees.pdf` : types, contraintes, relations et index.
- `docs/rapport_etape_02.pdf` : justification du modèle, règles métier et limites.
- `docs/VERIFICATION_AVANT_REMISE.md` : points à vérifier avant la remise.

**Limites connues :** le rôle contenu dans un JWT reste valide jusqu'à son expiration ; certaines colonnes proposées dans le sujet (adresse/mode de livraison, utilisateur actif, panier actif) ne sont pas dans le schéma ; aucun frontend n'a été fourni. Le détail public d'un ouvrage en rupture de stock renvoie 404 (le personnel connecté peut toujours le consulter).

## 11. Versionnement et remise

```bash
git init
git add .
git commit -m "Ajout API REST et scripts MySQL"
```

Créer ensuite un dépôt sur GitHub et suivre les commandes fournies par GitHub pour ajouter le remote et pousser la branche. **Ne pas inventer un historique de commits réguliers :** poursuivre avec de vrais commits au fil des corrections/tests.

**URL du dépôt :** https://github.com/hakimhaoui/TP2-Programmation-Web-Avancee

Sur LEA : déposer **un seul ZIP** contenant le projet et les documents, puis indiquer l'URL GitHub. Sur GitHub : publier les fichiers du projet (sans `.env` ni `node_modules/`).
