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
for(const m of h.matchAll(/(?:src|href)="([^"#]+)"/g))if(!/^https?:/.test(m[1]))assert(fs.existsSync(path.join(root,m[1].split('?')[0])),m[1]);
for(const file of ['assets/app.js','assets/analyzer.js'])assert(!/fetch\s*\(/.test(fs.readFileSync(path.join(root,file),'utf8')),'No external processing');
console.log('OK: Heuristiken ausführbar, lokale Dateiverweise vollständig, keine Fetch-Aufrufe.');
const catalog=JSON.parse(fs.readFileSync(path.join(root,'assets/data/scenes.json'),'utf8'));
const scenes=catalog.scenes,args=scenes.flatMap(s=>s.arguments);
assert.equal(scenes.length,55);assert.equal(args.length,163);
assert.equal(new Set(args.map(a=>a.id)).size,163);
scenes.forEach((s,i)=>{
 assert(s.start>=0&&s.end>s.start&&s.end<=catalog.source.duration);
 assert(s.duration<=135&&Math.abs(s.duration-(s.end-s.start))<.0011);
 if(i)assert.equal(s.start,scenes[i-1].end);
 assert.equal(s.questions.length,2);assert(s.teacher.length>50);
 for(const a of s.arguments)for(const k of ['speaker','claim','reason','type'])assert(a[k].trim().length>0);
});
const vm=require('node:vm');const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/scenes-data.js'),'utf8'),ctx);
assert.equal(JSON.stringify(ctx.window.KLIMA_SCENES),JSON.stringify(catalog),'JSON und Offline-Daten identisch');
assert(!fs.existsSync(path.join(root,'clips')),'Keine Videokopien in öffentlicher Fassung');
assert(!fs.existsSync(path.join(root,'assets/transcript.js')),'Kein Volltranskript in öffentlicher Fassung');
console.log('OK: 55 chronologische Szenen, 163 eindeutige Argumente, 110 Fragen und konsistente Offline-Daten.');
