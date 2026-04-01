// ── App Logic ──────────────────────────────────────────────────
// Depends on: icons.js (SVGI, si), vans.js (mkV, SVGS, CARD_TOPS, CARD_ACCENTS)
// Data loaded from src/data/*.json at startup

// ── SUPABASE ───────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://klhyopbigqpmqlkdotmh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_GgQw-Lk_M2OvvfKWSiPLOw_DKZaKxG1';
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── SYNC DOT ───────────────────────────────────────────────────────────
function syncDot(s){
  const d=document.getElementById('syncDot');
  const sd=document.getElementById('sidebarSync');
  const cls='sync-dot'+(s==='busy'?' busy':s==='err'?' err':'');
  if(d)d.className=cls;
  if(sd)sd.className='sidebar-sync'+(s==='busy'?' busy':s==='err'?' err':'');
}

// ── STORAGE ────────────────────────────────────────────────────────────
async function sGet(key){
  try{
    if(key==='profiles'){ const{data,error}=await db.from('profiles').select('*'); if(error)throw error; return data||[]; }
    if(key.startsWith('trip-')){
      const id=key.slice(5);
      const{data,error}=await db.from('trip_settings').select('*').eq('trip_id',id).single();
      if(error&&error.code!=='PGRST116')throw error;
      if(!data)return null;
      // Parse customItems back from JSON string if stored
      return{
        duration:data.duration,
        customItems: data.custom_items ? JSON.parse(data.custom_items) : []
      };
    }
    if(key.startsWith('checked-')){ const parts=key.split('-'); const pid=parts[parts.length-1]; const tid=parts.slice(1,-1).join('-'); const{data,error}=await db.from('checked_items').select('item_id').eq('trip_id',tid).eq('profile_id',pid); if(error)throw error; return data?data.map(r=>r.item_id):[]; }
    const v=localStorage.getItem('pu:'+key); return v?JSON.parse(v):null;
  }catch(e){ console.warn('[pU] sGet',key,e.message); syncDot('err'); return null; }
}
async function sSet(key,val){
  try{
    if(key==='profiles'){ for(const p of val){ const{error}=await db.from('profiles').upsert({id:p.id,name:p.name,color_hex:p.color},{onConflict:'id'}); if(error)throw error; } return; }
    if(key.startsWith('trip-')){
      const tid=key.slice(5);
      const{error}=await db.from('trip_settings').upsert({
        trip_id:tid,
        duration:val.duration,
        custom_items: JSON.stringify(val.customItems||[])
      },{onConflict:'trip_id'});
      if(error)throw error;
      return;
    }
    if(key.startsWith('checked-')){ const parts=key.split('-'); const pid=parts[parts.length-1]; const tid=parts.slice(1,-1).join('-'); const{error:de}=await db.from('checked_items').delete().eq('profile_id',pid).eq('trip_id',tid); if(de)throw de; if(val&&val.length){ const rows=val.map(id=>({profile_id:pid,trip_id:tid,item_id:id,item_type:'catalogue'})); const{error:ie}=await db.from('checked_items').insert(rows); if(ie)throw ie; } return; }
    localStorage.setItem('pu:'+key,JSON.stringify(val));
  }catch(e){ console.warn('[pU] sSet',key,e.message); syncDot('err'); }
}

// ── COLOUR ────────────────────────────────────────────────────────────
const PAL=['#c85a5a','#c87030','#c89a00','#4a9a60','#3a7ab8','#7055c8','#c04888','#1a8888','#7a6030','#445a78'];
function colorFromName(n){ if(!n||!n.trim())return PAL[5]; let h=0; for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))>>>0; return PAL[h%PAL.length]; }
function ini(n){ return(n||'?').trim().split(/\s+/).map(w=>w[0]).join('').toUpperCase().slice(0,2); }
function onNameInput(v){ const c=colorFromName(v),r=document.getElementById('avRing'); if(r){r.style.background=c;r.style.borderColor=c;r.textContent=ini(v)||'?';r.classList.toggle('has-name',!!v.trim());} }

