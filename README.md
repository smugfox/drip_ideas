# Drip — Live Shopping Prototype

A clickable, framework-free prototype exploring UX improvements for **dripshop.live**,
built for a founder conversation. Two screens, responsive desktop + mobile.

- **`index.html`** — Live **Discovery**: category filters, *Happening now*, *Starting soon*
  (with reminders), a personalized *For you* row, and *Replays*.
- **`live.html`** — Live **Stream room**: video stage, persistent live chat, an always-on
  **auction module** (live countdown, quick-bid increments, high-bidder + bid history,
  anti-snipe extension, winning/outbid states), an *up-next* queue, and a shop.
  On mobile it becomes a full-screen vertical video with overlaid chat, a pinned buy/bid
  card, and a shop bottom-sheet.
- **`onboarding.html`** — Post-signup **free-pack onboarding**: claim a free pack, pick
  what you collect, **press-and-hold to rip** it open, reveal the pull, then land in a
  live show matched to your interests.

## Stack
No frameworks. Plain **HTML + custom CSS + vanilla JS**.

- `css/kiri-base.css` — foundation borrowed from the [Kiri-TCG](https://github.com/smugfox/Kiri-TCG)
  design system: its **token architecture** (`--space-*`, `--rounded-*`, `--type-*` scales,
  shadow, `[data-theme]`) and framework-free primitives (`.btn`, `.chip`, `.badge`,
  `.input`, `.switch`, `.stepper`). Colors + fonts are Drip's, not Kiri's.
- `css/drip.css` — the Drip skin (dark, gold/blue) + all app components.
- `js/data.js` — mock data. `js/discovery.js`, `js/live.js` — page logic.

## Run locally
```
python3 -m http.server 4599
# open http://localhost:4599
```

It's a static site — Vercel serves it with zero config.

> Prototype only: no backend, no real payments. Bids/chat/other viewers are simulated.
