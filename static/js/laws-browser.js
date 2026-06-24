/* คลังกฎหมาย — กรองและแสดงการ์ดจากข้อมูล JSON */
(function () {
  'use strict';

  const grid = document.getElementById('lawGrid');
  const catalogEl = document.getElementById('lawsCatalog');
  if (!grid || !catalogEl) return;

  const DEFAULT_AUDIENCES = [
    'ครูและบุคลากรทางการศึกษา',
    'นักศึกษา',
    'ผู้สนใจทั่วไป',
  ];

  let catalog;
  let categoryLabels = {};
  try {
    let raw = JSON.parse(catalogEl.textContent.trim());
    while (typeof raw === 'string') raw = JSON.parse(raw);
    catalog = raw;
  } catch (e) {
    console.error('laws-browser: invalid catalog JSON', e);
    return;
  }

  const labelsEl = document.getElementById('lawsCategoryLabels');
  if (labelsEl) {
    try {
      let cats = JSON.parse(labelsEl.textContent.trim());
      while (typeof cats === 'string') cats = JSON.parse(cats);
      (cats || []).forEach((c) => {
        categoryLabels[c.key] = c.label;
      });
    } catch (e) {
      /* non-critical */
    }
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
  const filterLawtype = document.getElementById('filterLawtype');
  const filterCategory = document.getElementById('filterCategory');
  const filterAgency = document.getElementById('filterAgency');
  const filterAudience = document.getElementById('filterAudience');
  const filterReset = document.getElementById('filterReset');
  const params = new URLSearchParams(location.search);

  const state = {
    cat: params.get('cat') || '',
    q: params.get('q') || '',
    sort: 'default',
    lawtype: '',
    agency: '',
    audience: '',
  };

  if (searchInput && state.q) searchInput.value = state.q;
  if (filterCategory && state.cat) filterCategory.value = state.cat;

  function lawCategories(law) {
    return law.categories && law.categories.length ? law.categories : [law.category];
  }

  function lawAudiences(law) {
    return law.audiences && law.audiences.length ? law.audiences : DEFAULT_AUDIENCES;
  }

  function lawType(law) {
    return law.law_type || law.type || '';
  }

  function shortTitle(law) {
    if (law.short_title) return law.short_title;
    let t = law.title || '';
    if (t.includes(' (')) t = t.split(' (')[0];
    if (t.includes(' และที่แก้ไข')) t = t.split(' และที่แก้ไข')[0];
    return t;
  }

  function hasOfficialSource(law) {
    if (law.source_url) return true;
    const links = law.links || [];
    return links.some((l) =>
      /ราชกิจจานุเบกษา|กฤษฎีกา/.test(l.label || '')
    );
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

  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, 'th')
    );
  }

  function populateFilterOptions() {
    const types = uniqueSorted(laws.map(lawType));
    const agencies = uniqueSorted(laws.map((l) => l.agency));
    const audiences = uniqueSorted(laws.flatMap(lawAudiences));

    if (filterLawtype) {
      types.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        filterLawtype.appendChild(opt);
      });
    }
    if (filterAgency) {
      agencies.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        filterAgency.appendChild(opt);
      });
    }
    if (filterAudience) {
      audiences.forEach((v) => {
        const opt = document.createElement('option');
        opt.value = v;
        opt.textContent = v;
        filterAudience.appendChild(opt);
      });
    }
  }

  function matchesQuery(law, q) {
    if (!q) return true;
    const hay = [
      law.title,
      shortTitle(law),
      law.agency,
      law.summary,
      law.year,
      lawType(law),
      law.status,
      ...(law.points || []),
      ...(law.tags || []),
      ...lawAudiences(law),
    ]
      .join(' ')
      .toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function matchesFilters(law) {
    const cats = lawCategories(law);
    const catOk =
      !state.cat ||
      cats.includes(state.cat) ||
      (filterCategory && filterCategory.value === state.cat);
    const typeOk = !state.lawtype || lawType(law) === state.lawtype;
    const agencyOk = !state.agency || law.agency === state.agency;
    const audienceOk =
      !state.audience || lawAudiences(law).includes(state.audience);
    return catOk && typeOk && agencyOk && audienceOk;
  }

  function filteredLaws() {
    let list = laws.filter(
      (law) => matchesFilters(law) && matchesQuery(law, state.q)
    );

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
    const catLabel = categoryLabels[primaryCat] || primaryCat;
    const type = lawType(law);
    const st = shortTitle(law);
    const audiences = lawAudiences(law);
    const tags = law.tags || [];
    const official = hasOfficialSource(law);

    const dataAttrs = [
      `data-law-type="${escapeHtml(type)}"`,
      `data-category="${escapeHtml(lawCategories(law).join(','))}"`,
      `data-agency="${escapeHtml(law.agency || '')}"`,
      `data-audience="${escapeHtml(audiences.join(','))}"`,
    ].join(' ');

    const audiencePills = audiences.length
      ? `<ul class="law-card-pills law-card-pills--audience">${audiences
          .map((a) => `<li>${escapeHtml(a)}</li>`)
          .join('')}</ul>`
      : '';

    const tagPills = tags.length
      ? `<ul class="law-card-pills law-card-pills--tags">${tags
          .map((t) => `<li>${escapeHtml(t)}</li>`)
          .join('')}</ul>`
      : '';

    const shortTitleHtml =
      st && st !== law.title
        ? `<p class="law-short-title">${escapeHtml(st)}</p>`
        : '';

    const officialBadge = official
      ? '<span class="law-source-badge" title="มีลิงก์แหล่งข้อมูลทางการ">แหล่งทางการ</span>'
      : '';

    return `<a class="law-card law-card--rich law-card--data law-card--${escapeHtml(primaryCat)}" id="${escapeHtml(law.id)}" href="${escapeHtml(lawHref(law.id))}" ${dataAttrs}>
      <div class="law-card-top">
        <span class="law-tag${draftClass}">${escapeHtml(type)}</span>
        <span class="law-year">${escapeHtml(yearLabel)}</span>
        ${officialBadge}
      </div>
      <h3>${escapeHtml(law.title)}</h3>
      ${shortTitleHtml}
      <p class="law-summary">${escapeHtml(law.summary)}</p>
      <div class="law-card-meta">
        ${catLabel ? `<span class="law-card-meta__item">${escapeHtml(catLabel)}</span>` : ''}
        ${law.agency ? `<span class="law-card-meta__item">${escapeHtml(law.agency)}</span>` : ''}
        ${law.status ? `<span class="law-card-meta__item law-card-meta__item--status">${escapeHtml(law.status)}</span>` : ''}
      </div>
      ${audiencePills}
      ${tagPills}
      <div class="law-card-foot">
        <span class="read-more">อ่านสาระสำคัญ →</span>
      </div>
    </a>`;
  }

  function hasActiveFilters() {
    return !!(state.cat || state.lawtype || state.agency || state.audience || state.q);
  }

  function render() {
    const list = filteredLaws();
    if (resultCount) {
      resultCount.innerHTML = `พบ <b>${list.length}</b> ฉบับ`;
    }

    if (list.length === 0) {
      const msg = hasActiveFilters()
        ? 'ไม่พบกฎหมายที่ตรงกับตัวกรองที่เลือก'
        : 'ไม่พบกฎหมายในหมวดนี้ ลองเลือกหมวดอื่นหรือค้นหาด้วยคำสำคัญ';
      grid.innerHTML =
        '<div class="empty-state empty-state--laws" style="grid-column:1/-1;">' +
        '<p class="empty-state__title">' + msg + '</p>' +
        '<p class="empty-state__hint">ลองล้างตัวกรอง เปลี่ยนหมวดหมู่ หรือค้นหาด้วยคำอื่น</p>' +
        '<button type="button" class="btn btn-outline empty-state__reset" data-empty-reset>ล้างตัวกรอง</button>' +
        '</div>';
      const resetBtn = grid.querySelector('[data-empty-reset]');
      if (resetBtn) resetBtn.addEventListener('click', resetFilters);
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

  function syncCategoryFilter() {
    if (filterCategory) filterCategory.value = state.cat;
  }

  function resetFilters() {
    state.cat = '';
    state.lawtype = '';
    state.agency = '';
    state.audience = '';
    state.q = '';
    if (searchInput) searchInput.value = '';
    if (filterLawtype) filterLawtype.value = '';
    if (filterCategory) filterCategory.value = '';
    if (filterAgency) filterAgency.value = '';
    if (filterAudience) filterAudience.value = '';
    syncChips();
    render();
  }

  const lawParam = params.get('law');
  if (lawParam && lawBase) {
    location.replace(lawHref(lawParam));
    return;
  }

  populateFilterOptions();
  syncChips();
  render();

  if (chipRow) {
    chipRow.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      state.cat = btn.dataset.cat || '';
      syncCategoryFilter();
      syncChips();
      render();
    });
  }

  if (filterCategory) {
    filterCategory.addEventListener('change', () => {
      state.cat = filterCategory.value;
      syncChips();
      render();
    });
  }

  if (filterLawtype) {
    filterLawtype.addEventListener('change', () => {
      state.lawtype = filterLawtype.value;
      render();
    });
  }

  if (filterAgency) {
    filterAgency.addEventListener('change', () => {
      state.agency = filterAgency.value;
      render();
    });
  }

  if (filterAudience) {
    filterAudience.addEventListener('change', () => {
      state.audience = filterAudience.value;
      render();
    });
  }

  if (filterReset) {
    filterReset.addEventListener('click', resetFilters);
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
