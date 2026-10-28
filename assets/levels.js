'use strict';
(() => {
 const config=window.KLIMA_LEVELS,groups=new Map(config.groups.map(g=>[g.id,g])), key='klima-learning-level-v1';
 let mode='basis';try{if(localStorage.getItem(key)==='fortgeschritten')mode='fortgeschritten';}catch{}
 if(location.hash.startsWith('#kategorie-'))mode='fortgeschritten';
 const byId=id=>document.getElementById(id);
 function groupFor(a){return groups.get(config.arguments[a.id]);}
 function refreshLabels(){
  document.documentElement.dataset.level=mode;
  byId('levelLabel').textContent=mode==='basis'?'Basis':'Fortgeschritten';
  byId('levelToggle').textContent=mode==='basis'?'Fortgeschritten: aus':'Fortgeschritten: ein';
  byId('levelToggle').setAttribute('aria-pressed',String(mode==='fortgeschritten'));
  byId('levelToggle').title=mode==='basis'?'Vollständige Kategorien und Analysen einschalten':'Zur vereinfachten Basisansicht wechseln';
  byId('levelHelp').textContent=mode==='basis'?'Fünf Denkwege und einfache Prüffragen.':'Vollständige Handbuchkategorien und Detailanalysen.';
  document.querySelectorAll('[data-basic-heading]').forEach(n=>{n.textContent=mode==='basis'?n.dataset.basicHeading:n.dataset.advancedHeading;});
  const quizLabels={'Whataboutism':'Auf andere ablenken','Appell an Autorität (ad verecundiam)':'Ein Titel soll den Beweis ersetzen','Falsches Dilemma':'Nur zwei Möglichkeiten vortäuschen','Statistischer Schluss':'Mit Zahlen begründen','Dialektischer Schluss':'Einen Einwand abwägen','Ad hominem':'Die Person statt den Grund angreifen','Analogie':'Mit einem Vergleich begründen','Faktenargument':'Mit einem Sachbeleg begründen'};
  document.querySelectorAll('[data-quiz][data-option]').forEach(b=>{if(!b.dataset.fullLabel)b.dataset.fullLabel=b.textContent;b.textContent=mode==='basis'?(quizLabels[b.dataset.fullLabel]||b.dataset.fullLabel):b.dataset.fullLabel;});
 }
 function set(next,{preserve=true}={}){
  if(!config.levels.includes(next)||next===mode)return;
  const old=mode;const probe=document.elementFromPoint(Math.min(innerWidth-15,innerWidth*.55),Math.min(innerHeight-15,170));
  const anchor=preserve?probe?.closest('article[id],section[id]'):null, anchorId=anchor?.id, oldTop=anchor?.getBoundingClientRect().top;
  mode=next;try{localStorage.setItem(key,mode);}catch{}
  refreshLabels();document.dispatchEvent(new CustomEvent('klima-level-change',{detail:{level:mode,previous:old}}));
  if(mode==='basis'&&location.hash.startsWith('#kategorie-')){history.replaceState(null,'','#framework');byId('framework')?.scrollIntoView({block:'start'});}
  else if(anchorId)requestAnimationFrame(()=>{const now=byId(anchorId);if(now&&now.getClientRects().length)window.scrollBy(0,now.getBoundingClientRect().top-oldTop);});
 }
 window.KLIMA_LEVEL={isAdvanced:()=>mode==='fortgeschritten',get:()=>mode,set,groupFor,describe:a=>mode==='basis'?groupFor(a).label:a.type};
 const overviewHeading=document.querySelector('.overview-document')?'h2':'h4';
 function add(tag,className,text){const n=document.createElement(tag);n.className=className;n.textContent=text;return n;}
 // The same teaching overview is used on the main page and on the printable page.
 for(const g of config.groups){
  const card=byId('gruppe-'+g.overviewId);if(!card)continue;
  const heading=card.querySelector('h4,h2');heading.dataset.basicHeading=g.label;heading.dataset.advancedHeading=heading.textContent;
  card.querySelector('.group-types')?.classList.add('level-advanced');
  const explanation=card.querySelector('.group-types + p');if(explanation){explanation.classList.add('level-advanced');explanation.before(add('p','level-basic',g.explanation));}
  const advancedDetails=card.querySelector('details');if(advancedDetails){advancedDetails.classList.add('level-advanced');const details=document.createElement('details');details.className='level-basic';if(document.querySelector('.overview-document'))details.open=true;details.append(add('summary','','Beispiel und einfache Prüffrage'),add('p','',g.example),add('p','',g.check));const link=advancedDetails.querySelector('a');if(link)details.append(link.cloneNode(true));advancedDetails.after(details);}
 }
 document.querySelectorAll('.crosscutting').forEach(n=>{n.classList.add('level-advanced');const base=add('aside','crosscutting level-basic','');base.append(add(overviewHeading,'','Begründungen können Grenzen haben'),add('p','','Eine Aussage kann unter bestimmten Bedingungen gelten. Neue Informationen oder ein guter Einwand können unser Urteil verändern. Frage deshalb: Wann würde dieser Grund nicht mehr ausreichen?'));n.after(base);});
 document.querySelectorAll('.reasoning-path li b').forEach(n=>{n.dataset.advancedHeading=n.textContent;n.dataset.basicHeading=n.textContent.split(' · ')[0];});
 document.querySelectorAll('.framework-levels').forEach(n=>{n.classList.add('level-advanced');const base=add('div','framework-levels level-basic','');base.append(add(overviewHeading,'','Denkweg und Denkfehler sind nicht dasselbe'),add('p','','Ein Vergleich, ein Beispiel oder eine Erklärung kann gut oder schlecht begründet sein. Ordne zuerst den Denkweg zu. Prüfe danach, ob der Grund die Behauptung wirklich trägt. Ein ungeprüfter Beleg ist noch kein bewiesener Denkfehler.'));n.after(base);});
 document.querySelectorAll('.mini-lesson').forEach(n=>{n.classList.add('level-advanced');const d=document.createElement('details');d.className='mini-lesson level-basic';if(document.querySelector('.overview-document'))d.open=true;d.append(add('summary','','15-Minuten-Auftrag für die Basis'));const list=document.createElement('ol');for(const text of ['3 Minuten: Schaut eine Szene. Was behauptet die Person, und welchen Grund nennt sie?','4 Minuten: Wählt einen der fünf Denkwege. Erklärt eure Wahl in eigenen Worten.','4 Minuten: Prüft, ob der Grund passt. Nennt eine fehlende Information oder einen Einwand.','4 Minuten: Formuliert euer Urteil: Der Grund überzeugt mich unter der Bedingung, dass … .'])list.append(add('li','',text));d.append(list);n.after(d);});
 window.addEventListener('storage',event=>{if(event.key===key&&config.levels.includes(event.newValue)&&event.newValue!==mode)set(event.newValue);});
 byId('levelToggle').onclick=()=>set(mode==='basis'?'fortgeschritten':'basis');
 refreshLabels();
 if(typeof ResizeObserver!=='undefined')new ResizeObserver(()=>{document.documentElement.style.setProperty('--level-bar-height',byId('levelToggle').closest('.level-bar').offsetHeight+'px');}).observe(byId('levelToggle').closest('.level-bar'));
})();
