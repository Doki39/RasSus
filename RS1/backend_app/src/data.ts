import type { Jelo, Narudzba } from "./types";

export const jelovnik: Jelo[] = [
  { id: 1, naziv: "Crni rižot", kategorija: "Glavno jelo", cijena: 14.5 },
  { id: 2, naziv: "Istarski fuži s tartufima", kategorija: "Glavno jelo", cijena: 16 },
  { id: 3, naziv: "Salata od hobotnice", kategorija: "Predjelo", cijena: 12 },
  { id: 4, naziv: "Fritule", kategorija: "Desert", cijena: 5.5 },
  { id: 5, naziv: "Pelinkovac", kategorija: "Piće", cijena: 3.5 },
  { id: 6, naziv: "Radler", kategorija: "Piće", cijena: 4 },
  { id: 7, naziv: "Coca-Cola", kategorija: "Piće", cijena: 3 },
  { id: 8, naziv: "Espresso", kategorija: "Piće", cijena: 2.5 },
];

export const narudzbe: Narudzba[] = [
  {
    id: 1,
    ime_stola: "Stol 3",
    stavke: [
      {
        jeloId: 2,
        naziv: "Istarski fuži s tartufima",
        kolicina: 1,
        cijena: 16,
        ukupno: 16,
      },
      {
        jeloId: 6,
        naziv: "Radler",
        kolicina: 2,
        cijena: 4,
        ukupno: 8,
      },
    ],
    ukupno: 24,
  },
];
