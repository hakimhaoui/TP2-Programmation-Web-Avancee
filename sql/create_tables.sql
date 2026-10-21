-- ============================================================
-- Librairie en ligne - Creation des tables
-- A executer apres create_database.sql
-- ============================================================
USE librairie;

-- On supprime dans l'ordre inverse des dependances (re-execution propre)
DROP TABLE IF EXISTS commentaires;
DROP TABLE IF EXISTS avis;
DROP TABLE IF EXISTS liste_items;
DROP TABLE IF EXISTS listes_cadeaux;
DROP TABLE IF EXISTS commande_items;
DROP TABLE IF EXISTS commandes;
DROP TABLE IF EXISTS panier_items;
DROP TABLE IF EXISTS panier;
DROP TABLE IF EXISTS ouvrages;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- ------------------------------------------------------------
-- 1. users : client, editeur, gestionnaire, administrateur
-- ------------------------------------------------------------
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  nom           VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  mot_de_passe  VARCHAR(255) NOT NULL,
  role          ENUM('client','editeur','gestionnaire','administrateur')
                NOT NULL DEFAULT 'client',
  telephone     VARCHAR(20) NULL,
  adresse       VARCHAR(255) NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 2. categories
-- ------------------------------------------------------------
CREATE TABLE categories (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nom         VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 3. ouvrages
-- ------------------------------------------------------------
CREATE TABLE ouvrages (
  id               INT AUTO_INCREMENT PRIMARY KEY,
  titre            VARCHAR(200) NOT NULL,
  auteur           VARCHAR(150) NOT NULL,
  isbn             VARCHAR(20) NULL UNIQUE,
  description      TEXT NULL,
  prix             DECIMAL(10,2) NOT NULL,
  stock            INT NOT NULL DEFAULT 0,
  popularite       INT NOT NULL DEFAULT 0,
  image_url        VARCHAR(255) NULL,
  date_publication DATE NULL,
  categorie_id     INT NULL,
  created_by       INT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_ouvrages_prix CHECK (prix >= 0),
  CONSTRAINT chk_ouvrages_stock CHECK (stock >= 0),
  CONSTRAINT chk_ouvrages_popularite CHECK (popularite >= 0),
  CONSTRAINT fk_ouvrages_categorie FOREIGN KEY (categorie_id)
    REFERENCES categories(id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT fk_ouvrages_created_by FOREIGN KEY (created_by)
    REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_ouvrages_titre (titre),
  INDEX idx_ouvrages_auteur (auteur),
  INDEX idx_ouvrages_categorie (categorie_id),
  INDEX idx_ouvrages_popularite (popularite)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 4. panier (un seul panier par utilisateur)
-- ------------------------------------------------------------
CREATE TABLE panier (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL UNIQUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_panier_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 5. panier_items
-- ------------------------------------------------------------
CREATE TABLE panier_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  panier_id     INT NOT NULL,
  ouvrage_id    INT NOT NULL,
  quantite      INT NOT NULL DEFAULT 1,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_panier_items_quantite CHECK (quantite > 0),
  CONSTRAINT chk_panier_items_prix CHECK (prix_unitaire >= 0),
  CONSTRAINT uq_panier_item UNIQUE (panier_id, ouvrage_id),
  CONSTRAINT fk_panier_items_panier FOREIGN KEY (panier_id)
    REFERENCES panier(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_panier_items_ouvrage FOREIGN KEY (ouvrage_id)
    REFERENCES ouvrages(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_panier_items_ouvrage (ouvrage_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 6. commandes (paiement simule : aucune donnee bancaire)
-- ------------------------------------------------------------
CREATE TABLE commandes (
  id                 INT AUTO_INCREMENT PRIMARY KEY,
  user_id            INT NOT NULL,
  statut             ENUM('en_attente','payee','expediee','livree','annulee')
                     NOT NULL DEFAULT 'en_attente',
  total              DECIMAL(10,2) NOT NULL DEFAULT 0,
  mode_paiement      VARCHAR(30) NOT NULL DEFAULT 'simulation',
  reference_paiement VARCHAR(50) NULL,
  created_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_commandes_total CHECK (total >= 0),
  CONSTRAINT fk_commandes_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_commandes_user (user_id),
  INDEX idx_commandes_statut (statut)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 7. commande_items
-- ------------------------------------------------------------
CREATE TABLE commande_items (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  commande_id   INT NOT NULL,
  ouvrage_id    INT NOT NULL,
  quantite      INT NOT NULL,
  prix_unitaire DECIMAL(10,2) NOT NULL,
  CONSTRAINT chk_commande_items_quantite CHECK (quantite > 0),
  CONSTRAINT chk_commande_items_prix CHECK (prix_unitaire >= 0),
  CONSTRAINT fk_commande_items_commande FOREIGN KEY (commande_id)
    REFERENCES commandes(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_commande_items_ouvrage FOREIGN KEY (ouvrage_id)
    REFERENCES ouvrages(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_commande_items_ouvrage (ouvrage_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 8. listes_cadeaux (code de partage unique)
-- ------------------------------------------------------------
CREATE TABLE listes_cadeaux (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  nom          VARCHAR(150) NOT NULL,
  description  TEXT NULL,
  code_partage VARCHAR(20) NOT NULL UNIQUE,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_listes_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 9. liste_items
-- ------------------------------------------------------------
CREATE TABLE liste_items (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  liste_id   INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite   INT NOT NULL DEFAULT 1,
  achete     TINYINT(1) NOT NULL DEFAULT 0,
  achete_par INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_liste_items_quantite CHECK (quantite > 0),
  CONSTRAINT uq_liste_item UNIQUE (liste_id, ouvrage_id),
  CONSTRAINT fk_liste_items_liste FOREIGN KEY (liste_id)
    REFERENCES listes_cadeaux(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_liste_items_ouvrage FOREIGN KEY (ouvrage_id)
    REFERENCES ouvrages(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_liste_items_achete_par FOREIGN KEY (achete_par)
    REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 10. avis (note 1 a 5, un avis par client et par ouvrage)
-- ------------------------------------------------------------
CREATE TABLE avis (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  ouvrage_id INT NOT NULL,
  note       TINYINT NOT NULL,
  titre      VARCHAR(150) NULL,
  contenu    TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_avis_note CHECK (note BETWEEN 1 AND 5),
  CONSTRAINT uq_avis_user_ouvrage UNIQUE (user_id, ouvrage_id),
  CONSTRAINT fk_avis_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_avis_ouvrage FOREIGN KEY (ouvrage_id)
    REFERENCES ouvrages(id) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX idx_avis_ouvrage (ouvrage_id)
) ENGINE=InnoDB;

-- ------------------------------------------------------------
-- 11. commentaires (valide = 0 a la soumission)
-- ------------------------------------------------------------
CREATE TABLE commentaires (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  user_id         INT NOT NULL,
  ouvrage_id      INT NOT NULL,
  contenu         TEXT NOT NULL,
  valide          TINYINT(1) NOT NULL DEFAULT 0,
  valide_par      INT NULL,
  date_validation DATETIME NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_commentaires_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_commentaires_ouvrage FOREIGN KEY (ouvrage_id)
    REFERENCES ouvrages(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_commentaires_valide_par FOREIGN KEY (valide_par)
    REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_commentaires_ouvrage_valide (ouvrage_id, valide)
) ENGINE=InnoDB;
