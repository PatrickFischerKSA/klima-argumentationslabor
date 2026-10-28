'use strict';
(() => {
 const fw=window.KLIMA_FRAMEWORK, entries=new Map(fw.entries.map(e=>[e.id,e]));
 const el=id=>document.getElementById(id), safe=esc;
 const refLink=(id,text='')=>{const r=entries.get(id);return `<a href="#kategorie-${id}" data-fw-ref="${id}">${safe(text||r.name)} <small>(${id}, S. ${r.page})</small></a>`;};
 window.KLIMA_RENDER_ARGUMENT_ANALYSIS=(argument,open=false)=>{
  if(!window.KLIMA_LEVEL.isAdvanced()){
   const g=window.KLIMA_LEVEL.groupFor(argument);
   return `<div class="basic-argument-check"><p class="basic-way"><b>So wird begründet:</b> ${safe(g.label)}</p><p>${safe(g.explanation)}</p><details><summary>Einfach prüfen</summary><p><b>Passt der Grund?</b> ${safe(g.check)}</p><p><b>Was fehlt noch?</b> Welches konkrete Beispiel oder welche Quelle stützt diesen Grund?</p><p><b>Was spricht dagegen?</b> Nenne einen Einwand oder eine Bedingung, die das Urteil verändern könnte.</p></details></div>`;
  }
  const a=argument.analysis;
  const formLinks=a.forms.map(r=>refLink(r.id)).join(' · ');
  const checks=a.fallacyChecks.map(c=>`<article class="framework-check check-${c.status}"><p class="check-status">${safe(c.label)}</p><h5>${refLink(c.id)}</h5><p>${safe(c.reason)}</p></article>`).join('');
  const formal=a.formalRule?`<div class="formal-reconstruction"><h5>Optionale formale Rekonstruktion</h5><p>${refLink(a.formalRule.id)}</p><p><b>${safe(a.formalRule.scope)}</b></p><p>${safe(a.formalRule.explanation)}</p></div>`:'<p class="small">Keine einzelne aussagen- oder prädikatenlogische Regel wird dieser Gesprächseinheit eindeutig zugeschrieben. Eine nachträgliche Formalisierung darf fehlende Sach- oder Wertprämissen nicht als bewiesen behandeln.</p>';
  return `<div class="argument-framework"><p class="framework-forms"><b>Schlussform nach Handbuch:</b><br>${formLinks}</p><details class="argument-review" data-review="${argument.id}"${open?' open':''}><summary>Handbuchanalyse ${argument.id}: Prämissen und Fehlerprüfung</summary><p class="small"><b>Rolle:</b> ${safe(a.role)}. Die folgende zweite Prämisse ist eine mögliche analytische Ergänzung, kein wörtliches Zitat.</p><dl class="premise-map"><dt>P1 · Begründung im Gespräch</dt><dd>${safe(argument.reason)}</dd><dt>P2 · Mögliche ergänzte Schlussprämisse</dt><dd>${safe(a.implicitPremise)}</dd><dt>Konklusion / Funktion</dt><dd>${safe(argument.claim)}</dd></dl><h5>Beurteilung des Übergangs</h5><p>${safe(a.assessment)}</p>${formal}<h5>Fehlermuster prüfen und abgrenzen</h5>${checks}<h5>Prüfauftrag / stärkere Fassung</h5><p>${safe(a.verification)}</p><p class="small">Schlussform, Wahrheit der Prämissen und moralische Geltung werden getrennt beurteilt. Die Zuordnung ist eine begründete didaktische Analyse und kann mit Gegengründen revidiert werden.</p></details></div>`;
 };
 el('frameworkPrinciples').innerHTML=fw.principles.map(p=>`<li>${safe(p)}</li>`).join('');
 el('frameworkLegend').innerHTML='<p>Diese Status sind redaktionelle Prüfkennzeichnungen. Sie sind keine zusätzlichen Fehlschlusskategorien des Handbuchs.</p>'+Object.values(fw.statusLabels).map(label=>`<p><b>${safe(label)}</b></p>`).join('')+'<p>'+safe(fw.applicationPolicy)+'</p>';
 el('frameworkSummary').textContent=`${fw.summary.entries} Einträge · ${fw.summary.sections} Originalbereiche · ${fw.summary.argumentsReviewed} Argumenteinheiten individuell geprüft · ${fw.summary.usedEntries} Kategorien angewandt oder ausdrücklich abgegrenzt. Eine Kategorienverwendung ist keine Fehlerzählung.`;
 for(const section of fw.sections){const o=document.createElement('option');o.value=section.id;o.textContent=`${section.id} · ${section.title}`;el('frameworkSection').append(o);}
 function renderReference(){
  const q=el('frameworkSearch').value.trim().toLocaleLowerCase('de-CH'),section=el('frameworkSection').value,onlyUsed=el('frameworkUsed').checked;
  const selected=fw.entries.filter(e=>(!section||e.section===section)&&(!onlyUsed||e.applications.length)&&(!q||`${e.id} ${e.name} ${e.definition} ${e.example}`.toLocaleLowerCase('de-CH').includes(q)));
  el('frameworkCount').textContent=`${selected.length} von ${fw.entries.length} Referenzeinträgen`;
  el('frameworkEntries').innerHTML=fw.sections.map(sec=>{const list=selected.filter(e=>e.section===sec.id);if(!list.length)return '';return `<section class="framework-section"><h3>${sec.id} · ${safe(sec.title)}</h3>${list.map(e=>`<details class="framework-entry" id="kategorie-${e.id}"><summary><b>${e.id}</b> · ${safe(e.name)} <span>Handbuch S. ${e.page} · ${e.applications.length} Verwendungen / Abgrenzungen</span></summary><p>${safe(e.definition)}</p><p class="framework-example"><b>Didaktisches Beispiel aus dem Handbuch:</b> ${safe(e.example)}</p><p class="small">${e.section==='X'?'Argumentationsmanöver oder kognitive Verzerrung; nicht automatisch eine logische Schlussform.':e.section==='I'?'Grundform des Schliessens.':e.section==='II'||e.section==='III'?'Gültige Regel oder Beweisverfahren unter seinen jeweiligen Voraussetzungen.':'Eine Fehlerdiagnose erfordert den Nachweis des problematischen Übergangs im konkreten Argument.'}</p>${e.applications.length?`<p><b>Im Gespräch ansehen:</b></p><div class="framework-applications">${e.applications.map(x=>`<a href="#szene-${x.scene}-${x.argument}">${x.argument} · ${x.scene.toUpperCase()}</a>`).join('')}</div><p class="small">Die Links umfassen auch nur bedingte Risiken, zurückgewiesene Muster und ausdrückliche Abgrenzungen. Den Prüfstatus im Einzelargument lesen.</p>`:'<p class="small">Im Gespräch nicht gesondert zugeordnet. Die Kategorie bleibt als Nachschlageeintrag verfügbar.</p>'}</details>`).join('')}</section>`;}).join('')||'<p>Keine passenden Referenzeinträge. Passe die Filter an.</p>';
 }
 function openEntry(id){if(!entries.has(id))return;window.KLIMA_LEVEL.set('fortgeschritten',{preserve:false});el('frameworkSearch').value='';el('frameworkSection').value='';el('frameworkUsed').checked=false;renderReference();const details=el('kategorie-'+id);details.open=true;history.replaceState(null,'','#kategorie-'+id);details.scrollIntoView({block:'start'});}
 document.addEventListener('click',event=>{const link=event.target.closest('a[data-fw-ref]');if(!link)return;event.preventDefault();openEntry(link.dataset.fwRef);});
 for(const id of ['frameworkSearch','frameworkSection','frameworkUsed'])el(id).addEventListener('input',renderReference);
 el('frameworkClear').onclick=()=>{el('frameworkSearch').value='';el('frameworkSection').value='';el('frameworkUsed').checked=false;renderReference();};
 window.addEventListener('hashchange',()=>{const m=location.hash.match(/^#kategorie-([IVX]+-\d{2})$/);if(m)openEntry(m[1]);});
 renderReference();
 const initial=location.hash.match(/^#kategorie-([IVX]+-\d{2})$/);if(initial)openEntry(initial[1]);
})();
