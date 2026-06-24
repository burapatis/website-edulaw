/* คลังกฎหมาย — กรองและแสดงการ์ดจากข้อมูล JSON */
(function () {
  'use strict';

  const grid = document.getElementById('lawGrid');
  const catalogEl = document.getElementById('lawsCatalog');
  if (!grid || !catalogEl) return;

  let catalog;
  try {
    let raw = JSON.parse(catalogEl.textContent.trim());
    // Hugo jsonify อาจถูกห่อเป็น JSON string ซ้อนอีกชั้น
    while (typeof raw === 'string') raw = JSON.parse(raw);
    catalog = raw;
  } catch (e) {
    console.error('laws-browser: invalid catalog JSON', e);
    return;
  }

  const laws = catalog.laws || [];
  if (!laws.length) {
    console.error('laws-browser: no laws in catalog');
    return;
  }
  const lawBase = grid.dataset.lawBase || '';
  const searchInput = document.getElementById('searchInput');
  const resultCount = document.getElementById('resultCount');
  const chipRow = document.getElementById('chipRow');
  const sortSelect = document.getElementById('sortSelect');
  const params = new URLSearchParams(location.search);

  const state = {
    cat: params.get('cat') || '',
    q: params.get('q') || '',
    sort: 'default',
  };

  if (searchInput && state.q) searchInput.value = state.q;

  function lawCategories(law) {
    return law.categories && law.categories.length ? law.categories : [law.category];
  }

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function lawHref(id) {
    return lawBase.replace(/\/?$/, '/') + id + '/';
  }

  function matchesQuery(law, q) {
    if (!q) return true;
    const hay = [
      law.title,
      law.agency,
      law.summary,
      law.year,
      law.type,
      law.status,
      ...(law.points || []),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function filteredLaws() {
    let list = laws.filter((law) => {
      const cats = lawCategories(law);
      const catOk = !state.cat || cats.includes(state.cat);
      return catOk && matchesQuery(law, state.q);
    });

    if (state.sort === 'az') {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'th'));
    } else if (state.sort === 'year') {
      list = [...list].sort((a, b) => b.year.localeCompare(a.year, 'th'));
    }
    return list;
  }

  function renderCard(law) {
    const draftClass = law.status !== 'บังคับใช้' ? ' is-draft' : '';
    const yearLabel = (law.year || '').split('·')[0].trim();
    const primaryCat = law.category || lawCategories(law)[0] || '';

    return `<a class="law-card law-card--data law-card--${escapeHtml(primaryCat)}" id="${escapeHtml(law.id)}" href="${escapeHtml(lawHref(law.id))}">
      <div class="law-card-top">
        <span class="law-tag${draftClass}">${escapeHtml(law.type)}</span>
        <span class="law-year">${escapeHtml(yearLabel)}</span>
      </div>
      <h3>${escapeHtml(law.title)}</h3>
      <p class="law-summary">${escapeHtml(law.summary)}</p>
      <div class="law-card-foot">
        <span class="agency">${escapeHtml(law.agency)}</span>
        <span class="read-more">อ่านสาระสำคัญ →</span>
      </div>
    </a>`;
  }

  function render() {
    const list = filteredLaws();
    if (resultCount) {
      resultCount.innerHTML = `พบ <b>${list.length}</b> ฉบับ`;
    }

    if (list.length === 0) {
      grid.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1;">' +
        '<p>ไม่พบกฎหมายในหมวดนี้ ลองเลือกหมวดอื่นหรือค้นหาด้วยคำสำคัญ</p></div>';
      return;
    }

    grid.innerHTML = list.map(renderCard).join('');

    const hash = location.hash.replace('#', '');
    if (hash) {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function syncChips() {
    if (!chipRow) return;
    chipRow.querySelectorAll('.chip').forEach((chip) => {
      const key = chip.dataset.cat || '';
      chip.classList.toggle('active', key === state.cat);
    });
  }

  const lawParam = params.get('law');
  if (lawParam && lawBase) {
    location.replace(lawHref(lawParam));
    return;
  }

  syncChips();
  render();

  if (chipRow) {
    chipRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      state.cat = btn.dataset.cat || '';
      syncChips();
      render();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      state.q = searchInput.value.trim();
      render();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      render();
    });
  }
})();
