/* shared.js */

// ---------- THEME ----------

function getTheme() {
  return localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  const btn = document.getElementById('themeBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀' : '◐';
}

function toggleTheme() {
  applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

// ---------- LANG ----------

function getLang() {
  return localStorage.getItem('lang') ||
    (navigator.language.startsWith('ja') ? 'ja' : 'en');
}

function applyLang(lang) {
  localStorage.setItem('lang', lang);

  // data-lang 属性を持つ要素を切り替え
  document.querySelectorAll('[data-lang]').forEach(el => {
    el.classList.toggle('active', el.getAttribute('data-lang') === lang);
  });

  const btn = document.getElementById('langBtn');
  if (btn) {
    btn.textContent = lang === 'ja' ? 'EN' : 'JA';
    btn.classList.toggle('active', false);
  }

  // カスタムイベント（install.htmlのレンダリング更新用）
  document.dispatchEvent(new CustomEvent('langChanged', { detail: lang }));
}

function toggleLang() {
  applyLang(getLang() === 'ja' ? 'en' : 'ja');
}

// ---------- INIT ----------

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(getTheme());
  applyLang(getLang());
});
