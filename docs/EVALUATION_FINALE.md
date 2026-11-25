# Évaluation finale estimée — Étape 3 (/30)

**Date :** 25 novembre 2026  
**Important :** estimation honnête. **Ce n’est pas la note officielle.**

| # | Critère | Max | Preuve / état | Points estimés |
| --- | --- | ---: | --- | ---: |
| 1 | Wireframes Figma | 2 | [Lien réel](https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV) — **42 wireframes** | **2,0** |
| 2 | Prototype interactif | 2 |  |  |
| 3 | Dossier de conception | 2 | PDF 21 pages, captures Playwright live intégrées | **2,0** |
| 4 | Structure projet | 2 | `frontend/` + `backend/` conservés | **2,0** |
| 5 | Page d’accueil | 2 | e2e T06–T08 PASS + capture live | **2,0** |
| 6 | Page produit | 2 | e2e T09 PASS + capture live | **2,0** |
| 7 | Panier dynamique | 2 | `test:cart:node` 7/7 + Vitest + e2e T11–T17 | **2,0** |
| 8 | Dashboard admin | 2 | e2e T28–T32 PASS + captures admin | **2,0** |
| 9 | Axios | 2 | Services + e2e API | **2,0** |
| 10 | `/api/ouvrages` | 2 | Health + catalogue + e2e | **2,0** |
| 11 | Gestion erreurs | 2 | Messages FR + e2e login invalide | **2,0** |
| 12 | Context API | 2 | Auth + Cart (`useSyncExternalStore`) | **2,0** |
| 13 | localStorage | 2 | Isolation comptes testée (Node + Vitest + e2e) | **2,0** |
| 14 | Responsive | 1 | e2e T35–T37 + captures 390/768/1440 | **1,0** |
| 15 | Accessibilité | 1 | Labels, focus, messages textuels — non audit WCAG formel | **0,5–1,0** |
| 16 | GitHub & README | 1 | README à jour ; **push étape 3 à confirmer** | **0,5** |
| 17 | ZIP, liens, vidéo | 1 | Figma + vidéo MP4 + ZIP Léa prêts | **1,0** |

## Total estimé aujourd’hui : **≈ 27–28 / 30**

### Liens Figma (officiels)

- Maquettes : https://www.figma.com/design/nDpTL4OngsUY3hvtL7VznV  
- Adobe XD :  


### Preuves techniques exécutées le 24 nov. 2026

- `npm run test:cart:node` → 7/7 PASS  
- `npm run test` → 13/13 PASS  
- `npm run build` → PASS  
- `npm run test:e2e` → 28/28 PASS  
- `npm run capture:live` → 24 captures dans `docs/captures-reelles/`  
- MySQL **3307** + API `/api/health` OK  

### Remise

ZIP Léa préparé (`LivresGourmands_Etape3_REMISE_FINALE.zip`).  
Reste : vérifier le partage Figma, confirmer le push GitHub étape 3, déposer sur Léa avant le 26 nov. 2026 23 h 59.
