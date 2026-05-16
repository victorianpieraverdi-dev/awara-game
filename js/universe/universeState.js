import { createUniverseSnapshot } from './universeProgression.js';

export const ACTIVE_ZODIAC_SIGNS = [
  'Овен',
  'Телец',
  'Близнецы',
  'Рак',
  'Лев',
  'Дева',
  'Весы',
  'Скорпион',
  'Стрелец',
  'Козерог',
  'Водолей',
  'Рыбы'
];

export const ZODIAC_RAYS = [1, 4, 2, 3, 1, 2, 3, 4, 5, 6, 5, 6];

export function readUniversePlayerState(root) {
  if (root && typeof root.state !== 'undefined') return root.state;
  if (typeof state !== 'undefined') return state;
  return { totalLight: 0 };
}

export function getActiveZodiacByLight(light) {
  const value = Math.max(0, Number.isFinite(Number(light)) ? Number(light) : 0);
  const index = Math.max(0, Math.min(ACTIVE_ZODIAC_SIGNS.length - 1, Math.floor(value / 150)));
  return { name: ACTIVE_ZODIAC_SIGNS[index], index: index };
}

export function getRayByZodiacIndex(index) {
  const safeIndex = Math.max(0, Math.min(ZODIAC_RAYS.length - 1, Number(index) || 0));
  return ZODIAC_RAYS[safeIndex] || 1;
}

export function createUniverseState(playerState) {
  const snapshot = createUniverseSnapshot(playerState);
  const zodiac = getActiveZodiacByLight(snapshot.light);
  const ray = getRayByZodiacIndex(zodiac.index);

  return Object.assign({}, snapshot, {
    zodiac: zodiac,
    ray: ray,
    visibleSummary: 'В галактике сейчас: активный знак ' + zodiac.name + ', Луч ' + ray + ', Ра и одна сфера. Остальной опыт хранится в панелях и позже сможет выноситься игроком вручную.'
  });
}

export function createUniverseStateFromGlobal(root) {
  return createUniverseState(readUniversePlayerState(root || globalThis));
}
