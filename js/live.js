/* Live room: auction engine + chat + bidding + reactions + mobile sheet. */
(function () {
  const D = window.DRIP;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad2 = (n) => String(n).padStart(2, '0');
  const clock = (s) => { const m = Math.floor(s / 60); const ss = s % 60; return m > 0 ? m + ':' + pad2(ss) : '0:' + pad2(ss); };
  const hash = (str) => str.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const grad = (name) => D.grad(hash(name));
  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const bg = (lot) => `background-image:url('${lot.img}');background-size:cover;background-position:center;`;

  // ---- params ----
  const p = new URLSearchParams(location.search);
  const seller = p.get('seller') || 'Charmenic';
  const known = [].concat(D.happeningNow, D.forYou).find((s) => s.id === p.get('id'));
  let viewers = known ? known.viewers : 312;
  $('#shName').textContent = seller;
  const avUrl = (n) => (D.avatars && D.avatars[n]) || null;
  const avStyle = (n) => { const u = avUrl(n); return u ? `background-image:url('${u}');background-size:cover;background-position:center` : ''; };
  if (avUrl(seller)) { $('#shAvatar').className = 'sh-av'; $('#shAvatar').style.cssText = avStyle(seller); }
  else $('#shAvatar').className = 'sh-av ' + grad(seller);
  $('#shViewers').textContent = viewers;

  // put a real stream image behind the video stage
  const cam = $('#stage .cam');
  if (cam && D.stageBg) {
    cam.style.backgroundImage = `linear-gradient(rgba(6,7,10,.28), rgba(6,7,10,.58)), url('${D.stageBg}')`;
    cam.style.backgroundSize = 'cover';
    cam.style.backgroundPosition = 'center';
  }

  // ---- state ----
  const S = { i: 0, lot: null, timeLeft: 0, cur: 0, inc: 5, high: '', youHigh: false, sold: false, hist: [] };

  // ================= RENDER LOT =================
  function initLot() {
    const lot = D.lots[S.i]; S.lot = lot;
    $('#lotBadge').textContent = 'Lot ' + (S.i + 1);
    if (lot.type === 'auction') {
      S.timeLeft = lot.dur; S.cur = lot.start; S.inc = lot.inc;
      S.high = rand(D.bidderNames); S.youHigh = false; S.sold = false;
      S.hist = [{ u: S.high, amt: S.cur, you: false }];
    }
  }

  function auctionPanelHTML(lot) {
    return `
      <div class="a-top"><span class="badge soft">⚡ Auction</span><span class="a-set">Lot ${S.i + 1} of ${D.lots.length}</span></div>
      <div class="a-lot">
        <div class="a-thumb ${lot.g}" style="${bg(lot)}"></div>
        <div><div class="a-name">${lot.name}</div><div class="a-set">${lot.set}</div></div>
      </div>
      <div class="a-bidbox">
        <div class="a-bidrow">
          <div><div class="a-curlabel">Current bid</div><div class="a-cur tnum js-cur">$${S.cur}</div></div>
          <div class="a-timer"><div class="a-clock tnum js-clock">${clock(S.timeLeft)}</div><div class="lbl">time left</div></div>
        </div>
        <div class="a-high">high bidder <b class="js-highname">@${S.high}</b> · <span class="js-bids">${S.hist.length}</span> bids</div>
        <div class="a-status js-status neutral">Live auction — place a bid</div>
        <div class="a-quick">
          <button class="btn sm btn-secondary" data-act="bid" data-amt="${S.inc}">+$${S.inc}</button>
          <button class="btn sm btn-secondary" data-act="bid" data-amt="${S.inc * 2}">+$${S.inc * 2}</button>
          <button class="btn sm btn-secondary" data-act="bid" data-amt="${S.inc * 5}">+$${S.inc * 5}</button>
        </div>
        <button class="btn block btn-brand a-bidmain" data-act="bidmain" style="margin-top:8px"><span class="js-bidmain">Bid $${S.cur + S.inc}</span></button>
        <div class="a-hint">⏱ Timer extends on a bid in the last 10s (anti-snipe)</div>
      </div>
      <div class="a-history"><div class="hh">Bid history</div><div class="js-hist">${histHTML()}</div></div>`;
  }

  function buyPanelHTML(lot) {
    return `
      <div class="a-top"><span class="badge" style="background:var(--buy);color:#fff">Buy now</span><span class="a-set">Lot ${S.i + 1} of ${D.lots.length}</span></div>
      <div class="a-lot">
        <div class="a-thumb ${lot.g}" style="${bg(lot)}"></div>
        <div><div class="a-name">${lot.name}</div><div class="a-set">${lot.set}</div></div>
      </div>
      <div class="a-bidbox a-buy">
        <div class="a-bidrow">
          <div><div class="a-curlabel">Price</div><div class="a-cur tnum">$${lot.price}</div></div>
          <div class="stepper"><button data-act="qty" data-dir="-1">–</button><span class="q tnum" id="qty">1</span><button data-act="qty" data-dir="1">+</button></div>
        </div>
        <button class="btn block btn-primary" data-act="buy" style="margin-top:12px">Buy now — $${lot.price}</button>
        <div class="a-hint">Instant checkout from your Drip balance</div>
      </div>`;
  }

  function nowCardHTML(lot) {
    if (lot.type === 'auction') {
      return `
        <div class="nc-thumb ${lot.g}" style="${bg(lot)}"></div>
        <div class="nc-body">
          <div class="nc-eyebrow">⚡ Auction · selling now</div>
          <div class="nc-title">${lot.name}</div>
          <div class="nc-sub">Current bid <b class="js-cur">$${S.cur}</b> · <b class="js-clock">${clock(S.timeLeft)}</b> left · high <span class="js-highname">@${S.high}</span></div>
        </div>
        <div class="nc-actions">
          <button class="btn btn-secondary sm" data-act="bid" data-amt="${S.inc}">+$${S.inc}</button>
          <button class="btn btn-brand sm" data-act="bidmain"><span class="js-bidmain">Bid $${S.cur + S.inc}</span></button>
        </div>`;
    }
    return `
      <div class="nc-thumb ${lot.g}" style="${bg(lot)}"></div>
      <div class="nc-body">
        <div class="nc-eyebrow">Selling now</div>
        <div class="nc-title">${lot.name}</div>
        <div class="nc-sub">$${lot.price} · ${lot.set}</div>
      </div>
      <div class="nc-actions"><button class="btn btn-primary sm" data-act="buy">Buy now — $${lot.price}</button></div>`;
  }

  function mNowHTML(lot) {
    if (lot.type === 'auction') {
      return `<div class="m-acard">
        <div class="r1">
          <div class="m-thumb ${lot.g}" style="${bg(lot)}"></div>
          <div style="flex:1;min-width:0"><div class="m-name">${lot.name}</div><div class="m-sub">Bid <b class="js-cur">$${S.cur}</b> · <span class="js-highname">@${S.high}</span></div></div>
          <div class="m-clock tnum js-clock">${clock(S.timeLeft)}</div>
        </div>
        <div class="r2">
          <button class="btn sm btn-secondary" data-act="bid" data-amt="${S.inc}">+$${S.inc}</button>
          <button class="btn sm btn-brand" data-act="bidmain"><span class="js-bidmain">Bid $${S.cur + S.inc}</span></button>
        </div></div>`;
    }
    return `<div class="m-acard">
      <div class="r1"><div class="m-thumb ${lot.g}" style="${bg(lot)}"></div><div style="flex:1;min-width:0"><div class="m-name">${lot.name}</div><div class="m-sub">$${lot.price} · ${lot.set}</div></div></div>
      <div class="r2"><button class="btn sm btn-primary block" data-act="buy">Buy now — $${lot.price}</button></div></div>`;
  }

  function histHTML() {
    return S.hist.slice(-5).reverse().map((h) =>
      `<div class="a-hrow ${h.you ? 'you' : ''}"><span class="dot" style="width:16px;height:16px;border-radius:50%"><span class="st-av ${grad(h.you ? 'You' : h.u)}" style="width:16px;height:16px;display:inline-block"></span></span> ${h.you ? 'You' : '@' + h.u} <span class="hb">$${h.amt}</span></div>`
    ).join('');
  }

  function renderLot() {
    initLot();
    const lot = S.lot;
    $('#auctionPanel').innerHTML = lot.type === 'auction' ? auctionPanelHTML(lot) : buyPanelHTML(lot);
    $('#nowCard').innerHTML = nowCardHTML(lot);
    $('#mNow').innerHTML = mNowHTML(lot);
    // queue highlight
    $$('.qitem').forEach((q, idx) => q.classList.toggle('is-live', idx === S.i));
    $$('.pcard').forEach((c, idx) => c.style.outline = idx === S.i ? '2px solid var(--brand)' : 'none');
    updateDynamic();
  }

  // ================= DYNAMIC UPDATES =================
  function updateDynamic() {
    if (S.lot.type !== 'auction') return;
    $$('.js-cur').forEach((e) => (e.textContent = '$' + S.cur));
    $$('.js-clock').forEach((e) => { e.textContent = clock(S.timeLeft); e.classList.toggle('urgent', S.timeLeft <= 5 && !S.sold); });
    $$('.js-bidmain').forEach((e) => (e.textContent = 'Bid $' + (S.cur + S.inc)));
    $$('.js-highname').forEach((e) => (e.textContent = '@' + S.high));
    $$('.js-bids').forEach((e) => (e.textContent = S.hist.length));
    const h = $('.js-hist'); if (h) h.innerHTML = histHTML();
    const st = $('.js-status');
    if (st) {
      st.className = 'a-status js-status ' + (S.sold ? 'sold' : S.youHigh ? 'win' : (S.hist.length > 1 && !S.youHigh && anyYou()) ? 'out' : 'neutral');
      st.textContent = S.sold
        ? `🔨 SOLD to ${S.youHigh ? 'you' : '@' + S.high} for $${S.cur}`
        : S.youHigh ? "✓ You're the high bidder"
          : anyYou() ? `You've been outbid — next bid $${S.cur + S.inc}`
            : 'Live auction — place a bid';
    }
    // disable bidding when sold
    $$('[data-act="bid"],[data-act="bidmain"]').forEach((b) => (b.disabled = S.sold));
  }
  function anyYou() { return S.hist.some((h) => h.you); }

  // ================= BIDDING =================
  function antiSnipe() {
    if (!S.sold && S.timeLeft > 0 && S.timeLeft < 10) { S.timeLeft = 12; systemMsg('⏱ Timer extended — anti-snipe'); }
  }
  function userBid(amt) {
    if (S.lot.type !== 'auction' || S.sold) return;
    S.cur += amt; S.high = 'You'; S.youHigh = true;
    S.hist.push({ u: 'You', amt: S.cur, you: true });
    antiSnipe(); updateDynamic();
    addMsg({ u: 'You', t: `bid $${S.cur}`, cls: 'buy' });
    toast("You're the high bidder 🎉");
  }
  function rivalBid() {
    const r = rand(D.bidderNames.filter((n) => n !== S.high)) || rand(D.bidderNames);
    const wasYou = S.youHigh;
    S.cur += S.inc; S.high = r; S.youHigh = false;
    S.hist.push({ u: r, amt: S.cur, you: false });
    antiSnipe(); updateDynamic();
    if (Math.random() < 0.6) addMsg({ u: r, t: `bid $${S.cur}`, cls: 'buy' });
    if (wasYou) toast(`Outbid by @${r} — tap +$${S.inc} to reclaim`);
  }
  function sellLot() {
    S.sold = true; updateDynamic();
    systemMsg(`🔨 SOLD — ${S.youHigh ? 'you' : '@' + S.high} won ${S.lot.name} for $${S.cur}`);
    if (S.youHigh) toast(`You won ${S.lot.name}! 🎉`);
    setTimeout(nextLot, 2600);
  }
  function buyLot() {
    const q = $('#qty') ? +$('#qty').textContent : 1;
    systemMsg(`🛍 You bought ${q}× ${S.lot.name}`);
    toast(`Added to your order — ${q}× ${S.lot.name}`);
  }
  function nextLot() { S.i = (S.i + 1) % D.lots.length; renderLot(); }

  // ================= TICK =================
  setInterval(() => {
    if (!S.lot || S.lot.type !== 'auction' || S.sold) return;
    S.timeLeft = Math.max(0, S.timeLeft - 1);
    const heat = S.timeLeft <= 6 ? 0.32 : 0.14;
    if (S.timeLeft > 1 && Math.random() < heat) rivalBid();
    if (S.timeLeft === 0) { sellLot(); return; }
    updateDynamic();
  }, 1000);

  // viewers drift
  setInterval(() => { viewers += Math.round((Math.random() - 0.45) * 6); viewers = Math.max(20, viewers); $('#shViewers').textContent = viewers; }, 4000);

  // ================= CHAT =================
  const chatEls = [$('#chatList'), $('#mChat')];
  const msgs = D.chatSeed.slice();
  function msgHTML(m) {
    const cls = m.sys ? 'system' : m.cls === 'buy' ? 'buy' : '';
    if (m.sys) return `<div class="msg system"><div class="m-body">${m.t}</div></div>`;
    const av = avUrl(m.u)
      ? `<span class="m-av st-av" style="${avStyle(m.u)}"></span>`
      : `<span class="m-av st-av ${grad(m.u)}"></span>`;
    return `<div class="msg ${cls}">${av}<div class="m-body"><span class="m-name">${m.u}</span>${m.t}</div></div>`;
  }
  function renderChat() {
    const full = msgs.map(msgHTML).join('');
    const list = $('#chatList'); if (list) { list.innerHTML = full; list.scrollTop = list.scrollHeight; }
    const m = $('#mChat'); if (m) m.innerHTML = msgs.slice(-6).map(msgHTML).join('');
  }
  function addMsg(m) { msgs.push(m); if (msgs.length > 60) msgs.shift(); renderChat(); }
  function systemMsg(t) { addMsg({ sys: true, t }); }
  setInterval(() => addMsg({ u: rand(D.bidderNames.concat(['drip_ash', 'nb_nate', 'jessaruu'])), t: rand(D.chatFiller) }), 2700);

  // ================= QUEUE / SHOP / SHEET (built once) =================
  function queueItem(lot, idx) {
    const tag = lot.type === 'auction' ? `<span class="badge dark tl" style="font-size:9px">⚡ ${clock(lot.dur)}</span>` : `<span class="badge dark tl" style="font-size:9px">BUY</span>`;
    return `<div class="qitem" data-jump="${idx}">
      <div class="qthumb ${lot.g}" style="${bg(lot)}">${tag}</div>
      <div class="qcap">${lot.name}</div>
      <div class="qprice">${lot.type === 'auction' ? 'from $' + lot.start : '$' + lot.price}</div>
    </div>`;
  }
  $('#queue').innerHTML = D.lots.map(queueItem).join('');

  function shopCard(lot, idx) {
    const action = lot.type === 'auction'
      ? `<button class="btn sm btn-secondary" data-jump="${idx}">Bid ⚡</button>`
      : `<button class="btn sm btn-primary" data-jump="${idx}">$${lot.price}</button>`;
    return `<div class="pcard" data-jump="${idx}">
      <div class="pc-thumb ${lot.g}" style="${bg(lot)}"></div>
      <div style="min-width:0;flex:1"><div class="pc-title">${lot.name}</div><div class="pc-sub">${lot.set}</div></div>
      ${action}
    </div>`;
  }
  $('#shopGrid').innerHTML = D.lots.map(shopCard).join('');
  $('#shopCount').textContent = D.lots.length + ' products';
  $('#sheetBody').innerHTML = D.lots.map(shopCard).join('');
  $('#mBagCount').textContent = D.lots.length; $('#mBagCount2').textContent = D.lots.length;

  // ================= EVENTS (delegated) =================
  document.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]');
    const jump = e.target.closest('[data-jump]');
    const rx = e.target.closest('[data-rx]');
    if (rx) { floatHeart(rx.getAttribute('data-rx') || '❤️'); return; }
    if (jump) {
      const idx = +jump.getAttribute('data-jump');
      if (idx !== S.i) { S.i = idx; renderLot(); }
      closeSheet();
      return;
    }
    if (!act) return;
    const a = act.getAttribute('data-act');
    if (a === 'bid') userBid(+act.getAttribute('data-amt'));
    else if (a === 'bidmain') userBid(S.inc);
    else if (a === 'buy') buyLot();
    else if (a === 'qty') { const q = $('#qty'); if (q) q.textContent = Math.max(1, +q.textContent + (+act.getAttribute('data-dir'))); }
  });

  // follow
  $('#followBtn').onclick = (e) => {
    const on = e.target.classList.toggle('btn-secondary');
    e.target.classList.toggle('btn-brand', !on);
    e.target.textContent = on ? '✓ Following' : '+ Follow';
  };

  // chat send
  function send(input) { const v = input.value.trim(); if (!v) return; addMsg({ u: 'You', t: v }); input.value = ''; }
  $('#chatSend').onclick = () => send($('#chatInput'));
  $('#chatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') send($('#chatInput')); });
  $('#mChatInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') send($('#mChatInput')); });

  // reactions float
  function floatHeart(emoji) {
    const stage = $('#stage'); const h = document.createElement('div');
    h.className = 'heart'; h.textContent = emoji;
    const r = stage.getBoundingClientRect();
    h.style.left = (r.width * (0.55 + Math.random() * 0.35)) + 'px';
    h.style.bottom = '120px';
    stage.appendChild(h); setTimeout(() => h.remove(), 1700);
  }

  // mobile sheet
  function openSheet() { $('#sheet').classList.add('open'); $('#scrim').classList.add('open'); }
  function closeSheet() { $('#sheet').classList.remove('open'); $('#scrim').classList.remove('open'); }
  ['#mBag', '#mBagTop', '#mSwipe'].forEach((s) => { const el = $(s); if (el) el.onclick = openSheet; });
  $('#sheetClose').onclick = closeSheet; $('#scrim').onclick = closeSheet;

  // ================= TOAST =================
  const toastEl = $('#toast'); let tt;
  function toast(msg) { toastEl.textContent = msg; toastEl.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove('show'), 2200); }

  // go
  renderChat();
  renderLot();
})();
