# Murdoku

Een logische puzzel die sudoku combineert met een moordmysterie. Iemand heeft Vincent vermoord. Jij zoekt uit waar iedereen stond en wie de dader is.

Murdoku is een Progressive Web App (PWA): je speelt het in de browser, installeert het als app op je telefoon of computer, en na de eerste keer werkt het ook zonder internet.

## Spelregels

1. Zet iedereen op de plattegrond: de verdachten én Vincent.
2. In elke rij en in elke kolom staat precies één persoon.
3. Op een plant of boekenkast kan niemand staan. Stoelen, bedden en kleden mogen wel.
4. Iedereen heeft één aanwijzing, en elke aanwijzing klopt. ‘Naast’ betekent direct links, rechts, boven of onder, en in dezelfde kamer.
5. De dader is de enige verdachte die met Vincent in dezelfde kamer was.

## Bediening

Onder het bord staan de personen. Tik op een gezicht om de aanwijzing van die persoon te zien, en tik daarna op een vakje om de persoon neer te zetten. De app vertelt dan waar diegene nu staat, bijvoorbeeld ‘Anna zit op een stoel in de keuken’. Tik je zonder gekozen persoon op een vakje, dan zie je wat daar staat.

Onder het spelregelvenster staat het versienummer van de app.

## Knoppen

| Knop | Wat hij doet |
| --- | --- |
| **Persoon** | Een tik op het bord zet de gekozen persoon neer. |
| **Kruisje** | Een tik op het bord markeert een vakje waar volgens jou niemand stond. |
| **Terug** | Maakt je laatste zet ongedaan. |
| **Tip** | Haalt iemand weg die verkeerd staat, of zet de volgende persoon goed. |
| **Wissen** | Haalt iedereen en alle kruisjes van het bord. |

## Niveaus en zaaknummers

| Niveau | Bord | Kamers | Personen |
| --- | --- | --- | --- |
| Makkelijk | 5 × 5 | 4 | 4 verdachten + Vincent |
| Gemiddeld | 6 × 6 | 5 | 5 verdachten + Vincent |
| Moeilijk | 7 × 7 | 6 | 6 verdachten + Vincent |

Elke zaak heeft een nummer. Met hetzelfde zaaknummer en niveau krijgt iedereen precies dezelfde puzzel, dus je kunt tegen elkaar racen.

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

Zet je een nieuwe versie online, verhoog dan `VERSION` in `sw.js`. Zo krijgen spelers de update binnen.
