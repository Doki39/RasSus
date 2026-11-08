import asyncio

JELOVNIK_BAZA = [
    {"id": 1, "naziv": "Crni rižot", "kategorija": "Glavno jelo", "cijena": 14.5},
    {"id": 2, "naziv": "Istarski fuži s tartufima", "kategorija": "Glavno jelo", "cijena": 16.0},
    {"id": 3, "naziv": "Salata od hobotnice", "kategorija": "Predjelo", "cijena": 12.0},
    {"id": 4, "naziv": "Bruschetta", "kategorija": "Predjelo", "cijena": 8.5},
    {"id": 5, "naziv": "Pljukanci s gamberima", "kategorija": "Glavno jelo", "cijena": 15.0},
    {"id": 6, "naziv": "Pasticada", "kategorija": "Glavno jelo", "cijena": 17.5},
    {"id": 7, "naziv": "Fritule", "kategorija": "Desert", "cijena": 5.5},
    {"id": 8, "naziv": "Palačinke s lješnjacima", "kategorija": "Desert", "cijena": 6.0},
    {"id": 9, "naziv": "Pelinkovac", "kategorija": "Piće", "cijena": 3.5},
    {"id": 10, "naziv": "Radler", "kategorija": "Piće", "cijena": 4.0},
    {"id": 11, "naziv": "Coca-Cola", "kategorija": "Piće", "cijena": 3.0},
    {"id": 12, "naziv": "Espresso", "kategorija": "Piće", "cijena": 2.5},
]

NARUDBA_STOLA = [
    {"id": 1, "ime_stola": "Stol 3", "ukupno": 24.0},
    {"id": 2, "ime_stola": "Stol 7", "ukupno": 28.0},
    {"id": 3, "ime_stola": "Stol 12", "ukupno": 29.0},
    {"id": 4, "ime_stola": "Stol 1", "ukupno": 33.5},
    {"id": 5, "ime_stola": "Stol 9", "ukupno": 19.5},
]

NARUDBA_BAZA = [
    {"id": 1, "narudzba_id": 1, "jelo_id": 2, "naziv": "Istarski fuži s tartufima", "kolicina": 1, "cijena": 16.0, "ukupno": 16.0},
    {"id": 2, "narudzba_id": 1, "jelo_id": 10, "naziv": "Radler", "kolicina": 2, "cijena": 4.0, "ukupno": 8.0},

    {"id": 3, "narudzba_id": 2, "jelo_id": 1, "naziv": "Crni rižot", "kolicina": 1, "cijena": 14.5, "ukupno": 14.5},
    {"id": 4, "narudzba_id": 2, "jelo_id": 4, "naziv": "Bruschetta", "kolicina": 1, "cijena": 8.5, "ukupno": 8.5},
    {"id": 5, "narudzba_id": 2, "jelo_id": 12, "naziv": "Espresso", "kolicina": 2, "cijena": 2.5, "ukupno": 5.0},

    {"id": 6, "narudzba_id": 3, "jelo_id": 6, "naziv": "Pasticada", "kolicina": 1, "cijena": 17.5, "ukupno": 17.5},
    {"id": 7, "narudzba_id": 3, "jelo_id": 11, "naziv": "Coca-Cola", "kolicina": 2, "cijena": 3.0, "ukupno": 6.0},
    {"id": 8, "narudzba_id": 3, "jelo_id": 7, "naziv": "Fritule", "kolicina": 1, "cijena": 5.5, "ukupno": 5.5},

    {"id": 9, "narudzba_id": 4, "jelo_id": 5, "naziv": "Pljukanci s gamberima", "kolicina": 2, "cijena": 15.0, "ukupno": 30.0},
    {"id": 10, "narudzba_id": 4, "jelo_id": 9, "naziv": "Pelinkovac", "kolicina": 1, "cijena": 3.5, "ukupno": 3.5},

    {"id": 11, "narudzba_id": 5, "jelo_id": 3, "naziv": "Salata od hobotnice", "kolicina": 1, "cijena": 12.0, "ukupno": 12.0},
    {"id": 12, "narudzba_id": 5, "jelo_id": 8, "naziv": "Palačinke s lješnjacima", "kolicina": 1, "cijena": 6.0, "ukupno": 6.0},
    {"id": 13, "narudzba_id": 5, "jelo_id": 12, "naziv": "Espresso", "kolicina": 1, "cijena": 2.5, "ukupno": 2.5},
]



async def get_jelovnik():
    await asyncio.sleep(3)
    return JELOVNIK_BAZA 

async def get_narudbe(id):
    await asyncio.sleep(3)
    rezultat = []
    for p in NARUDBA_BAZA:
        if p["narudzba_id"] == id:
            rezultat.append(p)
    return rezultat

async def get_table(id):
    await asyncio.sleep(3)
    rezultat = 0;
    for p in NARUDBA_STOLA:
        if p["id"] == id:
            return p
    return 0

async def main1():
    return await asyncio.gather(get_jelovnik(),get_narudbe(1),get_table(1))

async def main2():
    task1 = asyncio.create_task(get_jelovnik)
    task2 = asyncio.create_task(get_narudbe(1))
    task3 = asyncio.create_task(get_table(1))
    rezultat1 = await task1
    rezultat2 = await task2
    rezultat3 = await task3
    return [rezultat1,rezultat2,rezultat3]

jelovnik,stol,narudba = asyncio.run(main2())
print(jelovnik)
print()
print(stol)
print()
print(narudba)
