/* Free-pack onboarding: claim → interests → hold-to-rip → reveal → into a live show.
   Pays off the "sign up & rip a free pack" promise (audit P1). All simulated. */
(function () {
  const D = window.DRIP;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Drip "Mystery Ball" pack art (die-cut PNG from cdn.dripshop.live)
  const PACK_ART = 'https://cdn.dripshop.live/product/a6pfFG2ZajEtkA8Ku-M8P.png';
  $('#pack-img-1').src = PACK_ART;
  $('#pack-img-3a').src = PACK_ART;
  $('#pack-img-3b').src = PACK_ART;
  $('#card-img').src = 'img/pull-mega-charizard.png'; // Mega Charizard X ex SAR · PSA 10 (local asset, transparent)
  $('#pull-name').textContent = 'Mega Charizard X ex · SAR · PSA 10';
  $('#pull-value').textContent = 'est. $300–400';

  function avatarGrad(seed) { return D.grad(seed.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)); }

  // ---- toast ----
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // ---- step engine ----
  function go(n) {
    $$('.onb-step').forEach((s) => s.classList.toggle('is-active', +s.dataset.step === n));
    $('#stepnum').textContent = `Step ${n} of 4`;
    $$('#dots i').forEach((d, i) => d.classList.toggle('on', i < n));
    if (n === 4) setupReveal();
  }

  // ---- 1 · claim ----
  $('#claim').onclick = () => go(2);

  // ---- 2 · interests ----
  const CATS = ['Pokémon', 'One Piece', 'Sports', 'Figures', 'Marvel', 'F1', 'Comics', 'Sealed'];
  const picked = new Set();
  const chipbox = $('#cats');
  CATS.forEach((c) => {
    const el = document.createElement('button');
    el.className = 'chip';
    el.textContent = c;
    el.onclick = () => {
      el.classList.toggle('selected');
      el.classList.contains('selected') ? picked.add(c) : picked.delete(c);
      $('#continue').textContent = picked.size ? `Continue (${picked.size})` : 'Skip for now';
    };
    chipbox.appendChild(el);
  });
  $('#continue').onclick = () => {
    try { localStorage.setItem('drip_interests', JSON.stringify([...picked])); } catch (e) {}
    go(3);
  };

  // ---- 3 · hold-to-rip ----
  const pack = $('#rip-pack');
  const ripBtn = $('#rip');
  const fill = $('#rip-fill');
  let p = 0, holding = false, raf = null, ripped = false, last = 0;

  function loop(ts) {
    if (!last) last = ts;
    const dt = Math.min(60, ts - last); // time-based so hold speed matches on any refresh rate
    last = ts;
    p = Math.max(0, Math.min(100, p + (holding ? 0.105 : -0.16) * dt));
    fill.style.width = p + '%';
    pack.style.setProperty('--shake', (2.6 * p / 100).toFixed(2));
    pack.classList.toggle('holding', holding && !ripped);
    if (p >= 100 && !ripped) { rip(); return; }
    if (p > 0 || holding) raf = requestAnimationFrame(loop);
    else last = 0;
  }
  function startHold(e) {
    if (ripped) return;
    e.preventDefault();
    holding = true;
    cancelAnimationFrame(raf);
    last = 0;
    raf = requestAnimationFrame(loop);
  }
  function stopHold() { holding = false; }
  [ripBtn, pack].forEach((el) => el.addEventListener('pointerdown', startHold));
  ['pointerup', 'pointercancel'].forEach((ev) => window.addEventListener(ev, stopHold));
  window.addEventListener('blur', stopHold);

  function rip() {
    ripped = true;
    holding = false;
    pack.classList.remove('holding');
    pack.classList.add('ripped');
    fill.style.width = '100%';
    $('#rip-lbl').textContent = '✨ Ripped!';
    ripBtn.disabled = true;
    burst(pack);
    setTimeout(() => go(4), 800);
  }

  function burst(host) {
    for (let i = 0; i < 14; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.textContent = ['✨', '⭐', '💛', '🔥'][i % 4];
      const a = Math.random() * Math.PI * 2;
      const r = 60 + Math.random() * 90;
      s.style.setProperty('--dx', Math.cos(a) * r + 'px');
      s.style.setProperty('--dy', Math.sin(a) * r + 'px');
      host.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  }

  // ---- 4 · reveal + route into a live show ----
  let revealDone = false;
  function setupReveal() {
    if (revealDone) return;
    revealDone = true;
    burst($('#reveal'));

    // route to a live show matching what they collect (fallback: featured stream)
    const match = D.happeningNow.find((s) => picked.has(s.cat)) || D.happeningNow[0];
    $('#watch-sub').textContent = `${match.seller} is live now · ${match.viewers} watching`;
    $('#watch').onclick = () => {
      location.href = `live.html?id=${encodeURIComponent(match.id)}&seller=${encodeURIComponent(match.seller)}&title=${encodeURIComponent(match.title)}`;
    };

    // suggested sellers (live now first)
    const box = $('#sellers');
    D.happeningNow.slice(0, 3).forEach((s) => {
      const row = document.createElement('div');
      row.className = 'seller-row';
      row.innerHTML = `
        <span class="st-av ${avatarGrad(s.seller)}"></span>
        <span>
          <span class="s-name">${s.seller}</span><br/>
          <span class="s-sub">★ ${s.rating} · ${s.cat} · live now</span>
        </span>
        <span class="spacer"></span>
        <button class="btn xs btn-secondary" data-follow>+ Follow</button>`;
      const btn = row.querySelector('[data-follow]');
      btn.onclick = () => {
        const on = btn.classList.toggle('btn-brand');
        btn.classList.toggle('btn-secondary', !on);
        btn.textContent = on ? '✓ Following' : '+ Follow';
        toast(on ? `Following ${s.seller} — we'll ping you when they go live` : 'Unfollowed');
      };
      box.appendChild(row);
    });
  }
  $('#sellers-toggle').onclick = () => $('#sellers').classList.toggle('open');

  // ---- click-to-enlarge lightbox on the pulled card ----
  const lightbox = $('#lightbox');
  $('#lightbox-img').src = $('#card-img').src;
  $('#reveal').onclick = () => lightbox.classList.add('open');
  lightbox.onclick = () => lightbox.classList.remove('open');
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.remove('open'); });
})();
