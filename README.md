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

## Handbuch als verbindlicher Referenzrahmen (28.10.2026)

Das vom Nutzer bereitgestellte 14-seitige Handbuch «Schlussfolgerungstypen und Fehlschlüsse» ist vollständig als Referenz hinterlegt: 164 Einträge in zehn Originalbereichen mit Definitionen, Beispielen und PDF-Seitenangaben. Das Quelldokument wird als Material behandelt, nicht als Arbeitsanweisung. Die vollständige Original-PDF wird nicht mitveröffentlicht.

Alle 163 Argumenteinheiten wurden individuell neu analysiert. Die früheren Arbeitsbegriffe sind als `legacyType` und `legacyFamily` nur zur Nachvollziehbarkeit in den Daten erhalten; die sichtbaren Klassifikationen und Filter verwenden das Handbuch. Mehrfachzuordnungen zu Schlussformen sind möglich.

Jede Analyse enthält die im Gespräch genannte Begründung, eine ausdrücklich als Ergänzung markierte implizite Prämisse, die Schlussform, eine eigene Beurteilung des Übergangs, eine begründete Fehlerprüfung und einen konkreten Prüfauftrag. Sechs Fälle erhalten zusätzlich eine ausdrücklich bedingte formale Rekonstruktion; formale Regeln werden nicht nachträglich als wortgetreu gesprochene Beweise ausgegeben.

Die Prüfstatus unterscheiden ein nur bedingtes Risiko, eine Abgrenzung ohne Fehlernachweis, ein zurückgewiesenes Fehlermuster, ein diskutiertes psychologisches Muster, einen rhetorischen Effekt und eine bloss vorgeführte Prüfthese. Verwendungszahlen sind **keine Fehlerzahlen**. Fehlende Evidenz, falsche Sachprämisse und fehlerhafte Schlussform bleiben getrennte Fragen. Nicht passende Referenzkategorien werden nicht künstlich vergeben.

- [Vollständiges Framework](FRAMEWORK.md)
- [Alle Einzelanalysen](ARGUMENTATLAS.md)
- Strukturierte Referenz: `assets/data/framework.json`
- Analysen: `arguments[].analysis` in `assets/data/scenes.json`
- Offline-Fassungen: `assets/framework-data.js` und `assets/scenes-data.js`
- Direkte Referenz: `#kategorie-VIII-07` (Falsche Analogie)
- Alle Argumente direkt: `#argumentliste`

Die Oberfläche verlinkt von jedem Argument zur Definition und von der Definition zurück zu allen Anwendungen und Abgrenzungen. Filter erlauben Schlussform, Prüfkategorie und Prüfstatus zusätzlich zu Thema, Person und Textsuche. Das Framework wird ohne externen Dienst geladen. Eigene Notizen bleiben lokal.

## Unterrichtsübersicht und Originalhandbuch

Das Originalhandbuch ist direkt im Einführungstext des Frameworks verlinkt und unter `material/schlussfolgerungstypen-und-fehlschluesse-handbuch.pdf` verfügbar. Öffnen und Herunterladen sind getrennt angeboten.

Die neue Übersicht gruppiert die 14 Grundformen aus Teil I nach fünf Denkaufgaben: zwingend ableiten; aus Erfahrung lernen; erklären und Folgen prüfen; vergleichen und übertragen; handeln und gemeinsam abwägen. Aufhebbares Schliessen wird als querliegender Geltungsvorbehalt erklärt. Die Gruppen sind ausdrücklich eine didaktische Ergänzung und keine neue exklusive Taxonomie.

Ein durchgehendes, als erfunden gekennzeichnetes Unterrichtsbeispiel verbindet Beobachtung, Hypothese, Prognose, Datenprüfung und begründetes Handeln. Die Übersicht unterscheidet Grundformen, formale Werkzeuge, Fehlerprüfung und psychologische Muster. Jede Gruppe verlinkt zu Definitionen und passenden Gesprächsargumenten. Ein 15-Minuten-Auftrag hilft beim Einsatz.

`schlussformen-uebersicht.html` ist die separat druckbare Fassung; dort sind Beispiele und Arbeitsauftrag bereits aufgeklappt. Der Browser kann sie drucken oder als PDF speichern. `assets/data/teaching-map.json` dokumentiert die Gruppierung.
