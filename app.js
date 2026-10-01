const CFG = window.TAALPORTFOLIO_CONFIG || {};
const DATA = window.PORTFOLIO_DATA;
const localKey = 'taalportfolio_records_v2';
const legacyLocalKey = 'taalportfolio_records_v1';
const profileKey = 'taalportfolio_profile_v1';
const teacherSessionKey = 'taalportfolio_teacher_session';

const qs = s => document.querySelector(s);
const qsa = s => [...document.querySelectorAll(s)];
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)+Math.random().toString(36).slice(2));

function getLocalRecords(){
  try{
    const current=JSON.parse(localStorage.getItem(localKey)||'[]');
    if(current.length) return current;
    const legacy=JSON.parse(localStorage.getItem(legacyLocalKey)||'[]');
    return legacy.map(r=>({...r,school_year:r.school_year||1}));
  }catch{return []}
}
function setLocalRecords(v){ localStorage.setItem(localKey, JSON.stringify(v)); }
function getProfile(){ try{return JSON.parse(localStorage.getItem(profileKey)||'{}')}catch{return {}} }
function setProfile(p){ localStorage.setItem(profileKey, JSON.stringify(p)); }
function isCloud(){ return !!(CFG.supabaseUrl && CFG.supabaseAnonKey); }
function teacherPassword(){ return CFG.teacherPassword || 'msbc1.11'; }
function isTeacherLoggedIn(){ return sessionStorage.getItem(teacherSessionKey)==='yes'; }
function teacherLogin(password){
  if(password===teacherPassword()){
    sessionStorage.setItem(teacherSessionKey,'yes');
    return true;
  }
  return false;
}
function teacherLogout(){ sessionStorage.removeItem(teacherSessionKey); }

async function api(path, opts={}){
  const headers = {
    'apikey': CFG.supabaseAnonKey,
    'Authorization': `Bearer ${CFG.supabaseAnonKey}`,
    'Content-Type':'application/json',
    'Prefer':'return=representation',
    ...(opts.headers||{})
  };
  const r = await fetch(`${CFG.supabaseUrl}/rest/v1/${path}`, {...opts, headers});
  if(!r.ok) throw new Error(await r.text());
  const txt = await r.text(); return txt ? JSON.parse(txt) : null;
}
async function loadRecords(){
  if(!isCloud()) return getLocalRecords();
  return await api('portfolio_records?select=*&order=created_at.asc');
}
async function upsertRecord(rec){
  if(!isCloud()){
    const all=getLocalRecords(); const i=all.findIndex(x=>x.id===rec.id);
    if(i>=0) all[i]=rec; else all.push(rec); setLocalRecords(all); return rec;
  }
  const out=await api('portfolio_records?on_conflict=id',{method:'POST',headers:{'Prefer':'resolution=merge-duplicates,return=representation'},body:JSON.stringify(rec)});
  return out?.[0]||rec;
}
async function deleteRecord(id){
  if(!isCloud()){ setLocalRecords(getLocalRecords().filter(x=>x.id!==id)); return; }
  await api(`portfolio_records?id=eq.${encodeURIComponent(id)}`,{method:'DELETE'});
}

function emptyOption(text='Kies…'){ return `<option value="">${text}</option>`; }
function optionList(items, selected=''){ return items.map(x=>`<option ${x===selected?'selected':''} value="${escapeHtml(x)}">${escapeHtml(x)}</option>`).join(''); }
function escapeHtml(s=''){ return String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[m])); }
function today(){ return new Date().toISOString().slice(0,10); }
function profileId(name,cls){ return `${String(cls).trim().toLowerCase()}::${String(name).trim().toLowerCase()}`; }
function normalizeRecord(r){
  return {...r,strongPoint:r.strongPoint||r.strong_point,workPoint:r.workPoint||r.work_point,schoolYear:Number(r.schoolYear||r.school_year||1)};
}