// ── TRANSLATIONS ───────────────────────────────────────────────────────
const T={
  en:{
    choose:'Choose your adventure',eye:'Your trips',choose2:'Track your packing. Share your progress.',
    duration:'Trip duration',days:'days',loading:'Loading…',
    progress:'My progress',teamProg:'Team progress',packed:'packed',of:'of',
    addItem:'Add an item',addName:'Item name…',addCat:'Category',addQty:'Qty',
    saveList:'Save as list',myLists:'My lists',listSaved:'List saved',deleteList:'Delete list',
    carryOn:'Carry-on',checked:'Checked',
    addPerm:'Save permanently',addBtn:'Add',
    reset:'Reset my packing',resetConfirm:'Reset your checked items?',
    pTitle:"Who's packing?",pSub:"Type your name",pEdit:'Edit profile',pSave:'Let\'s go →',pPh:'Your name…',
    you:'you',perDay:'per day',
    tripSki:'Ski Trip',tripSummer:'Summer Holiday',tripWinter:'Winter City',tripWeekend:'Weekend Getaway',tripSpring:'Spring Break',tripAutumn:'Autumn Trip',
    subSki:'Hit the slopes up north',subSummer:'Sun, sea and sangria',subWinter:'City breaks & culture',subWeekend:'Pack light, enjoy more',subSpring:'Fresh air, layered style',subAutumn:'Golden leaves, cosy layers',
    cats:{clothing:'Clothing',equipment:'Equipment',accessories:'Accessories',toiletries:'Toiletries',documents:'Documents',other:'Other',beach:'Beach & Sun'},
    items:{
      'ski-jacket':'Ski jacket','ski-pants':'Ski pants','thermal-top':'Thermal top','thermal-bot':'Thermal bottom','fleece':'Fleece mid-layer',
      'ski-socks':'Ski socks','wool-socks':'Wool socks','underwear':'Underwear','tshirts':'T-shirts','apres-outfit':'Après-ski outfit','casual-eve':'Casual evening outfit',
      'skis':'Skis / Snowboard','boots':'Ski boots','helmet':'Helmet','goggles':'Goggles','poles':'Ski poles','boot-bag':'Boot bag',
      'gloves':'Gloves / Mittens','neck':'Neck gaiter / Balaklava','ski-pass':'Ski pass holder','backpack':'Backpack','sunglasses':'Sunglasses','hand-warmers':'Hand warmers',
      'sunscreen':'Sunscreen SPF50','lip-balm':'Lip balm','moisturizer':'Moisturizer','deodorant':'Deodorant','first-aid':'First aid kit',
      'passport':'Passport / ID card','insurance':'Travel insurance','lift-booking':'Lift pass booking',
      'charger':'Phone charger','power-bank':'Power bank','camera':'Camera','snacks':'Snacks','water-bottle':'Water bottle','apres-boots':'Après-ski boots',
      'swimsuit':'Swimsuit','shorts':'Shorts','light-shirt':'Light shirts / dresses','socks':'Socks','sandals':'Sandals','flip-flops':'Flip flops','sneakers':'Sneakers',
      'light-jacket':'Light jacket','beach-towel':'Beach towel','beach-bag':'Beach bag','snorkel':'Snorkel & mask','waterproof-case':'Waterproof phone case',
      'hat':'Sun hat / cap','after-sun':'After-sun lotion','mosquito':'Mosquito repellent','shampoo':'Shampoo','adapter':'Travel adapter','guidebook':'Guidebook','phrase-book':'Spanish phrasebook',
      'jeans':'Jeans / trousers','sweaters':'Sweaters','rain-jacket':'Light rain jacket','casual-shoes':'Casual shoes','ankle-boots':'Ankle boots','scarf':'Scarf',
      'light-gloves':'Light gloves','beanie':'Beanie / hat','umbrella':'Umbrella','daypack':'Day pack','book':'Book / e-reader',
      'toothbrush':'Toothbrush & paste','medications':'Medications','reusable-bag':'Reusable bag','cash':'Cash',
      'casual-pants':'Casual trousers','nice-outfit':'Smart outfit','comfy-shoes':'Comfortable shoes','jacket':'Jacket',
    },
  },
  sv:{
    choose:'Välj ditt äventyr',eye:'Dina resor',choose2:'Spåra din packning. Dela framstegen.',
    duration:'Reslängd',days:'dagar',loading:'Laddar…',
    progress:'Mitt framsteg',teamProg:'Lagets framsteg',packed:'packade',of:'av',
    addItem:'Lägg till sak',addName:'Namn på sak…',addCat:'Kategori',addQty:'Antal',
    saveList:'Spara som lista',myLists:'Mina listor',listSaved:'Lista sparad',deleteList:'Radera lista',
    carryOn:'Handbagage',checked:'Incheckat',
    addPerm:'Spara permanent',addBtn:'Lägg till',
    reset:'Återställ min packning',resetConfirm:'Återställa dina bockade?',
    pTitle:'Vem packar?',pSub:'Skriv ditt namn',pEdit:'Redigera profil',pSave:'Kör! →',pPh:'Ditt namn…',
    you:'du',perDay:'per dag',
    tripSki:'Skidresa',tripSummer:'Sommarsemester',tripWinter:'Vinter',tripWeekend:'Helgresa',tripSpring:'Vårresa',tripAutumn:'Höstresa',
    subSki:'Till pisterna upp i norr',subSummer:'Sol, hav och sangria',subWinter:'Stadssemester & kultur',subWeekend:'Packa lätt, njut mer',subSpring:'Frisk luft, lagrat mode',subAutumn:'Gyllene löv, mysiga lager',
    cats:{clothing:'Kläder',equipment:'Utrustning',accessories:'Tillbehör',toiletries:'Toalettartiklar',documents:'Dokument',other:'Övrigt',beach:'Strand & Sol'},
    items:{
      'ski-jacket':'Skidjacka','ski-pants':'Skidbyxor','thermal-top':'Termisk topp','thermal-bot':'Termisk underdel','fleece':'Fleecetröja',
      'ski-socks':'Skidstrumpor','wool-socks':'Ullstrumpor','underwear':'Underklädsel','tshirts':'T-shirts','apres-outfit':'Après-ski-outfit','casual-eve':'Kvällsoutfit',
      'skis':'Skidor / Snowboard','boots':'Skidpjäxor','helmet':'Hjälm','goggles':'Skidglasögon','poles':'Skidstavar','boot-bag':'Pjäxväska',
      'gloves':'Handskar / Vantar','neck':'Halsrör / Balaklava','ski-pass':'Liftkortshållare','backpack':'Ryggsäck','sunglasses':'Solglasögon','hand-warmers':'Handvärmare',
      'sunscreen':'Solkräm SPF50','lip-balm':'Läppbalsam','moisturizer':'Fuktighetskräm','deodorant':'Deodorant','first-aid':'Förbandslåda',
      'passport':'Pass / ID-kort','insurance':'Reseförsäkring','lift-booking':'Liftkortsbokning',
      'charger':'Telefonladdare','power-bank':'Powerbank','camera':'Kamera','snacks':'Mellanmål','water-bottle':'Vattenflaska','apres-boots':'Après-ski-stövlar',
      'swimsuit':'Badkläder','shorts':'Shorts','light-shirt':'Lätta skjortor','socks':'Strumpor','sandals':'Sandaler','flip-flops':'Flipflops','sneakers':'Sneakers',
      'light-jacket':'Lättjacka','beach-towel':'Strandhandduk','beach-bag':'Strandväska','snorkel':'Snorkel & mask','waterproof-case':'Vattentätt fodral',
      'hat':'Solhatt / keps','after-sun':'After-sun lotion','mosquito':'Myggremedel','shampoo':'Schampo','adapter':'Reseadapter','guidebook':'Reseguide','phrase-book':'Spansk parlör',
      'jeans':'Jeans / byxor','sweaters':'Tröjor','rain-jacket':'Regnkappa','casual-shoes':'Vardagsskor','ankle-boots':'Ankelstövlar','scarf':'Halsduk',
      'light-gloves':'Tunna handskar','beanie':'Mössa / hatt','umbrella':'Paraply','daypack':'Dagsryggsäck','book':'Bok / e-läsare',
      'toothbrush':'Tandborste & kräm','medications':'Mediciner','reusable-bag':'Återanvändbar väska','cash':'Kontanter',
      'casual-pants':'Casual byxor','nice-outfit':'Snygg outfit','comfy-shoes':'Bekväma skor','jacket':'Jacka',
    },
  }
};

// ── QUANTITY RULES ────────────────────────────────────────────────────
const QRULES={fixed:()=>1,daily:d=>d,halfday:d=>Math.max(1,Math.ceil(d/2)),less:d=>Math.max(1,Math.ceil(d*.65)),sweaters:d=>Math.max(1,Math.ceil(d/3))};
function calcQ(rule,d){return(QRULES[rule]||QRULES.fixed)(d);}
function resolveQ(q,dur){if(typeof q==='number')return{qty:q,rule:'fixed'};const rule=QRULES[q]?q:'fixed';return{qty:calcQ(rule,dur),rule};}

// ── PER-USER PERSONAL LISTS (localStorage, keyed by userId+tripId) ────
// Separate from shared trip_settings — each user owns their own items & hidden list

function _uid() { return myProfile?.id || 'anon'; }

function getCustomItems(tid) {
  const raw = localStorage.getItem(`pu-ci-${_uid()}-${tid}`);
  return raw ? JSON.parse(raw) : [];
}
function setCustomItems(tid, items) {
  localStorage.setItem(`pu-ci-${_uid()}-${tid}`, JSON.stringify(items));
}
function getHiddenItems(tid) {
  const raw = localStorage.getItem(`pu-hi-${_uid()}-${tid}`);
  return raw ? new Set(JSON.parse(raw)) : new Set();
}
function setHiddenItems(tid, set) {
  localStorage.setItem(`pu-hi-${_uid()}-${tid}`, JSON.stringify([...set]));
}

// ── NAMED LISTS (localStorage) ────────────────────────────────────────
// A list is a named snapshot of a trip: {id, name, templateId, createdAt}
// Its checked/hidden/custom items are stored under the listId (not templateId)

function getLists() {
  try { return JSON.parse(localStorage.getItem('pu-lists')||'[]'); } catch(e){ return []; }
}
function saveLists(lists) { localStorage.setItem('pu-lists', JSON.stringify(lists)); }
function createList(name, templateId) {
  const id = 'l'+Date.now();
  const list = {id, name, templateId, createdAt: Date.now()};
  const lists = getLists();
  lists.push(list);
  saveLists(lists);
  return list;
}
function deleteList(listId) {
  saveLists(getLists().filter(l=>l.id!==listId));
  ['pu-ci','pu-hi'].forEach(k=>localStorage.removeItem(`${k}-${_uid()}-${listId}`));
  localStorage.removeItem(`pu-qty-${_uid()}-${listId}`);
}

// ── PER-ITEM QTY OVERRIDES (localStorage) ────────────────────────────
// User can override the calculated qty for any item in any trip/list
function getQtyOverrides(tid) {
  const raw = localStorage.getItem(`pu-qty-${_uid()}-${tid}`);
  return raw ? JSON.parse(raw) : {};
}
function setQtyOverrides(tid, map) {
  localStorage.setItem(`pu-qty-${_uid()}-${tid}`, JSON.stringify(map));
}
function setItemQty(tid, itemId, qty) {
  const map = getQtyOverrides(tid);
  if(qty === null) delete map[itemId]; else map[itemId] = qty;
  setQtyOverrides(tid, map);
}

