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

### Opcija A — Dockerfile (preporuka, bez `npm ci && npm run build`)

U rootu servisa postoji **`Dockerfile`** i **`railway.toml`**. Railway gradi sliku (`docker build`), ne Nixpacks `npm ci`.

1. New Project → deploy repo, **Root Directory**: `RS1/backend_app`
2. Add **PostgreSQL**, poveži **`DATABASE_URL`** na backend servis
3. Build/start se čitaju iz Dockerfilea; dodatni Build Command u UI **ostavi prazan** ili koristi Dockerfile builder

### Opcija B — Nixpacks (ručno u Railway UI)

U **Settings → Build** možeš promijeniti naredbu, npr.:

```bash
npm install && npm run build
```

`typescript` je u `devDependencies`, pa build mora instalirati dev pakete (ne samo `npm ci --omit=dev`).

Primjer Start Command: `npm start`

### Opcija C — bez compile koraka (brzo, manje uredno)

Start Command:

```bash
npx tsx src/index.ts
```

Tada Build Command može biti samo `npm install` ili prazan. Za produkciju je bolje A ili B.

### Zajedničko

1. New Project → deploy repo, root `RS1/backend_app`
2. **Add PostgreSQL**, varijabla **`DATABASE_URL`** (reference s Postgres servisa)
3. Railway postavlja **`PORT`** automatski  
4. Javni URL backenda upiši u `url.txt`; na frontendu **`VITE_API_URL`** = taj URL

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
