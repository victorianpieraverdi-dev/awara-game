/**
 * matrixSwitcher.js -- переключатель активной матрицы восприятия
 *
 * 3 основных матрицы (card economy):
 *   vedic        -- Ведическая
 *   slavic       -- Славянская
 *   kabbalistic  -- Каббалистическая
 *
 * localStorage key: awara_active_matrix (slug)
 */

var STORAGE_KEY = 'awara_active_matrix';

var THEMES = {
  vedic: {
    slug: 'vedic',
    label: 'ВЕДИЧЕСКАЯ',
    icon: '\u0950',
    color: '#ff8844',
    accent: 'rgba(255,136,68,0.85)',
    bg: 'rgba(255,136,68,0.08)',
    border: 'rgba(255,136,68,0.25)',
    desc: 'Спанда, мандалы, янтры'
  },
  slavic: {
    slug: 'slavic',
    label: 'СЛАВЯНСКАЯ',
    icon: '\uD83C\uDF1E',
    color: '#ff6450',
    accent: 'rgba(255,100,80,0.85)',
    bg: 'rgba(255,100,80,0.08)',
    border: 'rgba(255,100,80,0.25)',
    desc: 'Родовая память, Явь, Правь'
  },
  kabbalistic: {
    slug: 'kabbalistic',
    label: 'КАББАЛИСТИЧЕСКАЯ',
    icon: '\u2721',
    color: '#8888ff',
    accent: 'rgba(140,140,255,0.85)',
    bg: 'rgba(140,140,255,0.08)',
    border: 'rgba(140,140,255,0.25)',
    desc: 'Древо Жизни, Сефирот'
  }
};

var SLUGS = ['vedic', 'slavic', 'kabbalistic'];

export function getActiveMatrix() {
  var slug = localStorage.getItem(STORAGE_KEY) || 'vedic';
  if (SLUGS.indexOf(slug) === -1) slug = 'vedic';
  return slug;
}

export function setActiveMatrix(slug) {
  if (SLUGS.indexOf(slug) === -1) return;
  localStorage.setItem(STORAGE_KEY, slug);
}

export function getTheme(slug) {
  return THEMES[slug] || THEMES.vedic;
}

export function getAllThemes() {
  return SLUGS.map(function(s) { return THEMES[s]; });
}
