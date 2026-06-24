/* =========================================================
   admin.js — จัดการกฎหมาย (API + localStorage fallback)
   ========================================================= */

const ADMIN_SESSION_KEY = 'edulaw_admin_session';
const ADMIN_PIN = 'edulaw2567';

let _editingId = null;

function isAdminAuthed(){
  try{ return sessionStorage.getItem(ADMIN_SESSION_KEY) === '1'; }catch(e){ return false; }
}
function setAdminAuthed(v){
  try{
    if(v) sessionStorage.setItem(ADMIN_SESSION_KEY, '1');
    else sessionStorage.removeItem(ADMIN_SESSION_KEY);
  }catch(e){}
}

function showLogin(){
  document.querySelector('#adminLogin').style.display = '';
  document.querySelector('#adminApp').style.display = 'none';
}

function showApp(){
  document.querySelector('#adminLogin').style.display = 'none';
  document.querySelector('#adminApp').style.display = '';
}

function bindLogin(){
  document.querySelector('#loginForm').addEventListener('submit', async e=>{
    e.preventDefault();
    const pin = document.querySelector('#adminPin').value.trim();
    try{
      if(typeof EdulawApi !== 'undefined' && await EdulawApi.checkApi()){
        const { token } = await EdulawApi.login(pin);
        EdulawApi.setToken(token);
        setAdminAuthed(true);
        showApp();
        await initAdminApp();
        showToast('เข้าสู่ระบบ — เชื่อมต่อเซิร์ฟเวอร์แล้ว');
        return;
      }
    }catch(err){
      showToast(err.message || 'รหัสผ่านไม่ถูกต้อง', 'info');
      return;
    }
    if(pin === ADMIN_PIN){
      setAdminAuthed(true);
      showApp();
      initAdminApp();
      showToast('เข้าสู่ระบบ (โหมดออฟไลน์ — บันทึกในเบราว์เซอร์)');
    } else {
      showToast('รหัสผ่านไม่ถูกต้อง', 'info');
    }
  });
  document.querySelector('#logoutBtn')?.addEventListener('click', async ()=>{
    if(typeof EdulawApi !== 'undefined') EdulawApi.setToken('');
    if(typeof EdulawApi !== 'undefined' && await EdulawApi.checkApi()){
      await EdulawApi.logout();
    }
    setAdminAuthed(false);
    showLogin();
  });
}

function catOptions(selected){
  return (window.LAW_CATEGORIES || []).map(c =>
    `<option value="${c.key}" ${c.key===selected?'selected':''}>${c.label}</option>`
  ).join('');
}

function renderLawTable(filter=''){
  const tbody = document.querySelector('#lawTableBody');
  if(!tbody) return;
  const q = filter.toLowerCase();
  const list = (window.LAWS || []).filter(l=>{
    if(!q) return true;
    const hay = [l.id,l.title,l.agency,l.type,l.category,...(l.tags||[])].join(' ').toLowerCase();
    return hay.includes(q);
  });
  document.querySelector('#adminLawCount').textContent = list.length;
  tbody.innerHTML = list.map(l=>`
    <tr>
      <td><code>${escapeHtml(l.id)}</code></td>
      <td>${escapeHtml(l.title)}</td>
      <td>${escapeHtml((window.LAW_CATEGORIES||[]).find(c=>c.key===l.category)?.label || l.category)}</td>
      <td>${escapeHtml(l.type)}</td>
      <td><span class="status-pill ${l.status!=='บังคับใช้'?'is-draft':''}">${escapeHtml(l.status)}</span></td>
      <td class="admin-actions">
        <button type="button" class="btn btn-outline btn-sm" data-edit="${l.id}">แก้ไข</button>
        <button type="button" class="btn btn-outline btn-sm danger" data-del="${l.id}">ลบ</button>
      </td>
    </tr>`).join('') || `<tr><td colspan="6" class="empty-cell">ไม่พบกฎหมาย</td></tr>`;

  tbody.querySelectorAll('[data-edit]').forEach(b=> b.addEventListener('click', ()=> openLawForm(b.dataset.edit)));
  tbody.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', ()=> deleteLaw(b.dataset.del)));
}

