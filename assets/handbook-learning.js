'use strict';
(function(root){
 const grade=(question,selected)=>Number.isInteger(selected)&&selected>=0&&selected<question.options.length?{correct:selected===question.correct,explanation:question.explanation}:null;
 if(typeof module!=='undefined'&&module.exports){module.exports={grade};return;}
 const data=root.KLIMA_HANDBOOK_LEARNING,chapters=root.KLIMA_HANDBOOK.chapters,key='klima-handbook-learning-v1';
 const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 let saved={};try{const value=JSON.parse(localStorage.getItem(key)||'{}');if(value&&typeof value==='object'&&!Array.isArray(value))saved=value;}catch{}
 const active={},review={};let storageWorks=true;
 const mode=()=>root.KLIMA_LEVEL.get(),questions=id=>data.chapters[id][mode()];
 function record(q){const r=saved[q.id];return r&&Number.isInteger(r.selected)&&r.selected>=0&&r.selected<q.options.length&&typeof r.checked==='boolean'?r:{selected:null,checked:false,attempts:0};}
 function persist(){try{localStorage.setItem(key,JSON.stringify(saved));storageWorks=true;}catch{storageWorks=false;}summary();}
 const mastered=q=>{const r=record(q);return r.checked&&grade(q,r.selected)?.correct;};
 const incorrect=q=>{const r=record(q);return r.checked&&!grade(q,r.selected)?.correct;};
 const all=()=>chapters.flatMap(c=>questions(c.id));
 const panel=document.createElement('aside');panel.className='learning-overview';panel.innerHTML='<h2>Dein Lernstand im Handbuch</h2><p id="learningTotal" role="status"></p><button type="button" id="learningReview">Offene Fehler gezielt repetieren</button><p id="learningStorage" class="small"></p>';
 document.getElementById('handbookContents').before(panel);
 const direct=document.createElement('div');direct.className='learning-shortcuts';direct.innerHTML='<b>Direkt üben:</b> '+chapters.map((c,i)=>`<a href="#lernen-${esc(c.id)}">Kapitel ${i+1}</a>`).join(' · ');panel.append(direct);
 for(const c of chapters){const host=document.createElement('section');host.className='learning-path';host.id='lernen-'+c.id;host.setAttribute('aria-label','Selbstlernen: '+c.title);document.getElementById('kapitel-'+c.id).querySelector('.handbook-depth').before(host);}
 function summary(){const qs=all(),wrong=qs.filter(incorrect).length;document.getElementById('learningTotal').textContent=`${mode()==='basis'?'Basis':'Fortgeschritten'}: ${qs.filter(mastered).length} von ${qs.length} Lernschritten richtig gelöst. ${wrong} ${wrong===1?'Frage braucht':'Fragen brauchen'} noch eine Korrektur.`;document.getElementById('learningReview').disabled=!wrong;document.getElementById('learningStorage').textContent=storageWorks?'Deine Antworten und Lernstände bleiben auf diesem Gerät gespeichert, getrennt für beide Modi.':'Speichern ist in diesem Browser nicht möglich. Du kannst in dieser Sitzung weiterüben.';}
 function render(id){
  const qs=questions(id),stateKey=mode()+':'+id;let ix=active[stateKey]||0;if(ix>=qs.length)ix=0;active[stateKey]=ix;
  const q=qs[ix],r=record(q),result=r.checked?grade(q,r.selected):null,host=document.getElementById('lernen-'+id),done=qs.filter(mastered).length;
  host.innerHTML=`<p class="eyebrow">SELBSTLERNPFAD · ${mode()==='basis'?'BASIS':'FORTGESCHRITTEN'}</p><h3>Drei Schritte zum sicheren Urteil</h3><p>${done} von 3 Schritten richtig gelöst${review[stateKey]?' · Fehlerwiederholung aktiv':''}.</p><div class="learning-steps" role="group" aria-label="Lernschritt wählen">${qs.map((s,i)=>`<button type="button" data-step="${i}" aria-pressed="${i===ix}">${i+1}. ${s.phase}${mastered(s)?' ✓':incorrect(s)?' · nochmals prüfen':''}</button>`).join('')}</div><div class="learning-card"><p class="small">Schritt ${ix+1} von 3 · ${q.phase}</p><details class="learning-hint" ${ix===0?'open':''}><summary>${ix===0?'Kurz lernen':'Wissen auffrischen / Hinweis'}</summary><p>${esc(q.learn)}</p></details><form><fieldset ${r.checked?'disabled':''}><legend>${esc(q.question)}</legend>${q.options.map((o,i)=>`<label class="learning-option"><input type="radio" name="${esc(q.id)}" value="${i}" ${r.selected===i?'checked':''}> <span>${esc(o)}</span></label>`).join('')}</fieldset><button type="submit" ${r.checked?'disabled':''}>Antwort prüfen</button></form><div class="learning-feedback ${result?(result.correct?'is-correct':'is-incorrect'):''}" role="status" aria-live="polite">${result?`<b>${result.correct?'Richtig begründet.':'Noch nicht richtig.'}</b><p>${result.correct?'':'Die passende Antwort lautet: '+esc(q.options[q.correct])+' '}${esc(result.explanation)}</p>`:''}</div><div class="learning-controls">${r.checked?`<button type="button" data-retry>${result.correct?'Diesen Schritt nochmals üben':'Noch einmal versuchen'}</button>`:''}${ix<2?'<button type="button" data-next>Zum nächsten Lernschritt →</button>':'<a href="#handbookContents">Anderes Kapitel wählen ↑</a>'}<button type="button" data-review ${qs.some(incorrect)?'':'disabled'}>Fehler dieses Kapitels repetieren</button></div></div>`;
  host.querySelectorAll('[data-step]').forEach(b=>b.onclick=()=>{active[stateKey]=Number(b.dataset.step);render(id);});
  host.querySelector('form').onsubmit=e=>{e.preventDefault();const choice=host.querySelector('input:checked');if(!choice){host.querySelector('.learning-feedback').textContent='Wähle zuerst eine Antwort aus.';return;}const selected=Number(choice.value);saved[q.id]={selected,checked:true,attempts:(Number(r.attempts)||0)+1};persist();render(id);};
  host.querySelector('[data-retry]')?.addEventListener('click',()=>{saved[q.id]={selected:null,checked:false,attempts:Number(r.attempts)||0};persist();render(id);});
  host.querySelector('[data-next]')?.addEventListener('click',()=>{const next=review[stateKey]?qs.findIndex((s,i)=>i>ix&&incorrect(s)):ix+1;active[stateKey]=next>=0?next:Math.min(ix+1,2);render(id);});
  host.querySelector('[data-review]').onclick=()=>startReview(id);
 }
 function startReview(id){const qs=questions(id),ix=qs.findIndex(incorrect);if(ix<0)return;const k=mode()+':'+id;review[k]=true;active[k]=ix;render(id);document.getElementById('lernen-'+id).scrollIntoView({block:'start',behavior:'smooth'});}
 document.getElementById('learningReview').onclick=()=>{const chapter=chapters.find(c=>questions(c.id).some(incorrect));if(chapter)startReview(chapter.id);};
 function refresh(){chapters.forEach(c=>render(c.id));summary();}
 document.addEventListener('klima-level-change',refresh);refresh();
})(typeof window!=='undefined'?window:globalThis);
