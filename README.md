# Mijn taalportfolio – versie 3

## Nieuw in deze versie
- Leerkrachtenknop op de leerlingenpagina.
- Wachtwoord voor leerkrachten: `msbc1.11`.
- Dezelfde login kan door beide leerkrachten gebruikt worden.
- Vier aparte onderdelen: Spreken 1ste jaar, Schrijven 1ste jaar, Spreken 2de jaar, Schrijven 2de jaar.
- Leerkrachten kunnen filteren op schooljaar en op spreken/schrijven.
- De cartoon met tip blijft direct onder het werkpunt van elke taak staan.

## Bestanden
- `index.html` = leerlingenversie + leerkrachtenknop
- `leraar.html` = afgeschermd leerkrachtenoverzicht
- `config.js` = instellingen + leerkrachtenwachtwoord
- `data.js` = sterke punten, werkpunten en tips
- `styles.css` = lay-out
- `app.js` = werking
- `assets/teacher-cartoon.png` = cartoon bij tips
- `supabase.sql` = tabel/migratie voor gedeelde opslag

## GitHub Pages bijwerken
Upload/vervang minstens: `index.html`, `leraar.html`, `app.js`, `styles.css`, `config.js` en `supabase.sql`. De map `assets` mag blijven staan als `teacher-cartoon.png` daar al correct in zit.

## Als je Supabase gebruikt
Voer de nieuwe `supabase.sql` één keer uit in de SQL Editor. Daardoor wordt de extra kolom `school_year` toegevoegd. Bestaande taken krijgen automatisch `1ste jaar`.

## Belangrijk over het wachtwoord
Omdat GitHub Pages een statische website is, is dit een eenvoudige toegangsdrempel in de browser en geen volwaardige serverbeveiliging. Het wachtwoord staat technisch in de websitecode. Voor echte afscherming van leerlinggegevens is authenticatie via een backend/Supabase Auth of schoollogin nodig.

## Automatisch extra taakvak
Elk van de vier onderdelen start met vijf taakvakken. Na vijf geregistreerde taken verschijnt automatisch een extra leeg vak.
