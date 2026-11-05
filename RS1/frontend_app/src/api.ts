import type { Health, Jelo, Narudzba, ServisInfo } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

async function getJson<T>(putanja: string): Promise<T> {
  const odgovor = await fetch(`${API_URL}${putanja}`);
  if (!odgovor.ok) {
    throw new Error(`HTTP ${odgovor.status}`);
  }
  return odgovor.json() as Promise<T>;
}

export function dohvatiInfo() {
  return getJson<ServisInfo>("/");
}

export function dohvatiHealth() {
  return getJson<Health>("/health");
}

export function dohvatiJelovnik() {
  return getJson<Jelo[]>("/jelovnik");
}

export function dohvatiNarudzbe() {
  return getJson<Narudzba[]>("/narudzbe");
}

export async function posaljiNarudzbu(tijelo: {
  ime_stola: string;
  stavke: { jeloId: number; kolicina: number }[];
}): Promise<Narudzba> {
  const odgovor = await fetch(`${API_URL}/narudzbe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tijelo),
  });
  if (!odgovor.ok) {
    throw new Error(`HTTP ${odgovor.status}`);
  }
  return odgovor.json() as Promise<Narudzba>;
}

export { API_URL };
