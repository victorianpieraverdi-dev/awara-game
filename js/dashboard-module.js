// =============================================
// AWARA — Dashboard Module
// ES6 module — логика Дашборда
// Светкоин-банк, ранги, сферы, лидерборд, эволюция
// =============================================

import { STAGES, CANON, COLORS } from './core-module.js';
import { loadState } from './state-module.js';
import { formatLight, showToast } from './ui-module.js';
import { loadAgents, loadMatrices, loadAgentMatrixMap } from './canon-module.js';

// === Ранги Державы РА (расширенные, с иконками и описаниями) ===
const RANKS = [
  { id: 'initiate', name: 'ИНИЦИАТ',           min: 0,     icon: '~', col: '#88cc88', desc: 'Пробуждённая Искра · Начало Пути' },
  { id: 'warrior',  name: 'ВОИН СВЕТА',        min: 3000,  icon: '+', col: '#4488ff', desc: 'Воля укреплена · Сферы раскрыты' },
  { id: 'sage',     name: 'МУДРЕЦ',            min: 7000,  icon: '*', col: '#cc88ff', desc: 'Знание как Служение · Тапас' },
  { id: 'king',     name: 'ЦАРЬ',              min: 10000, icon: '#', col: '#ffd700', desc: 'Держава РА · Правитель Вселенной' },
  { id: 'buddha',   name: 'БУДДА',             min: 25000, icon: 'o', col: '#ffffff', desc: 'Освобождение · Нирвана · Свет' },
  { id: 'logos',    name: 'ПЛАНЕТАРНЫЙ ЛОГОС', min: 50000, icon: '@', col: '#00faff', desc: 'Единение с Планетой · Служение Всему' }
];

// === Демо-правители Державы РА (синхронизированы с js/core.js DERZHAVA_RULERS) ===
const RULERS = [
  { name: 'Кришна',  icon: '*', light: 88888, desc: 'Аватар Вишну · Держатель Гиты' },
  { name: 'Ашока',   icon: 'o', light: 31000, desc: 'Царь Дхармы · Объединитель' },
  { name: 'Соломон', icon: '#', light: 15000, desc: 'Царь Мира · Строитель Храма' },
  { name: 'Арджуна', icon: '+', light: 12400, desc: 'Воин Дхармы · Ученик Кришны' },
  { name: 'Акбар',   icon: '~', light: 9200,  desc: 'Владыка Справедливости · Дин-и-Илахи' }
];

// === Шкала эволюции (vision.md §2) ===
const EVO = [
  { n: 1, name: 'ИНИЦИАЦИЯ',     desc: 'Воин · Жрец · Маг · Король',           mult: 'x10^-10', threshold: 0 },
  { n: 2, name: 'ВОПЛОЩЕНИЕ',    desc: 'Земля · Вастушастра · 9 зон',          mult: 'x10^-6',  threshold: 1500 },
  { n: 3, name: 'ЗЕМЛЯ',         desc: 'Натальная карта · Колода 63 · Тигель', mult: 'x10^-4',  threshold: 3000 },
  { n: 4, name: 'КОСМОС',        desc: 'Карта мира · Эфир · Многомерность',    mult: 'x1',      threshold: 10000 },
  { n: 5, name: 'МНОГОМЕРНОСТЬ', desc: 'Параллельные локации · 14 локов',      mult: 'x10^2',   threshold: 25000 },
  { n: 6, name: 'АТМАН-СВЕТ',    desc: 'Растворение в Источнике · Лайя',       mult: 'x10^4+',  threshold: 50000 }
];

// === Личные сферы (4 — синхронизированы с PERSONAL_SPHERES в index.html) ===
const PSPHERES = [
  { id: 'psph-space', n: 'СФЕРА I',   icon: '[*]', col: '#4488ff', label: 'Пространство' },
  { id: 'psph-time',  n: 'СФЕРА II',  icon: '[*]', col: '#ffaa44', label: 'Время' },
  { id: 'psph-soul',  n: 'СФЕРА III', icon: '[*]', col: '#cc66ff', label: 'Душа' },
  { id: 'psph-karma', n: 'СФЕРА IV',  icon: '[*]', col: '#44cc88', label: 'Карма' }
];

// === Состояние модуля ===
let dashState = {
  initialized: false,
  state: null,
  agents: null,
  matrices: null,
  agentMatrixMap: null,
  activeMatrix: 'vedic',
  activeAgent: 'svet_ra'
};

// === Утилиты ===

