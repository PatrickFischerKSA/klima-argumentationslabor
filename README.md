# Klima / Denken – Argumentationslabor

Statische Lernumgebung zur Klimakrise und Argumentationslehre, mit dem vom Nutzer verlinkten SRF-Film als YouTube-Einbettung.

## Film

Der Film lässt sich direkt im eingebetteten YouTube-Player ansehen. Falls die Einbettung vom Anbieter oder Browser blockiert wird, stehen Direktlinks zu YouTube und SRF bereit. Alternativ eine lokale MP4 über die Dateiauswahl öffnen. Die Datei bleibt auf dem Gerät.

## Start und GitHub Pages

`index.html` öffnen oder `python3 -m http.server 8000` starten. Für GitHub Pages unter Settings → Pages als Quelle GitHub Actions wählen. Der mitgelieferte Workflow veröffentlicht bei Push auf main.

## Lokal arbeiten

Alle Lerntexte, Argumentkarten und Übungsantworten bleiben im Browser. Markdown-Export und JSON-Sicherung sind enthalten. Die Analyse läuft ohne Backend und ohne API-Schlüssel. Der Onlinefilm benötigt Internet und lädt Inhalte von YouTube; Lerntexte werden nicht an YouTube übermittelt.

Diese öffentliche Fassung enthält weder die MP4 noch den vollständigen Transkripttext noch Standbilder aus der Aufnahme. Eine eigene Transkriptdatei kann im Browser lokal geöffnet und durchsucht werden. Die vollständige lokale Unterrichtsfassung bleibt separat erhalten.

## Test

`node tests/smoke.cjs`

Herkunft und Grenzen: [QUELLEN.md](QUELLEN.md).