function openLawForm(id){
  _editingId = id || null;
  const form = document.querySelector('#lawForm');
  form.style.display = '';
  form.scrollIntoView({ behavior:'smooth', block:'start' });

  let law = {
    id:'', category:'national', title:'', year:'', type:'พระราชบัญญัติ',
    agency:'', status:'บังคับใช้', summary:'', points:[''], citation:'',
    links:[{label:'ราชกิจจานุเบกษา',url:'https://ratchakitcha.soc.go.th'}],
    tags:[], relatedLaws:[],
  };
  if(id) law = { ...getLawById(id) };

  document.querySelector('#formTitle').textContent = id ? 'แก้ไขกฎหมาย' : 'เพิ่มกฎหมายใหม่';
  document.querySelector('#fId').value = law.id;
  document.querySelector('#fId').readOnly = !!id;
  document.querySelector('#fCategory').innerHTML = catOptions(law.category);
  document.querySelector('#fTitle').value = law.title;
  document.querySelector('#fYear').value = law.year;
  document.querySelector('#fType').value = law.type;
  document.querySelector('#fAgency').value = law.agency;
  document.querySelector('#fStatus').value = law.status;
  document.querySelector('#fSummary').value = law.summary;
  document.querySelector('#fCitation').value = law.citation || '';
  document.querySelector('#fPoints').value = (law.points||[]).join('\n');
  document.querySelector('#fTags').value = (law.tags||[]).join(', ');
  document.querySelector('#fRelated').value = (law.relatedLaws||[]).join(', ');
  document.querySelector('#fLinks').value = (law.links||[]).map(l=>`${l.label}|${l.url}`).join('\n');
}

function closeLawForm(){
  document.querySelector('#lawForm').style.display = 'none';
  _editingId = null;
}

function parseLines(text){
  return text.split('\n').map(s=>s.trim()).filter(Boolean);
}

function parseLinks(text){
  return parseLines(text).map(line=>{
    const [label, ...rest] = line.split('|');
    return { label: (label||'').trim(), url: rest.join('|').trim() };
  }).filter(l=>l.label && l.url);
}

function collectLawFromForm(){
  const title = document.querySelector('#fTitle').value.trim();
  let id = document.querySelector('#fId').value.trim();
  if(!id) id = LawsStore.slugifyId(title) + '-' + Date.now().toString(36);

  return {
    id,
    category: document.querySelector('#fCategory').value,
    title,
    year: document.querySelector('#fYear').value.trim(),
    type: document.querySelector('#fType').value.trim(),
    agency: document.querySelector('#fAgency').value.trim(),
    status: document.querySelector('#fStatus').value,
    summary: document.querySelector('#fSummary').value.trim(),
    citation: document.querySelector('#fCitation').value.trim() || undefined,
    points: parseLines(document.querySelector('#fPoints').value),
    tags: parseLines(document.querySelector('#fTags').value.replace(/,/g,'\n')),
    relatedLaws: parseLines(document.querySelector('#fRelated').value.replace(/,/g,'\n')),
    links: parseLinks(document.querySelector('#fLinks').value),
    lastUpdated: new Date().toISOString().slice(0,10),
  };
}

async function saveLawFromForm(e){
  e.preventDefault();
  const law = collectLawFromForm();
  if(!law.title || !law.summary){ showToast('กรุณากรอกชื่อและสรุปสาระสำคัญ','info'); return; }

  try{
    await LawsStore.saveLaw(law);
    renderLawTable(document.querySelector('#adminSearch').value);
    closeLawForm();
    showToast(_editingId ? 'บันทึกการแก้ไขแล้ว' : 'เพิ่มกฎหมายใหม่แล้ว');
    updateStorageNote();
  }catch(err){
    showToast(err.message || 'บันทึกไม่สำเร็จ', 'info');
  }
}

