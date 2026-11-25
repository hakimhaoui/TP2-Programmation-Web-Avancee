# Interactions exactes à brancher dans Adobe XD

Pour chaque ligne : sélectionne l’élément cliquable → tire une flèche vers l’écran destination → réglages indiqués.

Légende transition recommandée : **Dissolve** 0,3 s (sauf indication).

## Point de départ A — Client

Écran Home XD : `HF_Desktop_01_Accueil_Client`

| Écran départ | Élément cliquable | Écran destination | Type | Transition | Résultat attendu |
| --- | --- | --- | --- | --- | --- |
| Accueil Client | Bouton / zone « Voir catalogue » | Accueil (ancre catalogue) ou Fiche | Tap | Dissolve | Arrive sur les cartes |
| Accueil Client | Carte ouvrage | Fiche ouvrage | Tap | Push Left | Ouvre le détail |
| Accueil Client | Connexion | Connexion | Tap | Dissolve | Formulaire login |
| Accueil Client | Panier | Panier | Tap | Push Left | Voir le panier |
| Fiche ouvrage | + quantité | Fiche ouvrage | Tap | None | Quantité +1 (état) |
| Fiche ouvrage | Ajouter au panier | Panier | Tap | Dissolve | Article ajouté |
| Panier | Modifier quantité | Panier | Tap | None | Total mis à jour |
| Panier | Supprimer | Panier | Tap | None | Ligne retirée |
| Panier | Livraison et règlement | Checkout | Tap | Push Left | Choix livraison |
| Checkout | Confirmer | Confirmation | Tap | Dissolve | Achat simulé OK |
| Confirmation | Accueil | Accueil Client | Tap | Dissolve | Retour catalogue |
| Connexion | Se connecter | Accueil Client | Tap | Dissolve | Session client |

## Point de départ B — Ami

Écran Home XD : `HF_Desktop_01_Code_Ami`

| Écran départ | Élément cliquable | Écran destination | Type | Transition | Résultat attendu |
| --- | --- | --- | --- | --- | --- |
| Code ami | Consulter la liste | Liste cadeaux | Tap | Push Left | Affiche les items |
| Liste cadeaux | Ajouter au panier | Panier Client | Tap | Dissolve | Si connecté client |
| Liste cadeaux | Retour | Code ami | Tap | Dissolve | Nouvelle saisie |

## Point de départ C — Administrateur

Écran Home XD : `HF_Desktop_01_Dashboard_Admin`  
(Prévoir aussi l’écran Connexion avant si tu veux montrer le login admin.)

| Écran départ | Élément cliquable | Écran destination | Type | Transition | Résultat attendu |
| --- | --- | --- | --- | --- | --- |
| Connexion | Se connecter (admin) | Dashboard | Tap | Dissolve | Accès protégé |
| Dashboard | Ouvrages | Liste ouvrages | Tap | Push Left | CRUD liste |
| Liste ouvrages | Ajouter | Formulaire ouvrage | Tap | Push Left | Création |
| Liste ouvrages | Modifier | Formulaire ouvrage | Tap | Push Left | Édition |
| Formulaire | Enregistrer | Liste ouvrages | Tap | Dissolve | Retour liste |
| Dashboard | Commandes | Commandes admin | Tap | Push Left | Suivi commandes |

## Vérification des 3 parcours

Coche après test dans XD Preview :

- [ ] Parcours Client complet (accueil → fiche → panier → checkout → confirmation)
- [ ] Parcours Ami (code → liste)
- [ ] Parcours Admin (dashboard → ouvrages → commandes)

## Révision des écrans et états
Les nouveaux SVG sont des maquettes éditables, pas un prototype XD publié. Utiliser les états séparés plutôt que des liens vers le même écran :

| Départ | Action | Destination |
|---|---|---|
| Fiche ouvrage | + | HF_Desktop_07_Fiche_quantite2 |
| Fiche quantité 2 | Ajouter au panier | HF_Desktop_08_Panier_quantite2 |
| Panier | + | HF_Desktop_08_Panier_quantite2 |
| Panier quantité 2 | − | HF_Desktop_03_Panier_Client |
| Panier / panier quantité 2 | Supprimer | HF_Desktop_09_Panier_vide |
| Panier vide | Catalogue | HF_Desktop_01_Accueil_Client |
| Checkout | Voir paiement externe | HF_Desktop_10_Paiement_externe |
| Paiement externe | Retour | HF_Desktop_04_Checkout_Client |
| Confirmation | Mes commandes | HF_Desktop_11_Mes_commandes |
| Connexion admin | Se connecter | HF_Desktop_01_Dashboard_Admin |

Tester ces transitions dans XD Preview. Ne pas afficher de données bancaires réelles. Les actions natives n'ont pas été branchées dans cette révision.
