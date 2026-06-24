/* =========================================================
   laws-store.js — โหลด/จัดการข้อมูลกฎหมาย
   ลำดับ: API → localStorage override → data/laws.json → bundle
   ========================================================= */

const LAWS_JSON_PATH = 'data/laws.json';
const LAWS_STORAGE_KEY = 'edulaw_laws_data';

let _lawsData = null;
let _loadPromise = null;
let _usingApi = false;

function normalizeLaw(law) {
  return {
    ...law,
    points: law.points || [],
    links: law.links || [],
    tags: law.tags || [],
    relatedLaws: law.relatedLaws || [],
  };
}

function applyGlobals(data) {
  window.LAW_CATEGORIES = data.categories;
  window.LAWS = data.laws.map(normalizeLaw);
}

function getLawById(id) {
  return (window.LAWS || []).find(l => l.id === id) || null;
}
window.getLawById = getLawById;

async function fetchBaseLaws() {
  const res = await fetch(LAWS_JSON_PATH, { cache: 'no-cache' });
  if (!res.ok) throw new Error('โหลด data/laws.json ไม่สำเร็จ');
  return res.json();
}

function readStorageOverride() {
  try {
    const raw = localStorage.getItem(LAWS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function normalizePayload(data) {
  return {
    version: data.version || 2,
    updatedAt: data.updatedAt || '',
    categories: data.categories || [],
    laws: (data.laws || []).map(normalizeLaw),
  };
}

async function loadLaws({ force = false } = {}) {
  if (_lawsData && !force) return _lawsData;
  if (_loadPromise && !force) return _loadPromise;

  _loadPromise = (async () => {
    let data = null;
    _usingApi = false;

    if (typeof EdulawApi !== 'undefined' && (await EdulawApi.checkApi())) {
      try {
        data = await EdulawApi.getLaws();
        _usingApi = true;
      } catch {
        /* fallback */
      }
    }

    if (!data) {
      data = readStorageOverride();
      if (!data) {
        try {
          data = await fetchBaseLaws();
        } catch {
          if (typeof LAWS_BUNDLE !== 'undefined') data = LAWS_BUNDLE;
          else throw new Error('โหลดข้อมูลกฎหมายไม่สำเร็จ');
        }
      }
    }

    data = normalizePayload(data);
    _lawsData = data;
    applyGlobals(data);
    return data;
  })();

  try {
    return await _loadPromise;
  } catch (e) {
    _loadPromise = null;
    throw e;
  }
}

function whenLawsReady() {
  return loadLaws();
}

async function saveLawsData(data) {
  const payload = normalizePayload({
    ...data,
    updatedAt: new Date().toISOString().slice(0, 10),
  });

  if (typeof EdulawApi !== 'undefined' && (await EdulawApi.checkApi()) && EdulawApi.getToken()) {
    await EdulawApi.saveLaws(payload);
    _usingApi = true;
  } else if (typeof EdulawApi !== 'undefined' && (await EdulawApi.checkApi())) {
    throw new Error('ต้องเข้าสู่ระบบ admin ก่อนบันทึกลงเซิร์ฟเวอร์');
  } else {
    localStorage.setItem(LAWS_STORAGE_KEY, JSON.stringify(payload));
  }

  _lawsData = payload;
  applyGlobals(payload);
  _loadPromise = Promise.resolve(payload);
  return payload;
}

async function saveLaw(law) {
  const payload = normalizePayload(_lawsData || { categories: LAW_CATEGORIES, laws: LAWS });
  const idx = payload.laws.findIndex(l => l.id === law.id);

  if (typeof EdulawApi !== 'undefined' && (await EdulawApi.checkApi()) && EdulawApi.getToken()) {
    if (idx >= 0) await EdulawApi.updateLaw(law.id, law);
    else await EdulawApi.createLaw(law);
    await loadLaws({ force: true });
    return law;
  }

  if (idx >= 0) payload.laws[idx] = normalizeLaw(law);
  else payload.laws.unshift(normalizeLaw(law));
  return saveLawsData(payload);
}

async function deleteLawById(id) {
  if (typeof EdulawApi !== 'undefined' && (await EdulawApi.checkApi()) && EdulawApi.getToken()) {
    await EdulawApi.deleteLaw(id);
    await loadLaws({ force: true });
    return;
  }
  const payload = normalizePayload(_lawsData || { categories: LAW_CATEGORIES, laws: LAWS });
  payload.laws = payload.laws.filter(l => l.id !== id);
  return saveLawsData(payload);
}

async function resetLawsToDefault() {
  localStorage.removeItem(LAWS_STORAGE_KEY);
  _lawsData = null;
  _loadPromise = null;
  return loadLaws({ force: true });
}

function exportLawsJson() {
  const data = _lawsData || {
    categories: window.LAW_CATEGORIES,
    laws: window.LAWS,
    version: 2,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `laws-export-${data.updatedAt || 'data'}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function slugifyId(str) {
  return (
    (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9ก-๙]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'law-' + Date.now()
  );
}

function isUsingApi() {
  return _usingApi;
}

window.LawsStore = {
  loadLaws,
  whenLawsReady,
  saveLawsData,
  saveLaw,
  deleteLawById,
  resetLawsToDefault,
  exportLawsJson,
  slugifyId,
  getData: () => _lawsData,
  isUsingApi,
  STORAGE_KEY: LAWS_STORAGE_KEY,
};
