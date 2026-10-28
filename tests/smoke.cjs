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
const sceneLearning=JSON.parse(fs.readFileSync(path.join(root,'assets/data/scene-learning.json'),'utf8'));
const sceneLearningContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/scene-learning-data.js'),'utf8'),sceneLearningContext);
assert.equal(JSON.stringify(sceneLearningContext.window.KLIMA_SCENE_LEARNING_DATA),JSON.stringify(sceneLearning));
const sceneQuiz=require('../assets/scene-learning.js'),quizIds=new Set(),chapterIds=new Set(hbData.chapters.map(c=>c.id));
let sceneQuizCount=0;
for(const s of scenes)for(const level of ['basis','fortgeschritten']){
 const qs=sceneLearning.scenes[s.id][level];assert.equal(qs.length,s.arguments.length+1);assert.deepEqual(qs.slice(0,-1).map(q=>q.argument),s.arguments.map(a=>a.id));
 for(const q of qs){
  assert(!quizIds.has(q.id));quizIds.add(q.id);sceneQuizCount++;assert(q.question.length>35&&q.explanation.length>70);assert(chapterIds.has(q.chapter));assert(s.arguments.some(a=>a.id===q.argument));assert.equal(q.options.length,3);assert.equal(new Set(q.options).size,3);assert(q.refs.length);assert.equal(q.revision,2);assert.equal(q.optionFeedback.length,3);assert(q.optionFeedback.every(text=>text.length>70));
  for(const ref of q.refs){const e=fw.entries.find(e=>e.id===ref.id);assert(e);assert.equal(ref.page,e.page);}
  assert.equal(sceneQuiz.grade(q,null),null);assert.equal(sceneQuiz.grade(q,3),null);assert.equal(sceneQuiz.grade(q,-1),null);
  for(let i=0;i<3;i++){assert.equal(sceneQuiz.grade(q,i).correct,i===q.correct);assert.equal(sceneQuiz.grade(q,i).feedback,q.optionFeedback[i]);}
 }
 const q=qs[0],wrong=(q.correct+1)%3;
 const saved={[q.id]:{revision:2,selected:wrong,checked:true,attempts:1}};assert.deepEqual(sceneQuiz.progress(saved,qs),{done:0,wrong:1,total:qs.length});
 saved[q.id]={revision:2,selected:q.correct,checked:true,attempts:2};assert.equal(sceneQuiz.progress(saved,qs).done,1);assert.equal(sceneQuiz.progress(saved,qs).wrong,0);
 assert.equal(sceneQuiz.progress(saved,sceneLearning.scenes[s.id][level==='basis'?'fortgeschritten':'basis']).done,0);
 saved[q.id]={revision:2,selected:null,checked:false,attempts:2};assert.equal(sceneQuiz.record(saved,q).attempts,2);assert.equal(sceneQuiz.progress(saved,qs).done,0);
 saved[q.id]={revision:2,selected:99,checked:true,attempts:2};assert.equal(sceneQuiz.progress(saved,qs).done,0);assert.equal(sceneQuiz.progress(saved,qs).wrong,0);
}
assert.equal(sceneQuizCount,436);assert(h.indexOf('assets/scene-learning.js')<h.indexOf('assets/scenes.js'));
console.log('OK: 436 Szenenübungen für alle 163 Argumente in beiden Modi, gültige Handbuchverweise und getrennte Lernstände.');
let sceneTestMode='basis',quizStorage='';
const sceneQuizContext={window:{KLIMA_SCENE_LEARNING_DATA:sceneLearning,KLIMA_SCENES:catalog,KLIMA_FRAMEWORK:fw,KLIMA_LEVEL:{get:()=>sceneTestMode}},localStorage:{getItem:()=>null,setItem:(_key,value)=>{quizStorage=value;}}};
vm.runInNewContext(fs.readFileSync(path.join(root,'assets/scene-learning.js'),'utf8'),sceneQuizContext);
const sceneApi=sceneQuizContext.window.KLIMA_SCENE_LEARNING,bq=sceneLearning.scenes.s28.basis[0],aq=sceneLearning.scenes.s28.fortgeschritten[0];
const sceneBackup={[bq.id]:{revision:2,selected:bq.correct,checked:true,attempts:1},[aq.id]:{revision:2,selected:(aq.correct+1)%3,checked:true,attempts:2},unknown:{revision:2,selected:0,checked:true,attempts:1}};
sceneApi.setState(sceneBackup);assert.equal(sceneApi.progress('s28').done,1);sceneTestMode='fortgeschritten';assert.equal(sceneApi.progress('s28').wrong,1);assert(!('unknown' in sceneApi.getState()));
const quizRoundTrip=JSON.parse(quizStorage);sceneApi.setState({});assert.equal(sceneApi.progress('s28').wrong,0);sceneApi.setState(quizRoundTrip);assert.equal(sceneApi.progress('s28').wrong,1);assert(sceneApi.journal().includes('noch zu korrigieren'));assert(sceneApi.journal().includes('Basis: 1 von 218'));
console.log('OK: Szenen-Lernstand lässt sich sichern, bereinigt importieren, zurücksetzen und als Journal exportieren.');
const units=require('../assets/study-units.js');assert.equal(units.presets.length,8);assert.deepEqual(units.presets.flatMap(p=>Array.from({length:p.end-p.start+1},(_,i)=>p.start+i)),Array.from({length:55},(_,i)=>i+1));
for(let start=-2;start<=60;start++)for(let end=-2;end<=60;end++)for(const changed of ['start','end']){const u=units.normalize(start,end,changed);assert(u.start>=1&&u.end<=55);assert(u.end-u.start>=1&&u.end-u.start<=11);}
assert(units.contains({start:27,end:33},'s28'));assert(!units.contains({start:27,end:33},'s34'));
assert.equal(sceneQuiz.progress({[bq.id]:{selected:bq.correct,checked:true,attempts:1}},[bq]).done,0,'Old answers must not be graded against revised options');
sceneQuizContext.window.KLIMA_UNIT={selected:()=>scenes.slice(26,33),questions:(s,level)=>[sceneLearning.scenes[s.id][level].at(-1)]};sceneApi.setState(quizRoundTrip);assert.equal(sceneApi.progress('s28').total,1);assert.equal(Object.keys(sceneApi.getState()).length,2,'Core-question scope must not discard argument answers on import');
assert(h.indexOf('assets/study-units.js')<h.indexOf('assets/scene-learning.js'));
console.log('OK: Individuelle Rückmeldung zu allen 1308 Antwortoptionen, alte Antworten werden nicht umgedeutet; 8 Themenblöcke und sichere Ausschnittsgrenzen.');
const unitAssessmentData=JSON.parse(fs.readFileSync(path.join(root,'assets/data/unit-assessment.json'),'utf8'));
const unitAssessmentContext={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'assets/unit-assessment-data.js'),'utf8'),unitAssessmentContext);
assert.equal(JSON.stringify(unitAssessmentContext.window.KLIMA_UNIT_ASSESSMENT_DATA),JSON.stringify(unitAssessmentData));
const finalQuiz=require('../assets/unit-assessment.js'),finalIds=new Set();let finalCount=0;
for(const preset of units.presets)for(const mode of ['basis','fortgeschritten']){
 const selected=finalQuiz.questionsFor(preset,mode,unitAssessmentData,scenes);assert.equal(selected.length,3);
 for(const q of selected){finalCount++;assert(!finalIds.has(q.id));finalIds.add(q.id);assert.equal(q.options.length,3);assert.equal(q.optionFeedback.length,3);assert.equal(new Set(q.options).size,3);assert(q.context.length>100);assert(q.optionFeedback.every(t=>t.length>80));assert(chapterIds.has(q.chapter));assert(new Set(q.sources.map(s=>s.scene)).size>=2);
  for(const source of q.sources){const s=scenes.find(s=>s.id===source.scene);assert(s&&s.arguments.some(a=>a.id===source.argument));assert(units.contains(preset,source.scene));}
  for(const id of q.framework)assert(fw.entries.some(e=>e.id===id));
  for(let i=0;i<3;i++){assert.equal(finalQuiz.grade(q,i).correct,i===q.correct);assert.equal(finalQuiz.grade(q,i).feedback,q.optionFeedback[i]);}
  assert.equal(finalQuiz.grade(q,null),null);assert.equal(finalQuiz.grade(q,99),null);
  const own={[q.id]:{revision:1,selected:q.correct,checked:true}};assert.equal(finalQuiz.progress(own,selected).done,1);assert.equal(finalQuiz.progress(own,unitAssessmentData.units[preset.id][mode==='basis'?'fortgeschritten':'basis']).done,0);
 }
}
assert.equal(finalCount,48);
for(let start=1;start<=54;start++)for(let end=start+1;end<=Math.min(55,start+11);end++)for(const mode of ['basis','fortgeschritten']){
 const selected=finalQuiz.questionsFor({start,end},mode,unitAssessmentData,scenes);assert(selected.length>=2);for(const q of selected){assert(new Set(q.sources.map(s=>s.scene)).size>=2);assert(q.sources.every(s=>units.contains({start,end},s.scene)));assert.equal(q.options.length,3);assert.equal(q.optionFeedback.length,3);}
}
assert(h.indexOf('assets/unit-assessment-data.js')<h.indexOf('assets/unit-assessment.js'));
console.log('OK: 48 szenenübergreifende Abschlussfragen mit 144 Einzelrückmeldungen, getrennte Modi und passende Fragen für jeden eigenen Ausschnitt.');
const finishB=unitAssessmentData.units.kosten.basis[0],finishA=unitAssessmentData.units.kosten.fortgeschritten[0],customFinish=finalQuiz.customQuestions({start:1,end:2},'basis',scenes)[0];
const finishBackup={
 [finishB.id]:{revision:1,selected:finishB.correct,checked:true},
 [finishA.id]:{revision:1,selected:(finishA.correct+1)%3,checked:true},
 [customFinish.id]:{revision:1,selected:customFinish.correct,checked:true},
 unknown:{revision:1,selected:0,checked:true},
 'custom-1-55-basis-vergleich':{revision:1,selected:0,checked:true}
};
const cleanedFinish=finalQuiz.cleanState(JSON.parse(JSON.stringify(finishBackup)),unitAssessmentData,scenes);assert.equal(Object.keys(cleanedFinish).length,3);assert.equal(finalQuiz.progress(cleanedFinish,[finishB]).done,1);assert.equal(finalQuiz.progress(cleanedFinish,[finishA]).wrong,1);assert.equal(finalQuiz.progress(cleanedFinish,[customFinish]).done,1);assert.deepEqual(finalQuiz.cleanState(null,unitAssessmentData,scenes),{});assert.deepEqual(finalQuiz.cleanState({[finishB.id]:{revision:1,selected:99,checked:true}},unitAssessmentData,scenes),{});
console.log('OK: Abschluss-Lernstände beider Modi und eigener Ausschnitte können validiert gesichert und wiederhergestellt werden.');
