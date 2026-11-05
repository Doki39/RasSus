import type { Jelo, Narudzba, NovaNarudzba, StavkaNarudzbe } from "../types";
import { pool } from "./pool";

function mapJelo(row: {
  id: number;
  naziv: string;
  kategorija: string;
  cijena: string;
}): Jelo {
  return {
    id: row.id,
    naziv: row.naziv,
    kategorija: row.kategorija,
    cijena: Number(row.cijena),
  };
}

export async function getJelovnik(): Promise<Jelo[]> {
  const { rows } = await pool.query(
    "SELECT id, naziv, kategorija, cijena FROM jelovnik ORDER BY id",
  );
  return rows.map(mapJelo);
}

export async function getJeloById(id: number): Promise<Jelo | null> {
  const { rows } = await pool.query(
    "SELECT id, naziv, kategorija, cijena FROM jelovnik WHERE id = $1",
    [id],
  );
  if (!rows[0]) {
    return null;
  }
  return mapJelo(rows[0]);
}

export async function getNarudzbe(): Promise<Narudzba[]> {
  const { rows: narudzbeRows } = await pool.query<{
    id: number;
    ime_stola: string;
    ukupno: string;
  }>("SELECT id, ime_stola, ukupno FROM narudzbe ORDER BY id DESC");

  const { rows: stavkeRows } = await pool.query<{
    narudzba_id: number;
    jelo_id: number;
    naziv: string;
    kolicina: number;
    cijena: string;
    ukupno: string;
  }>(
    `SELECT narudzba_id, jelo_id, naziv, kolicina, cijena, ukupno
     FROM narudzba_stavke
     ORDER BY id`,
  );

  const stavkePoNarudzbi = new Map<number, StavkaNarudzbe[]>();
  for (const row of stavkeRows) {
    const lista = stavkePoNarudzbi.get(row.narudzba_id) ?? [];
    lista.push({
      jeloId: row.jelo_id,
      naziv: row.naziv,
      kolicina: row.kolicina,
      cijena: Number(row.cijena),
      ukupno: Number(row.ukupno),
    });
    stavkePoNarudzbi.set(row.narudzba_id, lista);
  }

  return narudzbeRows.map((n) => ({
    id: n.id,
    ime_stola: n.ime_stola,
    ukupno: Number(n.ukupno),
    stavke: stavkePoNarudzbi.get(n.id) ?? [],
  }));
}

export async function createNarudzba(tijelo: NovaNarudzba): Promise<Narudzba | null> {
  const imeStola = tijelo.ime_stola.trim();
  const jelovnik = await getJelovnik();
  const jelovnikMap = new Map(jelovnik.map((j) => [j.id, j]));

  const stavke = tijelo.stavke
    .filter((s) => Number(s.kolicina) > 0)
    .map((s) => {
      const jelo = jelovnikMap.get(Number(s.jeloId));
      if (!jelo) {
        return null;
      }
      const kolicina = Number(s.kolicina);
      return {
        jeloId: jelo.id,
        naziv: jelo.naziv,
        kolicina,
        cijena: jelo.cijena,
        ukupno: jelo.cijena * kolicina,
      };
    })
    .filter((s): s is StavkaNarudzbe => s !== null);

  if (stavke.length === 0) {
    return null;
  }

  const ukupno = stavke.reduce((sum, s) => sum + s.ukupno, 0);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const narudzbaResult = await client.query<{ id: number }>(
      "INSERT INTO narudzbe (ime_stola, ukupno) VALUES ($1, $2) RETURNING id",
      [imeStola, ukupno],
    );
    const narudzbaId = narudzbaResult.rows[0].id;

    for (const stavka of stavke) {
      await client.query(
        `INSERT INTO narudzba_stavke (narudzba_id, jelo_id, naziv, kolicina, cijena, ukupno)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          narudzbaId,
          stavka.jeloId,
          stavka.naziv,
          stavka.kolicina,
          stavka.cijena,
          stavka.ukupno,
        ],
      );
    }

    await client.query("COMMIT");

    return {
      id: narudzbaId,
      ime_stola: imeStola,
      stavke,
      ukupno,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function pingDatabase(): Promise<boolean> {
  await pool.query("SELECT 1");
  return true;
}
