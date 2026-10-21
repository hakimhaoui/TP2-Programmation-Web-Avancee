-- ============================================================
-- Librairie en ligne - Donnees de test
-- A executer apres create_tables.sql
--
-- Comptes de test (mots de passe en clair, ici a titre de test) :
--   admin@librairie.ca       / Admin123!    (administrateur)
--   gestion@librairie.ca     / Gestion123!  (gestionnaire)
--   editeur@librairie.ca     / Editeur123!  (editeur)
--   client@librairie.ca      / Client123!   (client)
-- Les mots de passe sont stockes hashes avec bcrypt.
-- ============================================================
USE librairie;

INSERT INTO users (nom, email, mot_de_passe, role, telephone, adresse) VALUES
('Admin Librairie', 'admin@librairie.ca',
 '$2b$10$uiidbTalGP7Ro..DH90BOeOvflpJcdDzNoRF.mBcqrLhoTlBEaESC', 'administrateur', '514-555-0100', 'Montreal'),
('Gestionnaire Un', 'gestion@librairie.ca',
 '$2b$10$IuQkgx5AhTgiIZ3UsAgYDuDXQ/767epA2SOuIcVQnJ6.WReRkuYWi', 'gestionnaire', '514-555-0101', 'Montreal'),
('Editeur Un', 'editeur@librairie.ca',
 '$2b$10$j5cXvPdi8pgsYN4bWuF6Yu3.56LfKzwMiS2OgT5Tsv8CYMRm4KA1.', 'editeur', '514-555-0102', 'Quebec'),
('Client Test', 'client@librairie.ca',
 '$2b$10$m2UrPCHd6bY.iripypkDJu0.zTCIfMhwqTRrAASFZkiSsvKjt3P4O', 'client', '514-555-0103', 'Laval');

INSERT INTO categories (nom, description) VALUES
('Roman', 'Romans et fictions'),
('Science-Fiction', 'Science-fiction et fantasy'),
('Informatique', 'Programmation et technologies'),
('Histoire', 'Livres d''histoire');

-- created_by = 3 (editeur). L'ouvrage 4 a un stock de 0 :
-- il ne doit PAS apparaitre dans GET /api/ouvrages (affichage public).
INSERT INTO ouvrages
  (titre, auteur, isbn, description, prix, stock, popularite, date_publication, categorie_id, created_by) VALUES
('Le Petit Prince', 'Antoine de Saint-Exupery', '9782070612758', 'Conte philosophique.', 14.95, 10, 50, '1943-04-06', 1, 3),
('Dune', 'Frank Herbert', '9782266154512', 'Roman de science-fiction.', 24.95, 5, 80, '1965-08-01', 2, 3),
('Clean Code', 'Robert C. Martin', '9780132350884', 'Bonnes pratiques de programmation.', 49.95, 7, 65, '2008-08-01', 3, 3),
('Livre en rupture', 'Auteur Test', '9780000000001', 'Ouvrage sans stock (test affichage public).', 9.95, 0, 5, '2020-01-01', 1, 3),
('Histoire du Quebec', 'Jacques Lacoursiere', '9782894480001', 'Survol historique.', 39.95, 3, 10, '2015-05-01', 4, 3);

-- Panier du client (user 4) avec 1 exemplaire de Dune (ouvrage 2)
INSERT INTO panier (user_id) VALUES (4);
INSERT INTO panier_items (panier_id, ouvrage_id, quantite, prix_unitaire) VALUES (1, 2, 1, 24.95);

-- Commande deja payee du client : il a achete le Petit Prince (ouvrage 1),
-- il peut donc lui donner un avis. Sert aussi aux tests d'avis.
INSERT INTO commandes (user_id, statut, total, mode_paiement, reference_paiement)
VALUES (4, 'payee', 14.95, 'simulation', 'SIM-SEED-0001');
INSERT INTO commande_items (commande_id, ouvrage_id, quantite, prix_unitaire)
VALUES (1, 1, 1, 14.95);

-- Liste de cadeaux du client, partageable par son code
INSERT INTO listes_cadeaux (user_id, nom, description, code_partage)
VALUES (4, 'Anniversaire de Client Test', 'Mes envies de lecture', 'LC-TEST1234');
INSERT INTO liste_items (liste_id, ouvrage_id, quantite) VALUES (1, 3, 1);

-- Un avis valide et un commentaire deja valide (visibles publiquement)
INSERT INTO avis (user_id, ouvrage_id, note, titre, contenu)
VALUES (4, 1, 5, 'Excellent', 'Un classique a relire.');
INSERT INTO commentaires (user_id, ouvrage_id, contenu, valide, valide_par, date_validation)
VALUES (4, 1, 'Tres beau livre, je recommande.', 1, 3, NOW());