// ── PER-ITEM BAG ASSIGNMENT (localStorage) ────────────────────────────
// Stores user's chosen bag for each item: {itemId: 'carry_on'|'checked'}
// Falls back to the default from trips.json if not overridden
function getBagAssignments(tid) {
  const raw = localStorage.getItem(`pu-bag-${_uid()}-${tid}`);
  return raw ? JSON.parse(raw) : {};
}
function setBagAssignments(tid, map) {
  localStorage.setItem(`pu-bag-${_uid()}-${tid}`, JSON.stringify(map));
}
function setItemBag(tid, itemId, bagType) {
  const map = getBagAssignments(tid);
  map[itemId] = bagType;
  setBagAssignments(tid, map);
  renderTrip(tid);
}


// ── VAN SVGs (white/light style on dark) ──────────────────────────────

// ── DATA GLOBALS (populated by loadData) ──────────────────────
let TRIPS = {};
let LINKS = {};
let CAR_LISTS = {};
let CAR_SEARCH = {};
let DOG_LISTS = {};
let DOG_LINKS = {};

async function loadData() {
  const [trips, links, car, dog] = await Promise.all([
    fetch('src/data/trips.json').then(r => r.json()),
    fetch('src/data/links.json').then(r => r.json()),
    fetch('src/data/car.json').then(r => r.json()),
    fetch('src/data/dog.json').then(r => r.json()),
  ]);
  TRIPS      = trips;
  LINKS      = links;
  CAR_LISTS  = car.lists;
  CAR_SEARCH = car.search;
  DOG_LISTS  = dog.lists;
  DOG_LINKS  = dog.links;
}

// ── APP STATE ─────────────────────────────────────────────────
const IDS = ['ski','summer','winter','weekend','spring','autumn'];
let lang         = localStorage.getItem('pu-lang') || 'en';
let currentTrip  = null;   // template id (ski/summer/winter/weekend)
let currentListId = null;  // saved list id, or null for base template
let activeTab    = 'trips';
let pollTimer    = null;
let myProfile    = null;
let tripStates   = {};
let allProfiles  = [];
let userChecked  = {};
let carChecked   = JSON.parse(localStorage.getItem('pu-car') || '{}');

function defState(id)   { return { duration: TRIPS[id]?.defaultDuration || 7, customItems: [] }; }
const t  = k => (T[lang] && T[lang][k]) || k;
const ti = id => (T[lang]?.items  || {})[id] || id;
const tc = id => (T[lang]?.cats   || {})[id] || id;
function showToast(msg, ms=2100) {
  const e = document.getElementById('toast');
  e.textContent = msg; e.classList.add('show');
  setTimeout(() => e.classList.remove('show'), ms);
}
function allItemsList(id, st) {
  const tr=TRIPS[id], d=st.duration, arr=[];
  if(!tr) return arr;
  const hidden = getHiddenItems(id);
  for(const c of tr.cats) for(const i of c.items) {
    if(hidden.has(i.id)) continue;
    const {qty,rule}=resolveQ(i.q,d);
    arr.push({id:i.id,catId:c.id,qty,rule});
  }
  for(const ci of getCustomItems(id))
    arr.push({id:ci.id,catId:ci.catId,qty:ci.qty||1,rule:'fixed',custom:true,name:ci.name});
  return arr;
}
function calcProg(tid, st, chk) {
  const all=allItemsList(tid,st), s=new Set(chk);
  return { done: all.filter(i=>s.has(i.id)).length, total: all.length };
}
function durPills(tid, dur) {
  if(!TRIPS[tid]) return [];
  return TRIPS[tid].cats.flatMap(c =>
    c.items.filter(i => typeof i.q==='string' && i.q!=='fixed')
           .map(i => ({id:i.id, qty:calcQ(i.q,dur), rule:i.q}))
  );
}

function halfGauge(color, pct, label){
  // Small gauge used in team rows (r=32)
  const arcTotal = 100.5;
  const arcFill  = (pct / 100 * arcTotal).toFixed(1);
  return `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:2px">
    <svg width="76" height="46" viewBox="0 0 76 46" style="overflow:visible">
      <path d="M6,42 A32,32 0 0,1 70,42" fill="none" stroke="rgba(0,0,0,.08)" stroke-width="11" stroke-linecap="round"/>
      <path d="M6,42 A32,32 0 0,1 70,42" fill="none" stroke="${color}" stroke-width="11" stroke-linecap="round"
        stroke-dasharray="${arcFill} ${arcTotal}" style="transition:stroke-dasharray .6s ease"/>
      <text x="38" y="36" text-anchor="middle" font-size="12" font-weight="700" fill="${color}" font-family="DM Mono,monospace">${label}</text>
    </svg>
    <span style="font-size:12px;font-weight:700;color:${color};font-family:var(--display);line-height:1">${pct}%</span>
  </div>`;
}

