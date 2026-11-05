# Backend app (Express + TypeScript + PostgreSQL)

REST API za vježbu 1: jelovnik i narudžbe u **PostgreSQL** bazi.

## Lokalno

### 1. PostgreSQL

Primjer s Dockerom:

```bash
docker run --name rassus-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=rassus -p 5432:5432 -d postgres:16
```

### 2. Env varijable

```bash
cp .env.example .env
```

U `.env` postavi `DATABASE_URL`, npr.:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/rassus
```

### 3. Pokretanje

```bash
npm install
npm run dev
```

Pri startu se automatski izvršava `db/schema.sql` i, ako je jelovnik prazan, učitaju početne stavke.

Ručno samo migracija + seed:

```bash
npm run db:setup
```

API: `http://localhost:3000`  
Health s bazom: `GET /health` → `"db": "connected"`

## Rute

| Metoda | Ruta | Opis |
| --- | --- | --- |
| GET | `/` | info o servisu |
| GET | `/health` | status + baza |
| GET | `/jelovnik` | cijeli jelovnik |
| GET | `/jelovnik/:id` | jedna stavka |
| GET | `/narudzbe` | lista narudžbi |
| POST | `/narudzbe` | nova narudžba |

## Deploy na Railway

### A) Backend servis

1. New Project → **Deploy from GitHub** (repo s `RS1/backend_app`).
2. Root Directory: `RS1/backend_app` (ili cijeli repo ako je root backend).
3. **Add PostgreSQL** u isti projekt (Railway → New → Database → PostgreSQL).
4. Na **backend** servisu → Variables → **Add Reference** → `DATABASE_URL` iz PostgreSQL servisa.
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`
7. Railway postavlja `PORT` automatski.

Pri deployu `npm start` pokreće shemu i seed (jednom, kad je jelovnik prazan).

Javni URL backenda upiši u `url.txt`.

### B) Frontend (Render ili Railway Static)

Postavi `VITE_API_URL` na javni URL Railway backenda, npr. `https://tvoj-backend.up.railway.app`.

### Test

```bash
curl https://TVJ-BACKEND.up.railway.app/health
curl https://TVJ-BACKEND.up.railway.app/jelovnik
curl -X POST https://TVJ-BACKEND.up.railway.app/narudzbe \
  -H "Content-Type: application/json" \
  -d '{"ime_stola":"Stol 5","stavke":[{"jeloId":1,"kolicina":2},{"jeloId":7,"kolicina":1}]}'
```

## Shema

SQL datoteka: `db/schema.sql`  
Tablice: `jelovnik`, `narudzbe`, `narudzba_stavke`