const CUSTOM_OPTION = 'Iets anders (zelf invullen)';
function isCustomValue(v=''){ return String(v).startsWith('Iets anders: '); }
function customText(v=''){ return isCustomValue(v) ? String(v).slice('Iets anders: '.length) : ''; }
function wordCount(v=''){ return String(v).trim() ? String(v).trim().split(/\s+/).length : 0; }
function getTip(type, workPoint){ return DATA[type]?.work?.find(x=>x.label===workPoint)?.tip || ''; }

function taskCard(type, year, rec, idx){
  const d=DATA[type];
  const storedStrong=rec?.strongPoint||'';
  const storedWork=rec?.workPoint||'';
  const strongCustom=isCustomValue(storedStrong), workCustom=isCustomValue(storedWork);
  const strongSelected=strongCustom?CUSTOM_OPTION:storedStrong;
  const workSelected=workCustom?CUSTOM_OPTION:storedWork;
  const advice = getTip(type, storedWork);
  return `<article class="task-card ${rec?.id?'saved-task':'empty-task'}" data-id="${rec?.id||''}" data-type="${type}" data-year="${year}">
    <div class="task-top">
      <div class="num">${idx+1}</div>
      <div class="field"><label>Titel van de taak</label><input class="title" placeholder="bv. Boekvoorstelling" value="${escapeHtml(rec?.title||'')}"></div>
      <div class="field datefield"><label>Datum</label><input class="date" type="date" value="${rec?.date||today()}"></div>
    </div>
    <div class="task-grid">
      <div class="choice-box good">
        <div class="choice-heading"><span class="choice-icon">✓</span><div><h4>Sterk punt</h4><small>Wat liep al goed?</small></div></div>
        <div class="field"><select class="strong">${emptyOption('Kies een sterk punt…')}${optionList([...d.strong,CUSTOM_OPTION],strongSelected)}</select></div>
        <div class="custom-entry custom-strong-wrap ${strongCustom?'':'hidden'}">
          <label>Mijn eigen sterk punt</label>
          <textarea class="custom-strong" rows="3" placeholder="Schrijf kort wat jij sterk vond aan deze taak.">${escapeHtml(customText(storedStrong))}</textarea>
          <div class="word-counter"><span class="strong-count">${wordCount(customText(storedStrong))}</span>/50 woorden</div>
        </div>
      </div>
      <div class="choice-box work">
        <div class="choice-heading"><span class="choice-icon">↗</span><div><h4>Werkpunt</h4><small>Waar wil je verder aan werken?</small></div></div>
        <div class="field"><select class="work">${emptyOption('Kies een werkpunt…')}${optionList([...d.work.map(x=>x.label),CUSTOM_OPTION],workSelected)}</select></div>
        <div class="custom-entry custom-work-wrap ${workCustom?'':'hidden'}">
          <label>Mijn eigen werkpunt</label>
          <textarea class="custom-work" rows="3" placeholder="Beschrijf kort waar je zelf nog aan wilt werken.">${escapeHtml(customText(storedWork))}</textarea>
          <div class="word-counter"><span class="work-count">${wordCount(customText(storedWork))}</span>/50 woorden</div>
          <div class="custom-note">Voor een eigen werkpunt verschijnt geen automatische tip.</div>
        </div>
        <div class="task-tip ${advice?'':'hidden'}">
          <img src="assets/teacher-cartoon.png" alt="Cartoon van de leerkracht">
          <div class="bubble"><strong>Mijn tip voor jou</strong><div class="advice">${advice?escapeHtml(advice):''}</div></div>
        </div>
      </div>
    </div>
    <div class="actions"><button class="primary-btn save">Bewaren</button>${rec?.id?'<button class="danger-btn del">Verwijderen</button>':''}</div>
  </article>`;
}

