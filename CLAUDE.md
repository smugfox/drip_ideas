# Drip — audit + prototype (project notes)

Portable working notes so this can be continued on any machine. (The original
`.claude` memory lived only on the first Mac; this file is the git-tracked version.)

## What this is
A **UX audit of dripshop.live** plus a **clickable prototype** of the highest-leverage
fixes, made for a **30-min founder conversation with Javaughn Lawrence** (Co-founder/CEO of
Drip — AI-native live social commerce for collectibles, a Whatnot-style competitor; ex-Bain,
ex-VC, Yale econ — appreciates crisp, prioritized, impact-framed input). **The talk is Mon 2026-07-20.**

Drip = live shopping (sellers stream and sell cards/collectibles via auctions, buy-now, and
"instant packs"/mystery boxes), plus a Marketplace and a Rewards loop ("Driplets").

## Deliverables (all deployed)
Vercel project **drip-ideas** (team "Robin's projects"), git-connected to this repo —
**every push to `main` auto-deploys.**

| Page | URL |
|---|---|
| Discovery (desktop entry) | https://drip-ideas.vercel.app/ |
| Live room + auction | https://drip-ideas.vercel.app/live.html |
| Mobile / vertical preview | https://drip-ideas.vercel.app/mobile.html |
| UX audit (shareable) | https://drip-ideas.vercel.app/audit.html |

Figma (wireframes + before/after board): https://www.figma.com/design/u3mIgENvx3eSbED18u8R2g/Drip
— has 4 low-fi wireframes (A desktop stream, B discovery, C free-pack onboarding, D mobile),
an "Auction mode" strip, and a **"Live today → Proposed" before/after board** (dark panel,
frame id 9:2, with real screenshots).

## Constraints (from the user — important)
- **No frameworks.** Plain **HTML + custom CSS + vanilla JS**. No React/Next/Tailwind/**shadcn**.
- CSS foundation borrowed from **Kiri-TCG** (github.com/smugfox/Kiri-TCG) — its *token
  architecture* only (space/radius/type scales, reset, `.btn/.chip/.badge/.input/.switch/.stepper`).
  **NOT its colors.** Skinned dark + gold/blue to **look like Drip**.
- Uses **real Drip images** (pack art, slabs, stream thumbnails) hotlinked from
  `cdn.dripshop.live`, and Drip's real **logo** (`dripshop.live/assets/privy-wallet-drip-logo-dark-*.png`).

## File map
- `index.html` — Discovery ("Live" page): filters, Happening now, Starting soon (reminders),
  For you, Replays. Logic: `js/discovery.js`.
- `live.html` — Live room. Desktop: video stage + persistent chat rail + **auction module** +
  up-next queue + shop. Mobile (≤1024px): full-screen vertical video, overlaid chat, pinned
  buy/bid card, shop bottom-sheet. Logic: `js/live.js`.
- `mobile.html` — renders `live.html` + `index.html` inside phone-frame iframes (so the
  responsive mobile layout is viewable on desktop).
- `audit.html` + `css/audit.css` — the shareable audit doc (dark, Drip-themed).
- `css/kiri-base.css` — Kiri-derived tokens + primitives (Drip colors).
- `css/drip.css` — the Drip skin + all app components + responsive rules.
- `js/data.js` — all mock data (streams, lots, chat, image URLs by name).

## Gotchas / decisions (don't relearn these the hard way)
- **CSS class collisions bit us:** `.badge.live` / `.badge.brand` collided with layout
  classes `.live` / `.brand`. Containers were renamed to **`.liveroom`** and **`.logo`**.
  Keep badge modifiers and layout containers namespaced apart.
- **Logo has a baked-in dark background** (it's the `logo-dark` asset). It's shown with
  **`mix-blend-mode: screen`** so the dark bg drops out on our dark surfaces. Don't remove that.
- **Asset cache-busting:** CSS/JS links carry `?v=N`. **Bump the version when you edit a
  shared CSS/JS file** or browsers serve stale copies (currently `drip.css?v=4`, others `?v=3`).
- **Auction engine** (`js/live.js`): live countdown, simulated rival bids, quick-bid, bid
  history, anti-snipe (timer extends if a bid lands in last 10s), winning/outbid states, buy-now
  lots, then advances through the lot queue. All simulated — no backend.
- **Live seller avatars** = gradient ring + red "LIVE" pill (`.av-ring` / `.av-live`).
- Figma screenshots were placed via the Figma MCP `upload_assets` (POST bytes to the returned
  URL); image hashes can be reused on new nodes via `{type:'IMAGE',imageHash,scaleMode}`.

## Audit findings (summary — full version in audit.html)
- **P0 (verify first):** with an ad blocker (AdGuard), Home (`/streams/home`) and Marketplace
  hung on blank spinners while Statsig's feature-flag call was blocked. Not universal (Instant
  Packs/streams loaded). Test on a clean profile before treating as real.
- **P1 (conversion):** no "free pack" payoff after signup; stored-value wallet + 2% deposit
  fee; live chat hidden behind a "Comment" button on desktop (~40% dead space); login buries
  Google/Apple under phone + wallet.
- **P2 (polish):** no skeletons on main grids (but Marketplace has them); deep links to
  `/home`/`/rewards`/`/marketplace` 404; white 404 page; sparse Live page; heavy 4-checkbox
  first-stream gate.
- **Strengths:** pack/box art, Instant Packs, deep in-stream shop, Driplets/rewards, Google Pay.

## Open TODOs / next ideas
- Build the **free-pack onboarding** screen into the coded prototype (only wireframed as Figma frame C).
- Add a **mobile before/after row** to the Figma board.
- Give **seller avatars** real images (currently gradient placeholders).
- Optionally add an "Audit" link into the prototype's own nav.

## Run / deploy
```bash
python3 -m http.server 4599   # then open http://localhost:4599
```
Static site — no build. **Deploy = `git push origin main`** (Vercel auto-builds).
Git identity used: `smugfox` / `robinfoxin@gmail.com`.
