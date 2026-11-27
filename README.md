# Murdoku

Een logische puzzel die sudoku combineert met een moordmysterie. Iemand heeft Vincent vermoord. Jij zoekt uit waar iedereen stond en wie de dader is.

Murdoku is een Progressive Web App (PWA): je speelt het in de browser, installeert het als app op je telefoon of computer, en na de eerste keer werkt het ook zonder internet.

**Speel online:** https://rserne.github.io/murdoku/

## Spelregels

1. Zet iedereen op de plattegrond: de verdachten én Vincent.
2. In elke rij en in elke kolom staat precies één persoon.
3. Op een plant of boekenkast kan niemand staan. Stoelen, bedden en kleden mogen wel.
4. Iedereen heeft één aanwijzing, en elke aanwijzing klopt. ‘Naast’ betekent direct links, rechts, boven of onder, en in dezelfde kamer.
5. De dader is de enige verdachte die met Vincent in dezelfde kamer was.

## Bediening

Onder het bord staan de personen. Tik op een gezicht om de aanwijzing van die persoon te zien, en tik daarna op een vakje om de persoon neer te zetten. De app vertelt dan waar diegene nu staat, bijvoorbeeld ‘Anna zit op een stoel in de keuken’. Tik je zonder gekozen persoon op een vakje, dan zie je wat daar staat.

Staat iemand op een stoel, bed of kleed, dan zie je dat aan een wit rondje met het meubel rechtsonder op het gezicht. De naam van elke kamer staat als witte tekst in een leeg vakje van die kamer. Tussen het bord en de personen staat de speeltijd.

Onder het spelregelvenster staat het versienummer van de app. Zolang er een venster openstaat, loopt de klok niet door.

## De dader aanwijzen

Staat iedereen op de goede plek, dan blijft het bord gewoon zichtbaar. De balk onder de gezichten kleurt rood en vraagt wie Vincent heeft vermoord. Tik op de dader, in de rij met gezichten of op het bord.

- **Fout gekozen:** de balk meldt dat die persoon een alibi heeft, en je kiest opnieuw.
- **Goed gekozen:** de dader krijgt een rood label *Dader* op het bord. De balk toont *Zaak gesloten*, je tijd, het aantal tips en een knop *Nieuwe zaak*.

## Knoppen

| Knop | Wat hij doet |
| --- | --- |
| **?** (rechtsboven) | Opent de uitleg: een carrousel met de vijf spelregels en de bediening. Veeg opzij of tik op *Volgende*. Bij de eerste keer opstarten verschijnt die vanzelf. |
| **Persoon** | Een tik op het bord zet de gekozen persoon neer. Tussen Persoon, Potlood en Kruisje wissel je met een tik of door met je vinger over de knoppen te schuiven. |
| **Potlood** | Een tik op het bord zet een kleine letter van de gekozen persoon in het vakje: een notitie dat die persoon daar zou kunnen staan. Nog een keer tikken haalt de notitie weg. Zet je die persoon neer, dan verdwijnen al zijn of haar notities. |
| **Kruisje** | Een tik op het bord markeert een vakje waar volgens jou niemand stond. Een kruisje vervangt de notities in dat vakje, en een nieuwe notitie haalt het kruisje weer weg. |
| **Tip** | Haalt iemand weg die verkeerd staat, of zet de volgende persoon goed. |
| **Meer › Terug** | Maakt je laatste zet ongedaan. |
| **Meer › Wis het bord** | Haalt iedereen, alle notities en alle kruisjes van het bord. |
| **Meer › Automatisch wegstrepen** | Schakelaar, standaard uit. Staat hij aan, dan worden alle vrije vakjes in de rij en kolom van een geplaatste persoon donkerder en gearceerd. Meubels en notities in die vakjes vervagen. Je eigen kruisjes blijven gewoon staan. |

De spelregels en andere vensters sluit je door ze omlaag te vegen, of door ernaast te tikken.

## Niveaus en zaaknummers

| Niveau | Bord | Kamers | Personen |
| --- | --- | --- | --- |
| Makkelijk | 5 × 5 | 4 | 4 verdachten + Vincent |
| Gemiddeld | 6 × 6 | 5 | 5 verdachten + Vincent |
| Moeilijk | 7 × 7 | 6 | 6 verdachten + Vincent |

Elke zaak heeft een zaaknummer van vijf cijfers, bijvoorbeeld 21213. Het eerste cijfer is het niveau (1 = Makkelijk, 2 = Gemiddeld, 3 = Moeilijk), de rest bepaalt de puzzel. Het nummer staat linksboven, onder ‘Murdoku’.

Bij **Nieuwe zaak** kies je bovenaan tussen **Alleen** en **Samen**. Bij **Alleen** kies je een niveau en krijg je een willekeurige zaak.

Kies **Samen** om met iemand dezelfde zaak te spelen:

- **Nieuwe zaak starten:** kies een niveau. Je ziet het zaaknummer in grote cijfers, met een knop *Deel uitnodiging*. De uitnodiging bevat een link (bijv. `…/murdoku/#zaak-21213`) die de zaak bij je vriend direct opent. Tik later linksboven op het zaaknummer om het deelscherm terug te halen.
- **Meedoen met een zaaknummer:** typ het nummer van je vriend en tik op *Doe mee*.

Dezelfde zaak krijg je alleen met dezelfde versie van de app; die staat onderaan de spelregels.

## Installeren

1. Open de app in je browser.
2. **iPhone of iPad (Safari):** tik op de deelknop en kies *Zet op beginscherm*.
3. **Android (Chrome):** tik op het menu met drie puntjes en kies *App installeren*.
4. **Computer (Chrome of Edge):** klik op het installatie-icoon rechts in de adresbalk.

## Hoe de puzzels ontstaan

De app bedenkt elke zaak zelf (`js/core.js`):

- Kamers groeien willekeurig vanuit een paar startvakjes, daarna komen er meubels in.
- De generator kiest een geldige opstelling: één persoon per rij en kolom, en precies één verdachte bij Vincent.
- Iedereen krijgt één ware aanwijzing. Een oplosser controleert dat de zaak precies één oplossing heeft.
- Zaken waarin je de dader al uit de losse aanwijzingen kunt aflezen, keurt de generator af.

## Lokaal draaien

Een service worker werkt alleen via `http://localhost` of `https://`, niet door `index.html` direct te openen.

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `index.html` | De app: opmaak, bediening en gezichten |
| `js/core.js` | Puzzelgenerator, oplosser en teksten van de aanwijzingen |
| `sw.js` | Service worker voor offline spelen |
| `manifest.webmanifest` | App-gegevens voor installatie |
| `icons/` | App-icoontjes |

Zet je een nieuwe versie online, verhoog dan het versienummer op twee plekken: `VERSION` in `sw.js` (zo krijgen spelers de update binnen) en de tekst *Versie …* onderaan de spelregels in `index.html`. Houd ze gelijk, zodat spelers kunnen zien of ze de nieuwste versie hebben.
