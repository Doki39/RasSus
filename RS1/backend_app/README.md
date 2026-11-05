# Backend app (Express + TypeScript)

REST API za vježbu 1: jelovnik i narudžbe.

## Lokalno

```bash
npm install
npm run dev
```

API sluša na `http://localhost:3000`.

## Rute

| Metoda | Ruta | Opis |
| --- | --- | --- |
| GET | `/` | info o servisu |
| GET | `/health` | status |
| GET | `/jelovnik` | cijeli jelovnik |
| GET | `/jelovnik/:id` | jedno jelo |
| GET | `/narudzbe` | lista narudžbi |
| POST | `/narudzbe` | nova narudžba |

Primjer `curl`:

```bash
curl https://TVJ-BACKEND.onrender.com/jelovnik
curl -X POST https://TVJ-BACKEND.onrender.com/narudzbe \
  -H "Content-Type: application/json" \
  -d '{"ime_stola":"Stol 5","stavke":[{"jeloId":1,"kolicina":2},{"jeloId":7,"kolicina":1}]}'
```

## Render.com

1. New Web Service, ovaj direktorij kao root (`RS1/backend_app`).
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Render postavlja `PORT` sam.

Javni URL upiši u `url.txt`.