function setupTeacherButton(){
  const btn=qs('#teacherLoginBtn'), modal=qs('#teacherModal');
  if(!btn||!modal) return;
  const input=qs('#teacherPassword'), error=qs('#teacherLoginError');
  const open=()=>{modal.classList.remove('hidden'); input.value=''; error.classList.add('hidden'); setTimeout(()=>input.focus(),50)};
  const close=()=>modal.classList.add('hidden');
  const submit=()=>{
    if(teacherLogin(input.value)){ location.href='leraar.html'; }
    else{ error.classList.remove('hidden'); input.select(); }
  };
  btn.onclick=open; qs('#teacherModalClose').onclick=close; qs('#teacherLoginSubmit').onclick=submit;
  input.addEventListener('keydown',e=>{if(e.key==='Enter')submit();});
  modal.addEventListener('click',e=>{if(e.target===modal) close();});
}

async function initStudent(){
  setupTeacherButton();
  const p=getProfile(); qs('#studentName').value=p.name||''; qs('#studentClass').value=p.className||'';
  qs('#mode').textContent=isCloud()?'Gedeelde online versie':'Lokale demo-modus';
  const records=(await loadRecords()).map(normalizeRecord);
  renderStudent(records);
  ['studentName','studentClass'].forEach(id=>qs('#'+id).addEventListener('change',()=>{setProfile({name:qs('#studentName').value.trim(),className:qs('#studentClass').value.trim()}); location.reload();}));
  qsa('[data-tab]').forEach(b=>b.onclick=()=>{qsa('[data-tab]').forEach(x=>x.classList.remove('active'));b.classList.add('active');qsa('[data-section]').forEach(s=>s.classList.toggle('hidden',s.dataset.section!==b.dataset.tab));});
}
function renderStudent(all){
  const name=qs('#studentName').value.trim(), cls=qs('#studentClass').value.trim(), pid=profileId(name,cls);
  const mine=(name&&cls)?all.filter(r=>r.profile_id===pid):[];
  const combinations=[['spreken',1,'spreken1List'],['schrijven',1,'schrijven1List'],['spreken',2,'spreken2List'],['schrijven',2,'schrijven2List']];
  combinations.forEach(([type,year,target])=>{
    const arr=mine.filter(r=>r.type===type && Number(r.schoolYear)===year).sort((a,b)=>(a.date||'').localeCompare(b.date||''));
    const slots=Math.max(5,arr.length + (arr.length>=5 ? 1 : 0));
    const html=[]; for(let i=0;i<slots;i++) html.push(taskCard(type,year,arr[i],i));
    qs(`#${target}`).innerHTML=html.join('');
  });
  wireTaskCards(); updateStats(mine);
}
function updateStats(mine){
  qs('#countSpeak').textContent=mine.filter(x=>x.type==='spreken').length;
  qs('#countWrite').textContent=mine.filter(x=>x.type==='schrijven').length;
  qs('#countTotal').textContent=mine.length;
  const works=mine.map(x=>x.workPoint).filter(Boolean); qs('#countWork').textContent=new Set(works).size;
}
function wireTaskCards(){
  qsa('.task-card').forEach(card=>{
    const type=card.dataset.type, year=Number(card.dataset.year);
    const strongSel=card.querySelector('.strong'), workSel=card.querySelector('.work');
    const strongWrap=card.querySelector('.custom-strong-wrap'), workWrap=card.querySelector('.custom-work-wrap');
    const strongText=card.querySelector('.custom-strong'), workText=card.querySelector('.custom-work');

    const updateCounter=(textarea, selector)=>{
      const n=wordCount(textarea.value); const el=card.querySelector(selector); if(el) el.textContent=n;
      textarea.classList.toggle('over-limit',n>50);
      const counter=textarea.closest('.custom-entry')?.querySelector('.word-counter'); if(counter) counter.classList.toggle('over-limit',n>50);
    };
    strongText.addEventListener('input',()=>updateCounter(strongText,'.strong-count'));
    workText.addEventListener('input',()=>updateCounter(workText,'.work-count'));

    strongSel.addEventListener('change',e=>{
      const custom=e.target.value===CUSTOM_OPTION;
      strongWrap.classList.toggle('hidden',!custom);
      if(custom) setTimeout(()=>strongText.focus(),20);
    });
    workSel.addEventListener('change',e=>{
      const custom=e.target.value===CUSTOM_OPTION;
      workWrap.classList.toggle('hidden',!custom);
      const found=DATA[type].work.find(x=>x.label===e.target.value);
      const tipWrap=card.querySelector('.task-tip'); const box=card.querySelector('.advice');
      if(found&&!custom){ box.textContent=found.tip; tipWrap.classList.remove('hidden'); }
      else{ box.textContent=''; tipWrap.classList.add('hidden'); }
      if(custom) setTimeout(()=>workText.focus(),20);
    });

    card.querySelector('.save').onclick=async()=>{
      const p={name:qs('#studentName').value.trim(),className:qs('#studentClass').value.trim()};
      if(!p.name||!p.className){alert('Vul eerst je naam en klas in.');return;}
      setProfile(p);
      let strongPoint=strongSel.value, workPoint=workSel.value;
      if(strongPoint===CUSTOM_OPTION){
        const t=strongText.value.trim(), n=wordCount(t);
        if(!t){alert('Vul je eigen sterke punt in.');return;}
        if(n>50){alert('Je eigen sterke punt mag maximaal 50 woorden bevatten.');return;}
        strongPoint=`Iets anders: ${t}`;
      }
      if(workPoint===CUSTOM_OPTION){
        const t=workText.value.trim(), n=wordCount(t);
        if(!t){alert('Vul je eigen werkpunt in.');return;}
        if(n>50){alert('Je eigen werkpunt mag maximaal 50 woorden bevatten.');return;}
        workPoint=`Iets anders: ${t}`;
      }
      const rec={id:card.dataset.id||uid(),profile_id:profileId(p.name,p.className),student_name:p.name,class_name:p.className,type,school_year:year,title:card.querySelector('.title').value.trim(),date:card.querySelector('.date').value,strong_point:strongPoint,work_point:workPoint,updated_at:new Date().toISOString()};
      rec.strongPoint=rec.strong_point; rec.workPoint=rec.work_point; rec.schoolYear=year;
      if(!rec.title||!rec.strong_point||!rec.work_point){alert('Vul de titel, een sterk punt en een werkpunt in.');return;}
      try{ await upsertRecord(rec); location.reload(); }
      catch(err){ alert('Opslaan lukt nog niet. Als je Supabase gebruikt, voer dan eerst de bijgewerkte supabase.sql uit zodat de kolom school_year bestaat.'); console.error(err); }
    };
    const del=card.querySelector('.del'); if(del) del.onclick=async()=>{if(confirm('Deze taak verwijderen?')){await deleteRecord(card.dataset.id);location.reload();}};
  });
}

