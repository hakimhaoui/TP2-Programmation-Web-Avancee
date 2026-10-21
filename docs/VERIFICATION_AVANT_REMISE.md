# Vérification avant remise — Étape 02

Cette feuille est une **analyse statique** des fichiers fournis, pas un procès-verbal de tests MySQL réussis.

## Vérifications constatées

- [x] 11 tables SQL définies dans `create_tables.sql`, avec PK et FK.
- [x] Routes Express regroupées dans `backend/routes/`.
- [x] Middleware JWT, rôles, `express-validator` et gestion centralisée des erreurs présents.
- [x] Authentification par `bcrypt` et création de JWT implémentées dans le code.
- [x] Transaction + `SELECT ... FOR UPDATE` dans `commandeService.js`.
- [x] Contrôle d'achat préalable à l'avis dans `avisRepository.js`.
- [x] Validation des commentaires et nettoyage des paniers présents.
- [x] Validation de la syntaxe JavaScript avec `node --check` sur les fichiers backend de l'archive.

## Corrections / décisions recommandées pour Cursor

1. **Affichage public :** `ouvrageRepository.findById` ne filtre pas le stock à zéro. **Corrigé le 21 octobre 2026 :** le détail public `GET /api/ouvrages/:id` renvoie désormais 404 pour un ouvrage en rupture de stock (le personnel connecté — editeur, gestionnaire, administrateur — peut toujours le consulter pour le gérer).
2. **Comparaison avec l'Étape 01 :** le diagramme original n'était pas dans le ZIP. Vérifier si les attributs supplémentaires attendus sont absents (notamment `users.actif`, `panier.actif`, `commandes.adresse_livraison`, `mode_livraison`, `payment_provider_id`). Le sujet propose des champs et certains choix sont indicatifs : confirmer la conformité avec le cahier des charges et le schéma de l'Étape 01.
3. **Rôles JWT :** le rôle est pris dans le token et n'est pas rechargé depuis la base à chaque requête. Un ancien JWT reste actif après changement de rôle jusqu'à son expiration.
4. **Achat de liste de cadeaux :** l'opération réduit le stock et marque l'article acheté, mais ne crée pas de ligne dans `commandes`/`commande_items` ; cet achat ne permet donc pas ensuite d'écrire un avis selon la règle actuelle.
5. **Rapport / README :** les deux membres (Abdelhakim Haoui et Mohammed Amine El Marzouki) sont inscrits dans le README ; renseigner la répartition réelle des tâches et l'URL GitHub avant la remise.
6. **Frontend :** aucun dossier frontend dans le fichier source ; si l'Étape 01 comporte un frontend requis, l'ajouter et documenter son démarrage.

## Tests à faire sur ton ordinateur avec MySQL + Postman

- [ ] Démarrer MySQL, appliquer les trois scripts SQL sans erreur.
- [ ] `npm install`, `npm run dev` et `GET /api/health`.
- [ ] Vérifier les 4 connexions et le stockage bcrypt ; aucune information secrète ne doit apparaître en réponse.
- [ ] Vérifier CRUD catégories / ouvrages et les refus d'accès 401/403.
- [x] Vérifier que le livre en rupture (`id=4` dans les données de démonstration) n'apparaît pas dans le catalogue public **et** le détail public (corrigé, puis vérifié par tests automatisés le 21 octobre 2026).
- [ ] Ajouter 1 livre au panier, commander, vérifier commande/items et décrémentation du stock en SQL.
- [ ] Tester un stock insuffisant et vérifier qu'aucune commande partielle n'est créée.
- [ ] Vérifier l'avis autorisé après achat, et rejeté sans achat.
- [ ] Vérifier commentaire non visible avant approbation, puis visible après validation.
- [ ] Tester partage et achat d'une liste de cadeaux.
- [ ] Tester le script de nettoyage des paniers inactifs.
- [ ] Prendre des captures Postman/MySQL si demandées, après exécution réelle.
- [ ] Mettre les vrais noms et tâches, lien GitHub ; pousser le projet sans `.env` ni `node_modules`.

## Publication

Le ZIP de livraison est assaini : **aucun `.env` ni `node_modules/`** ne doit y figurer. Si un secret réel a déjà été partagé ou publié, le changer avant de mettre le projet sur GitHub.
