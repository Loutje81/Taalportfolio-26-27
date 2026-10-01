# Mijn taalportfolio

## Bestanden
- `index.html` = leerlingenversie
- `leraar.html` = leerkrachtenversie
- `config.js` = instellingen
- `data.js` = sterke punten, werkpunten en tips
- `styles.css` = lay-out
- `app.js` = werking
- `assets/teacher-cartoon.png` = cartoon bij tips
- `supabase.sql` = optionele gedeelde database

## Direct testen
Open `index.html` in een browser. Zonder database werkt de site in **lokale demo-modus**. De gegevens blijven dan alleen in die browser staan.

## Waarom een database nodig is
Als leerlingen via Smartschool elk op hun eigen toestel werken en de leerkracht hun voortgang op een andere computer moet kunnen zien, kan dit niet met alleen een HTML-bestand. Er is centrale opslag nodig.

## Eenvoudige gedeelde versie met Supabase
1. Maak een gratis Supabase-project.
2. Open SQL Editor en voer `supabase.sql` uit.
3. Kopieer in Project Settings > API de Project URL en anon public key.
4. Vul beide waarden in `config.js` in.
5. Upload de volledige map naar GitHub Pages of een andere webhost.
6. Deel `index.html` met leerlingen en `leraar.html` met leerkrachten via Smartschool.

## Belangrijk voor echte schooldata
De meegeleverde Supabase-policies zijn bewust eenvoudig voor een prototype. Ze zijn niet geschikt als definitieve beveiliging van persoonsgegevens. Gebruik voor een echte schooluitrol bij voorkeur schoolaccounts/authenticatie en strengere Row Level Security, of een schoolbeheerde backend. Deel de leerkrachtenlink niet publiek.

## Automatisch extra taakvak
Er staan aanvankelijk vijf vakken voor Spreken en vijf voor Schrijven. Zodra er vijf geregistreerde taken zijn, verschijnt automatisch een zesde leeg vak. Dit blijft doorgaan wanneer meer taken worden toegevoegd.
