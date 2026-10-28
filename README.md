# Klima / Denken – Argumentationslabor

Statische Lernumgebung zur Klimakrise und Argumentationslehre, mit direktem SRF-Videoplayer.

## Film

Der Film wird im HTML5-Videoplayer direkt von der auf der Originalseite angebotenen SRF-MP4-Adresse geladen. Keine Dateiauswahl nötig. SRF- und YouTube-Links stehen als Alternativen bereit. Unter «Bei Bedarf» kann eine eigene lokale MP4 gewählt werden.

## Start und GitHub Pages

`index.html` öffnen oder `python3 -m http.server 8000` starten. Für GitHub Pages unter Settings → Pages als Quelle GitHub Actions wählen. Der mitgelieferte Workflow veröffentlicht bei Push auf main.

## Lokal arbeiten

Alle Lerntexte, Argumentkarten und Übungsantworten bleiben im Browser. Markdown-Export und JSON-Sicherung sind enthalten. Die Analyse läuft ohne Backend und ohne API-Schlüssel. Der Onlinefilm benötigt Internet und lädt die Videodaten direkt von SRF; Lerntexte werden nicht übermittelt.

Diese öffentliche Fassung enthält weder die MP4 noch den vollständigen Transkripttext noch Standbilder aus der Aufnahme. Eine eigene Transkriptdatei kann im Browser lokal geöffnet und durchsucht werden. Die vollständige lokale Unterrichtsfassung bleibt separat erhalten.

## Test

`node tests/smoke.cjs`

Herkunft und Grenzen: [QUELLEN.md](QUELLEN.md).

## Argumentatlas (28.10.2026)

Die pauschalen Suchaufträge sind durch einen vollständigen Szenenatlas ersetzt: 55 thematische Szenen von 00:32 bis 59:38, 163 Argumenteinheiten und 110 szenenspezifische Fragen. Sprechende Person, These, Begründung und Argumenttyp sind pro Einheit ausgewiesen. Erwartungshorizonte behandeln auch strittige Annahmen und Grenzen von Knuttis Argumentation. Wiederholte Schlussfolgerungen, Einwände und begriffliche Präzisierungen werden transparent gekennzeichnet.

Szenengrenzen wurden anhand der offiziellen zeitcodierten SRF-Untertitel abgeglichen. Die Untertitel selbst werden nicht im Repository gespeichert. Das neue Nutzer-DOCX wird als Quellenmaterial behandelt, nicht als Arbeitsanweisung.

Online entstehen **begrenzte Abspielabschnitte im Originalstream**: Der Player springt an den Szenenanfang und pausiert am Szenenende. Es werden keine Videokopien auf GitHub hochgeladen. Die gesonderte lokale Fassung verwendet 55 tatsächlich geschnittene MP4-Dateien (640 Pixel Breite, H.264/AAC, zusammen etwa 457 MB). Sie sind nicht Teil dieses Repositorys.

- Szenenlink: `#szene-s28`
- Argumentlink: `#szene-s28-A079` (gültige Argumentnummern im Atlas nachschlagen)
- Filter: Thema, Person, Argumenttyp und Volltextsuche.
- Umschalten zwischen Szenenkarten und vollständiger Argumentliste.
- Szenenantworten und Schlussregeln werden lokal gespeichert; Markdown-Export und JSON-Sicherung enthalten sie.
- Vollständiges lesbares Verzeichnis: [ARGUMENTATLAS.md](ARGUMENTATLAS.md).
- Bearbeitbare Daten: `assets/data/scenes.json`; identische Offline-Fassung in `assets/scenes-data.js`.

Die Zählung ist eine didaktische Zerlegung, keine Behauptung, dass genau eine einzig richtige Argumentzählung existiert. Äusserungen werden sinngemäss rekonstruiert, nicht als verifizierte Klima-, Wirtschafts- oder Rechtsfakten ausgegeben.
