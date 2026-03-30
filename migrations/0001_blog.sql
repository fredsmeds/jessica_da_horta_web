CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  cover_image TEXT NOT NULL DEFAULT '',
  category_id INTEGER REFERENCES categories(id),
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

INSERT OR IGNORE INTO categories (slug, name) VALUES
  ('formacoes', 'Formações'),
  ('tutoriais', 'Tutoriais'),
  ('conhecimento-botanico', 'Conhecimento Botânico'),
  ('cuidados-manutencao', 'Cuidados & Manutenção'),
  ('jardins-de-sequeiro', 'Jardins de Sequeiro'),
  ('plantas-mediterranicas', 'Plantas Mediterrânicas'),
  ('microflorestas-urbanas', 'Microflorestas Urbanas'),
  ('noticias', 'Notícias');