async function deleteLaw(id){
  const l = getLawById(id);
  if(!l || !confirm(`ลบกฎหมาย “${l.title}” ?`)) return;
  try{
    await LawsStore.deleteLawById(id);
    renderLawTable(document.querySelector('#adminSearch').value);
    showToast('ลบกฎหมายแล้ว');
    updateStorageNote();
  }catch(err){
    showToast(err.message || 'ลบไม่สำเร็จ', 'info');
  }
}

function bindAdminTools(){
  document.querySelector('#btnAddLaw').addEventListener('click', ()=> openLawForm(null));
  document.querySelector('#btnCancelForm').addEventListener('click', closeLawForm);
  document.querySelector('#lawFormEl').addEventListener('submit', saveLawFromForm);
  document.querySelector('#adminSearch').addEventListener('input', e=> renderLawTable(e.target.value));
  document.querySelector('#btnExport').addEventListener('click', ()=>{
    LawsStore.exportLawsJson();
    showToast('ดาวน์โหลดไฟล์ JSON แล้ว');
  });
  document.querySelector('#btnImport').addEventListener('click', ()=> document.querySelector('#importFile').click());
  document.querySelector('#importFile').addEventListener('change', async e=>{
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = async ()=>{
      try{
        const data = JSON.parse(reader.result);
        if(!data.laws || !data.categories) throw new Error('รูปแบบไฟล์ไม่ถูกต้อง');
        await LawsStore.saveLawsData(data);
        await LawsStore.loadLaws({ force: true });
        renderLawTable();
        showToast('นำเข้าข้อมูลสำเร็จ');
        updateStorageNote();
      }catch(err){
        showToast('นำเข้าไม่สำเร็จ: ' + err.message, 'info');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  document.querySelector('#btnReset').addEventListener('click', async ()=>{
    if(!confirm('รีเซ็ตกลับเป็นข้อมูลจากเซิร์ฟเวอร์/ไฟล์ต้นฉบับ?')) return;
    await LawsStore.resetLawsToDefault();
    renderLawTable();
    updateStorageNote();
    showToast('รีเซ็ตข้อมูลแล้ว');
  });
  document.querySelector('#btnGenId').addEventListener('click', ()=>{
    const title = document.querySelector('#fTitle').value.trim();
    if(title) document.querySelector('#fId').value = LawsStore.slugifyId(title);
  });
}

async function updateStorageNote(){
  const el = document.querySelector('#storageNote');
  if(!el) return;
  if(LawsStore.isUsingApi() && EdulawApi.getToken()){
    el.textContent = 'เชื่อมต่อ Backend — บันทึกลงเซิร์ฟเวอร์ทันที';
    el.style.background = 'var(--sage-tint)';
    el.style.color = 'var(--sage)';
  } else if(localStorage.getItem(LawsStore.STORAGE_KEY)){
    el.textContent = 'โหมดออฟไลน์ — แก้ไขในเบราว์เซอร์ (Export JSON เพื่อย้ายข้อมูล)';
    el.style.background = '';
    el.style.color = '';
  } else {
    el.textContent = 'โหลดจาก data/laws.json / API';
    el.style.background = '';
    el.style.color = '';
  }
}

function initAdminApp(){
  renderLawTable();
  bindAdminTools();
  updateStorageNote();
}

document.addEventListener('DOMContentLoaded', ()=>{
  bindLogin();
  LawsStore.whenLawsReady().then(async ()=>{
    const apiUp = typeof EdulawApi !== 'undefined' && await EdulawApi.checkApi();
    if(isAdminAuthed() && apiUp && EdulawApi.getToken()){
      const valid = await EdulawApi.checkSession();
      if(!valid){ setAdminAuthed(false); EdulawApi.setToken(''); showLogin(); return; }
    }
    if(isAdminAuthed()){
      showApp();
      initAdminApp();
    } else showLogin();
  }).catch(()=>{
    showToast('โหลดข้อมูลกฎหมายไม่สำเร็จ', 'info');
  });
});