// Перевод HEX в RGB-строку
function hexToRgb(hex) {
  hex = (hex || '').replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(function(c) { return c + c; }).join('');
  const r = parseInt(hex.substr(0, 2), 16) || 200;
  const g = parseInt(hex.substr(2, 2), 16) || 168;
  const b = parseInt(hex.substr(4, 2), 16) || 76;
  return r + ',' + g + ',' + b;
}

// Экранирование HTML
function escapeHtml(s) {
  return String(s || '').replace(/[&<>"']/g, function(c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
  });
}

// Форматирование Светкоина (10^-10)
function fmtLux(raw) {
  const n = (raw || 0) / 1e10;
  return n.toFixed(10);
}

// Форматирование числа с разделителями
function fmtRaw(raw) {
  return (raw || 0).toLocaleString('ru-RU');
}

// === Ранги ===

// Текущий ранг по количеству света
export function rankOf(light) {
  let r = RANKS[0];
  for (let i = 0; i < RANKS.length; i++) {
    if (light >= RANKS[i].min) r = RANKS[i];
  }
  return r;
}

// Следующий ранг
export function nextRank(light) {
  for (let i = 0; i < RANKS.length; i++) {
    if (RANKS[i].min > light) return RANKS[i];
  }
  return null;
}

// Текущий уровень эволюции по количеству света
export function evoLevelOf(light) {
  let idx = 0;
  for (let i = 0; i < EVO.length; i++) {
    if (light >= EVO[i].threshold) idx = i;
  }
  return EVO[idx];
}

// === Загрузка локальных данных ===

// Активная матрица из localStorage
function loadActiveMatrix() {
  return localStorage.getItem('awara_active_matrix') || 'vedic';
}

// Активный агент из localStorage
function loadActiveAgent() {
  return localStorage.getItem('awara_active_agent') || 'svet_ra';
}

// Кастомные имена сфер
function loadSphereNames() {
  try {
    return JSON.parse(localStorage.getItem('awara_sphere_names') || '{}');
  } catch (e) {
    return {};
  }
}

// =============================================
// РЕНДЕРИНГ
// =============================================

// === Hero: личный баланс Светкоина ===
export function renderHero(state) {
  const light = (state && state.totalLight) || 0;
  const el = document.getElementById('hero-amount');
  if (el) el.textContent = fmtLux(light);

  const r = rankOf(light);
  const nr = nextRank(light);

  const stageIcon = document.getElementById('stage-icon');
  const stageName = document.getElementById('stage-name');
  const stageEl = document.querySelector('.hero-stage');
  const rankBar = document.getElementById('rank-bar');
  const heroProgress = document.getElementById('hero-progress');

  if (stageIcon) stageIcon.textContent = r.icon;
  if (stageName) {
    stageName.textContent = r.name;
    stageName.style.color = r.col;
  }
  if (stageEl) {
    stageEl.style.borderColor = r.col + '55';
    stageEl.style.background = 'rgba(' + hexToRgb(r.col) + ',0.10)';
  }

  if (nr) {
    const span = nr.min - r.min;
    const pos = light - r.min;
    const pct = Math.max(0, Math.min(100, (pos / span) * 100));
    if (rankBar) rankBar.style.width = pct.toFixed(1) + '%';
    if (heroProgress) {
      heroProgress.textContent =
        'до ' + nr.name + ': ' + fmtRaw(nr.min - light) + ' св. (' + Math.round(100 - pct) + '% осталось)';
    }
  } else {
    if (rankBar) rankBar.style.width = '100%';
    if (heroProgress) heroProgress.textContent = 'Высший ранг достигнут';
  }
}

// === Личный вклад: статистика ===
export function renderStats(state) {
  const light = (state && state.totalLight) || 0;
  const journey = (state && state.journey) || [];
  const sphereData = (state && state.sphereData) || {};
  let maxLvl = 1;
  Object.keys(sphereData).forEach(function(k) {
    const lvl = sphereData[k] && sphereData[k].lvl;
    if (lvl && lvl > maxLvl) maxLvl = lvl;
  });

  const elLight = document.getElementById('stat-light');
  const elJourney = document.getElementById('stat-journey');
  const elMaxLvl = document.getElementById('stat-maxlvl');

  if (elLight) elLight.textContent = fmtRaw(light);
  if (elJourney) elJourney.textContent = journey.length;
  if (elMaxLvl) elMaxLvl.textContent = maxLvl;

  const slug = loadActiveMatrix();
  loadMatrices().then(function(arr) {
    if (!arr) return;
    const m = arr.find(function(x) { return x.slug === slug; });
    const label = m ? m.name : slug;
    const elMatrix = document.getElementById('stat-matrix');
    if (elMatrix) elMatrix.textContent = label;
  }).catch(function() {
    const elMatrix = document.getElementById('stat-matrix');
    if (elMatrix) elMatrix.textContent = slug;
  });
}

