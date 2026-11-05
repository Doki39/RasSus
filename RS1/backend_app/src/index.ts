import cors from "cors";
import express from "express";
import {
  createNarudzba,
  getJeloById,
  getJelovnik,
  getNarudzbe,
  pingDatabase,
} from "./db/repository";
import { setupDatabase } from "./db/setup";
import type { NovaNarudzba } from "./types";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    servis: "Restoran RasSus API",
    verzija: "1.0.0",
    baza: "postgresql",
    rute: ["/health", "/jelovnik", "/jelovnik/:id", "/narudzbe"],
  });
});

app.get("/health", async (_req, res) => {
  try {
    await pingDatabase();
    res.json({ status: "ok", db: "connected", vrijeme: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: "error", db: "disconnected", vrijeme: new Date().toISOString() });
  }
});

app.get("/jelovnik", async (_req, res) => {
  try {
    res.json(await getJelovnik());
  } catch {
    res.status(500).json({ greska: "Greška pri dohvaćanju jelovnika." });
  }
});

app.get("/jelovnik/:id", async (req, res) => {
  try {
    const jelo = await getJeloById(Number(req.params.id));
    if (!jelo) {
      res.status(404).json({ greska: "Stavka nije pronađena." });
      return;
    }
    res.json(jelo);
  } catch {
    res.status(500).json({ greska: "Greška pri dohvaćanju stavke." });
  }
});

app.get("/narudzbe", async (_req, res) => {
  try {
    res.json(await getNarudzbe());
  } catch {
    res.status(500).json({ greska: "Greška pri dohvaćanju narudžbi." });
  }
});

app.post("/narudzbe", async (req, res) => {
  const tijelo = req.body as NovaNarudzba;
  const imeStola = tijelo.ime_stola?.trim();

  if (!imeStola || !Array.isArray(tijelo.stavke)) {
    res.status(400).json({ greska: "Neispravna narudžba." });
    return;
  }

  try {
    const narudzba = await createNarudzba({ ime_stola: imeStola, stavke: tijelo.stavke });
    if (!narudzba) {
      res.status(400).json({ greska: "Odaberi barem jednu stavku." });
      return;
    }
    res.status(201).json(narudzba);
  } catch {
    res.status(500).json({ greska: "Greška pri spremanju narudžbe." });
  }
});

async function start() {
  await setupDatabase();
  app.listen(port, () => {
    console.log(`API sluša na portu ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
