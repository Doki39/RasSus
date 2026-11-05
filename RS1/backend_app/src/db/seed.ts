import type { Jelo } from "../types";

export const pocetniJelovnik: Omit<Jelo, "id">[] = [
  { naziv: "Crni rižot", kategorija: "Glavno jelo", cijena: 14.5 },
  { naziv: "Istarski fuži s tartufima", kategorija: "Glavno jelo", cijena: 16 },
  { naziv: "Salata od hobotnice", kategorija: "Predjelo", cijena: 12 },
  { naziv: "Fritule", kategorija: "Desert", cijena: 5.5 },
  { naziv: "Pelinkovac", kategorija: "Piće", cijena: 3.5 },
  { naziv: "Radler", kategorija: "Piće", cijena: 4 },
  { naziv: "Coca-Cola", kategorija: "Piće", cijena: 3 },
  { naziv: "Espresso", kategorija: "Piće", cijena: 2.5 },
];
