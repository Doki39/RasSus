import { readFileSync } from "fs";
import { join } from "path";
import { pool } from "./pool";
import { pocetniJelovnik } from "./seed";

export async function setupDatabase() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL nije postavljen.");
  }

  const schemaPath = join(process.cwd(), "db", "schema.sql");
  const schema = readFileSync(schemaPath, "utf8");
  await pool.query(schema);

  const { rows } = await pool.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM jelovnik",
  );
  if (Number(rows[0].count) > 0) {
    return;
  }

  for (const jelo of pocetniJelovnik) {
    await pool.query(
      "INSERT INTO jelovnik (naziv, kategorija, cijena) VALUES ($1, $2, $3)",
      [jelo.naziv, jelo.kategorija, jelo.cijena],
    );
  }
}
