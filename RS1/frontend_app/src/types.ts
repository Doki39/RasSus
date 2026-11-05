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

export type ServisInfo = {
  servis: string;
  verzija: string;
  rute: string[];
};

export type Health = {
  status: string;
  vrijeme: string;
};
