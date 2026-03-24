# Zadanie 1 – Kontajnerizovaná webová aplikácia

Úprimne, webové programovanie nikdy nebola moja silná stránka a ani som sa oň dlhodobo veľmi nezaujímal. Pri hľadaní komponentov pre vlastné shell prostredie vytvárané pomocou Quickshellu som však zistil, že som nenašiel žiadny rozumný agregátor komponentov podobný tomu, čo má napríklad KDE Plasma Store. Preto som sa rozhodol spraviť aspoň jednoduchý základ takejto aplikácie a zároveň na nej splniť toto zadanie. Ďakujem za motiváciu prinútiť ma pozrieť sa viac na webové technológie, aj keď frontend ma stále skôr irituje než baví.

## Stručný opis aplikácie

Aplikácia predstavuje jednoduchý katalóg Quickshell komponentov. Používateľ sa môže zaregistrovať, prihlásiť a následne vytvárať, prezerať, upravovať a mazať záznamy o komponentoch. Cieľom nebolo vytvoriť komplexný produkčný systém, ale funkčný základ viacdielnej webovej aplikácie s oddeleným frontendom, backendom a databázou.

## Architektúra

Aplikácia pozostáva z troch samostatných služieb:

### Frontend (FE)
Frontend predstavuje používateľské rozhranie dostupné cez webový prehliadač. Je zodpovedný za zobrazenie stránok, formulárov pre registráciu a prihlásenie, ako aj za prácu s CRUD operáciami nad entitou `components`. Frontend komunikuje výhradne s backendom cez HTTP API.

### Backend (BE)
Backend implementuje aplikačnú logiku a poskytuje REST API. Zabezpečuje registráciu používateľa, prihlásenie, hashovanie hesiel, vydávanie autentifikačných tokenov a CRUD operácie nad komponentmi. Backend komunikuje s frontendom cez HTTP a s databázou cez databázové pripojenie.

### Databáza (DB)
Databáza slúži ako perzistentné úložisko dát. Uchováva používateľov a komponenty. Heslá používateľov nie sú ukladané v čitateľnej podobe, ale vo forme kryptografického hash-u.

## Použité technológie

### Frontend
- React
- Vite
- TypeScript

### Backend
- Node.js
- Express
- TypeScript
- bcrypt
- JSON Web Token

### Databáza
- PostgreSQL

### Kontajnerizácia
- Docker
- Docker Compose

## Podporované a vhodné verzie softvéru

Projekt je navrhnutý s použitím aktuálnych a podporovaných technológií:
- Node.js 24 LTS
- PostgreSQL 18
- aktuálny oficiálny Docker obraz `postgres`
- vlastné Docker obrazy pre frontend a backend

Frontend aj backend sú buildované pomocou vlastných `Dockerfile`. Databáza používa oficiálny obraz z Docker Hub.

## Funkcionalita

### Registrácia a prihlásenie
Aplikácia obsahuje:
- registráciu nového používateľa
- prihlásenie existujúceho používateľa
- hashovanie hesiel pomocou `bcrypt`

Používateľské heslá sa do databázy nikdy neukladajú v otvorenej forme.

### CRUD nad entitou `components`
Backend poskytuje REST API pre entitu `components`:
- `GET` – získanie zoznamu komponentov alebo detailu jedného komponentu
- `POST` – vytvorenie nového komponentu
- `PUT` – úprava existujúceho komponentu
- `DELETE` – odstránenie komponentu

Frontend komunikuje s backendom výhradne cez HTTP API.

## Siete a izolácia komunikácie

Použité sú dve samostatné Docker siete:

### 1. sieť FE → BE
Na tejto sieti sa nachádzajú:
- frontend
- backend

Frontend má prístup iba k backendu.

### 2. sieť BE → DB
Na tejto sieti sa nachádzajú:
- backend
- databáza

Databáza nie je priamo dostupná z frontendovej siete, čím je splnená požiadavka izolácie komunikácie.

### Dôležité vlastnosti komunikácie
- každá služba beží vo vlastnom kontajneri
- každá služba používa svoj vlastný port
- komunikácia medzi kontajnermi je realizovaná pomocou názvov služieb
- nepoužívajú sa IP adresy
- databáza nie je priamo vystavená frontendovej časti

## Volume a perzistencia dát

Databáza používa pomenovaný Docker volume:
- `postgres_data`

Tento volume zabezpečuje, že databázové dáta prežijú reštart kontajnera a nie sú stratené po jeho vypnutí.

## Konfigurácia aplikácie

Konfigurácia aplikácie je realizovaná pomocou premenných prostredia. Citlivé údaje nie sú napevno zapísané v zdrojovom kóde.

Používajú sa najmä tieto premenné:
- `VITE_API_URL`
- `PORT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

Kontajnery sú nakonfigurované tak, aby sa po zlyhaní automaticky reštartovali.

## Spustenie aplikácie

### Požiadavky
- nainštalovaný Docker
- nainštalovaný Docker Compose

### Postup spustenia

1. Naklonovať alebo rozbaliť projekt.
2. V koreňovom adresári projektu vytvoriť súbor `.env` podľa pripraveného `.env.example`.
3. Spustiť aplikáciu príkazom:

```bash
docker compose up --build
```

Tento príkaz:

* zostaví vlastné obrazy frontend a backend
* vytvorí potrebné siete
* vytvorí pomenovaný volume
* spustí všetky kontajnery aplikácie

## Vypnutie aplikácie

Na zastavenie aplikácie slúži príkaz:

```bash
docker compose down
```

Ak by bolo potrebné odstrániť aj volume, je možné použiť:

```bash
docker compose down -v
```

## Používanie aplikácie

Po spustení aplikácie je frontend dostupný v prehliadači na adrese:

`http://localhost:3000`

Backend API je dostupné na adrese:

`http://localhost:8080`

Typický scenár používania:

1. používateľ otvorí frontend v prehliadači
2. zaregistruje si nový účet
3. prihlási sa do aplikácie
4. vytvorí nový komponent
5. zobrazí zoznam komponentov
6. upraví alebo odstráni existujúci komponent

## Splnenie požiadaviek zadania

### 3b – registrácia a prihlásenie

Splnené:

* registrácia nového používateľa
* prihlásenie existujúceho používateľa
* hashované heslá

### 6b – CRUD funkcionalita

Splnené:

* Create
* Read
* Update
* Delete
  nad entitou `components`

### 3b – siete a izolácia komunikácie

Splnené:

* dve samostatné Docker siete
* frontend nekomunikuje priamo s databázou
* backend je jediný medzičlánok medzi FE a DB

### 3b – konfigurácia aplikácie

Splnené:

* použitie `.env`
* bez hardcodovaných citlivých údajov
* konfigurovateľné pripojenie a tajné kľúče

### 2b – reprodukovateľné spustenie a vypnutie

Splnené:

* `docker compose up --build`
* `docker compose down`

### 3b – aktuálne a vhodné verzie softvéru

Splnené:

* aktuálny Node.js LTS
* aktuálny PostgreSQL obraz
* Docker Official Image pre databázu
* vlastné obrazy pre FE a BE

## Záver

Cieľom projektu bolo navrhnúť a lokálne nasadiť jednoduchú kontajnerizovanú viacdielnu webovú aplikáciu s jasne oddelenými službami, riadenou komunikáciou medzi nimi a perzistentným úložiskom dát. Aplikácia spĺňa požiadavky zadania a zároveň predstavuje základ pre ďalšie rozšírenie do plnohodnotnejšieho katalógu Quickshell komponentov.