// === Вклад по сферам ===
export function renderSpheres(state) {
  const sphereData = (state && state.sphereData) || {};
  const names = loadSphereNames();
  const host = document.getElementById('spheres-list');
  if (!host) return;
  host.innerHTML = '';
  let any = false;

  PSPHERES.forEach(function(ps) {
    const d = sphereData[ps.id];
    if (!d) return;
    any = true;
    const lvl = d.lvl || 1;
    const circle = d.circle || 1;
    const entries = (d.entries || []).length;
    const customName = names[ps.id] || ps.n;
    const contrib = 100 * lvl + 10 * entries;

    const row = document.createElement('div');
    row.className = 'sphere-row';
    row.style.setProperty('--c1', ps.col + '88');
    row.style.setProperty('--c2', '#1a1428');
    row.innerHTML =
      '<div class="glyph">' + ps.icon + '</div>' +
      '<div class="body">' +
        '<div class="name">' + escapeHtml(customName) + '</div>' +
        '<div class="meta">' + ps.label + ' · ' + entries + ' зап. · круг ' + circle + ' · ~' + fmtRaw(contrib) + ' св.</div>' +
      '</div>' +
      '<div class="lvl">УР. ' + lvl + '<span>LVL</span></div>';
    host.appendChild(row);
  });

  if (!any) {
    host.innerHTML = '<div class="empty">Сферы не инициализированы. Открой Лобби и пройди инициацию.</div>';
  }
}

// === Последний Тигель ===
export function renderLastCauldron(state) {
  const section = document.getElementById('last-cauldron-section');
  const result = state && state.cauldron && state.cauldron.lastResult;
  if (!section || !result) {
    if (section) section.style.display = 'none';
    return;
  }

  const sphereLabels = {
    feet: 'Ноги / тело / воплощение',
    heart: 'Сердце / чувства / отношения',
    head: 'Голова / мысль / осознание',
    cooperation: 'Сотрудничество / обмен / служение'
  };

  const elLight = document.getElementById('last-cauldron-light');
  const elElement = document.getElementById('last-cauldron-element');
  const elSphere = document.getElementById('last-cauldron-sphere');
  const elPractice = document.getElementById('last-cauldron-practice');
  const elDate = document.getElementById('last-cauldron-date');

  if (elLight) elLight.textContent = fmtRaw(result.lightAwarded || 0);
  if (elElement) elElement.textContent = result.dayEnergy || '---';
  if (elSphere) elSphere.textContent = sphereLabels[result.dominantSphere] || result.dominantSphere || '---';
  if (elPractice) elPractice.textContent = result.practiceTomorrow || 'Практика ещё не определена.';
  if (elDate) {
    const date = result.createdAt ? new Date(result.createdAt) : null;
    elDate.textContent = date && !isNaN(date.getTime()) ? date.toLocaleString('ru-RU') : 'дата не сохранена';
  }
  section.style.display = '';
}

// === Топ Державы РА (лидерборд) ===
export function renderLeaderboard(state) {
  const light = (state && state.totalLight) || 0;
  const entries = RULERS.slice();
  entries.push({ name: 'ВЫ', icon: '*', light: light, desc: 'Игрок · текущая сессия', isYou: true });
  entries.sort(function(a, b) { return b.light - a.light; });

  const host = document.getElementById('leaderboard');
  if (!host) return;
  host.innerHTML = '';

  entries.forEach(function(e, i) {
    const r = rankOf(e.light);
    const row = document.createElement('div');
    row.className = 'lead-row' + (e.isYou ? ' you' : '');
    row.style.setProperty('--rank-col', r.col);
    row.innerHTML =
      '<div class="pos">' + (i + 1) + '</div>' +
      '<div class="icon">' + e.icon + '</div>' +
      '<div class="meta">' +
        '<div class="name">' + escapeHtml(e.name) + '</div>' +
        '<div class="desc">' + escapeHtml(e.desc) + '</div>' +
      '</div>' +
      '<div class="light">' + fmtRaw(e.light) + ' св.</div>' +
      '<div class="rank">' + r.name + '</div>';
    host.appendChild(row);
  });
}

