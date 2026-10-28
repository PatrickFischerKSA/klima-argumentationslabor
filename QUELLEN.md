# Quellen und Bearbeitung

## Unterrichtsmaterial

- Originalsendung SRF: https://www.srf.ch/play/tv/sternstunde-philosophie/video/klimakrise-warum-handeln-wir-nicht-reto-knutti?urn=urn:srf:video:1c612fe7-f87a-4f59-a7c4-4a9cbf820ba0
- Vom Nutzer angegebener YouTube-Film: https://www.youtube.com/watch?v=J77-r4-gwxE
- Die öffentliche Fassung spielt die auf der Originalseite angebotene MP4 direkt vom SRF-Server ab und verlinkt das Original. Sie enthält keine Kopie des Films, keine Standbilder und keinen vollständigen Transkripttext. Lokale Dateien werden nur auf dem jeweiligen Gerät geöffnet.
- Die Aufgaben wurden anhand des bereitgestellten Gesprächsmaterials entwickelt. Übungsbeispiele und Rekonstruktionen sind keine wörtlichen Knutti-Zitate. Sachangaben und Fundstellen am Original prüfen.

## Argumentationsprüfer

- Vom Nutzer gewünschte Ressource: https://patrickfischerksa.github.io/argumentationspruefer/
- Originalrepository: https://github.com/PatrickFischerKSA/argumentationspruefer
- Originaldatei: https://github.com/PatrickFischerKSA/argumentationspruefer/blob/main/server.js
- Abruf: 27.10.2026.

`assets/analyzer.js` übernimmt den zusammenhängenden, ohne Netzwerk ausführbaren Funktionsblock von `normalizeInputText` bis einschliesslich `analyzeQuoteUsage` aus `server.js`. Ergänzt wurden Herkunftskommentar und ein optionaler CommonJS-Export für den lokalen Test. Express-, OpenAI-, LanguageTool-, Literatur-API- und Upload-Serverfunktionen wurden nicht übernommen. Die Oberfläche ist neu und zeigt gezielt Signalzählungen und Überarbeitungsfragen statt automatischer Qualitätsnoten. Das Originalrepository enthielt in der abgerufenen Wurzel keine Lizenzdatei; diese Bearbeitung erteilt keine neue Lizenz für den Originalcode. Herkunfts- und Rechtehinweise bei Weitergabe beibehalten.

## Argumentationsdidaktik

Die Argumentkarte verwendet eine vereinfachte Rekonstruktion nach Stephen E. Toulmins Modell (The Uses of Argument, 1958): Behauptung, Daten, Schlussregel, Einwand und Geltungsgrenze. Kein vollständiger Abdruck und keine Übersetzung des Werks. Die begrifflichen Erläuterungen und Beispiele sind für diese Lernumgebung formuliert.

## Veröffentlichung

Veröffentlicht werden Lernfunktionen, didaktische Aufgaben, Quellenlinks und den direkten SRF-Videolink. Persönliche Lerntexte bleiben lokal. Der Film selbst wird nicht in das Repository kopiert.

## Direkte Filmwiedergabe

Der HTML5-Player verwendet den offiziellen «Herunterladen»-Link der oben genannten SRF-Sendungsseite. Am 27.10.2026 geprüft: HTTP 200 und Unterstützung von Byte-Range-Anfragen. Die Videodatei liegt weiterhin ausschliesslich auf dem SRF-Server.

## Szenen- und Argumentauswertung vom 28.10.2026

- Neue Arbeitsgrundlage: vom Nutzer bereitgestelltes DOCX `KI-Multimedia-Tool_ai-generated_KI-Multimedia-Tool_Transkript_28-10-2026mp3_28-10-2026.docx`.
- Offizielle Zeitbasis: [SRF-Untertitel (SWISS TXT), WebVTT](https://subtitles.eai-general.aws.srf.ch/srf/f5f60904-b095-4408-a418-09671868cc2a/episode/de/vod/vod.vtt), über die auf der SRF-Seite verwendete Medienmetadatenquelle ermittelt. Abgerufen am 28.10.2026.
- Der Abgleich betrifft die Position im Film und den Wortlaut der Szenenanfänge. Er ist keine unabhängige Prüfung der im Gespräch behaupteten Zahlen oder Tatsachen.
- Der veröffentlichte Atlas enthält eigene sinngemässe Rekonstruktionen und Analysefragen; weder das vollständige DOCX noch die vollständigen Untertitel werden mitveröffentlicht.
- Die 55 lokalen Clips wurden neu codiert und mit `ffprobe` auf Dauer (Abweichung < 0,25 Sekunden je Clip), Video- und Audiospur geprüft. Die Clipdateien verbleiben lokal. Online werden dieselben Grenzen im offiziellen Stream als begrenzte Abspielabschnitte verwendet.

## Schlussfolgerungs- und Fehlerframework (28.10.2026)

Vom Nutzer bereitgestellte Quelle: «Schlussfolgerungstypen und Fehlschlüsse», Systematisches Nachschlagewerk, Oktober 2026, 14 Seiten. Die sichtbare Referenz übernimmt die 164 benannten Einträge, Definitionen und Beispiele samt Seitenangaben aus diesem bereitgestellten Material. Die Dateiprüfsumme ist zur Nachvollziehbarkeit in `assets/data/framework.json` hinterlegt. Das Original-PDF wird nicht zusätzlich veröffentlicht.

Die 163 Einzelanalysen sind eigenständige didaktische Anwendungen, keine Aussagen des Handbuchs über das Gespräch. Ergänzte Prämissen, mögliche formale Rekonstruktionen und editorielle Prüfstatus sind als solche gekennzeichnet. Eine verlinkte Fehlerkategorie kann ausdrücklich nur abgegrenzt, als Risiko geprüft oder als im Gespräch zurückgewiesenes Muster erläutert sein. Sie ist deshalb keine automatische Beschuldigung der sprechenden Person. Nicht alle 164 Kategorien kommen im Gespräch vor.

Die bisherigen scene IDs, Argumentnummern und Videogrenzen bleiben erhalten. Die früheren freien Beschreibungen werden in den Daten nur als Legacy-Felder dokumentiert; die Oberfläche verwendet die Schlussformen des neuen Handbuchs.
