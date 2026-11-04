import asyncio,time

baza_korisnika = [
  {'korisnicko_ime': 'mirko123', 'email': 'mirko123@gmail.com'},
  {'korisnicko_ime': 'ana_anic', 'email': 'aanic@gmail.com'},
  {'korisnicko_ime': 'maja_0x', 'email': 'majaaaaa@gmail.com'},
  {'korisnicko_ime': 'zdeslav032', 'email': 'deso032@gmail.com'}
]

baza_lozinka = [
  {'korisnicko_ime': 'mirko123', 'lozinka': 'lozinka123'},
  {'korisnicko_ime': 'ana_anic', 'lozinka': 'super_teska_lozinka'},
  {'korisnicko_ime': 'maja_0x', 'lozinka': 's324SDFfdsj234'},
  {'korisnicko_ime': 'zdeslav032', 'lozinka': 'deso123'}
]

async def get_user(name,email,password):
  print("checking user cred.")
  await asyncio.sleep(3)
  for k in baza_korisnika:
    if k["korisnicko_ime"] == name and k["email"] == email:
      return 1
  return 0
async def user_auth(name,password):
  print("checking user password")
  await asyncio.sleep(2)
  for k in baza_lozinka:
    if k["korisnicko_ime"] == name and k["lozinka"] == password:
      return 1
  return 0

async def main():
  user_lookup = await get_user("mirko123","mirko123@gmail.com","lozinka123")
  if user_lookup:
    return await user_auth("mirko123", "lozinka123")
  return 0


rezultat = asyncio.run(main())
if rezultat:
  print("Autorizacija uspjesna")
else:
  print("Autorizacija neuspjesna")