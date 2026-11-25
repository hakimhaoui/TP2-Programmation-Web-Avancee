# Plan d’implémentation — Étape 3 LivresGourmands.net

Ordre d’exécution. L’énoncé officiel prime sur toute suggestion.

## Déjà fait (Phase 1)

- [x] Lecture des 3 PDF (extraction texte)
- [x] Import du backend Étape 2 dans le workspace
- [x] Audit technique (`docs/AUDIT_INITIAL.md`)
- [x] Identification endpoints, rôles, stock, JWT
- [x] Tentative MySQL / tests préalables (blocage credentials)

## Suite ordonnée

### A. Infrastructure frontend (Phases 2–3)

1. Créer `frontend/` avec Vite + React
2. Installer : react-router-dom, bootstrap, axios, bootstrap-icons
3. Structure : components, pages/admin, context, services, hooks, utils, styles, tests
4. Charte CSS (vert #214E3B, terracotta #B45335, fond #F8F5EF)
5. Logo SVG local, image placeholder
6. Composants réutilisables listés dans l’énoncé étudiant

### B. Services API (Phase 9 en parallèle)

1. `services/api.js` + interceptors JWT
2. `bookService`, `authService`, `cartService`, `orderService`, `giftListService`, `adminService`
3. `.env.example` avec `VITE_API_URL`

### C. Auth + panier (Phases 6–7)

1. `AuthContext` (login, logout, token, rôles, expiration)
2. `CartContext` + localStorage isolé par utilisateur
3. `ProtectedRoute` + pages Connexion / Inscription

### D. Pages client (Phases 4–5, 10)

1. Layout (Navbar, Footer)
2. Accueil (carrousel, filtres, cartes, search)
3. Fiche produit
4. Panier
5. Listes cadeaux (création + consultation code)
6. Pages checkout maquettées (simulation, sans faux paiement réel)

### E. Admin (Phase 8)

1. `AdminLayout`
2. Dashboard, CRUD ouvrages, commandes, utilisateurs si API

### F. Design docs (Phases 11–13)

1. Wireframes SVG desktop/mobile + inventaire
2. Instructions Figma / ressources XD + `INTERACTIONS_XD.md`
3. Dossier de conception (source HTML/MD + PDF)

### G. Qualité (Phases 14–16)

1. Responsive + a11y
2. Vitest + RTL ; Playwright si possible
3. `docs/RAPPORT_VERIFICATION.md` (résultats réels)

### H. Remise (Phases 17–20)

1. README racine mis à jour
2. Scénario vidéo
3. Dossier livrables + ZIP provisoire si liens manquants
4. `docs/EVALUATION_FINALE.md` honnête /30

## Dépendances bloquantes

| Blocage | Impact | Action |
| --- | --- | --- |
| Mot de passe MySQL root inconnu | API + tests T01–T40 partiels | Demander credentials ; documenter NOT RUN |
| Pas de compte Figma/XD lié | Critères 1–2 | Ressources + procédure ; ne pas inventer de liens |
| Vidéo non enregistrée | Critère 17 | Scénario écrit uniquement |

## Règles permanentes

- Ne pas supprimer le travail Étape 2
- Ne pas inventer endpoints / colonnes / rôles
- Ne pas masquer les erreurs API
- Ne pas commit/push sans demande
- Ne pas `npm audit fix --force`
