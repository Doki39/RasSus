export type Jelo = {
  id: number;
  naziv: string;
  kategorija: string;
  cijena: number;
};

export type StavkaNarudzbe = {
  jeloId: number;
  naziv: string;
  kolicina: number;
  cijena: number;
  ukupno: number;
};

export type Narudzba = {
  id: number;
  ime_stola: string;
  stavke: StavkaNarudzbe[];
  ukupno: number;
};

export type NovaNarudzba = {
  ime_stola: string;
  stavke: { jeloId: number; kolicina: number }[];
};
