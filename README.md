# AWARA

Сакральная операционная система / эзотерическая игра.
Разработка ведётся синхронно на нескольких Devin-аккаунтах через этот репо.

## Live

https://victorianpieraverdi-dev.github.io/awara-game/ (auto-deploy с `master` через GitHub Pages)

## Локально

```bash
git clone https://github.com/victorianpieraverdi-dev/awara-game.git
cd awara-game
python3 -m http.server 8765
# открыть http://127.0.0.1:8765/
```

Бекэнда нет, всё статические HTML/CSS/JS. Состояние игрока — в `localStorage` браузера.

## Экраны

| Файл | Назначение |
|---|---|
| `index.html` | Лобби (Светкоин в шапке + 6 плиток входа) |
| `initiation-space.html` | Пространство инициации: 4 личные сферы + связи между ними |
| `tigel.html` | Вечерний Тигель: лог дня + алхимия (LLM-анализ через OpenRouter) |
| `dashboard.html` | Дашборд: Светкоин-банк, личный вклад, топ Державы Ра, шкала эволюции |
| `matrices.html` | Матрица восприятия: выбор культурного слоя (33 матрицы) |
| `earth-player.html` | Земля игрока: 9 Васту-зон (placeholder, в работе) |

## Канон

| Сущность | Кол-во | Файл |
|---|---|---|
| Космические Агенты | 21 | `data/agents.json` |
| Матрицы культур | 33 | `data/matrices.json` |
| Соответствия агент×матрица | 693 | `data/agent_matrix_map.json` |
| Локи плотности | 14 | TBD: `data/locas.json` |
| Чакры-меры | 9 | TBD: `data/chakras.json` |

Полный лор: `lore/text/` (50 .txt-файлов), `lore/raw/` (39 .docx-исходников).

## Документы

- [`docs/handoff-manifest.md`](docs/handoff-manifest.md) — самодостаточный onboarding-документ (~25 KB)
- [`docs/vision.md`](docs/vision.md) — видение Pavel'а
- [`docs/synthesis.md`](docs/synthesis.md) — синтез
- [`docs/roadmap.md`](docs/roadmap.md) — roadmap по фазам (Phase 0..6)
- [`docs/PHILOSOPHY.md`](docs/PHILOSOPHY.md) — личный журнал Pavel'а (3+ года записей)

## Для AI-агентов (Devin / Claude / GPT)

- [`START_PROMPT.md`](START_PROMPT.md) — bootstrap-промпт для новой сессии
- [`AWARA_RULES.md`](AWARA_RULES.md) — инвариантные правила (стиль, канон, секреты)
- [`HANDOFF.md`](HANDOFF.md) — журнал смен (читать перед началом работы)
- [`TASKS.md`](TASKS.md) — бэклог микро-задач (5-10 мин каждая)

## Стек

- Чистый HTML/CSS/JS (без сборщиков, без фреймворков)
- localStorage для состояния
- Шрифты: Cinzel (заголовки), Cormorant Garamond (корпус), JetBrains Mono (цифры)
- Палитра: золото `#c9a84c` на чёрном `#000` / `#0a0a14`
- Mobile-first, breakpoints 320 / 375 / 768

## Лицензия

Не определена (private project, public visibility для синхронизации команды).
