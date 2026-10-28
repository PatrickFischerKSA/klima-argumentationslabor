'use strict';
(() => {
 const data=window.KLIMA_SCENES, scenes=data.scenes, byId=new Map(scenes.map(s=>[s.id,s]));
 const video=document.getElementById('video'); let fullSrc=video.getAttribute('src');
 const unit=window.KLIMA_UNIT;
 const el=id=>document.getElementById(id), escape=esc;
 const fwEntries=new Map(window.KLIMA_FRAMEWORK.entries.map(e=>[e.id,e]));
 const sceneTitle=s=>window.KLIMA_LEVEL.isAdvanced()?s.title:window.KLIMA_LEVELS.sceneTitles[s.id];
 const format=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 const speakerGroup=s=>s.startsWith('Bleisch')?'Barbara Bleisch':s.startsWith('Knutti')?'Reto Knutti':s.startsWith('Foer')?'Jonathan Safran Foer':'Frauke Rostalski';
 let active=scenes[0], whole=false, localClip=false, selectedArgument='', view='scenes', segmentEnded=false;
 let openReviews=[];
 let notes={}; const notesKey='klima-scene-notes-v2';
 try{const v=JSON.parse(localStorage.getItem(notesKey)||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))notes=v;}catch{}
 function saveNotes(){try{localStorage.setItem(notesKey,JSON.stringify(notes));el('notesStatus').textContent='Szenenantwort in diesem Browser gespeichert.';}catch{el('notesStatus').textContent='Speichern nicht verfügbar. Bitte dein Szenenjournal exportieren.';}}
 function fillSelect(id,values){for(const value of [...new Set(values)].sort((a,b)=>a.localeCompare(b,'de'))){const o=document.createElement('option');o.value=value;o.textContent=value;el(id).append(o);}}
 for(const group of window.KLIMA_LEVELS.groups){const o=document.createElement('option');o.value=group.id;o.textContent=group.label;el('basicTypeFilter').append(o);}
 fillSelect('themeFilter',scenes.map(s=>s.theme));fillSelect('speakerFilter',scenes.flatMap(s=>s.arguments.map(a=>speakerGroup(a.speaker))));for(const ref of window.KLIMA_FRAMEWORK.entries.filter(e=>e.section==='I')){const o=document.createElement('option');o.value=ref.id;o.textContent=ref.name;el('typeFilter').append(o);}
 const usedChecks=new Set(scenes.flatMap(s=>s.arguments.flatMap(a=>a.analysis.fallacyChecks.map(c=>c.id))));
 for(const ref of window.KLIMA_FRAMEWORK.entries.filter(e=>usedChecks.has(e.id))){const o=document.createElement('option');o.value=ref.id;o.textContent=ref.name;el('fallacyFilter').append(o);}
 for(const [value,label] of Object.entries(window.KLIMA_FRAMEWORK.statusLabels)){const o=document.createElement('option');o.value=value;o.textContent=label;el('assessmentFilter').append(o);}
 function matchingArguments(s){if(!unit.catalogIncludes(s))return [];const q=el('sceneSearch').value.trim().toLocaleLowerCase('de-CH'), person=el('speakerFilter').value, type=window.KLIMA_LEVEL.isAdvanced()?el('typeFilter').value:'', check=window.KLIMA_LEVEL.isAdvanced()?el('fallacyFilter').value:'', status=window.KLIMA_LEVEL.isAdvanced()?el('assessmentFilter').value:'', basicType=window.KLIMA_LEVEL.isAdvanced()?'':el('basicTypeFilter').value;
  if(el('themeFilter').value&&s.theme!==el('themeFilter').value)return [];
  return s.arguments.filter(a=>(!person||speakerGroup(a.speaker)===person)&&(!basicType||window.KLIMA_LEVEL.groupFor(a).id===basicType)&&(!type||a.analysis.forms.some(r=>r.id===type))&&(!check&&!status||a.analysis.fallacyChecks.some(r=>(!check||r.id===check)&&(!status||r.status===status)))&&(!q||`${s.id} ${s.title} ${sceneTitle(s)} ${s.theme} ${a.id} ${a.speaker} ${a.claim} ${a.reason} ${a.type} ${a.analysis.assessment} ${a.analysis.fallacyChecks.map(r=>fwEntries.get(r.id).name+' '+r.label).join(' ')}`.toLocaleLowerCase('de-CH').includes(q)));
 }
 function renderCatalog(){let total=0;const found=scenes.map(s=>({s,args:matchingArguments(s)})).filter(x=>x.args.length);for(const x of found)total+=x.args.length;
  el('sceneCount').textContent=`${found.length} von ${scenes.length} Szenen · ${total} von ${scenes.reduce((n,s)=>n+s.arguments.length,0)} Argumenteinheiten`;
  el('sceneCards').innerHTML=found.map(({s,args})=>`<article class="scene-card${s.id===active.id?' active':''}" id="card-${s.id}"><p class="eyebrow">${s.id.toUpperCase()} · ${format(s.start)}–${format(s.end)} · ${Math.round(s.duration)} SEK.</p><h3><a href="#szene-${s.id}" data-open="${s.id}">${escape(sceneTitle(s))}</a></h3><p class="small">${escape(s.theme)} · ${args.length} ${args.length===1?'Argumenteinheit':'Argumenteinheiten'}</p><ul>${args.map(a=>`<li><a href="#szene-${s.id}-${a.id}" data-open="${s.id}" data-arg="${a.id}"><b>${a.id}</b> ${escape(a.claim)}</a></li>`).join('')}</ul><button data-play="${s.id}">Diesen Abschnitt ansehen ▶</button><span class="scene-learning-badge">${window.KLIMA_SCENE_LEARNING.progress(s.id).done} / ${window.KLIMA_SCENE_LEARNING.progress(s.id).total} Selbstlernfragen richtig</span><span class="scene-done">${notes[s.id]&&Object.values(notes[s.id]).some(v=>typeof v==='string'&&v.trim())?'✎ Notizen vorhanden':''}</span></article>`).join('')||'<p>Keine passenden Szenen. Passe die Filter an.</p>';
  el('allArguments').innerHTML=found.map(({s,args})=>`<section class="argument-group"><h3>${s.id.toUpperCase()} · ${format(s.start)}–${format(s.end)} · ${escape(sceneTitle(s))}</h3>${args.map(a=>`<article class="argument-row"><div><a href="#szene-${s.id}-${a.id}" data-open="${s.id}" data-arg="${a.id}"><b>${a.id} · Filmstelle öffnen ↗</b></a><p class="small">${escape(a.speaker)} · ${escape(window.KLIMA_LEVEL.describe(a))}</p></div><div><p><b>${window.KLIMA_LEVEL.isAdvanced()?'These / Funktion:':'Behauptung:'}</b> ${escape(a.claim)}</p><p><b>Begründung:</b> ${escape(a.reason)}</p>${window.KLIMA_RENDER_ARGUMENT_ANALYSIS(a,false)}</div></article>`).join('')}</section>`).join('');
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=e=>{e.preventDefault();selectScene(b.dataset.open,false,b.dataset.arg||'',true);});
  document.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>selectScene(b.dataset.play,true,'',true));
 }
 function renderAnalysis(){const s=active,n=notes[s.id]||{}, advanced=window.KLIMA_LEVEL.isAdvanced(),questions=advanced?s.questions:window.KLIMA_LEVELS.sceneQuestions[s.id], questionPrefix=advanced?'q':'bq';
  el('sceneAnalysis').innerHTML=`<div id="sceneLearning"></div><p class="eyebrow">${s.id.toUpperCase()} / ${escape(s.theme)}</p><h3>Die Argumente dieser Szene</h3><p class="small">${advanced?'Sinngemässe Rekonstruktionen, keine Zitate. Einwände, Präzisierungen und offen präsentierte Prüfthesen sind ausdrücklich gekennzeichnet.':'Die Aussagen sind in eigenen Worten zusammengefasst. Prüfe sie an der Filmszene.'}</p>${s.arguments.map(a=>`<article class="scene-argument${a.id===selectedArgument?' selected':''}" id="argument-${a.id}"><p class="argument-meta"><b>${a.id}</b> · ${escape(a.speaker)} <span>${escape(window.KLIMA_LEVEL.describe(a))}</span></p><h4>${escape(a.claim)}</h4><p><b>Begründung im Gespräch:</b> ${escape(a.reason)}</p>${window.KLIMA_RENDER_ARGUMENT_ANALYSIS(a,a.id===selectedArgument)}<button class="argument-link" data-copy-arg="${a.id}">Argumentlink kopieren</button></article>`).join('')}<div class="scene-questions"><h3>Genau hier prüfen</h3>${questions.map((q,i)=>`<label>${i+1}. ${escape(q)}<textarea aria-label="${i+1}. ${escape(q)}" data-scene-note="${questionPrefix}${i}" placeholder="${advanced?'Rekonstruiere den Schritt mit Beleg aus dieser Szene …':'Notiere deine Antwort in eigenen Worten …'}">${escape(typeof n[questionPrefix+i]==='string'?n[questionPrefix+i]:'')}</textarea></label>`).join('')}<label class="level-advanced">Die unausgesprochene Schlussregel dieser Szene<textarea aria-label="Die unausgesprochene Schlussregel dieser Szene" data-scene-note="warrant" placeholder="Wenn …, dann …; dabei wird vorausgesetzt, dass …">${escape(typeof n.warrant==='string'?n.warrant:'')}</textarea></label><label>${advanced?'Mein stärkster Einwand / noch zu prüfender Beleg':'Was spricht dagegen? Was möchte ich noch überprüfen?'}<textarea aria-label="${advanced?'Mein stärkster Einwand / noch zu prüfender Beleg':'Was spricht dagegen? Was möchte ich noch überprüfen?'}" data-scene-note="critical">${escape(typeof n.critical==='string'?n.critical:'')}</textarea></label><p id="notesStatus" role="status" class="small"></p><button id="exportSceneNotes">Szenenjournal exportieren ↓</button><details class="teacher-note level-advanced"><summary>Prüfhinweis / möglicher Erwartungshorizont</summary><p>${escape(s.teacher)}</p><p>Akzeptiere auch abweichende begründete Rekonstruktionen. Entscheidend sind die Prämissen, der Schluss und seine Grenzen — nicht die politische Zustimmung.</p></details></div>`;
  el('sceneAnalysis').querySelectorAll('[data-scene-note]').forEach(t=>t.oninput=()=>{if(!notes[s.id])notes[s.id]={};notes[s.id][t.dataset.sceneNote]=t.value;saveNotes();});
  el('sceneAnalysis').querySelectorAll('[data-copy-arg]').forEach(b=>b.onclick=()=>copyLink(s.id,b.dataset.copyArg,b));
  el('exportSceneNotes').onclick=exportNotes;
  window.KLIMA_SCENE_LEARNING.mount(s,{argument:selectedArgument,onProgress:()=>{renderCatalog();unit.refresh();},onScene:id=>selectScene(id,false,'',false)});unit.refresh();
 }
 function sceneURL(id,arg=''){const u=new URL(location.href);u.hash=`szene-${id}${arg?'-'+arg:''}`;return u.href;}
 async function copyLink(id,arg,button){const text=sceneURL(id,arg);try{await navigator.clipboard.writeText(text);button.textContent='Link kopiert ✓';}catch{button.textContent='Link markieren und kopieren';const input=document.createElement('input');input.value=text;button.after(input);input.select();}}
 function seekStart(play){const start=localClip?0:(whole?unit.bounds().start:active.start);segmentEnded=false;el('sceneEnd').hidden=true;video.currentTime=start;if(play){const promise=video.play();if(promise)promise.catch(()=>{el('videoStatus').textContent='Die Szene ist ausgewählt. Zum Starten ▶ im Filmplayer drücken.';});}}
 function setSourceForScene(play){const src=window.KLIMA_LOCAL_CLIPS?`clips/${active.id}.mp4`:fullSrc;localClip=!!window.KLIMA_LOCAL_CLIPS;
  if(video.getAttribute('src')!==src){video.pause();video.setAttribute('src',src);video.load();video.addEventListener('loadedmetadata',()=>seekStart(play),{once:true});}
  else if(video.readyState>=1)seekStart(play);else video.addEventListener('loadedmetadata',()=>seekStart(play),{once:true});
 }
 function selectScene(id,play=false,arg='',scroll=false){if(!byId.has(id))return;unit.ensureScene(id);active=byId.get(id);selectedArgument=arg;whole=false;el('wholeFilm').setAttribute('aria-pressed','false');el('wholeFilm').textContent='Gewählte Einheit ansehen';el('replayScene').textContent='Szene wiederholen ↺';
  el('currentSceneTitle').textContent=sceneTitle(active);el('sceneTimeLabel').textContent=`${active.id.toUpperCase()} · Originalfilm ${format(active.start)}–${format(active.end)} · ${Math.round(active.duration)} Sekunden · stoppt am Szenenende`;
  el('sceneTimeline').closest('label').firstChild.textContent='Position innerhalb der Szene';el('sceneTimeline').setAttribute('aria-label','Position innerhalb der Szene');el('sceneTimeline').disabled=false;el('sceneTimeline').max=String(active.duration);el('sceneTimeline').value='0';el('scenePosition').textContent=`00:00 / ${format(active.duration)} · Filmzeit ${format(active.start)}`;
  el('youtubeScene').href=`https://www.youtube.com/watch?v=J77-r4-gwxE&t=${Math.floor(active.start)}s`;
  el('prevScene').disabled=active===unit.selected()[0];el('nextScene').disabled=active===unit.selected().at(-1);
  el('localClipDownload').hidden=!window.KLIMA_LOCAL_CLIPS;if(window.KLIMA_LOCAL_CLIPS)el('localClipDownload').href=`clips/${active.id}.mp4`;
  history.replaceState(null,'',sceneURL(id,arg));renderAnalysis();renderCatalog();setSourceForScene(play);
  if(scroll){el('gespraech').scrollIntoView({block:'start'});if(arg)el('argument-'+arg)?.scrollIntoView({block:'nearest'});}
 }
 function currentFilmTime(){return video.currentTime+(localClip?active.start:0);}
 function playbackBounds(){return whole?unit.bounds():{start:active.start,end:active.end,duration:active.duration};}
 video.addEventListener('timeupdate',()=>{const b=playbackBounds(),elapsed=Math.max(0,currentFilmTime()-b.start);el('sceneTimeline').value=String(Math.min(elapsed,b.duration));el('scenePosition').textContent=`${format(Math.min(elapsed,b.duration))} / ${format(b.duration)} · Filmzeit ${format(currentFilmTime())}`;
  if(elapsed>=b.duration-.08&&!segmentEnded){segmentEnded=true;video.pause();el('sceneEnd').hidden=false;el('sceneEnd').textContent=whole?'Lerneinheit beendet. Vergleiche jetzt die Szenen und bearbeite das Abschlussquiz.':'Szene beendet. Bearbeite ihre Frage oder gehe zur nächsten Szene deiner Einheit.';el('videoStatus').textContent=whole?'Ende des gewählten Ausschnitts erreicht.':'Szenenende erreicht.';}
 });
 video.addEventListener('ended',()=>{segmentEnded=true;el('sceneEnd').hidden=false;});
 video.addEventListener('play',()=>{const b=playbackBounds();if(segmentEnded||currentFilmTime()<b.start-.2||currentFilmTime()>=b.end-.08)seekStart(false);});
 video.addEventListener('seeking',()=>{if(!localClip){const b=playbackBounds();if(video.currentTime<b.start-.2)video.currentTime=b.start;if(video.currentTime>b.end+.2)video.currentTime=b.end-.12;}});
 el('sceneTimeline').oninput=e=>{segmentEnded=false;el('sceneEnd').hidden=true;video.currentTime=(localClip?0:playbackBounds().start)+Number(e.target.value);};
 el('replayScene').onclick=()=>seekStart(true);
 el('prevScene').onclick=()=>{const list=unit.selected();selectScene(list[Math.max(0,list.indexOf(active)-1)].id,true,'',true);};
 el('nextScene').onclick=()=>{const list=unit.selected();selectScene(list[Math.min(list.length-1,list.indexOf(active)+1)].id,true,'',true);};
 function startUnit(play=true){video.pause();whole=true;localClip=false;segmentEnded=false;active=unit.first();selectedArgument='';const b=unit.bounds();el('sceneEnd').hidden=true;el('wholeFilm').setAttribute('aria-pressed','true');el('wholeFilm').textContent='Zur Einzelszene zurück';el('replayScene').textContent='Einheit wiederholen ↺';el('currentSceneTitle').textContent=unit.title();el('sceneTimeLabel').textContent=`Lerneinheit ${unit.selected()[0].id.toUpperCase()}–${unit.selected().at(-1).id.toUpperCase()} · ${format(b.start)}–${format(b.end)} · stoppt am Ende des Ausschnitts`;el('sceneTimeline').closest('label').firstChild.textContent='Position innerhalb der Lerneinheit';el('sceneTimeline').setAttribute('aria-label','Position innerhalb der Lerneinheit');el('sceneTimeline').disabled=false;el('sceneTimeline').max=b.duration.toFixed(2);el('sceneTimeline').value='0';el('prevScene').disabled=true;el('nextScene').disabled=unit.selected().length<2;el('youtubeScene').href=`https://www.youtube.com/watch?v=J77-r4-gwxE&t=${Math.floor(b.start)}s`;el('localClipDownload').hidden=true;renderAnalysis();renderCatalog();
  if(video.getAttribute('src')!==fullSrc){video.setAttribute('src',fullSrc);video.load();video.addEventListener('loadedmetadata',()=>seekStart(play),{once:true});}else if(video.readyState>=1)seekStart(play);else video.addEventListener('loadedmetadata',()=>seekStart(play),{once:true});
 }
 el('wholeFilm').onclick=()=>{if(whole){video.pause();selectScene(active.id,false);}else startUnit(true);};
 const atTime=document.createElement('button');atTime.id='unitQuestionAtTime';atTime.type='button';atTime.textContent='Fragen zur aktuellen Filmstelle';el('scenePosition').after(atTime);
 atTime.onclick=()=>{const now=currentFilmTime(),s=unit.selected().find(s=>now>=s.start&&now<s.end)||(now<unit.bounds().start?unit.first():unit.selected().at(-1));active=s;selectedArgument='';el('youtubeScene').href=`https://www.youtube.com/watch?v=J77-r4-gwxE&t=${Math.floor(s.start)}s`;el('prevScene').disabled=s===unit.first();el('nextScene').disabled=s===unit.selected().at(-1);renderAnalysis();renderCatalog();if(!whole)el('currentSceneTitle').textContent=sceneTitle(active);el('sceneLearning').scrollIntoView({block:'start'});};
 document.addEventListener('klima-unit-change',event=>{if(event.detail.rangeChanged){video.pause();selectScene(unit.first().id,false);}else{renderAnalysis();renderCatalog();}});
 document.addEventListener('klima-unit-catalog',renderCatalog);
 document.addEventListener('klima-unit-open-scene',event=>{video.pause();selectScene(event.detail.id,false,event.detail.argument||'',true);});
 document.addEventListener('klima-unit-play',()=>{startUnit(true);el('gespraech').scrollIntoView({block:'start'});});
 // This button also works with physically cut local clips: the journal always gets original-film time.
 el('stamp').onclick=()=>{const t=Math.floor(currentFilmTime());state.time=format(t);hydrate();persist();};
 // A user-selected file is treated as the full original film, not as a pre-cut clip.
 el('videoFile').addEventListener('change',()=>{if(!el('videoFile').files[0])return;fullSrc=video.getAttribute('src');startUnit(false);});
 el('copySceneLink').onclick=()=>copyLink(active.id,'',el('copySceneLink'));
 function sceneNotesText(){let text='# Szenenjournal – Klimakrise und Argumentation\n\n';for(const s of scenes){const n=notes[s.id];if(!n||!Object.values(n).some(v=>typeof v==='string'&&v.trim()))continue;text+=`## ${s.id.toUpperCase()} · ${format(s.start)}–${format(s.end)} · ${s.title}\n\n${sceneURL(s.id)}\n\n`;for(const [level,questions,prefix] of [['Basis',window.KLIMA_LEVELS.sceneQuestions[s.id],'bq'],['Fortgeschritten',s.questions,'q']]){if(questions.some((q,i)=>typeof n[prefix+i]==='string'&&n[prefix+i].trim())){text+=`### ${level}\n\n`;questions.forEach((q,i)=>{text+=`#### ${q}\n\n${n[prefix+i]||'Noch offen'}\n\n`;});}}text+=`### Schlussregel\n\n${n.warrant||'Noch offen'}\n\n### Gegenargument / Quellenprüfung\n\n${n.critical||'Noch offen'}\n\n`;}
  return text;
 }
 function exportNotes(){download(sceneNotesText(),'klima-szenenjournal.md','text/markdown;charset=utf-8');}
 window.KLIMA_SCENE_NOTES_TEXT=sceneNotesText;
 window.KLIMA_GET_SCENE_NOTES=()=>notes;
 window.KLIMA_SET_SCENE_NOTES=value=>{const clean={};if(value&&typeof value==='object'&&!Array.isArray(value)){for(const scene of scenes){const raw=value[scene.id];if(!raw||typeof raw!=='object'||Array.isArray(raw))continue;const n={};for(const k of ['q0','q1','bq0','bq1','warrant','critical'])if(typeof raw[k]==='string')n[k]=raw[k].slice(0,100000);clean[scene.id]=n;}}notes=clean;saveNotes();renderAnalysis();renderCatalog();};
 for(const id of ['sceneSearch','themeFilter','speakerFilter','basicTypeFilter','typeFilter','fallacyFilter','assessmentFilter'])el(id).addEventListener('input',renderCatalog);
 el('clearFilters').onclick=()=>{for(const id of ['sceneSearch','themeFilter','speakerFilter','basicTypeFilter','typeFilter','fallacyFilter','assessmentFilter'])el(id).value='';renderCatalog();};
 function setView(v){view=v;el('sceneCards').hidden=v!=='scenes';el('argumentliste').hidden=v!=='arguments';el('sceneView').setAttribute('aria-pressed',String(v==='scenes'));el('argumentView').setAttribute('aria-pressed',String(v==='arguments'));}
 el('sceneView').onclick=()=>setView('scenes');el('argumentView').onclick=()=>setView('arguments');
 document.querySelector('a[href="#argumentliste"]').onclick=e=>{e.preventDefault();setView('arguments');el('szenen').scrollIntoView({block:'start'});};
 function readRoute(){const m=location.hash.match(/^#szene-(s\d{2})(?:-(A\d{3}))?$/);if(m&&byId.has(m[1]))selectScene(m[1],false,m[2]||'',true);}
 document.addEventListener('klima-level-change',e=>{
  if(e.detail.previous==='fortgeschritten')openReviews=[...el('sceneAnalysis').querySelectorAll('details[data-review][open]')].map(n=>n.dataset.review);
  renderCatalog();renderAnalysis();el('currentSceneTitle').textContent=whole?unit.title():sceneTitle(active);
  if(window.KLIMA_LEVEL.isAdvanced())for(const id of openReviews){const d=el('sceneAnalysis').querySelector(`details[data-review="${id}"]`);if(d)d.open=true;}
 });
 window.addEventListener('hashchange',readRoute);
 const hash=location.hash;const initial=hash.match(/^#szene-(s\d{2})/);selectScene(initial&&byId.has(initial[1])?initial[1]:unit.first().id,false);if(hash.startsWith('#szene-')){history.replaceState(null,'',hash);readRoute();}else{history.replaceState(null,'',hash||'#start');if(hash==='#argumentliste'){setView('arguments');el('szenen').scrollIntoView({block:'start'});}}
})();