function bigGauge(color, pct, label, sublabel, name){
  const r = 54, arcTotal = +(Math.PI * r).toFixed(1);
  const arcFill = (pct / 100 * arcTotal).toFixed(1);
  const cx = 70, cy = 74;
  const nameLabel = name ? `${name}'s progress` : t('progress');
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:0">
    <div style="font-family:var(--mono);font-size:10px;color:var(--cream3);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px">${nameLabel}</div>
    <svg width="140" height="80" viewBox="0 0 140 80" style="overflow:visible">
      <path d="M${cx-r},${cy} A${r},${r} 0 0,1 ${cx+r},${cy}" fill="none" stroke="rgba(0,0,0,.07)" stroke-width="13" stroke-linecap="round"/>
      <path d="M${cx-r},${cy} A${r},${r} 0 0,1 ${cx+r},${cy}" fill="none" stroke="${color}" stroke-width="13" stroke-linecap="round"
        stroke-dasharray="${arcFill} ${arcTotal}" style="transition:stroke-dasharray .7s cubic-bezier(.4,0,.2,1)"/>
      <text x="${cx}" y="${cy-4}" text-anchor="middle" font-size="28" font-weight="700" fill="${color}" font-family="Playfair Display,serif">${pct}%</text>
      <text x="${cx}" y="${cy+14}" text-anchor="middle" font-size="11" fill="rgba(42,37,32,.4)" font-family="DM Mono,monospace">${label}</text>
    </svg>
    <span style="font-size:11px;color:var(--cream3);font-family:var(--mono);margin-top:-4px">${sublabel}</span>
  </div>`;
}

// ── AUTH — username only ─────────────────────────────────────────────
// No email or password. Identity = name matched against profiles table.
// Returning users are recognised by localStorage profile ID.
// New name = new profile. Same name = same profile (load existing).

function showAuthMode(mode) {
  document.getElementById('authMain').style.display = mode === 'main' ? 'block' : 'none';
  document.getElementById('authEdit').style.display = mode === 'edit' ? 'block' : 'none';
  if(mode === 'main') setTimeout(() => document.getElementById('uName')?.focus(), 140);
  if(mode === 'edit') setTimeout(() => document.getElementById('editName')?.focus(), 140);
}

function showProfileModal(editMode = false) {
  document.getElementById('profileModal').style.display = 'flex';
  if(editMode && myProfile) {
    const r = document.getElementById('avRingEdit');
    if(r){ r.style.background=myProfile.color; r.style.borderColor=myProfile.color; r.textContent=ini(myProfile.name); r.classList.add('has-name'); }
    const inp = document.getElementById('editName');
    if(inp) inp.value = myProfile.name;
    showAuthMode('edit');
  } else {
    const inp = document.getElementById('uName');
    if(inp) inp.value = '';
    const r = document.getElementById('avRing');
    if(r){ r.style.background='var(--rim2)'; r.style.borderColor='var(--rim2)'; r.textContent='?'; r.classList.remove('has-name'); }
    showAuthMode('main');
  }
}

function addNewUser(){ showProfileModal(false); }

function setAuthErr(id, msg) {
  const el = document.getElementById(id);
  if(el){ el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}

async function doLogin() {
  const name = (document.getElementById('uName')?.value || '').trim();
  if(!name){ setAuthErr('uErr', lang==='sv'?'Skriv ditt namn.':'Please enter your name.'); return; }
  setAuthErr('uErr', '');
  document.getElementById('mSaveBtn').textContent = '…';
  document.getElementById('mSaveBtn').disabled = true;

  // Reload profiles to get the freshest list
  const fresh = await sGet('profiles');
  if(fresh) allProfiles = fresh;

  // Look for an existing profile with this exact name (case-insensitive)
  const existing = allProfiles.find(p => p.name.trim().toLowerCase() === name.toLowerCase());

  if(existing) {
    // Returning user — load their profile
    myProfile = { ...existing, color: colorFromName(existing.name) };
  } else {
    // New user — create a fresh profile
    myProfile = { id: 'u' + Date.now() + Math.random().toString(36).slice(2,6), name, color: colorFromName(name) };
    allProfiles.push({ ...myProfile });
    syncDot('busy');
    await sSet('profiles', allProfiles);
    syncDot('ok');
  }

  // Persist to localStorage so they're auto-recognised next visit
  localStorage.setItem('pu-me', JSON.stringify(myProfile));

  // Load their checked items
  for(const id of IDS){
    const ch = await sGet('checked-' + id + '-' + myProfile.id);
    userChecked[id] = ch || [];
    userChecked['_u' + myProfile.id + '_' + id] = ch || [];
  }

  document.getElementById('mSaveBtn').textContent = "Let's go →";
  document.getElementById('mSaveBtn').disabled = false;
  document.getElementById('profileModal').style.display = 'none';
  updateProfBtn();
  switchTab('trips');
}

async function doEditName() {
  const name = (document.getElementById('editName')?.value || '').trim();
  if(!name){ setAuthErr('editErr', lang==='sv'?'Skriv ett namn.':'Please enter a name.'); return; }
  // Check if name is taken by someone else
  const taken = allProfiles.find(p => p.id !== myProfile.id && p.name.trim().toLowerCase() === name.toLowerCase());
  if(taken){ setAuthErr('editErr', lang==='sv'?'Det namnet finns redan.':'That name is already taken.'); return; }
  myProfile.name  = name;
  myProfile.color = colorFromName(name);
  localStorage.setItem('pu-me', JSON.stringify(myProfile));
  const idx = allProfiles.findIndex(p => p.id === myProfile.id);
  if(idx >= 0) allProfiles[idx] = {...myProfile};
  syncDot('busy');
  await sSet('profiles', allProfiles);
  syncDot('ok');
  document.getElementById('profileModal').style.display = 'none';
  updateProfBtn();
  if(currentTrip) renderTrip(currentTrip); else renderHome();
}

function doSignOut() {
  // Clear localStorage identity — next visit will prompt for name
  localStorage.removeItem('pu-me');
  myProfile = null;
  document.getElementById('profileModal').style.display = 'none';
  updateProfBtn();
  showProfileModal(false);
}

function onNameInput(v){
  const c=colorFromName(v), r=document.getElementById('avRing');
  if(r){ r.style.background=c; r.style.borderColor=c; r.textContent=ini(v)||'?'; r.classList.toggle('has-name',!!v.trim()); }
}
function onEditNameInput(v){
  const c=colorFromName(v), r=document.getElementById('avRingEdit');
  if(r){ r.style.background=c; r.style.borderColor=c; r.textContent=ini(v)||'?'; r.classList.toggle('has-name',!!v.trim()); }
}

function updateProfBtn(){
  // Header sign-in button
  const siBtn = document.getElementById('signInHeaderBtn');
  if(siBtn) siBtn.style.display = myProfile ? 'none' : 'inline-flex';
  // Sidebar buttons
  const soBtn = document.getElementById('sbSignOutBtn');
  const seBtn = document.getElementById('sbEditBtn');
  if(soBtn) soBtn.style.display = myProfile ? 'flex' : 'none';
  if(seBtn) seBtn.style.display = myProfile ? 'flex' : 'none';
  // Top bar user pills
  const strip = document.getElementById('usersStrip');
  if(strip){
    strip.innerHTML = allProfiles.map(pr => {
      const isMe = myProfile && pr.id === myProfile.id;
      return `<div class="u-pill${isMe?' me':''}"
        onclick="${isMe?'showProfileModal(true)':''}"
        title="${pr.name}${isMe?' (tap to edit)':''}">
        <div class="u-pill-av" style="background:${pr.color}">${ini(pr.name)}</div>
        <span class="u-pill-name">${pr.name}</span>
      </div>`;
    }).join('');
  }
  // Sidebar user list
  const sbList = document.getElementById('sbUserList');
  if(sbList){
    sbList.innerHTML = allProfiles.map(pr => {
      const isMe = myProfile && pr.id === myProfile.id;
      return `<div class="sb-user-row${isMe?' me':''}"
        onclick="${isMe?'showProfileModal(true)':''}"
        title="${pr.name}${isMe?' (edit)':''}">
        <div class="sb-av" style="background:${pr.color}">${ini(pr.name)}</div>
        <span class="sb-name">${pr.name}</span>
      </div>`;
    }).join('');
  }
}
function updateSidebarLists() {
  const lists = getLists();
  const el = document.getElementById('sbListItems');
  const wrap = document.getElementById('sidebarLists');
  if(!el || !wrap) return;
  if(!lists.length){ wrap.style.display='none'; return; }
  wrap.style.display='block';
  el.innerHTML = lists.map(l => {
    const isActive = l.id === currentListId;
    const emoji = {ski:'⛷️',summer:'☀️',winter:'🏙️',weekend:'🎒'}[l.templateId]||'✈️';
    return `<div class="sb-list-row${isActive?' active':''}" onclick="openList('${l.id}')" title="${l.name}">
      <span>${emoji}</span><span class="sb-list-name">${l.name}</span>
    </div>`;
  }).join('');
}

// ── SAVE LIST MODAL ───────────────────────────────────────────────────
let _pendingListTemplate = null;

function openSaveListModal(templateId) {
  _pendingListTemplate = templateId;
  document.getElementById('listNameInp').value = '';
  const err = document.getElementById('listNameErr');
  if(err){ err.textContent=''; err.style.display='none'; }
  document.getElementById('saveListModal').style.display = 'flex';
  setTimeout(()=>document.getElementById('listNameInp').focus(), 140);
}
function closeSaveListModal() {
  document.getElementById('saveListModal').style.display = 'none';
  _pendingListTemplate = null;
}
function confirmSaveList() {
  const name = (document.getElementById('listNameInp').value||'').trim();
  const err = document.getElementById('listNameErr');
  if(!name){ if(err){err.textContent='Please enter a name.';err.style.display='block';} return; }
  const list = createList(name, _pendingListTemplate);
  closeSaveListModal();
  // Copy current trip's state into the new list
  const src = _pendingListTemplate;
  const ci = getCustomItems(src);
  setCustomItems(list.id, ci);
  const hi = getHiddenItems(src);
  setHiddenItems(list.id, hi);
  const qo = getQtyOverrides(src);
  setQtyOverrides(list.id, qo);
  // Copy checked items
  if(myProfile && userChecked[src] && userChecked[src].length){
    userChecked[list.id] = [...userChecked[src]];
    userChecked['_u'+myProfile.id+'_'+list.id] = [...userChecked[src]];
    sSet('checked-'+list.id+'-'+myProfile.id, userChecked[list.id]);
  }
  updateSidebarLists();
  showToast('✓ ' + t('listSaved') + ': ' + name);
  openList(list.id);
}
function doDeleteList(listId) {
  const list = getLists().find(l=>l.id===listId);
  if(!list) return;
  if(!confirm(`Delete "${list.name}"?`)) return;
  deleteList(listId);
  currentListId = null;
  updateSidebarLists();
  goHome();
}

// Open a saved list in trip view
function openList(listId) {
  const list = getLists().find(l=>l.id===listId);
  if(!list) return;
  currentListId = listId;
  openTrip(list.templateId);
}

// updateCustomItemQty — update qty of a custom item
function updateCustomItemQty(tid, itemId, qty) {
  const items = getCustomItems(tid);
  const ci = items.find(i=>i.id===itemId);
  if(ci){ ci.qty = qty; setCustomItems(tid, items); }
}

function toggleManage(){
  const p=document.getElementById('managePanel'),b=document.getElementById('manageToggle');
  const open=p.style.display==='none'||!p.style.display;
  p.style.display=open?'block':'none';b.textContent=open?'hide':'manage users';
  if(open)renderUserList();
}
function renderUserList(){
  const el=document.getElementById('userList');if(!el)return;
  el.innerHTML=allProfiles.map(pr=>{
    const isMe=myProfile&&pr.id===myProfile.id;
    return`<div class="mu-row"><div class="mu-av" style="background:${pr.color}">${ini(pr.name)}</div><div class="mu-name">${pr.name}${isMe?`<span class="mu-you">you</span>`:''}</div>${isMe?'<div style="width:24px"></div>':`<button class="mu-del" onclick="deleteProfile('${pr.id}')">×</button>`}</div>`;
  }).join('');
}
async function deleteProfile(id){
  const pr=allProfiles.find(p=>p.id===id);if(!pr)return;
  if(!confirm(`Remove "${pr.name}" from all trips?`))return;
  syncDot('busy');
  try{
    const{error:e1}=await db.from('checked_items').delete().eq('profile_id',id);if(e1)throw e1;
    const{error:e2}=await db.from('profiles').delete().eq('id',id);if(e2)throw e2;
    allProfiles=allProfiles.filter(p=>p.id!==id);
    IDS.forEach(tid=>{delete userChecked['_u'+id+'_'+tid];});
    syncDot('ok');showToast('✓ '+pr.name+' removed');renderUserList();
    if(currentTrip)renderTrip(currentTrip);else renderHome();
  }catch(e){console.error(e.message);syncDot('err');showToast('Error removing user');}
}

function renderHome(){
  document.getElementById('homeTitle').textContent=t('choose');
  document.getElementById('langBtn').textContent=lang==='en'?'SV':'EN';
  const grid=document.getElementById('tripsGrid');grid.innerHTML='';
  const list=[{id:'ski',name:t('tripSki'),sub:t('subSki')},{id:'summer',name:t('tripSummer'),sub:t('subSummer')},{id:'winter',name:t('tripWinter'),sub:t('subWinter')},{id:'weekend',name:t('tripWeekend'),sub:t('subWeekend')},{id:'spring',name:t('tripSpring'),sub:t('subSpring')},{id:'autumn',name:t('tripAutumn'),sub:t('subAutumn')}];
  for(const tr of list){
    const st=tripStates[tr.id]||defState(tr.id);
    const myChk=userChecked[tr.id]||[];
    const p=calcProg(tr.id,st,myChk);
    const pct=p.total?Math.round(p.done/p.total*100):0;
    const acc=CARD_ACCENTS[tr.id];
    let gauges='';
    if(allProfiles.length>0){
      for(const pr of allProfiles){
        const ch=userChecked['_u'+pr.id+'_'+tr.id]||[];
        const up=calcProg(tr.id,st,ch);
        const upct=up.total?Math.round(up.done/up.total*100):0;
        gauges+=halfGauge(pr.color,upct,ini(pr.name));
      }
    }
    const card=document.createElement('div');
    card.className='tcard';card.onclick=()=>{currentListId=null;openTrip(tr.id);};
    card.innerHTML=`
      <div class="ctop" style="background:${CARD_TOPS[tr.id]}">
        <div class="ctop-bg" style="background:${CARD_TOPS[tr.id]}"></div>
        <div class="ctop-grad" style="background:linear-gradient(to bottom,transparent 40%,rgba(255,253,250,.85) 100%)"></div>
        <div class="cvan">${SVGS[tr.id]}</div>
      </div>
      <div class="cbot">
        <div class="cbot-inner">
          <div class="cbot-text">
            <div class="cname">${tr.name}</div>
            <div class="csub">${tr.sub}</div>
            <div class="cdur"><span class="cdur-dot"></span>${st.duration} ${t('days')}</div>
          </div>
          <div class="cgauges">${gauges||halfGauge(acc,pct,'')}</div>
        </div>
      </div>`;
    grid.appendChild(card);
  }
}

// ── RENDER TRIP ───────────────────────────────────────────────────────
function renderTrip(tripId){
  const st=tripStates[tripId]||defState(tripId);
  const trip=TRIPS[tripId];
  const myChk=new Set(userChecked[tripId]||[]);
  const dur=st.duration;
  const p=calcProg(tripId,st,[...myChk]);
  const pct=p.total?Math.round(p.done/p.total*100):0;
  const tNames={ski:t('tripSki'),summer:t('tripSummer'),winter:t('tripWinter'),weekend:t('tripWeekend'),spring:t('tripSpring'),autumn:t('tripAutumn')};
  const tSubs={ski:t('subSki'),summer:t('subSummer'),winter:t('subWinter'),weekend:t('subWeekend'),spring:t('subSpring'),autumn:t('subAutumn')};
  const catOpts=trip.cats.map(c=>`<option value="${c.id}">${tc(c.id)}</option>`).join('');
  const acc=CARD_ACCENTS[tripId];
  const myCol=myProfile?myProfile.color:acc;
  const others=allProfiles.filter(pr=>!myProfile||pr.id!==myProfile.id);
  const pills=durPills(tripId,dur);
  const pillsHTML=pills.map(pi=>`<div class="dur-pill"><span class="dp-name">${ti(pi.id)}</span><span class="dp-qty">×${pi.qty}</span></div>`).join('');
  let teamHTML='';
  for(const pr of allProfiles){
    const ch=userChecked['_u'+pr.id+'_'+tripId]||[];
    const up=calcProg(tripId,st,ch);
    const upct=up.total?Math.round(up.done/up.total*100):0;
    const isMe=myProfile&&pr.id===myProfile.id;
    teamHTML+=`<div class="uc-row">
      <div class="u-av" style="background:${pr.color}">${ini(pr.name)}</div>
      <div class="u-info">
        <div class="u-name">${pr.name}${isMe?`<span class="u-you">${t('you')}</span>`:''}</div>
        <div class="u-pbar"><div class="u-pfill" style="width:${upct}%;background:${pr.color}"></div></div>
      </div>
      <div class="u-pct" style="color:${pr.color}">${upct}%</div>
      ${!isMe?`<button class="u-del" onclick="deleteProfile('${pr.id}')">×</button>`:'<div style="width:28px"></div>'}
    </div>`;
  }
  const qtyOverrides = getQtyOverrides(tripId);
  const bagAssignments = getBagAssignments(tripId);
  let catsHTML='';
  for(const cat of trip.cats){
    const hidden=getHiddenItems(tripId);
    const cH=cat.items.filter(item=>!hidden.has(item.id)).map(item=>{
      const{qty,rule}=resolveQ(item.q,dur);
      const done=myChk.has(item.id);
      const dots=others.filter(pr=>(userChecked['_u'+pr.id+'_'+tripId]||[]).includes(item.id)).map(pr=>`<div class="ic-dot" style="background:${pr.color}" title="${pr.name}"></div>`).join('');
      const effectiveBag = bagAssignments[item.id] || item.bag || 'checked';
      const bagBtns = `<span class="bag-btns" onclick="event.stopPropagation()">
        <button class="bag-btn${effectiveBag==='carry_on'?' bag-btn-on':''}" onclick="setItemBag('${tripId}','${item.id}','carry_on')" title="Carry-on">✈</button>
        <button class="bag-btn${effectiveBag==='checked'?' bag-btn-on':''}" onclick="setItemBag('${tripId}','${item.id}','checked')" title="Checked">🧳</button>
      </span>`;
      const qtyOvr = qtyOverrides[item.id];
      const displayQty = qtyOvr !== undefined ? qtyOvr : qty;
      const qtyIn = `<input class="item-qty" type="number" min="0" max="99" value="${displayQty}" title="Quantity needed" onchange="setItemQty('${tripId}','${item.id}',+this.value||0);" onclick="event.stopPropagation()" tabindex="-1"/>`;
      return`<div class="item${done?' done':''}" data-id="${item.id}" onclick="toggleItem('${tripId}','${item.id}')"><div class="chk"></div>${bagBtns}<div class="itxt">${ti(item.id)}</div>${qtyIn}${dots?`<div class="item-dots">${dots}</div>`:''}<button class="idel" onclick="event.stopPropagation();hideItem('${tripId}','${item.id}')" title="Remove from my list">×</button></div>`;
    }).join('');
    const custH=getCustomItems(tripId).filter(ci=>ci.catId===cat.id).map(ci=>{
      const done=myChk.has(ci.id);
      const dots=others.filter(pr=>(userChecked['_u'+pr.id+'_'+tripId]||[]).includes(ci.id)).map(pr=>`<div class="ic-dot" style="background:${pr.color}"></div>`).join('');
      const ciEffBag = bagAssignments[ci.id] || 'checked';
      const ciBagBtns = `<span class="bag-btns" onclick="event.stopPropagation()">
        <button class="bag-btn${ciEffBag==='carry_on'?' bag-btn-on':''}" onclick="setItemBag('${tripId}','${ci.id}','carry_on')" title="Carry-on">✈</button>
        <button class="bag-btn${ciEffBag==='checked'?' bag-btn-on':''}" onclick="setItemBag('${tripId}','${ci.id}','checked')" title="Checked">🧳</button>
      </span>`;
      const ciQtyIn = `<input class="item-qty" type="number" min="0" max="99" value="${ci.qty||1}" title="Quantity" onclick="event.stopPropagation()" onchange="updateCustomItemQty('${tripId}','${ci.id}',+this.value||1)" tabindex="-1"/>`;
      return`<div class="item${done?' done':''}" data-id="${ci.id}" onclick="toggleItem('${tripId}','${ci.id}')"><div class="chk"></div>${ciBagBtns}<div class="itxt">${ci.name} <span style="font-size:9px;color:var(--gold);font-family:var(--mono)">mine</span></div>${ciQtyIn}${dots?`<div class="item-dots">${dots}</div>`:''}<button class="idel" onclick="event.stopPropagation();delItem('${tripId}','${ci.id}')" title="Delete">×</button></div>`;
    }).join('');
    const allVisible=allItemsList(tripId,st).filter(i=>i.catId===cat.id);
    const total=allVisible.length;
    const done2=allVisible.filter(i=>myChk.has(i.id)).length;
    catsHTML+=`<div class="cats" id="cat-${tripId}-${cat.id}">
      <div class="cath" onclick="togCat('${tripId}','${cat.id}')">
        <span class="caticon">${si(cat.icon)}</span><span class="catname">${tc(cat.id)}</span>
        <span class="catcount">${done2}/${total}</span><span class="catchev">▾</span>
      </div>
      <div class="ilist">${cH}${custH}</div>
    </div>`;
  }
  const listObj = currentListId ? getLists().find(l=>l.id===currentListId) : null;
  const tripTitle = listObj ? listObj.name : tNames[tripId];
  const tripSub   = listObj ? `${tNames[tripId]} · ${tSubs[tripId]}` : tSubs[tripId];
  document.getElementById('tripView').innerHTML=`
    <div class="thero">
      <div class="hvan">${SVGS[tripId]}</div>
      <h1>${tripTitle}</h1>
      <p class="tsub">${tripSub}</p>
      ${!listObj ? `<button class="save-list-btn" onclick="openSaveListModal('${tripId}')">${t('saveList')} +</button>` : `<button class="save-list-btn del-list-btn" onclick="doDeleteList('${currentListId}')">${t('deleteList')}</button>`}
    </div>
    <div class="trip-top-row">
      <div class="dcard trip-top-card">
        <div class="dur-row">
          <span class="dur-label">${t('duration')}</span>
          <div class="dur-ctrl">
            <button class="durbtn" onclick="chDur('${tripId}',-1)">−</button>
            <span class="durval" id="durVal">${dur}</span>
            <button class="durbtn" onclick="chDur('${tripId}',1)">+</button>
            <span style="font-size:12px;color:var(--cream3)">${t('days')}</span>
          </div>
        </div>
        ${pillsHTML?`<div class="dur-pills">${pillsHTML}</div>`:''}
      </div>
      <div class="dcard trip-top-card" style="display:flex;align-items:center;justify-content:center;padding:16px">
        ${bigGauge(myCol, pct, ini(myProfile?.name||'?'), `${p.done} ${t('of')} ${p.total} ${t('packed')}`, myProfile?.name)}
      </div>
      ${allProfiles.length>1?`<div class="dcard trip-top-card">
        <div class="uc-title">${t('teamProg')}</div>
        <div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">
          ${allProfiles.map(pr=>{
            const ch=userChecked['_u'+pr.id+'_'+tripId]||[];
            const up=calcProg(tripId,st,ch);
            const upct=up.total?Math.round(up.done/up.total*100):0;
            return halfGauge(pr.color, upct, ini(pr.name));
          }).join('')}
        </div>
      </div>`:''}
    </div>
    ${catsHTML}
    <div class="addsec">
      <div class="addtitle">+ ${t('addItem')}</div>
      <div class="addrow">
        <input class="ainput" id="newN" placeholder="${t('addName')}" maxlength="60" onkeydown="if(event.key==='Enter')addItem('${tripId}')"/>
        <input class="ainput aqty" id="newQ" type="number" min="1" max="99" value="1" placeholder="${t('addQty')}" style="width:62px;flex-shrink:0;text-align:center"/>
        <select class="aselect" id="newC">${catOpts}</select>
        <button class="abtn" onclick="addItem('${tripId}')">${t('addBtn')}</button>
      </div>
    </div>
    <button class="resetbtn" onclick="doReset('${tripId}')">${t('reset')}</button>
    <div style="height:24px"></div>`;
}
function updProg(tid){
  // Just re-render the whole trip — the gauge has no simple partial update
  if(currentTrip===tid) renderTrip(tid);
}

// ── RENDER LINKS ──────────────────────────────────────────────────────
function renderLinks(){
  const data=LINKS[lang]||LINKS.en;
  document.getElementById('linksView').innerHTML=data.map(sec=>`
    <span class="sec-eyebrow">${sec.eye}</span>
    <div class="sec-title">${sec.title}</div>
    <div class="link-grid">${sec.items.map(lk=>`
      <a class="lcard" href="${lk.url}" target="_blank" rel="noopener">
        <div class="lc-icon">${si(lk.icon,20)}</div>
        <div class="lc-name">${lk.name}</div>
        <div class="lc-desc">${lk.desc}</div>
        <div class="lc-badge">${lk.badge}</div>
        <span class="lc-arrow">↗</span>
      </a>`).join('')}
    </div>`).join('');
}

// ── RENDER CAR ────────────────────────────────────────────────────────
function renderCar(){
  const lists=CAR_LISTS[lang]||CAR_LISTS.en;
  const srch=CAR_SEARCH[lang]||CAR_SEARCH.en;
  const model=localStorage.getItem('pu-carmodel')||'';
  const ph=lang==='sv'?'Bilmodell t.ex. Volvo XC60 2019…':'Car model e.g. Volvo XC60 2019…';
  const searchLinks=model
    ?srch.map(s=>`<a class="car-link" href="https://www.google.com/search?q=${encodeURIComponent(model+' '+s.q)}" target="_blank" rel="noopener">${si('search',12)} ${s.l}</a>`).join('')
    :`<span style="font-size:12px;color:var(--cream3)">${lang==='sv'?'Ange bilmodellen ovan':'Enter your car model above'}</span>`;
  const listsHTML=lists.map(lst=>{
    const done=lst.items.filter(i=>carChecked[lst.id+'-'+i.id]).length;
    const pct=Math.round(done/lst.items.length*100);
    const rows=lst.items.map(i=>{const k=lst.id+'-'+i.id;const isDone=!!carChecked[k];return`<div class="cl-item${isDone?' done':''}" onclick="toggleCl('${k}','${lst.id}')"><div class="cl-chk"></div><div class="cl-txt">${i.label}<span class="cl-sub">${i.sub}</span></div></div>`;}).join('');
    const carIconKey = lst.id==='pre'?'car':'bag';
    return`<div class="cl-box">
      <div class="cl-head">${si(carIconKey,14)}<span class="cl-htitle" style="margin-left:6px">${lst.title}</span><span class="cl-pct">${done}/${lst.items.length} · ${pct}%</span></div>
      <div class="cl-progwrap"><div class="cl-prog"><div class="cl-pfill" style="width:${pct}%"></div></div></div>
      ${rows}
    </div>`;
  }).join('');
  document.getElementById('carView').innerHTML=`
    <span class="sec-eyebrow" style="margin-top:0">${lang==='sv'?'Bilresa':'Road trip'}</span>
    <div class="sec-title" style="margin-bottom:14px">${lang==='sv'?'Förbered bilen':'Prepare the car'}</div>
    <div class="car-search-box">
      <div class="car-stitle"><span class="car-stitle-mono">${lang==='sv'?'Sök om din bil':'Search your car'}</span></div>
      <div class="car-row">
        <input class="car-inp" id="carInp" value="${model}" placeholder="${ph}" onkeydown="if(event.key==='Enter')saveCarModel()"/>
        <button class="car-sbtn" onclick="saveCarModel()">${lang==='sv'?'Sök':'Search'} →</button>
      </div>
      <div class="car-links">${searchLinks}</div>
    </div>
    ${listsHTML}
    <button class="resetbtn" onclick="resetCar()">${lang==='sv'?'Återställ checklistor':'Reset all checklists'}</button>
    <div style="height:12px"></div>`;
}
function saveCarModel(){const v=(document.getElementById('carInp').value||'').trim();localStorage.setItem('pu-carmodel',v);renderCar();if(v)showToast('✓ '+v);}
function toggleCl(key,listId){carChecked[key]=!carChecked[key];localStorage.setItem('pu-car',JSON.stringify(carChecked));renderCar();}
function resetCar(){if(!confirm(lang==='sv'?'Återställa alla checklistor?':'Reset all checklists?'))return;carChecked={};localStorage.setItem('pu-car','{}');renderCar();showToast('✓ Reset');}

// ── DOG ────────────────────────────────────────────────────────────────

;
let dogChecked=JSON.parse(localStorage.getItem('pu-dog')||'{}');
function renderDog(){
  const el=document.getElementById('dogView');
  const lists=DOG_LISTS[lang]||DOG_LISTS.en;
  const links=DOG_LINKS[lang]||DOG_LINKS.en;
  const heading=lang==='sv'?'Resa med hund':'Travelling with your dog';
  const linksHead=lang==='sv'?'Användbara länkar':'Useful links';
  const listsHTML=lists.map(lst=>{
    const done=lst.items.filter(i=>dogChecked[lst.id+'-'+i.id]).length;
    const pct=Math.round(done/lst.items.length*100);
    const rows=lst.items.map(i=>{const k=lst.id+'-'+i.id;const isDone=!!dogChecked[k];
      return`<div class="cl-item${isDone?' done':''}" onclick="toggleDog('${k}')"><div class="cl-chk"></div><div class="cl-txt">${i.label}<span class="cl-sub">${i.sub}</span></div></div>`;}).join('');
    const iconKey = lst.id==='pre'?'car':lst.id==='kids'?'bag':lst.id==='dog-pack'?'bag':lst.id==='dog-admin'?'clipboard':lst.id==='dog-tips'?'car':'other';
    return`<div class="cl-box"><div class="cl-head">${si(iconKey,14)}<span class="cl-htitle" style="margin-left:6px">${lst.title}</span><span class="cl-pct">${done}/${lst.items.length} · ${pct}%</span></div><div class="cl-progwrap"><div class="cl-prog"><div class="cl-pfill" style="width:${pct}%"></div></div></div>${rows}</div>`;
  }).join('');
  const linksHTML=`<div class="link-grid" style="margin-bottom:14px">${links.map(lk=>`<a class="lcard" href="${lk.url}" target="_blank" rel="noopener"><span class="lc-arrow">↗</span><div class="lc-icon">${si(lk.icon,20)}</div><div class="lc-name">${lk.name}</div><div class="lc-desc">${lk.desc}</div></a>`).join('')}</div>`;
  el.innerHTML=`<span class="sec-eyebrow" style="margin-top:0">Road trip companion</span><div class="sec-title">🐶 ${heading}</div>${listsHTML}<span class="sec-eyebrow">${linksHead}</span>${linksHTML}<button class="resetbtn" onclick="resetDog()">${lang==='sv'?'Återställ hundchecklistorna':'Reset dog checklists'}</button><div style="height:12px"></div>`;
}
function toggleDog(key){dogChecked[key]=!dogChecked[key];localStorage.setItem('pu-dog',JSON.stringify(dogChecked));renderDog();}
function resetDog(){if(!confirm(lang==='sv'?'Återställa hundchecklistorna?':'Reset dog checklists?'))return;dogChecked={};localStorage.setItem('pu-dog','{}');renderDog();showToast('✓ Reset');}

// ── ACTIONS ───────────────────────────────────────────────────────────
async function toggleItem(tid,iid){
  if(!myProfile){showProfileModal();return;}
  const arr=userChecked[tid]||(userChecked[tid]=[]);
  const idx=arr.indexOf(iid);if(idx>=0)arr.splice(idx,1);else arr.push(iid);
  userChecked['_u'+myProfile.id+'_'+tid]=arr;
  const el=document.querySelector(`[data-id="${iid}"]`);
  if(el)el.classList.toggle('done',arr.includes(iid));
  updProg(tid);syncDot('busy');
  await sSet('checked-'+tid+'-'+myProfile.id,arr);syncDot('ok');
}
async function chDur(tid,d){
  const st=tripStates[tid]||defState(tid);
  st.duration=Math.max(1,Math.min(60,(st.duration||TRIPS[tid].defaultDuration)+d));
  tripStates[tid]=st;syncDot('busy');await sSet('trip-'+tid,st);syncDot('ok');renderTrip(tid);
}
async function addItem(tid){
  const n=(document.getElementById('newN').value||'').trim();
  if(!n){document.getElementById('newN').focus();return;}
  if(!myProfile){showToast('Sign in first');return;}
  const qty=Math.max(1,Math.min(99,parseInt(document.getElementById('newQ')?.value)||1));
  const catId=document.getElementById('newC').value;
  const id='c'+Date.now()+Math.random().toString(36).slice(2,5);
  const items=getCustomItems(tid);
  items.push({id,name:n,qty,catId});
  setCustomItems(tid,items);
  document.getElementById('newN').value='';
  const qEl=document.getElementById('newQ');if(qEl)qEl.value='1';
  renderTrip(tid);showToast('✓ '+n);
}

function delItem(tid,iid){
  // Remove from custom items
  const items=getCustomItems(tid).filter(ci=>ci.id!==iid);
  setCustomItems(tid,items);
  // Also uncheck if checked
  userChecked[tid]=(userChecked[tid]||[]).filter(id=>id!==iid);
  if(myProfile) sSet('checked-'+tid+'-'+myProfile.id, userChecked[tid]);
  renderTrip(tid);
}

function hideItem(tid,iid){
  // Hide a catalogue item from this user's list
  const hidden=getHiddenItems(tid);
  hidden.add(iid);
  setHiddenItems(tid,hidden);
  // Uncheck it too
  userChecked[tid]=(userChecked[tid]||[]).filter(id=>id!==iid);
  if(myProfile) sSet('checked-'+tid+'-'+myProfile.id, userChecked[tid]);
  renderTrip(tid);
}

async function doReset(tid){
  if(!myProfile) return;
  const msg = lang==='sv'
    ? 'Återställa bockar? (Dina egna saker och dolda objekt behålls)'
    : 'Reset checked items? (Your custom items and hidden items are kept)';
  if(!confirm(msg)) return;
  userChecked[tid]=[];
  userChecked['_u'+myProfile.id+'_'+tid]=[];
  syncDot('busy');
  await sSet('checked-'+tid+'-'+myProfile.id,[]);
  syncDot('ok');
  renderTrip(tid);showToast('✓ Reset');
}
function togCat(tid,cid){const el=document.getElementById(`cat-${tid}-${cid}`);if(el)el.classList.toggle('coll');}

// ── NAV ───────────────────────────────────────────────────────────────
function switchTab(tab){
  activeTab=tab;
  document.getElementById('homeView').style.display='none';
  document.getElementById('linksView').classList.remove('on');
  document.getElementById('carView').classList.remove('on');
  document.getElementById('dogView').classList.remove('on');
  document.getElementById('tripView').style.display='none';
  document.getElementById('tripView').classList.remove('on');
  document.getElementById('backBtn').style.display='none';
  currentTrip=null;stopPoll();
  document.querySelectorAll('.sidenav-btn').forEach(b=>b.classList.toggle('on',b.id==='tab-'+tab));
  if(tab==='trips'){document.getElementById('homeView').style.display='block';renderHome();}
  else if(tab==='links'){document.getElementById('linksView').classList.add('on');renderLinks();}
  else if(tab==='car'){document.getElementById('carView').classList.add('on');renderCar();}
  else if(tab==='dog'){document.getElementById('dogView').classList.add('on');renderDog();}
  window.scrollTo(0,0);
}
function openTrip(id){
  currentTrip=id;
  // If not coming from openList(), clear the list context
  // (openList sets currentListId before calling openTrip)
  document.getElementById('homeView').style.display='none';
  document.getElementById('linksView').classList.remove('on');
  document.getElementById('carView').classList.remove('on');
  document.getElementById('dogView').classList.remove('on');
  document.getElementById('tripView').style.display='block';
  document.getElementById('tripView').classList.add('on');
  document.getElementById('backBtn').style.display='inline-flex';
  renderTrip(id);startPoll(id);updateSidebarLists();window.scrollTo(0,0);
}
function goHome(){
  currentTrip=null;currentListId=null;stopPoll();
  document.getElementById('tripView').style.display='none';
  document.getElementById('tripView').classList.remove('on');
  document.getElementById('backBtn').style.display='none';
  switchTab(activeTab);
}
function toggleLang(){
  lang=lang==='en'?'sv':'en';
  localStorage.setItem('pu-lang',lang);
  document.getElementById('langBtn').textContent=lang==='en'?'SV':'EN';
  document.getElementById('tl-trips').textContent=lang==='sv'?'Resor':'Trips';
  document.getElementById('tl-links').textContent=lang==='sv'?'Länkar':'Links';
  document.getElementById('tl-car').textContent=lang==='sv'?'Bil':'Car';
  document.getElementById('tl-dog').textContent=lang==='sv'?'Hund':'Dog';
  if(currentTrip)renderTrip(currentTrip);else switchTab(activeTab);
}
document.getElementById('sidebar').querySelector('.sidebar-logo').onclick=goHome;

// ── POLLING ───────────────────────────────────────────────────────────
// Normalise a trip state for comparison — ignore customItems order differences
function stateKey(st){
  if(!st)return'';
  const items=JSON.stringify((st.customItems||[]).map(i=>i.id).sort());
  return st.duration+'|'+items;
}

function startPoll(tid){
  stopPoll();
  pollTimer=setInterval(async()=>{
    // Don't re-render while user is typing in the add-item input
    const inp=document.getElementById('newN');
    if(inp&&document.activeElement===inp) return;

    try{
      const[fSt,fPr]=await Promise.all([sGet('trip-'+tid),sGet('profiles')]);
      let tripChanged=false;
      let otherChanged=false;

      // Only mark trip changed if duration or customItems actually differ
      if(fSt&&stateKey(fSt)!==stateKey(tripStates[tid])){
        // Preserve local customItems if remote has fewer (means our save is in flight)
        const localItems=tripStates[tid]?.customItems||[];
        const remoteItems=fSt.customItems||[];
        if(remoteItems.length>=localItems.length){
          tripStates[tid]=fSt;
          tripChanged=true;
        }
      }

      if(fPr&&JSON.stringify(fPr)!==JSON.stringify(allProfiles)){
        allProfiles=fPr;otherChanged=true;
      }

      // Refresh other users' checked items
      await Promise.all(allProfiles.map(async pr=>{
        for(const id of IDS){
          if(myProfile&&pr.id===myProfile.id) continue;
          const fresh=await sGet('checked-'+id+'-'+pr.id);
          const ck='_u'+pr.id+'_'+id;
          if(fresh&&JSON.stringify(fresh)!==JSON.stringify(userChecked[ck])){
            userChecked[ck]=fresh;otherChanged=true;
          }
        }
      }));

      const anyChange=tripChanged||otherChanged;
      if(anyChange&&currentTrip===tid){
        // Preserve scroll position when poll triggers re-render
        const scrollY=window.scrollY;
        renderTrip(tid);
        window.scrollTo(0,scrollY);
      } else if(anyChange){
        renderHome();
      }
    }catch(e){console.warn('[pU] poll',e.message);}
  },4000);
}
function stopPoll(){if(pollTimer){clearInterval(pollTimer);pollTimer=null;}}

// ── INIT ──────────────────────────────────────────────────────────────
async function init(){
  await loadData();
  document.getElementById('langBtn').textContent=lang==='en'?'SV':'EN';
  document.getElementById('tl-trips').textContent=lang==='sv'?'Resor':'Trips';
  document.getElementById('tl-links').textContent=lang==='sv'?'Länkar':'Links';
  document.getElementById('tl-car').textContent=lang==='sv'?'Bil':'Car';
  document.getElementById('tl-dog').textContent=lang==='sv'?'Hund':'Dog';
  syncDot('busy');

  // Restore identity from this device
  const saved = localStorage.getItem('pu-me');
  if(saved) try { myProfile = JSON.parse(saved); myProfile.color = colorFromName(myProfile.name); } catch(e){}

  // Load profiles + trip states in parallel
  const[shPr,...trs]=await Promise.all([sGet('profiles'),...IDS.map(id=>sGet('trip-'+id))]);
  allProfiles=shPr||[];
  IDS.forEach((id,i)=>{ tripStates[id]=trs[i]||defState(id); if(!tripStates[id].customItems) tripStates[id].customItems=[]; });

  // Merge own profile into shared list
  if(myProfile){
    const idx=allProfiles.findIndex(p=>p.id===myProfile.id);
    if(idx>=0) allProfiles[idx]={...myProfile}; else allProfiles.push({...myProfile});
    await sSet('profiles',allProfiles);
  }

  // Load checked items for all users across all trips
  await Promise.all(allProfiles.map(async pr=>{
    for(const id of IDS){
      const ch=await sGet('checked-'+id+'-'+pr.id);
      userChecked['_u'+pr.id+'_'+id]=ch||[];
      if(myProfile&&pr.id===myProfile.id) userChecked[id]=ch||[];
    }
  }));

  syncDot('ok');
  document.getElementById('loading').style.display='none';
  updateProfBtn();

  if(!myProfile){
    showProfileModal(false);
  } else {
    switchTab('trips');
  }
  updateSidebarLists();
}
init();
