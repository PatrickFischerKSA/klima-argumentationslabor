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
