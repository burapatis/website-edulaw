/* =========================================================
   forum.js — กระดานสนทนา (API + localStorage fallback)
   ========================================================= */

const FORUM_TOPICS = [
  { key:'qa', label:'ถาม-ตอบข้อกฎหมาย' },
  { key:'practice', label:'แนวปฏิบัติ/วิทยฐานะ' },
  { key:'news', label:'ข่าว/ร่างกฎหมายใหม่' },
  { key:'general', label:'พูดคุยทั่วไป' },
];

const STORAGE_KEY = 'edulaw_forum_threads_v1';
const NAME_KEY = 'edulaw_display_name';

function seedThreads(){
  const now = Date.now();
  return [
    {
      id:'t1', topic:'qa',
      title:'ครูบรรจุใหม่ ต้องมีใบอนุญาตประกอบวิชาชีพก่อนวันบรรจุหรือไม่?',
      author:'ครูปฐมวัย_กชกร', createdAt: now - 1000*60*60*26,
      body:'รบกวนสอบถามครับ ผมสอบบรรจุครูผู้ช่วยได้แล้ว แต่ใบอนุญาตประกอบวิชาชีพครูยังอยู่ระหว่างดำเนินการ จะสามารถรายงานตัวบรรจุได้หรือไม่ หรือต้องรอใบอนุญาตให้ออกก่อน',
      replies:[
        { author:'ศน.ดวงใจ', createdAt: now - 1000*60*60*20,
          body:'ตามหลักของคุรุสภา ผู้ที่จะได้รับการบรรจุเป็นข้าราชการครูต้องมีใบอนุญาตประกอบวิชาชีพ หรืออย่างน้อยต้องมีหนังสือรับรองสิทธิจากคุรุสภาก่อนวันรายงานตัวค่ะ แนะนำให้ติดต่อคุรุสภาเพื่อขอหนังสือรับรองสิทธิไปแสดงต่อ กศจ./อ.ก.ค.ศ. เขตพื้นที่' },
      ],
    },
    {
      id:'t2', topic:'news',
      title:'อัปเดตความคืบหน้าร่าง พ.ร.บ.การศึกษาแห่งชาติฉบับใหม่',
      author:'Boorapatis_Ploysuwan', createdAt: now - 1000*60*60*72,
      body:'ฝากติดตามความคืบหน้าร่างกฎหมายฉบับนี้ร่วมกันครับ ปัจจุบันมีการเสนอร่างหลายฉบับเข้าสู่กระบวนการรับฟังความเห็นตามมาตรา 77 ของรัฐธรรมนูญ ใครมีข้อมูลอัปเดตล่าสุด มาช่วยกันแบ่งปันได้เลยครับ',
      replies:[],
    },
    {
      id:'t3', topic:'practice',
      title:'แนวทางการยื่นขอวิทยฐานะเชี่ยวชาญ (วPA) ทำอย่างไรให้ผ่านรอบแรก',
      author:'ผอ.รร.บ้านดอนสัก', createdAt: now - 1000*60*60*5,
      body:'อยากแลกเปลี่ยนประสบการณ์การจัดทำข้อตกลงในการพัฒนางาน (PA) และแฟ้มสะสมผลงานสำหรับขอวิทยฐานะเชี่ยวชาญครับ มีใครผ่านรอบแรกแล้วบ้าง อยากทราบเทคนิคการเขียนรายงานผลการพัฒนาคุณภาพผู้เรียน',
      replies:[
        { author:'ครูเชี่ยวชาญ_สมาน', createdAt: now - 1000*60*60*2,
          body:'เคล็ดลับของผมคือเขียนให้เห็นผลลัพธ์ที่เป็นรูปธรรมและเชื่อมโยงกับมาตรฐานวิทยฐานะตามหลักเกณฑ์ ก.ค.ศ. ชัดเจน พร้อมแนบหลักฐานเชิงประจักษ์ครบทุกตัวชี้วัดครับ' },
      ],
    },
    {
      id:'t4', topic:'general',
      title:'แนะนำตัวและทำความรู้จักกันครับ/ค่ะ',
      author:'แอดมินเว็บไซต์', createdAt: now - 1000*60*60*96,
      body:'สวัสดีทุกท่านที่เข้ามาเยี่ยมเยือนคลังความรู้กฎหมายการศึกษาครับ พื้นที่นี้เปิดไว้สำหรับครู บุคลากรทางการศึกษา นักศึกษา และผู้สนใจทุกท่าน เชิญแนะนำตัวและแลกเปลี่ยนความคิดเห็นกันได้เลยครับ',
      replies:[],
    },
  ];
}

function loadThreadsLocal(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){ /* ignore */ }
  const seeded = seedThreads();
  saveThreadsLocal(seeded);
  return seeded;
}
function saveThreadsLocal(threads){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(threads)); }catch(e){ /* storage full/unavailable */ }
}

