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
