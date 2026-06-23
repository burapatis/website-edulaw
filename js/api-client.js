/* =========================================================
   api-client.js — เชื่อมต่อ Backend API
   ========================================================= */

const TOKEN_KEY = 'edulaw_admin_token';

let _apiAvailable = null;

async function checkApi() {
  if (_apiAvailable !== null) return _apiAvailable;
  try {
    const res = await fetch('/api/health', { cache: 'no-store' });
    _apiAvailable = res.ok;
  } catch {
    _apiAvailable = false;
  }
  return _apiAvailable;
}

function getToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || '';
  } catch {
    return '';
  }
}

function setToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token);
    else sessionStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

async function apiFetch(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = 'Bearer ' + token;

  const res = await fetch('/api' + path, { ...options, headers });
  let data = {};
  try {
    data = await res.json();
  } catch {
    /* non-json */
  }
  if (!res.ok) throw new Error(data.error || res.statusText || 'API error');
  return data;
}

window.EdulawApi = {
  checkApi,
  getToken,
  setToken,
  isAvailable: () => _apiAvailable === true,

  getLaws: () => apiFetch('/laws'),
  saveLaws: data => apiFetch('/laws', { method: 'PUT', body: JSON.stringify(data) }),
  createLaw: law => apiFetch('/laws', { method: 'POST', body: JSON.stringify(law) }),
  updateLaw: (id, law) => apiFetch('/laws/' + encodeURIComponent(id), { method: 'PUT', body: JSON.stringify(law) }),
  deleteLaw: id => apiFetch('/laws/' + encodeURIComponent(id), { method: 'DELETE' }),

  login: pin => apiFetch('/admin/login', { method: 'POST', body: JSON.stringify({ pin }) }),
  logout: () => apiFetch('/admin/logout', { method: 'POST' }).catch(() => {}),
  checkSession: async () => {
    try {
      const d = await apiFetch('/admin/session');
      return !!d.authenticated;
    } catch {
      return false;
    }
  },

  getThreads: () => apiFetch('/forum/threads').then(d => d.threads || []),
  createThread: payload =>
    apiFetch('/forum/threads', { method: 'POST', body: JSON.stringify(payload) }),
  addReply: (threadId, payload) =>
    apiFetch('/forum/threads/' + encodeURIComponent(threadId) + '/replies', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