async function loadThreads(){
  if(typeof EdulawApi !== 'undefined' && await EdulawApi.checkApi()){
    try{
      const threads = await EdulawApi.getThreads();
      if(Array.isArray(threads) && threads.length) return threads;
    }catch(e){ /* fallback */ }
  }
  return loadThreadsLocal();
}

async function persistThread(thread){
  if(typeof EdulawApi !== 'undefined' && await EdulawApi.checkApi()){
    return EdulawApi.createThread({
      topic: thread.topic,
      title: thread.title,
      body: thread.body,
      author: thread.author,
    });
  }
  _threads.unshift(thread);
  saveThreadsLocal(_threads);
  return thread;
}

async function persistReply(threadId, reply){
  if(typeof EdulawApi !== 'undefined' && await EdulawApi.checkApi()){
    await EdulawApi.addReply(threadId, { body: reply.body, author: reply.author });
    return loadThreads();
  }
  const t = _threads.find(x => x.id === threadId);
  if(t) t.replies.push(reply);
  saveThreadsLocal(_threads);
  return _threads;
}

function getDisplayName(){ try{ return localStorage.getItem(NAME_KEY) || ''; }catch(e){ return ''; } }
function setDisplayName(n){ try{ localStorage.setItem(NAME_KEY, n); }catch(e){} }

function initialsOf(name){
  return (name||'ผ').trim().slice(0,1).toUpperCase();
}

let _threads = [];
let _activeTopic = 'all';
let _activeThreadId = null;
let _usingApi = false;

async function initForumPage(){
  _usingApi = typeof EdulawApi !== 'undefined' && await EdulawApi.checkApi();
  _threads = await loadThreads();
  renderSide();
  renderList();
  bindNewThreadBox();

  const params = new URLSearchParams(location.search);
  const tid = params.get('thread');
  if(tid){
    openThread(tid);
    return;
  }
  openNewThreadFromParams(params);
}

function openNewThreadFromParams(params){
  const topic = params.get('topic');
  const lawTitle = params.get('lawTitle');
  if(!topic && !lawTitle) return;

  if(topic && FORUM_TOPICS.some(t => t.key === topic)){
    _activeTopic = topic;
    renderSide();
    renderList();
    const sel = document.querySelector('#newTopic');
    if(sel) sel.value = topic;
  }

  const box = document.querySelector('#newThreadBox');
  if(!box) return;
  box.style.display = 'block';
  box.classList.add('open');

  if(lawTitle){
    const titleEl = document.querySelector('#newTitle');
    if(titleEl) titleEl.value = 'ถามเกี่ยวกับ: ' + decodeURIComponent(lawTitle);
    const bodyEl = document.querySelector('#newBody');
    if(bodyEl && !bodyEl.value.trim()){
      bodyEl.placeholder = 'ระบุคำถามหรือประเด็นที่ต้องการสอบถามเกี่ยวกับกฎหมายฉบับนี้...';
    }
    titleEl?.focus();
  }
}

function renderSide(){
  const side = document.querySelector('#forumSide');
  if(!side) return;
  const counts = {all:_threads.length};
  FORUM_TOPICS.forEach(t=> counts[t.key] = _threads.filter(th=>th.topic===t.key).length);
  side.innerHTML = `
    <h4>หมวดกระทู้</h4>
    ${_usingApi ? '<p style="font-size:11px;color:var(--sage);margin:0 0 10px;">เชื่อมต่อเซิร์ฟเวอร์ — แชร์กระทู้ร่วมกันได้</p>' : ''}
    <button data-topic="all" class="${_activeTopic==='all'?'active':''}">ทั้งหมด <span class="n">${counts.all}</span></button>
    ${FORUM_TOPICS.map(t=>`<button data-topic="${t.key}" class="${_activeTopic===t.key?'active':''}">${t.label} <span class="n">${counts[t.key]}</span></button>`).join('')}
  `;
  side.querySelectorAll('button').forEach(b=>{
    b.addEventListener('click', ()=>{ _activeTopic = b.dataset.topic; showListView(); renderSide(); renderList(); });
  });
}

function showListView(){
  document.querySelector('#forumListView').style.display = '';
  document.querySelector('#forumDetailView').style.display = 'none';
  history.replaceState(null,'','forum.html');
}

function renderList(){
  const list = document.querySelector('#threadList');
  if(!list) return;
  const items = _threads
    .filter(t => _activeTopic==='all' || t.topic===_activeTopic)
    .sort((a,b)=> b.createdAt - a.createdAt);

  if(items.length===0){
    list.innerHTML = `<div class="empty-state">ยังไม่มีกระทู้ในหมวดนี้ — เริ่มตั้งกระทู้แรกได้เลย</div>`;
    return;
  }
  list.innerHTML = items.map(t=>{
    const topicLabel = FORUM_TOPICS.find(x=>x.key===t.topic)?.label || t.topic;
    return `<div class="thread-card" data-id="${t.id}">
      <div class="thread-top">
        <span class="thread-tag">${topicLabel}</span>
        <span class="thread-meta">${timeAgo(t.createdAt)}</span>
      </div>
      <h3>${escapeHtml(t.title)}</h3>
      <div class="thread-meta"><span class="author">${escapeHtml(t.author)}</span> · ${(t.replies||[]).length} ความคิดเห็น</div>
    </div>`;
  }).join('');
  list.querySelectorAll('.thread-card').forEach(c=>{
    c.addEventListener('click', ()=> openThread(c.dataset.id));
  });
}

