import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { API_URL, dohvatiHealth, dohvatiJelovnik, dohvatiNarudzbe, posaljiNarudzbu } from "./api";
import { normalizirajNarudzbe } from "./narudzbe";
import type { Health, Jelo, Narudzba } from "./types";
import "./App.css";

const REDOSLIJED_KATEGORIJA = ["Predjelo", "Glavno jelo", "Desert", "Piće"];

function App() {
  const [jelovnik, setJelovnik] = useState<Jelo[]>([]);
  const [narudzbe, setNarudzbe] = useState<Narudzba[]>([]);
  const [health, setHealth] = useState<Health | null>(null);
  const [greska, setGreska] = useState("");
  const [imeStola, setImeStola] = useState("");
  const [kolicine, setKolicine] = useState<Record<number, number>>({});

  const grupe = useMemo(() => {
    const mapa = new Map<string, Jelo[]>();
    for (const jelo of jelovnik) {
      const lista = mapa.get(jelo.kategorija) ?? [];
      lista.push(jelo);
      mapa.set(jelo.kategorija, lista);
    }
    return REDOSLIJED_KATEGORIJA.filter((k) => mapa.has(k)).map((kategorija) => ({
      kategorija,
      stavke: mapa.get(kategorija) ?? [],
    }));
  }, [jelovnik]);

  const ukupnoKosarica = useMemo(() => {
    return jelovnik.reduce((sum, jelo) => {
      const k = kolicine[jelo.id] ?? 0;
      return sum + jelo.cijena * k;
    }, 0);
  }, [jelovnik, kolicine]);

  async function ucitaj() {
    try {
      const [jelovnikOdgovor, narudzbeOdgovor, healthOdgovor] = await Promise.all([
        dohvatiJelovnik(),
        dohvatiNarudzbe(),
        dohvatiHealth(),
      ]);
      setJelovnik(jelovnikOdgovor);
      setNarudzbe(normalizirajNarudzbe(narudzbeOdgovor as unknown[]));
      setHealth(healthOdgovor);
      setGreska("");
    } catch {
      setGreska("Backend nije dostupan. Pokreni API ili postavi VITE_API_URL.");
    }
  }

  useEffect(() => {
    void ucitaj();
  }, []);

  function promijeniKolicinu(jeloId: number, delta: number) {
    setKolicine((prev) => {
      const trenutno = prev[jeloId] ?? 0;
      const novo = Math.max(0, trenutno + delta);
      const next = { ...prev };
      if (novo === 0) {
        delete next[jeloId];
      } else {
        next[jeloId] = novo;
      }
      return next;
    });
  }

  async function naruci(event: FormEvent) {
    event.preventDefault();
    const stavke = Object.entries(kolicine)
      .filter(([, kolicina]) => kolicina > 0)
      .map(([jeloId, kolicina]) => ({ jeloId: Number(jeloId), kolicina }));

    if (stavke.length === 0) {
      setGreska("Odaberi barem jednu stavku.");
      return;
    }

    try {
      await posaljiNarudzbu({ ime_stola: imeStola.trim(), stavke });
      setImeStola("");
      setKolicine({});
      setGreska("");
      await ucitaj();
    } catch {
      setGreska("Narudžba nije poslana.");
    }
  }

  return (
    <main>
      <header>
        <p className="kicker">RS1 · klijent–poslužitelj</p>
        <h1>Restoran RasSus</h1>
        <p>
          Frontend šalje HTTP zahtjeve na <code>{API_URL}</code>
        </p>
        {health ? (
          <p className="status">
            Servis {health.status} · {new Date(health.vrijeme).toLocaleTimeString("hr-HR")}
          </p>
        ) : null}
      </header>

      {greska ? <p className="error">{greska}</p> : null}

      <section>
        <h2>Nova narudžba</h2>
        <form onSubmit={naruci}>
          <label>
            Ime stola
            <input
              value={imeStola}
              onChange={(e) => setImeStola(e.target.value)}
              placeholder="npr. Stol 5"
              required
            />
          </label>

          {grupe.map(({ kategorija, stavke }) => (
            <div key={kategorija} className="kategorija">
              <h3>{kategorija}</h3>
              <ul className="odabir">
                {stavke.map((jelo) => {
                  const kolicina = kolicine[jelo.id] ?? 0;
                  return (
                    <li key={jelo.id}>
                      <div className="odabir-info">
                        <strong>{jelo.naziv}</strong>
                        <span>{jelo.cijena.toFixed(2)} €</span>
                      </div>
                      <div className="stepper">
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => promijeniKolicinu(jelo.id, -1)}
                          disabled={kolicina === 0}
                          aria-label={`Manje ${jelo.naziv}`}
                        >
                          −
                        </button>
                        <span className="stepper-broj">{kolicina}</span>
                        <button
                          type="button"
                          className="stepper-btn"
                          onClick={() => promijeniKolicinu(jelo.id, 1)}
                          aria-label={`Više ${jelo.naziv}`}
                        >
                          +
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          <p className="ukupno">
            Ukupno: <strong>{ukupnoKosarica.toFixed(2)} €</strong>
          </p>
          <button type="submit">Pošalji POST /narudzbe</button>
        </form>
      </section>

      <section>
        <h2>Narudžbe</h2>
        <ul className="narudzbe-lista">
          {narudzbe.map((narudzba) => (
            <li key={narudzba.id} className="narudzba-kartica">
              <div className="narudzba-zaglavlje">
                <strong>{narudzba.ime_stola}</strong>
                <span>{narudzba.ukupno.toFixed(2)} €</span>
              </div>
              <ul className="narudzba-stavke">
                {(narudzba.stavke ?? []).map((stavka) => (
                  <li key={`${narudzba.id}-${stavka.jeloId}`}>
                    {stavka.kolicina}× {stavka.naziv} · {stavka.ukupno.toFixed(2)} €
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
