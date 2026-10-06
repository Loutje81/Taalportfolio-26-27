# Mijn taalportfolio – versie 7

## Nieuw
- Peerfeedback werkt met vaste spreekopdrachten 1 t/m 5.
- Daarna kiest de leerling een klas (1A1–1C4) en een klasgenoot uit de aangeleverde klaslijst.
- Daarna kiest de leerling precies één positief punt en één werkpunt.
- De ontvanger ziet per spreekopdracht automatisch het meest gekozen positieve punt en werkpunt plus het aantal stemmen.
- De eigen reflectie blijft apart: na mondelinge feedback van de leerkracht kiest de leerling zelf een positief punt en werkpunt.
- Eén reviewer kan per leerling/opdracht één stem bewaren; opnieuw bewaren vervangt die stem.

## Installatie
1. Vervang de bestanden in GitHub door deze versie.
2. Voer `supabase.sql` één keer uit in de Supabase SQL Editor.
3. Vul in `config.js` je `supabaseUrl` en `supabaseAnonKey` in. Zonder die waarden werkt de site alleen lokaal in de browser en kunnen leerlingen elkaars peerfeedback niet zien.

De klaslijsten staan in `data.js` onder `window.PEER_CLASS_LISTS`.


## Versie 9
- Peerfeedback: klaskeuze is vereenvoudigd tot 1A, 1B of 1C.
- 1A bevat leerlingen uit 1A1, 1A2 en 1A3; 1B uit 1B1 en 1B2; 1C uit 1C1 t.e.m. 1C4.
- Na de klaskeuze verschijnt één samengevoegde namenlijst.


## Versie 9 – leerling kiest zichzelf uit de klaslijst
- Bovenaan kiest de leerling eerst 1A, 1B of 1C en daarna de eigen naam uit dezelfde officiële klaslijst als bij peerfeedback.
- Daardoor gebruikt het portfolio exact dezelfde naam en klas als de peerfeedback en kan de feedback betrouwbaar aan de juiste leerling worden gekoppeld.
- Let op: in Lokale demo-modus staat feedback alleen in de browser van het toestel waarop ze werd ingevoerd. Voor feedback tussen verschillende leerlingtoestellen moeten `supabaseUrl` en `supabaseAnonKey` in `config.js` ingevuld zijn en moet `supabase.sql` uitgevoerd zijn.


## Versie 10
- Klaskeuze bovenaan staat nu rechtstreeks in index.html (1A, 1B, 1C), zodat deze niet afhankelijk is van JavaScript om zichtbaar te worden.
- Cache-busting toegevoegd aan config.js, data.js en app.js zodat GitHub Pages/browsers na upload niet per ongeluk oude JavaScript blijven gebruiken.
- Na klaskeuze wordt de namenlijst uit data.js geladen.


## Versie 11
- Leerlingen kiezen één keer schooljaar, klas en naam en klikken op **Mijn gegevens bewaren**.
- De keuze blijft lokaal bewaard voor volgende opdrachten en volgende bezoeken in dezelfde browser.
- Met **Andere leerling / gegevens wijzigen** kan een gedeeld toestel naar een ander leerlingprofiel wisselen.
- De bewaarde leerlingidentiteit wordt ook gebruikt als afzender van peerfeedback.


## Versie 14
- Fout bij bewaren van eigen feedback opgelost.
- Validatie van positief punt, werkpunt en opdracht afzonderlijk gemaakt.
- Cache-busting toegevoegd zodat GitHub Pages de nieuwste JavaScript-versie laadt.
