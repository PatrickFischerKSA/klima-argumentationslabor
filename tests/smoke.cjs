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
const teaching=JSON.parse(fs.readFileSync(path.join(root,'assets/data/teaching-map.json'),'utf8'));
const grouped=teaching.groups.flatMap(g=>g.ids).concat(teaching.crosscutting);
assert.equal(teaching.groups.length,5);assert.equal(grouped.length,14);assert.equal(new Set(grouped).size,14);
assert.deepEqual([...grouped].sort(),fw.entries.filter(e=>e.section==='I').map(e=>e.id).sort());
for(const group of teaching.groups){const [sid,aid]=group.scene.split('-');assert(scenes.some(s=>s.id===sid&&s.arguments.some(a=>a.id===aid)));}
const handbook=fs.readFileSync(path.join(root,'material/schlussfolgerungstypen-und-fehlschluesse-handbuch.pdf'));
assert.equal(handbook.subarray(0,4).toString(),'%PDF');
assert.equal(require('node:crypto').createHash('sha256').update(handbook).digest('hex'),fw.source.sha256);
const overview=fs.readFileSync(path.join(root,'schlussformen-uebersicht.html'),'utf8');
for(const id of grouped)assert(overview.includes('#kategorie-'+id));
assert(h.includes('href="material/schlussfolgerungstypen-und-fehlschluesse-handbuch.pdf"'));
assert(h.includes('id="schlussformen-uebersicht"'));
console.log('OK: Originalhandbuch bytegleich verlinkt, alle 14 Grundformen gruppiert und eigene Druckübersicht vorhanden.');
const levels=JSON.parse(fs.readFileSync(path.join(root,'assets/data/levels.json'),'utf8'));
assert.equal(levels.default,'basis');assert.deepEqual(levels.levels,['basis','fortgeschritten']);assert.equal(levels.groups.length,5);
assert.equal(Object.keys(levels.sceneTitles).length,55);assert.equal(Object.keys(levels.arguments).length,163);assert.equal(Object.keys(levels.sceneQuestions).length,55);
for(const a of args)assert(levels.groups.some(g=>g.id===levels.arguments[a.id]));
for(const s of scenes){const qs=levels.sceneQuestions[s.id];assert.equal(qs.length,2);assert(qs.every(q=>q.length>15));}
assert.deepEqual(levels.groups.flatMap(g=>g.forms).sort(),fw.entries.filter(e=>e.section==='I').map(e=>e.id).sort());
const levelContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/levels-data.js'),'utf8'),levelContext);
assert.equal(JSON.stringify(levelContext.window.KLIMA_LEVELS),JSON.stringify(levels));
assert(h.includes('id="levelToggle"')&&overview.includes('id="levelToggle"'));
console.log('OK: Zwei Levels, fünf Basisgruppen für alle 163 Argumente, 110 einfache Szenenfragen und konsistente Offline-Daten.');
const hbData=JSON.parse(fs.readFileSync(path.join(root,'assets/data/handbook.json'),'utf8'));
assert.equal(hbData.chapters.length,6);
for(const ch of hbData.chapters){assert(ch.blocks.length>=2);assert(ch.tasks.length);for(const id of ch.depth)assert(fw.entries.some(e=>e.id===id));assert(scenes.some(s=>s.id===ch.scene.id&&s.arguments.some(a=>a.id===ch.scene.argument)));}
for(const file of ['handbuch.html','assets/handbook.js','material/handbuch-basis.pdf','material/handbuch-fortgeschritten.pdf'])assert(fs.existsSync(path.join(root,file)));
console.log('OK: Sechs Handbuchkapitel mit gültigen Vertiefungen, Filmszenen und zwei Druckfassungen.');
const learning=JSON.parse(fs.readFileSync(path.join(root,'assets/data/handbook-learning.json'),'utf8'));
const {grade}=require('../assets/handbook-learning.js');
const learningContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/handbook-learning-data.js'),'utf8'),learningContext);
assert.equal(JSON.stringify(learningContext.window.KLIMA_HANDBOOK_LEARNING),JSON.stringify(learning));
let questionCount=0;const learningIds=new Set();
for(const c of hbData.chapters)for(const mode of ['basis','fortgeschritten']){
 const qs=learning.chapters[c.id][mode];assert.equal(qs.length,3);assert.deepEqual(qs.map(q=>q.phase),['Lernen','Repetieren','Vertiefen']);
 for(const q of qs){assert(!learningIds.has(q.id));learningIds.add(q.id);questionCount++;assert(q.learn.length>40&&q.explanation.length>70);assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert.equal(grade(q,null),null);assert.equal(grade(q,-1),null);assert.equal(grade(q,3),null);assert.equal(grade(q,q.correct).correct,true);for(let i=0;i<3;i++)assert.equal(grade(q,i).correct,i===q.correct);}
}
assert.equal(questionCount,36);
console.log('OK: 36 individuelle Selbstlernfragen in beiden Modi, Autokorrektur und Offline-Daten konsistent.');
