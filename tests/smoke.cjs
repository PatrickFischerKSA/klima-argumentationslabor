const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const {analyzeArgumentation}=require('../assets/analyzer.js');
for(const text of ['', 'Ein kurzer Satz.', 'Meiner Meinung nach braucht es Regeln, weil gemeinsames Handeln hilft.\n\nZwar gibt es Einwände, aber deshalb ist eine faire Abwägung nötig.']){
 const result=analyzeArgumentation(text);
 assert(Number.isFinite(result.stats.words));assert(Number.isFinite(result.signals.reasonMarkers));
 assert(result.categories.every(c=>typeof c.advice==='string'));
}
const h=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const m of h.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^https?:/.test(m[1]))assert(fs.existsSync(path.join(root,m[1])),m[1]);
for(const file of ['assets/app.js','assets/analyzer.js'])assert(!/fetch\s*\(/.test(fs.readFileSync(path.join(root,file),'utf8')),'No external processing');
console.log('OK: Heuristiken ausführbar, lokale Dateiverweise vollständig, keine Fetch-Aufrufe.');
