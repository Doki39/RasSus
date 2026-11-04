import asyncio
import random

async def provjeri_parnost(broj):
    await asyncio.sleep(2)
    if broj % 2 == 0:
        return f"Broj {broj} je paran."
    return f"Broj {broj} je neparan."

async def main():
    brojevi = [random.randint(1,100) for _ in range(10)]
    zadaci = [asyncio.create_task(provjeri_parnost(b)) for b in brojevi]
    rezultati = await asyncio.gather(*zadaci)
    for poruka in rezultati:
        print(poruka)

asyncio.run(main())
