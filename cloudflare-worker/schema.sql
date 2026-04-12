-- Safe Place Événementiel — Base de données D1
-- Schema des événements

CREATE TABLE IF NOT EXISTS events (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  type         TEXT    NOT NULL DEFAULT 'evenement',
  title        TEXT    NOT NULL DEFAULT '',
  subtitle     TEXT    NOT NULL DEFAULT '',
  description  TEXT    NOT NULL DEFAULT '',
  date         TEXT    DEFAULT NULL,
  date_end     TEXT    DEFAULT NULL,
  weekday      TEXT    NOT NULL DEFAULT '',
  time_start   TEXT    NOT NULL DEFAULT '',
  time_end     TEXT    NOT NULL DEFAULT '',
  location     TEXT    NOT NULL DEFAULT '',
  price_display TEXT   NOT NULL DEFAULT '',
  stripe_link  TEXT    NOT NULL DEFAULT '',
  status       TEXT    NOT NULL DEFAULT 'open',
  extra        TEXT    NOT NULL DEFAULT '{}',
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS reservations (
  id               INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id         INTEGER NOT NULL,
  event_title      TEXT    NOT NULL DEFAULT '',
  prenom           TEXT    NOT NULL DEFAULT '',
  email            TEXT    NOT NULL DEFAULT '',
  telephone        TEXT    NOT NULL DEFAULT '',
  nb_places        INTEGER NOT NULL DEFAULT 1,
  nb_accompagnants INTEGER NOT NULL DEFAULT 0,
  type             TEXT    NOT NULL DEFAULT '',
  status           TEXT    NOT NULL DEFAULT 'pending',
  created_at       TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  form_type  TEXT    NOT NULL DEFAULT 'general',   -- 'general' | 'sur_mesure' | 'collaborateur'
  prenom     TEXT    NOT NULL DEFAULT '',
  nom        TEXT    NOT NULL DEFAULT '',
  email      TEXT    NOT NULL DEFAULT '',
  telephone  TEXT    NOT NULL DEFAULT '',
  sujet      TEXT    NOT NULL DEFAULT '',
  message    TEXT    NOT NULL DEFAULT '',
  extra      TEXT    NOT NULL DEFAULT '{}',        -- champs spécifiques au formulaire
  status     TEXT    NOT NULL DEFAULT 'new',       -- 'new' | 'read' | 'replied'
  created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Événements actuels (agenda avril–juin 2026)
INSERT INTO events (type, title, subtitle, description, date, weekday, time_start, time_end, location, price_display, stripe_link, status, extra) VALUES
(
  'evenement', 'Vide Dressing', '',
  'Un grand vide dressing convivial pour chiner de belles pièces et faire de bonnes affaires. Stands de vente et dépôts-ventes — pour repartir avec des trésors ou vider ses placards avec le sourire.',
  '2026-04-19', 'Dimanche', '', '', 'Lieu à confirmer', '', '', 'open',
  '{"entree_libre":true,"vendeurs":true}'
),
(
  'apero', 'Apéro Créatif', 'Fabrication de magnets pour frigo',
  'Fabrication de magnets pour frigo — viens créer, lâcher prise et partager un verre dans une ambiance douce et conviviale. Chaque participant.e repart avec sa création personnalisée !',
  '2026-04-22', 'Mercredi', '19h', '21h', 'La Kabane de la Plage, Boulogne-sur-Mer', '24€ / personne', '', 'open',
  '{"boisson":true,"adultes_only":true}'
),
(
  'apero', 'Apéro Créatif', 'Personnalisation de miroir',
  'Personnalisation de miroir — ce soir on transforme un miroir en objet unique à ton image. Motifs, couleurs, textures... laisse parler ta créativité autour d''un verre !',
  '2026-05-06', 'Mercredi', '19h', '21h', 'La Kabane de la Plage, Boulogne-sur-Mer', '24€ / personne', '', 'open',
  '{"boisson":true,"adultes_only":true}'
),
(
  'apero', 'Apéro Créatif', 'Personnalisation de planche apéro',
  'Personnalisation de planche apéro — grave, peins et décore ta planche pour en faire une pièce unique. Parfait à offrir ou à garder précieusement. Un verre à la main, bien sûr !',
  '2026-05-20', 'Mercredi', '19h', '21h', 'La Kabane de la Plage, Boulogne-sur-Mer', '24€ / personne', '', 'open',
  '{"boisson":true,"adultes_only":true}'
),
(
  'evenement', 'Marché des Créateurs', '',
  'Un marché convivial qui met à l''honneur les artisans et créateurs locaux. Créations uniques, art de vivre, savoir-faire — viens les découvrir et les soutenir.',
  '2026-05-17', 'Dimanche', '', '', 'La Kabane de la Plage — Promenade San Martin, Boulogne-sur-Mer', '', '', 'open',
  '{"entree_libre":true,"exposants":true}'
),
(
  'evenement', 'Rencontre ton Praticien', '',
  'Un salon du bien-être pour découvrir des praticiens locaux et leurs disciplines — massage, méditation, médecine douce, accompagnement... Viens explorer à ton rythme dans un cadre doux et bienveillant.',
  '2026-06-14', 'Dimanche', '', '', 'Lieu à venir', '', '', 'open',
  '{"coming_soon":true}'
),
(
  'evenement', 'La Tablée', '',
  'Un repas entre inconnus pour créer de vraies rencontres — bonne cuisine, mini jeux et défis pour briser la glace et repartir avec de nouveaux amis. Parce que se faire des amis, ça s''organise.',
  '2026-06-26', 'Vendredi', '', '', 'Lieu à venir', 'Prix à venir', '', 'open',
  '{"coming_soon":true}'
);
