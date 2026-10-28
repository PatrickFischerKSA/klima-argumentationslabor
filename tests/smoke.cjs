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
const fw=JSON.parse(fs.readFileSync(path.join(root,'assets/data/framework.json'),'utf8'));
assert.equal(fw.entries.length,164);assert.equal(fw.sections.length,10);
assert.deepEqual(fw.sections.map(s=>s.count),[14,15,13,18,24,20,24,16,8,12]);
const frameworkMap=new Map(fw.entries.map(e=>[e.id,e]));assert.equal(frameworkMap.size,164);
for(const e of fw.entries){assert(e.definition.length>12&&e.example.length>8);assert(e.page>=1&&e.page<=14);assert(fw.sections.some(s=>s.id===e.section));}
let formalCount=0;
for(const a of args){
 const review=a.analysis;assert.equal(review.frameworkVersion,fw.version);assert(review.implicitPremise.length>25&&review.assessment.length>40&&review.verification.length>20);
 assert(review.forms.length>=1);assert.equal(new Set(review.forms.map(r=>r.id)).size,review.forms.length);
 for(const ref of review.forms){assert.equal(frameworkMap.get(ref.id)?.section,'I');assert.equal(ref.page,frameworkMap.get(ref.id).page);}
 assert(review.fallacyChecks.length>=1);
 for(const check of review.fallacyChecks){const ref=frameworkMap.get(check.id);assert(ref&&!['I','II','III'].includes(ref.section));assert(check.status in fw.statusLabels);assert.equal(check.page,ref.page);assert(check.reason.length>30);}
 if(review.formalRule){formalCount++;const ref=frameworkMap.get(review.formalRule.id);assert(ref&&['II','III'].includes(ref.section));assert(review.formalRule.scope.length>10);}
 assert.equal(a.family,frameworkMap.get(review.forms[0].id).name);
}
assert.equal(formalCount,6);
const fwContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/framework-data.js'),'utf8'),fwContext);
assert.equal(JSON.stringify(fwContext.window.KLIMA_FRAMEWORK),JSON.stringify(fw));
for(const e of fw.entries)for(const app of e.applications){const s=scenes.find(x=>x.id===app.scene);const a=s?.arguments.find(x=>x.id===app.argument);assert(a);const r=a.analysis;assert([...r.forms,...r.fallacyChecks,...(r.formalRule?[r.formalRule]:[])].some(x=>x.id===e.id));}
assert.equal(args.find(a=>a.id==='A079').analysis.forms[0].id,'I-04','Pferdevergleich ist Analogie, kein strenger Widerspruchsbeweis');
assert(!args.find(a=>a.id==='A079').analysis.forms.some(r=>r.id==='I-12'));
assert(args.find(a=>a.id==='A118').analysis.fallacyChecks.every(r=>r.status==='zurueckgewiesen'));
assert(args.find(a=>a.id==='A110').analysis.fallacyChecks.every(r=>r.status==='pruefthese'));
console.log('OK: 164 quellentreue Frameworkeinträge, 163 individuelle Einzelanalysen, gültige Querverweise und sechs bedingte formale Rekonstruktionen.');