function initTeacherGate(){
  const gate=qs('#teacherGate'), app=qs('#teacherApp'), input=qs('#gatePassword'), error=qs('#gateError');
  const openApp=()=>{gate.classList.add('hidden');app.classList.remove('hidden');initTeacher();};
  if(isTeacherLoggedIn()){openApp();return;}
  const submit=()=>{if(teacherLogin(input.value)) openApp(); else{error.classList.remove('hidden');input.select();}};
  qs('#gateSubmit').onclick=submit; input.addEventListener('keydown',e=>{if(e.key==='Enter')submit();}); setTimeout(()=>input.focus(),50);
}

async function initTeacher(){
  qs('#mode').textContent=isCloud()?'Gedeelde online versie':'Lokale demo-modus';
  qs('#logoutBtn').onclick=()=>{teacherLogout();location.href='index.html';};
  const records=(await loadRecords()).map(normalizeRecord);
  const grouped={}; records.forEach(r=>{const k=r.profile_id||profileId(r.student_name,r.class_name); (grouped[k] ||= {name:r.student_name,className:r.class_name,records:[]}).records.push(r)});
  const students=Object.entries(grouped).sort((a,b)=>(a[1].className+a[1].name).localeCompare(b[1].className+b[1].name));
  qs('#studentCount').textContent=students.length; qs('#recordCount').textContent=records.length;
  qs('#studentList').innerHTML=students.length?students.map(([id,s],i)=>`<button class="student-btn ${i===0?'active':''}" data-pid="${escapeHtml(id)}"><strong>${escapeHtml(s.name)}</strong><br><span class="small">${escapeHtml(s.className)} · ${s.records.length} taken</span></button>`).join(''):'<div class="small">Nog geen leerlinggegevens.</div>';
  let currentPid=students[0]?.[0]||null;
  function show(pid){
    currentPid=pid; qsa('.student-btn').forEach(b=>b.classList.toggle('active',b.dataset.pid===pid)); const s=grouped[pid];
    if(!s){qs('#studentDetail').innerHTML='<p class="small">Selecteer een leerling.</p>';return;}
    const year=qs('#filterYear').value, type=qs('#filterType').value;
    const items=s.records.filter(r=>(year==='all'||String(r.schoolYear)===year)&&(type==='all'||r.type===type)).sort((a,b)=>(b.date||'').localeCompare(a.date||''));
    const recurring={}; items.forEach(x=>{if(x.workPoint) recurring[x.workPoint]=(recurring[x.workPoint]||0)+1});
    const repeated=Object.entries(recurring).filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]);
    qs('#studentDetail').innerHTML=`<div class="section-head teacher-student-head"><div><h2>${escapeHtml(s.name)}</h2><p>${escapeHtml(s.className)} · ${items.length} getoonde taken</p></div></div>
      ${repeated.length?`<div class="notice"><strong>Terugkerende werkpunten:</strong> ${repeated.map(([x,n])=>`${escapeHtml(x)} (${n}×)`).join(' · ')}</div>`:''}
      <div class="history">${items.length?items.map(r=>`<div class="history-item"><div class="history-title-row"><h4>${escapeHtml(r.title)}</h4><button class="danger-btn teacher-delete" data-delete-id="${escapeHtml(r.id)}" title="Deze taak wissen">Wissen</button></div><div class="history-meta"><span class="badge year">${r.schoolYear===2?'2de jaar':'1ste jaar'}</span><span class="badge">${r.type==='spreken'?'Spreken':'Schrijven'}</span><span class="badge">${escapeHtml(r.date||'')}</span></div><p><span class="badge good">Sterk</span> ${escapeHtml(r.strongPoint||'')}</p><p><span class="badge work">Werkpunt</span> ${escapeHtml(r.workPoint||'')}</p>${getTip(r.type,r.workPoint)?`<p class="small"><strong>Tip:</strong> ${escapeHtml(getTip(r.type,r.workPoint))}</p>`:''}</div>`).join(''):'<div class="small empty-state">Geen taken voor deze selectie.</div>'}</div>`;
    qsa('.teacher-delete').forEach(btn=>btn.onclick=async()=>{
      if(!confirm('Deze taak volledig wissen? De titel, sterke punten en werkpunten worden verwijderd.')) return;
      try{ await deleteRecord(btn.dataset.deleteId); location.reload(); }
      catch(err){ alert('Wissen is niet gelukt. Controleer de databankinstellingen en probeer opnieuw.'); console.error(err); }
    });
  }
  qsa('.student-btn').forEach(b=>b.onclick=()=>show(b.dataset.pid));
  ['filterYear','filterType'].forEach(id=>qs('#'+id).onchange=()=>{if(currentPid)show(currentPid)});
  if(currentPid) show(currentPid);
  qs('#exportBtn').onclick=()=>{const blob=new Blob([JSON.stringify(records,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='taalportfolio-export.json';a.click();URL.revokeObjectURL(a.href)};
}
