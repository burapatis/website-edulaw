/* =========================================================
   main.js — ฟังก์ชันร่วมของทุกหน้า: เมนู / ไอคอน / ตราประทับ / toast
   ========================================================= */

/* ---------- ไอคอนเส้น (line icons) แบบ inline SVG ---------- */
const ICONS = {
  scale:'<path d="M12 3v18M5 7h14M5 7 2 14a3 3 0 0 0 6 0L5 7Zm14 0-3 7a3 3 0 0 0 6 0l-3-7ZM8 21h8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  book:'<path d="M4 5.5C4 4.7 4.7 4 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5v-13ZM20 5.5c0-.8-.7-1.5-1.5-1.5H13v16h5.5c.8 0 1.5-.7 1.5-1.5v-13Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  building:'<path d="M4 21V6l8-3 8 3v15M4 21h16M9 21v-4h6v4M9 10h.01M9 14h.01M15 10h.01M15 14h.01" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  users:'<path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM2 20c0-3 2.5-5 6-5s6 2 6 5M12 20c0-2.5 2-4.5 5-4.5s5 2 5 4.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  cap:'<path d="M12 4 2 9l10 5 8.5-4.25V15M2 9v5.5M22 9 12 4M6 12.2V17c0 1.5 3 3 6 3s6-1.5 6-3v-4.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  school:'<path d="M3 21h18M5 21V10l7-5 7 5v11M9 21v-6h6v6M12 5v0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  heart:'<path d="M12 20.5s-7.5-4.6-9.8-9C.6 7.8 2.4 4 6 4c2 0 3.4 1.1 4 2.2C10.6 5.1 12 4 14 4c3.6 0 5.4 3.8 3.8 7.5-2.3 4.4-9.8 9-9.8 9Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  stamp:'<circle cx="12" cy="9" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 9.5 11 11.5 15.5 7M8 21l1.5-5h5L16 21M12 15v1" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
  flag:'<path d="M5 21V4M5 4h12l-3 4 3 4H5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  search:'<circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M21 21l-4.3-4.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  arrow:'<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
  close:'<path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  check:'<path d="M5 12.5 9.5 17 19 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
  chat:'<path d="M21 12c0 4.4-4 8-9 8-1.1 0-2.2-.2-3.1-.5L3 21l1.7-4.3A7.9 7.9 0 0 1 3 12c0-4.4 4-8 9-8s9 3.6 9 8Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  plus:'<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  doc:'<path d="M7 3h7l3 3v15H7V3Z M14 3v3h3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9.5 11h5M9.5 14h5M9.5 17h3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
  info:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 8h.01M11 11h1v6h1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>',
};
function icon(name, size=20){
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name]||''}</svg>`;
}

/* ---------- ตราประทับลายเซ็นเว็บไซต์ ---------- */
const SEAL_SVG = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="96" fill="none" stroke="var(--gold)" stroke-width="3"/>
  <circle cx="100" cy="100" r="84" fill="none" stroke="var(--gold)" stroke-width="1.5" stroke-dasharray="2 5"/>
  <circle cx="100" cy="100" r="70" fill="var(--navy)"/>
  <path d="M100 52v96M64 70h72M64 70 50 96a14 14 0 0 0 28 0L64 70Zm72 0-14 26a14 14 0 0 0 28 0l-14-26Z"
        fill="none" stroke="var(--gold-light)" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M76 132h48" stroke="var(--gold-light)" stroke-width="3.4" stroke-linecap="round"/>
  <text x="100" y="28" text-anchor="middle" font-family="'Noto Serif Thai', serif" font-size="13" fill="var(--navy)" font-weight="700">กฎหมายการศึกษา</text>
  <text x="100" y="182" text-anchor="middle" font-family="'IBM Plex Mono', monospace" font-size="9" letter-spacing="2" fill="var(--navy)">EDUCATION LAW HUB</text>
</svg>`;

function injectSeals(){
  document.querySelectorAll('[data-seal]').forEach(el=>{ el.innerHTML = SEAL_SVG; });
}

/* ---------- เติมไอคอนให้ <span data-icon="name"></span> ทุกตัวในหน้า ---------- */
function injectIcons(){
  document.querySelectorAll('[data-icon]').forEach(el=>{
    const name = el.getAttribute('data-icon');
    const size = el.getAttribute('data-icon-size') || 22;
    el.innerHTML = icon(name, size);
  });
}

/* ---------- toast แจ้งเตือนเล็ก ---------- */
let toastTimer;
function showToast(msg, icoName='check'){
  let t = document.querySelector('.toast');
  if(!t){
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = `${icon(icoName,18)}<span>${msg}</span>`;
  requestAnimationFrame(()=> t.classList.add('show'));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> t.classList.remove('show'), 2600);
}

/* ---------- escape helper ---------- */
function escapeHtml(str=''){
  return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}
function timeAgo(ts){
  const s = Math.floor((Date.now()-ts)/1000);
  if(s<60) return 'เมื่อสักครู่';
  if(s<3600) return Math.floor(s/60)+' นาทีที่แล้ว';
  if(s<86400) return Math.floor(s/3600)+' ชั่วโมงที่แล้ว';
  return Math.floor(s/86400)+' วันที่แล้ว';
}

/* ---------- เมนูมือถือ + ลิงก์ที่ใช้งานอยู่ + ปีในฟุตเตอร์ ---------- */
function initHeader(){
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=>{
      nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> nav.classList.remove('open')));
  }
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.main-nav a').forEach(a=>{
    const href = a.getAttribute('href').split('#')[0];
    if(href === path) a.classList.add('active');
  });
  document.querySelectorAll('[data-year]').forEach(el=> el.textContent = new Date().getFullYear()+543);

  const miniForm = document.querySelector('.search-mini');
  if(miniForm){
    const input = miniForm.querySelector('input');
    const btn = miniForm.querySelector('button');
    const go = ()=>{
      const v = (input.value||'').trim();
      location.href = 'library.html' + (v ? ('?q='+encodeURIComponent(v)) : '');
    };
    btn.addEventListener('click', go);
    input.addEventListener('keydown', e=>{ if(e.key==='Enter') go(); });
  }
}

/* ---------- การ์ดหมวดหมู่ (ใช้ในหน้าแรกและคลังกฎหมาย) ---------- */
function countByCategory(catKey){
  return (window.LAWS || []).filter(l => l.category === catKey).length;
}
function renderCategoryGrid(targetSelector, {linkTpl} = {}){
  const el = document.querySelector(targetSelector);
  if(!el || !window.LAW_CATEGORIES) return;
  el.innerHTML = LAW_CATEGORIES.map(c => {
    const href = linkTpl ? linkTpl(c.key) : `library.html?cat=${c.key}`;
    return `<a class="cat-card" href="${href}">
      <span class="cat-icon">${icon(c.icon,22)}</span>
      <h3>${c.label}</h3>
      <p>${c.desc}</p>
      <span class="cat-count">${countByCategory(c.key)} ฉบับ</span>
    </a>`;
  }).join('');
}

function updateLawStats(){
  const statLaws = document.querySelector('#statLaws');
  const statCats = document.querySelector('#statCats');
  if(statLaws && window.LAWS) statLaws.textContent = LAWS.length;
  if(statCats && window.LAW_CATEGORIES) statCats.textContent = LAW_CATEGORIES.length;
}

document.addEventListener('DOMContentLoaded', ()=>{
  injectSeals();
  injectIcons();
  initHeader();
});
