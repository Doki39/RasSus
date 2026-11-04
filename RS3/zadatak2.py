# Definirajte dvije korutine koje će simulirati dohvaćanje podataka s weba. 
# Prva korutina neka vrati listu proizvoljnih rječnika 
# (npr. koji reprezentiraju podatke o korisnicima) nakon 3 sekunde, 
# a druga korutina neka vrati listu proizvoljnih rječnika 
# (npr. koji reprezentiraju podatke o proizvodima) nakon 5 sekundi. 
# Korutine pozovite konkurentno korištenjem asyncio.gather() i ispišite rezultate. 
# Program se mora izvršavati ~5 sekundi.


import asyncio,time

async def proizvod():
    print("Nesto pocinjem s proizvodom")
    await asyncio.sleep(3)
    rijeci =  ["Banana", "Jabuka"]
    return rijeci

async def namjena():
    print("nesto pocinjem s namjenom")
    await asyncio.sleep(5)
    prehrana = [ "Povrce", "Voce"]
    return prehrana

async def main():

    return await asyncio.gather(proizvod(), namjena())

t1 = time.perf_counter()
rezultat = asyncio.run(main())
t2 = time.perf_counter()
print(rezultat)
print(f"Vrijeme izvođenja {t2 - t1:.3f} sekunde")
