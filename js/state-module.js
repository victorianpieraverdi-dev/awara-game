// =============================================
// AWARA — State Management (localStorage)
// ES6 Module — используется через import
// =============================================

import { STORAGE_KEYS } from './core-module.js';

// === Дефолтное состояние ===
const DEFAULT_STATE = {
  totalLight: 0,
  level: 0,
  agent: null,
  matrix: 'vedic',
  initiationProgress: 0,
  tigelEntries: [],
  unlockedKeys: [],
  lastVisit: null,
  createdAt: null
};

// === Загрузка состояния ===
export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATE);
    if (!raw) {
      const fresh = { ...DEFAULT_STATE, createdAt: Date.now() };
      saveState(fresh);
      return fresh;
    }
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch (e) {
    console.error('[AWARA State] Load error:', e);
    return { ...DEFAULT_STATE };
  }
}

// === Сохранение состояния ===
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEYS.STATE, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('[AWARA State] Save error:', e);
    return false;
  }
}

// === Обновление частичное ===
export function updateState(updates) {
  const current = loadState();
  const next = { 
    ...current, 
    ...updates, 
    lastVisit: Date.now() 
  };
  saveState(next);
  return next;
}

// === Сброс состояния ===
export function resetState() {
  localStorage.removeItem(STORAGE_KEYS.STATE);
  console.log('[AWARA State] State reset');
  return { ...DEFAULT_STATE, createdAt: Date.now() };
}

// === Получение света ===
export function getLight() {
  return loadState().totalLight;
}

// === Добавление света ===
export function addLight(amount) {
  if (typeof amount !== 'number' || amount < 0) {
    console.warn('[AWARA State] Invalid light amount:', amount);
    return null;
  }
  const state = loadState();
  state.totalLight = (state.totalLight || 0) + amount;
  saveState(state);
  return state.totalLight;
}

// === Получение уровня (по STAGES) ===
export function getLevel() {
  return loadState().level || 0;
}

// === Установка уровня ===
export function setLevel(level) {
  return updateState({ level });
}

// === Тигель: добавление записи ===
export function addTigelEntry(entry) {
  const state = loadState();
  state.tigelEntries = state.tigelEntries || [];
  state.tigelEntries.push({
    ...entry,
    timestamp: Date.now()
  });
  saveState(state);
  return state.tigelEntries.length;
}

// === Тигель: получение последних N записей ===
export function getTigelEntries(limit = 10) {
  const state = loadState();
  const entries = state.tigelEntries || [];
  return entries.slice(-limit);
}
