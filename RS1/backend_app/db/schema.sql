CREATE TABLE IF NOT EXISTS jelovnik (
  id SERIAL PRIMARY KEY,
  naziv TEXT NOT NULL,
  kategorija TEXT NOT NULL,
  cijena NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS narudzbe (
  id SERIAL PRIMARY KEY,
  ime_stola TEXT NOT NULL,
  ukupno NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS narudzba_stavke (
  id SERIAL PRIMARY KEY,
  narudzba_id INTEGER NOT NULL REFERENCES narudzbe (id) ON DELETE CASCADE,
  jelo_id INTEGER NOT NULL REFERENCES jelovnik (id),
  naziv TEXT NOT NULL,
  kolicina INTEGER NOT NULL CHECK (kolicina > 0),
  cijena NUMERIC(10, 2) NOT NULL,
  ukupno NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_narudzba_stavke_narudzba_id ON narudzba_stavke (narudzba_id);
