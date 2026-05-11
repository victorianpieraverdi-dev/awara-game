---
name: testing-awara-game
description: Test AWARA game features end-to-end via local HTTP server and browser. Use when verifying UI changes to tigel.html, earth-player.html, index.html, or card/reward mechanics.
---

# Testing AWARA Game

## Local Server Setup

```bash
cd ~/repos/awara-game
python3 -m http.server 8765 &
```

Pages:
- Lobby: http://127.0.0.1:8765/index.html
- Tigel: http://127.0.0.1:8765/tigel.html
- Earth: http://127.0.0.1:8765/earth-player.html
- Deck: http://127.0.0.1:8765/deck.html

## Alpha Gate

The lobby (index.html) may have an alpha gate that requires a password. The gate checks `localStorage.getItem('awara_alpha')`. To bypass:

```js
localStorage.setItem('awara_alpha', 'true');
```

Then reload the page.

## Key localStorage Keys

| Key | Type | Purpose |
|-----|------|---------|
| `awara_cards` | JSON object `{cardId: true}` | Collected cards |
| `awara_keys` | string (number) | Player keys count |
| `awara_streak_days` | string (number) | Current streak days |
| `awara_streak_bonus_date` | ISO date string | Guards streak bonus to once/day |
| `awara_daily_reward_date` | ISO date string | Guards daily card reward to once/day |
| `awara_alpha` | string | Alpha gate bypass |

## Card ID Format

Card IDs follow the pattern: `{agentSlug}__{matrixName}`

Examples:
- `svet_ra__Ведическая`
- `iskra__Славянская`
- `brahma__Каббалистическая`

Matrix names are in Russian: Ведическая, Славянская, Каббалистическая.

## Seeding Test Cards

To test card-related features, seed cards via browser console:

```js
// One card per matrix
localStorage.setItem('awara_cards', JSON.stringify({
  "svet_ra__Ведическая": true,
  "iskra__Славянская": true,
  "brahma__Каббалистическая": true
}));

// Multiple cards for scaling tests
localStorage.setItem('awara_cards', JSON.stringify({
  "svet_ra__Ведическая": true,
  "iskra__Ведическая": true,
  "brahma__Ведическая": true,
  "prema__Славянская": true,
  "shiva__Славянская": true
}));

// Clear all cards
localStorage.removeItem('awara_cards');
```

Always reload the page after changing localStorage.

## Testing Card Effects (T-027+)

1. Seed cards via console
2. Navigate to tigel.html, click "БАЛАНС" tab
3. Verify "БОНУСЫ КАРТ" block shows correct bonus lines
4. Navigate to earth-player.html
5. Verify bonus block appears above "ВОЗВЕСТИ СТРУКТУРУ" button
6. Clear cards, reload -- verify blocks are hidden

Expected bonuses per matrix:
- Ведическая: +N свет/час (N = card count)
- Славянская: +N*5% шанс ключа
- Каббалистическая: +N ключ при streak 7

## Testing Daily Card Reward (T-026+)

The daily reward has a 5% chance (`DROP_CHANCE = 0.05`). To force a drop for testing, temporarily modify `js/dailyReward.js` and set `DROP_CHANCE = 1.0`, then:

1. Clear reward date: `localStorage.removeItem('awara_daily_reward_date')`
2. Navigate to index.html (lobby)
3. Verify popup "КАРТА НАЙДЕНА" appears with agent details
4. Check `localStorage.getItem('awara_cards')` has the new card
5. Reload -- verify no second popup (same-day guard)

## Pre-existing Warnings

- `[AWARA_AI] getDailyMeaning failed` -- the AI meaning endpoint might return HTML instead of JSON. This is a known issue unrelated to card/reward features.

## Devin Secrets Needed

No secrets required for local testing. The game uses localStorage for all state and has no backend API authentication.
