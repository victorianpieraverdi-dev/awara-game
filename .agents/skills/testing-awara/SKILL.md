---
name: testing-awara-game
description: Test AWARA game features end-to-end via local HTTP server and Chrome. Use when verifying lobby UI, daily reward, card collection, or other gameplay features.
---

# Testing AWARA Game

## Local Server Setup

```bash
cd ~/repos/awara-game
python3 -m http.server 8765
```

Open Chrome to `http://127.0.0.1:8765/`

## Alpha Gate Bypass

The lobby is gated behind an alpha code. Bypass via console:

```javascript
localStorage.setItem('awara_alpha_access', '1');
```

Or enter code `AWARA108` in the gate input field.

## Key localStorage Keys

| Key | Purpose |
|-----|--------|
| `awara_alpha_access` | Alpha gate bypass (`'1'`) |
| `awara_cards` | Collected cards object (`{cardId: true}`) |
| `awara_daily_reward_date` | Last daily reward roll date (ISO `YYYY-MM-DD`) |
| `awara_v258_state` | Player state (streak, svetcoin, etc.) |
| `awara_creator_mode` | Creator mode flag |

## Card ID Format

Cards use format `{agentSlug}__{matrix}`, e.g. `svet_ra__Ведическая`.

Matrices: `Ведическая`, `Славянская`, `Каббалистическая`

Total: 21 agents x 3 matrices = 63 cards.

## Testing Daily Reward (T-026)

1. Temporarily edit `js/dailyReward.js` line 15: change `DROP_CHANCE = 0.05` to `DROP_CHANCE = 1.0`
2. Clear state:
   ```javascript
   localStorage.removeItem('awara_daily_reward_date');
   localStorage.removeItem('awara_cards');
   ```
3. Reload page -- popup "КАРТА НАЙДЕНА" should appear
4. Verify popup fields: agent name, matrix (uppercased), element, vastu zone
5. Verify `awara_cards` has 1 entry, badge shows `1/63`
6. Reload again -- no popup (same-day guard)
7. **Revert** `DROP_CHANCE` back to `0.05` after testing

## Agents Data

`data/agents.json` contains 21 agents with fields: `slug`, `name`, `domain`, `guna`, `vastu_zone`, `planet`, `element`, `ray`.

## Known Warnings (Not Bugs)

- `[AWARA_AI] getDailyMeaning failed` -- AI meaning endpoint may return HTML instead of JSON. Pre-existing, unrelated to card features.

## No CI

This repo has no CI pipeline. Testing is manual via local server + Chrome.

## Devin Secrets Needed

None -- all testing is local, no external services required.