// === Шкала эволюции ===
export function renderEvolution(state) {
  const light = (state && state.totalLight) || 0;
  let currentIdx = 0;
  for (let i = 0; i < EVO.length; i++) {
    if (light >= EVO[i].threshold) currentIdx = i;
  }

  const host = document.getElementById('evolution-list');
  if (!host) return;
  host.innerHTML = '';

  EVO.forEach(function(e, idx) {
    const st = idx === currentIdx ? 'current' : (idx > currentIdx ? 'locked' : '');
    const row = document.createElement('div');
    row.className = 'evo-row ' + st;
    const marker = idx === currentIdx ? '>' : (idx < currentIdx ? '+' : 'o');
    row.innerHTML =
      '<div class="num">' + marker + '</div>' +
      '<div class="body">' +
        '<div class="lab">' + e.n + '. ' + e.name + '</div>' +
        '<div class="desc">' + escapeHtml(e.desc) + '</div>' +
      '</div>' +
      '<div class="mult">' + e.mult + '</div>';
    host.appendChild(row);
  });
}

// === Отрисовка агента в hero-блоке ===
export async function renderAgent() {
  const agentSlug = loadActiveAgent();
  const matrixSlug = loadActiveMatrix();

  try {
    const [agents, map] = await Promise.all([
      loadAgents(),
      loadAgentMatrixMap()
    ]);

    if (!agents) return;

    const agent = agents.find(function(a) { return a.slug === agentSlug; });
    if (!agent) return;

    let mapping = null;
    if (map && Array.isArray(map)) {
      mapping = map.find(function(m) {
        return m.agent_slug === agentSlug && m.matrix_slug === matrixSlug;
      });
    }

    const container = document.getElementById('hero-agent');
    const elName = document.getElementById('agent-name');
    const elCultural = document.getElementById('agent-cultural');

    if (elName) elName.textContent = agent.name;
    if (mapping && elCultural) {
      elCultural.textContent = mapping.cultural_name + ' · ' + mapping.matrix_name;
    }
    if (container) container.style.display = '';
  } catch (e) {
    console.warn('[Dashboard] Ошибка отрисовки агента:', e);
  }
}

// =============================================
// ПУБЛИЧНЫЙ API
// =============================================

// === Инициализация дашборда ===
export async function initDashboard() {
  if (dashState.initialized) {
    console.log('[Dashboard] Уже инициализировано');
    return dashState;
  }

  console.log('[Dashboard] Инициализация...');
  const start = Date.now();

  try {
    dashState.state = loadState();
    dashState.activeMatrix = loadActiveMatrix();
    dashState.activeAgent = loadActiveAgent();

    renderHero(dashState.state);
    renderStats(dashState.state);
    await renderAgent();
    renderLastCauldron(dashState.state);
    renderSpheres(dashState.state);
    renderLeaderboard(dashState.state);
    renderEvolution(dashState.state);

    dashState.initialized = true;
    const elapsed = Date.now() - start;
    console.log('[Dashboard] Готово за ' + elapsed + 'мс');

    return dashState;
  } catch (e) {
    console.error('[Dashboard] Ошибка инициализации:', e);
    return null;
  }
}

// === Получение состояния модуля ===
export function getDashboardState() {
  return {
    initialized: dashState.initialized,
    totalLight: dashState.state ? dashState.state.totalLight : 0,
    activeMatrix: dashState.activeMatrix,
    activeAgent: dashState.activeAgent,
    currentRank: dashState.state ? rankOf(dashState.state.totalLight || 0) : RANKS[0],
    currentEvo: dashState.state ? evoLevelOf(dashState.state.totalLight || 0) : EVO[0]
  };
}

// === Сброс состояния модуля ===
export function resetDashboardState() {
  dashState = {
    initialized: false,
    state: null,
    agents: null,
    matrices: null,
    agentMatrixMap: null,
    activeMatrix: 'vedic',
    activeAgent: 'svet_ra'
  };
  console.log('[Dashboard] Состояние сброшено');
  return dashState;
}

// === Получение списка рангов ===
export function getRanks() {
  return RANKS.slice();
}

// === Получение шкалы эволюции ===
export function getEvolution() {
  return EVO.slice();
}

// === Получение списка правителей ===
export function getRulers() {
  return RULERS.slice();
}

// === Получение списка сфер ===
export function getSpheres() {
  return PSPHERES.slice();
}

// === Обновление дашборда (перечитать state и перерисовать) ===
export async function refreshDashboard() {
  dashState.state = loadState();
  dashState.activeMatrix = loadActiveMatrix();
  dashState.activeAgent = loadActiveAgent();

  renderHero(dashState.state);
  renderStats(dashState.state);
  await renderAgent();
  renderLastCauldron(dashState.state);
  renderSpheres(dashState.state);
  renderLeaderboard(dashState.state);
  renderEvolution(dashState.state);

  console.log('[Dashboard] Обновлено');
  return dashState;
}