function openThread(id){
  const t = _threads.find(x=>x.id===id);
  if(!t) return;
  _activeThreadId = id;
  document.querySelector('#forumListView').style.display = 'none';
  document.querySelector('#forumDetailView').style.display = '';
  history.replaceState(null,'','forum.html?thread='+id);

  const topicLabel = FORUM_TOPICS.find(x=>x.key===t.topic)?.label || t.topic;
  const detail = document.querySelector('#forumDetailView');
  detail.innerHTML = `
    <a href="#" class="back-link" id="backToList">${icon('arrow',16)} กลับไปหน้ารายการกระทู้</a>
    <div class="thread-detail">
      <span class="thread-tag">${topicLabel}</span>
      <h2 style="margin-top:10px;">${escapeHtml(t.title)}</h2>
      <div class="post-block">
        <div class="post-author">
          <div class="avatar">${initialsOf(t.author)}</div>
          <div><b>${escapeHtml(t.author)}</b><br><span>${timeAgo(t.createdAt)}</span></div>
        </div>
        <div class="post-body">${escapeHtml(t.body)}</div>
      </div>
      ${(t.replies||[]).map(r=>`
        <div class="post-block">
          <div class="post-author">
            <div class="avatar">${initialsOf(r.author)}</div>
            <div><b>${escapeHtml(r.author)}</b><br><span>${timeAgo(r.createdAt)}</span></div>
          </div>
          <div class="post-body">${escapeHtml(r.body)}</div>
        </div>`).join('')}
      <div class="reply-box">
        <h4 style="font-family:var(--f-mono);font-size:12.5px;text-transform:uppercase;color:var(--maroon);">ร่วมแสดงความคิดเห็น</h4>
        <input type="text" id="replyName" placeholder="ชื่อที่ใช้แสดง (เช่น ครู... / ผอ... )" value="${escapeHtml(getDisplayName())}">
        <textarea id="replyBody" placeholder="แสดงความคิดเห็นของคุณ — โปรดสุภาพและให้ข้อมูลที่เป็นประโยชน์"></textarea>
        <button class="btn btn-primary btn-sm" id="submitReply">ส่งความคิดเห็น</button>
      </div>
    </div>
  `;
  detail.querySelector('#backToList').addEventListener('click', e=>{ e.preventDefault(); showListView(); });
  detail.querySelector('#submitReply').addEventListener('click', async ()=>{
    const name = detail.querySelector('#replyName').value.trim() || 'ผู้ใช้นิรนาม';
    const body = detail.querySelector('#replyBody').value.trim();
    if(!body){ showToast('โปรดพิมพ์ข้อความก่อนส่ง','info'); return; }
    setDisplayName(name);
    const reply = { author:name, body, createdAt: Date.now() };
    const updated = await persistReply(id, reply);
    if(Array.isArray(updated)) _threads = updated;
    showToast('ส่งความคิดเห็นเรียบร้อยแล้ว');
    openThread(id);
  });
}

function bindNewThreadBox(){
  const box = document.querySelector('#newThreadBox');
  const openBtn = document.querySelector('#openNewThread');
  if(!box || !openBtn) return;
  openBtn.addEventListener('click', ()=>{
    box.classList.toggle('open');
    box.style.display = box.classList.contains('open') ? 'block' : 'none';
  });
  document.querySelector('#submitThread').addEventListener('click', async ()=>{
    const name = document.querySelector('#newName').value.trim() || 'ผู้ใช้นิรนาม';
    const topic = document.querySelector('#newTopic').value;
    const title = document.querySelector('#newTitle').value.trim();
    const body = document.querySelector('#newBody').value.trim();
    if(!title || !body){ showToast('โปรดกรอกหัวข้อและรายละเอียดให้ครบถ้วน','info'); return; }
    setDisplayName(name);
    const thread = { id:'t'+Date.now(), topic, title, author:name, body, createdAt: Date.now(), replies:[] };
    const saved = await persistThread(thread);
    if(saved && saved.id) thread.id = saved.id;
    if(!_usingApi) _threads = await loadThreads();
    else _threads = await loadThreads();
    document.querySelector('#newTitle').value='';
    document.querySelector('#newBody').value='';
    box.style.display='none'; box.classList.remove('open');
    _activeTopic = 'all';
    renderSide(); renderList();
    showToast('ตั้งกระทู้ใหม่เรียบร้อยแล้ว');
  });
}
