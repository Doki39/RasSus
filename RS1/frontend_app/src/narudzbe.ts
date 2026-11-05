import type { Narudzba } from "./types";

type StaraNarudzba = {
  id: number;
  ime?: string;
  jeloId?: number;
  jelo?: string;
  kolicina?: number;
  ukupno?: number;
};

export function normalizirajNarudzbe(lista: unknown[]): Narudzba[] {
  return lista.map((raw) => {
    const n = raw as Narudzba & StaraNarudzba;
    if (Array.isArray(n.stavke)) {
      return n;
    }
    return {
      id: n.id,
      ime_stola: n.ime_stola ?? n.ime ?? "Nepoznato",
      stavke: n.jelo
        ? [
            {
              jeloId: n.jeloId ?? 0,
              naziv: n.jelo,
              kolicina: n.kolicina ?? 1,
              cijena: n.ukupno ?? 0,
              ukupno: n.ukupno ?? 0,
            },
          ]
        : [],
      ukupno: n.ukupno ?? 0,
    };
  });
}
