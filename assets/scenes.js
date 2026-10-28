'use strict';
(() => {
 const data=window.KLIMA_SCENES, scenes=data.scenes, byId=new Map(scenes.map(s=>[s.id,s]));
 const video=document.getElementById('video'), fullSrc=video.getAttribute('src');
 const el=id=>document.getElementById(id), escape=esc;
 const format=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(Math.floor(t%60)).padStart(2,'0')}`;
 const speakerGroup=s=>s.startsWith('Bleisch')?'Barbara Bleisch':s.startsWith('Knutti')?'Reto Knutti':s.startsWith('Foer')?'Jonathan Safran Foer':'Frauke Rostalski';
 let active=scenes[0], whole=false, localClip=false, selectedArgument='', view='scenes', segmentEnded=false;
 let notes={}; const notesKey='klima-scene-notes-v2';
 try{const v=JSON.parse(localStorage.getItem(notesKey)||'{}');if(v&&typeof v==='object'&&!Array.isArray(v))notes=v;}catch{}
 function saveNotes(){try{localStorage.setItem(notesKey,JSON.stringify(notes));el('notesStatus').textContent='Szenenantwort in diesem Browser gespeichert.';}catch{el('notesStatus').textContent='Speichern nicht verfügbar. Bitte dein Szenenjournal exportieren.';}}
 function fillSelect(id,values){for(const value of [...new Set(values)].sort((a,b)=>a.localeCompare(b,'de'))){const o=document.createElement('option');o.value=value;o.textContent=value;el(id).append(o);}}
 fillSelect('themeFilter',scenes.map(s=>s.theme));fillSelect('speakerFilter',scenes.flatMap(s=>s.arguments.map(a=>speakerGroup(a.speaker))));fillSelect('typeFilter',scenes.flatMap(s=>s.arguments.map(a=>a.family)));
 function matchingArguments(s){const q=el('sceneSearch').value.trim().toLocaleLowerCase('de-CH'), person=el('speakerFilter').value, type=el('typeFilter').value;
  if(el('themeFilter').value&&s.theme!==el('themeFilter').value)return [];
  return s.arguments.filter(a=>(!person||speakerGroup(a.speaker)===person)&&(!type||a.family===type)&&(!q||`${s.id} ${s.title} ${s.theme} ${a.id} ${a.speaker} ${a.claim} ${a.reason} ${a.type}`.toLocaleLowerCase('de-CH').includes(q)));
 }
 function renderCatalog(){let total=0;const found=scenes.map(s=>({s,args:matchingArguments(s)})).filter(x=>x.args.length);for(const x of found)total+=x.args.length;
  el('sceneCount').textContent=`${found.length} von ${scenes.length} Szenen · ${total} von ${scenes.reduce((n,s)=>n+s.arguments.length,0)} Argumenteinheiten`;
  el('sceneCards').innerHTML=found.map(({s,args})=>`<article class="scene-card${s.id===active.id?' active':''}" id="card-${s.id}"><p class="eyebrow">${s.id.toUpperCase()} · ${format(s.start)}–${format(s.end)} · ${Math.round(s.duration)} SEK.</p><h3><a href="#szene-${s.id}" data-open="${s.id}">${escape(s.title)}</a></h3><p class="small">${escape(s.theme)} · ${args.length} ${args.length===1?'Argumenteinheit':'Argumenteinheiten'}</p><ul>${args.map(a=>`<li><a href="#szene-${s.id}-${a.id}" data-open="${s.id}" data-arg="${a.id}"><b>${a.id}</b> ${escape(a.claim)}</a></li>`).join('')}</ul><button data-play="${s.id}">Diesen Abschnitt ansehen ▶</button><span class="scene-done">${notes[s.id]&&Object.values(notes[s.id]).some(v=>typeof v==='string'&&v.trim())?'✎ Notizen vorhanden':''}</span></article>`).join('')||'<p>Keine passenden Szenen. Passe die Filter an.</p>';
  el('allArguments').innerHTML=found.map(({s,args})=>`<section class="argument-group"><h3>${s.id.toUpperCase()} · ${format(s.start)}–${format(s.end)} · ${escape(s.title)}</h3>${args.map(a=>`<article class="argument-row"><div><a href="#szene-${s.id}-${a.id}" data-open="${s.id}" data-arg="${a.id}"><b>${a.id} · Filmstelle öffnen ↗</b></a><p class="small">${escape(a.speaker)} · ${escape(a.type)}</p></div><div><p><b>These / Funktion:</b> ${escape(a.claim)}</p><p><b>Begründung:</b> ${escape(a.reason)}</p></div></article>`).join('')}</section>`).join('');
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=e=>{e.preventDefault();selectScene(b.dataset.open,false,b.dataset.arg||'',true);});
  document.querySelectorAll('[data-play]').forEach(b=>b.onclick=()=>selectScene(b.dataset.play,true,'',true));
 }
 function renderAnalysis(){const s=active,n=notes[s.id]||{};
  el('sceneAnalysis').innerHTML=`<p class="eyebrow">${s.id.toUpperCase()} / ${escape(s.theme)}</p><h3>Die Argumente dieser Szene</h3><p class="small">Sinngemässe Rekonstruktionen, keine Zitate. Einwände, Präzisierungen und offen präsentierte Prüfthesen sind ausdrücklich gekennzeichnet.</p>${s.arguments.map(a=>`<article class="scene-argument${a.id===selectedArgument?' selected':''}" id="argument-${a.id}"><p class="argument-meta"><b>${a.id}</b> · ${escape(a.speaker)} <span>${escape(a.type)}</span></p><h4>${escape(a.claim)}</h4><p><b>Begründung im Gespräch:</b> ${escape(a.reason)}</p><button class="argument-link" data-copy-arg="${a.id}">Argumentlink kopieren</button></article>`).join('')}<div class="scene-questions"><h3>Genau hier prüfen</h3>${s.questions.map((q,i)=>`<label>${i+1}. ${escape(q)}<textarea aria-label="${i+1}. ${escape(q)}" data-scene-note="q${i}" placeholder="Rekonstruiere den Schritt mit Beleg aus dieser Szene …">${escape(typeof n['q'+i]==='string'?n['q'+i]:'')}</textarea></label>`).join('')}<label>Die unausgesprochene Schlussregel dieser Szene<textarea aria-label="Die unausgesprochene Schlussregel dieser Szene" data-scene-note="warrant" placeholder="Wenn …, dann …; dabei wird vorausgesetzt, dass …">${escape(typeof n.warrant==='string'?n.warrant:'')}</textarea></label><label>Mein stärkster Einwand / noch zu prüfender Beleg<textarea aria-label="Mein stärkster Einwand / noch zu prüfender Beleg" data-scene-note="critical">${escape(typeof n.critical==='string'?n.critical:'')}</textarea></label><p id="notesStatus" role="status" class="small"></p><button id="exportSceneNotes">Szenenjournal exportieren ↓</button><details class="teacher-note"><summary>Prüfhinweis / möglicher Erwartungshorizont</summary><p>${escape(s.teacher)}</p><p>Akzeptiere auch abweichende begründete Rekonstruktionen. Entscheidend sind die Prämissen, der Schluss und seine Grenzen — nicht die politische Zustimmung.</p></details></div>`;
  el('sceneAnalysis').querySelectorAll('[data-scene-note]').forEach(t=>t.oninput=()=>{if(!notes[s.id])notes[s.id]={};notes[s.id][t.dataset.sceneNote]=t.value;saveNotes();});
  el('sceneAnalysis').querySelectorAll('[data-copy-arg]').forEach(b=>b.onclick=()=>copyLink(s.id,b.dataset.copyArg,b));
  el('exportSceneNotes').onclick=exportNotes;
 }
 function sceneURL(id,arg=''){const u=new URL(location.href);u.hash=`szene-${id}${arg?'-'+arg:''}`;return u.href;}
 async function copyLink(id,arg,button){const text=sceneURL(id,arg);try{await navigator.clipboard.writeText(text);button.textContent='Link kopiert ✓';}catch{button.textContent='Link markieren und kopieren';const input=document.createElement('input');input.value=text;button.after(input);input.select();}}
 function seekStart(play){const start=localClip?0:active.start;segmentEnded=false;el('sceneEnd').hidden=true;video.currentTime=start;if(play){const promise=video.play();if(promise)promise.catch(()=>{el('videoStatus').textContent='Die Szene ist ausgewählt. Zum Starten ▶ im Filmplayer drücken.';});}}
 function setSourceForScene(play){const src=window.KLIMA_LOCAL_CLIPS?`clips/${active.id}.mp4`:fullSrc;localClip=!!window.KLIMA_LOCAL_CLIPS;
  if(video.getAttribute('src')!==src){video.pause();video.setAttribute('src',src);video.load();video.addEventListener('loadedmetadata',()=>seekStart(play),{once:true});}
  else if(video.readyState>=1)seekStart(play);else video.addEventListener('loadedmetadata',()=>seekStart(play),{once:true});
 }
 function selectScene(id,play=false,arg='',scroll=false){if(!byId.has(id))return;active=byId.get(id);selectedArgument=arg;whole=false;el('wholeFilm').setAttribute('aria-pressed','false');el('wholeFilm').textContent='Zum ganzen Film wechseln';
  el('currentSceneTitle').textContent=active.title;el('sceneTimeLabel').textContent=`${active.id.toUpperCase()} · Originalfilm ${format(active.start)}–${format(active.end)} · ${Math.round(active.duration)} Sekunden · stoppt am Szenenende`;
  el('sceneTimeline').disabled=false;el('sceneTimeline').max=String(active.duration);el('sceneTimeline').value='0';el('scenePosition').textContent=`00:00 / ${format(active.duration)} · Filmzeit ${format(active.start)}`;
  el('youtubeScene').href=`https://www.youtube.com/watch?v=J77-r4-gwxE&t=${Math.floor(active.start)}s`;
  el('prevScene').disabled=active===scenes[0];el('nextScene').disabled=active===scenes[scenes.length-1];
  el('localClipDownload').hidden=!window.KLIMA_LOCAL_CLIPS;if(window.KLIMA_LOCAL_CLIPS)el('localClipDownload').href=`clips/${active.id}.mp4`;
  history.replaceState(null,'',sceneURL(id,arg));renderAnalysis();renderCatalog();setSourceForScene(play);
  if(scroll){el('gespraech').scrollIntoView({block:'start'});if(arg)el('argument-'+arg)?.scrollIntoView({block:'nearest'});}
 }
 function currentFilmTime(){return video.currentTime+(localClip?active.start:0);}
 video.addEventListener('timeupdate',()=>{if(whole)return;const elapsed=Math.max(0,currentFilmTime()-active.start);el('sceneTimeline').value=String(Math.min(elapsed,active.duration));el('scenePosition').textContent=`${format(Math.min(elapsed,active.duration))} / ${format(active.duration)} · Filmzeit ${format(currentFilmTime())}`;
  if(elapsed>=active.duration-.08&&!segmentEnded){segmentEnded=true;video.pause();el('sceneEnd').hidden=false;el('videoStatus').textContent='Szenenende erreicht.';}
 });
 video.addEventListener('ended',()=>{if(!whole){segmentEnded=true;el('sceneEnd').hidden=false;}});
 video.addEventListener('play',()=>{if(!whole&&(segmentEnded||currentFilmTime()<active.start-.2||currentFilmTime()>=active.end-.08))seekStart(false);});
 video.addEventListener('seeking',()=>{if(!whole&&!localClip){if(video.currentTime<active.start-.2)video.currentTime=active.start;if(video.currentTime>active.end+.2)video.currentTime=active.end-.12;}});
 el('sceneTimeline').oninput=e=>{if(whole)return;segmentEnded=false;el('sceneEnd').hidden=true;video.currentTime=(localClip?0:active.start)+Number(e.target.value);};
 el('replayScene').onclick=()=>{if(whole)selectScene(active.id,true);else seekStart(true);};
 el('prevScene').onclick=()=>selectScene(scenes[Math.max(0,scenes.indexOf(active)-1)].id,true,'',true);
 el('nextScene').onclick=()=>selectScene(scenes[Math.min(scenes.length-1,scenes.indexOf(active)+1)].id,true,'',true);
 el('wholeFilm').onclick=()=>{if(whole){selectScene(active.id,false);return;}const t=currentFilmTime();whole=true;segmentEnded=false;el('sceneEnd').hidden=true;el('wholeFilm').setAttribute('aria-pressed','true');el('wholeFilm').textContent='Zur begrenzten Szene zurück';el('sceneTimeLabel').textContent='Ganzer Film · keine automatische Pause am Szenenende';el('sceneTimeline').disabled=true;
  if(localClip){localClip=false;video.setAttribute('src',fullSrc);video.load();video.addEventListener('loadedmetadata',()=>{video.currentTime=t;},{once:true});}
 };
 // This button also works with physically cut local clips: the journal always gets original-film time.
 el('stamp').onclick=()=>{const t=Math.floor(currentFilmTime());state.time=format(t);hydrate();persist();};
 // A user-selected file is treated as the full original film, not as a pre-cut clip.
 el('videoFile').addEventListener('change',()=>{if(!el('videoFile').files[0])return;whole=true;localClip=false;el('sceneTimeLabel').textContent='Eigene Videodatei · ganzer Film';el('wholeFilm').textContent='Zur SRF-Szene zurück';});
 el('copySceneLink').onclick=()=>copyLink(active.id,'',el('copySceneLink'));
 function sceneNotesText(){let text='# Szenenjournal – Klimakrise und Argumentation\n\n';for(const s of scenes){const n=notes[s.id];if(!n||!Object.values(n).some(v=>typeof v==='string'&&v.trim()))continue;text+=`## ${s.id.toUpperCase()} · ${format(s.start)}–${format(s.end)} · ${s.title}\n\n${sceneURL(s.id)}\n\n`;s.questions.forEach((q,i)=>{text+=`### ${q}\n\n${n['q'+i]||'Noch offen'}\n\n`;});text+=`### Schlussregel\n\n${n.warrant||'Noch offen'}\n\n### Gegenargument / Quellenprüfung\n\n${n.critical||'Noch offen'}\n\n`;}
  return text;
 }
 function exportNotes(){download(sceneNotesText(),'klima-szenenjournal.md','text/markdown;charset=utf-8');}
 window.KLIMA_SCENE_NOTES_TEXT=sceneNotesText;
 window.KLIMA_GET_SCENE_NOTES=()=>notes;
 window.KLIMA_SET_SCENE_NOTES=value=>{const clean={};if(value&&typeof value==='object'&&!Array.isArray(value)){for(const scene of scenes){const raw=value[scene.id];if(!raw||typeof raw!=='object'||Array.isArray(raw))continue;const n={};for(const k of ['q0','q1','warrant','critical'])if(typeof raw[k]==='string')n[k]=raw[k].slice(0,100000);clean[scene.id]=n;}}notes=clean;saveNotes();renderAnalysis();renderCatalog();};
 for(const id of ['sceneSearch','themeFilter','speakerFilter','typeFilter'])el(id).addEventListener('input',renderCatalog);
 el('clearFilters').onclick=()=>{for(const id of ['sceneSearch','themeFilter','speakerFilter','typeFilter'])el(id).value='';renderCatalog();};
 function setView(v){view=v;el('sceneCards').hidden=v!=='scenes';el('argumentliste').hidden=v!=='arguments';el('sceneView').setAttribute('aria-pressed',String(v==='scenes'));el('argumentView').setAttribute('aria-pressed',String(v==='arguments'));}
 el('sceneView').onclick=()=>setView('scenes');el('argumentView').onclick=()=>setView('arguments');
 document.querySelector('a[href="#argumentliste"]').onclick=e=>{e.preventDefault();setView('arguments');el('szenen').scrollIntoView({block:'start'});};
 function readRoute(){const m=location.hash.match(/^#szene-(s\d{2})(?:-(A\d{3}))?$/);if(m&&byId.has(m[1]))selectScene(m[1],false,m[2]||'',true);}
 window.addEventListener('hashchange',readRoute);
 const hash=location.hash;selectScene(scenes[0].id,false);if(hash.startsWith('#szene-')){history.replaceState(null,'',hash);readRoute();}else history.replaceState(null,'',hash||'#start');
 // Reset scene mode after returning from whole-film mode.
 const originalSelect=el('sceneTimeline');new MutationObserver(()=>{originalSelect.disabled=whole;}).observe(el('wholeFilm'),{attributes:true,attributeFilter:['aria-pressed']});
})();
