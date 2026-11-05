import cors from "cors";
import express from "express";
import { jelovnik, narudzbe } from "./data";
import type { NovaNarudzba } from "./types";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    servis: "Restoran RasSus API",
    verzija: "1.0.0",
    rute: ["/health", "/jelovnik", "/jelovnik/:id", "/narudzbe"],
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok", vrijeme: new Date().toISOString() });
});

app.get("/jelovnik", (_req, res) => {
  res.json(jelovnik);
});

app.get("/jelovnik/:id", (req, res) => {
  const jelo = jelovnik.find((stavka) => stavka.id === Number(req.params.id));
  if (!jelo) {
    res.status(404).json({ greska: "Stavka nije pronađena." });
    return;
  }
  res.json(jelo);
});

app.get("/narudzbe", (_req, res) => {
  res.json(narudzbe);
});

app.post("/narudzbe", (req, res) => {
  const tijelo = req.body as NovaNarudzba;
  const imeStola = tijelo.ime_stola?.trim();

  if (!imeStola || !Array.isArray(tijelo.stavke)) {
    res.status(400).json({ greska: "Neispravna narudžba." });
    return;
  }

  const stavke = tijelo.stavke
    .filter((s) => Number(s.kolicina) > 0)
    .map((s) => {
      const jelo = jelovnik.find((stavka) => stavka.id === Number(s.jeloId));
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
    .filter((s): s is NonNullable<typeof s> => s !== null);

  if (stavke.length === 0) {
    res.status(400).json({ greska: "Odaberi barem jednu stavku." });
    return;
  }

  const narudzba = {
    id: narudzbe.length + 1,
    ime_stola: imeStola,
    stavke,
    ukupno: stavke.reduce((sum, s) => sum + s.ukupno, 0),
  };

  narudzbe.push(narudzba);
  res.status(201).json(narudzba);
});

app.listen(port, () => {
  console.log(`API sluša na portu ${port}`);
});
