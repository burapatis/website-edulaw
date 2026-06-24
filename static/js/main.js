/* Hugo site — shared UI helpers */
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('mainNav');
  if (!toggle || !nav) return;

  const setNavOpen = (open) => {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
    document.body.classList.toggle('nav-open', open);
  };

  toggle.addEventListener('click', () => {
    setNavOpen(!nav.classList.contains('open'));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      setNavOpen(false);
      toggle.focus();
    }
  });
});
