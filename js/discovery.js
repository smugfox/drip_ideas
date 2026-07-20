/* Discovery page: render filter chips + card grids, handle filtering. */
(function () {
  const D = window.DRIP;
  const $ = (s, r = document) => r.querySelector(s);

  let active = 'All';

  // ---- filter chips ----
  const filters = $('#filters');
  D.categories.forEach((c) => {
    const el = document.createElement('button');
    el.className = 'chip' + (c === 'All' ? ' selected' : '');
    el.textContent = c;
    el.onclick = () => {
      active = c;
      filters.querySelectorAll('.chip').forEach((n) => n.classList.toggle('selected', n.textContent === c));
      renderAll();
    };
    filters.appendChild(el);
  });

  function matches(item) { return active === 'All' || item.cat === active; }

  function avatarGrad(seed) { return D.grad(seed.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0)); }

  // real avatar image when we have one; gradient placeholder otherwise
  function avSpan(seller, cls = 'st-av') {
    const url = D.avatars && D.avatars[seller];
    return url
      ? `<span class="${cls}" style="background-image:url('${url}');background-size:cover;background-position:center"></span>`
      : `<span class="${cls} ${avatarGrad(seller)}"></span>`;
  }

  // ---- a live/recommended stream card ----
  function streamCard(s, opts = {}) {
    const el = document.createElement('div');
    el.className = 'scard';
    const badge = opts.replay
      ? `<span class="badge dark bl">▶ ${s.len}</span>`
      : opts.soon
        ? `<span class="badge dark tl">⏰ in ${s.in}</span>`
        : `<span class="badge live tl">● LIVE · ${s.viewers}</span>`;
    const featured = s.featured ? `<span class="badge brand tr">FEATURED</span>` : '';
    const catTag = s.cat ? `<span class="badge dark bl">${s.cat}</span>` : '';
    const cta = opts.soon
      ? `<button class="btn sm btn-secondary st-cta" data-remind>🔔 Remind me</button>`
      : '';
    const isLive = !opts.soon && !opts.replay;
    const sub = opts.replay ? `Ended show`
      : opts.soon ? `Starts in ${s.in}`
        : `★ ${s.rating} · ${s.viewers} watching`;
    const avatar = isLive
      ? `<span class="av-ring">${avSpan(s.seller)}<span class="av-live">LIVE</span></span>`
      : avSpan(s.seller);
    el.innerHTML = `
      <div class="thumb ${s.g}">
        <img class="thumb-img" src="${s.img}" loading="lazy" alt="" onerror="this.remove()" />
        ${badge}${featured}${opts.soon ? '' : catTag}
        <span class="live-preview">▶ live preview on hover</span>
      </div>
      <div class="meta">
        <div class="st-title">${s.title}</div>
        <div class="st-row">
          ${avatar}
          <span>
            <span class="st-seller">${s.seller}</span><br/>
            <span class="st-sub">${sub}</span>
          </span>
          ${cta}
        </div>
      </div>`;
    // remind toggle
    const remind = el.querySelector('[data-remind]');
    if (remind) {
      remind.onclick = (e) => {
        e.stopPropagation();
        const on = remind.classList.toggle('btn-brand');
        remind.classList.toggle('btn-secondary', !on);
        remind.textContent = on ? '✓ Reminder set' : '🔔 Remind me';
        toast(on ? `We'll ping you when ${s.seller} goes live` : 'Reminder removed');
      };
    }
    if (!opts.soon) {
      el.onclick = () => { location.href = `live.html?id=${encodeURIComponent(s.id)}&seller=${encodeURIComponent(s.seller)}&title=${encodeURIComponent(s.title)}`; };
    }
    return el;
  }

  function fill(id, list, opts) {
    const box = $('#' + id);
    box.innerHTML = '';
    const items = list.filter(matches);
    if (!items.length) {
      box.innerHTML = `<div class="page-sub" style="width:70vw;padding:8px 0">No ${active} shows here right now — try another category.</div>`;
      if (box._updateCar) box._updateCar();
      return;
    }
    // cycle the cards so the rail stays full and scrollable at any viewport width
    const railW = box.clientWidth || window.innerWidth;
    const MIN = Math.max(10, Math.ceil(railW / 318) + 3);
    const display = items.length >= MIN ? items
      : Array.from({ length: MIN }, (_, i) => items[i % items.length]);
    display.forEach((s) => box.appendChild(streamCard(s, opts)));
    if (box._updateCar) box._updateCar();
  }

  // ---- carousel chevrons + edge fade ----
  function setupCarousel(id) {
    const grid = $('#' + id);
    const wrap = grid.parentElement;
    if (!wrap || !wrap.classList.contains('car-wrap')) return;
    const mk = (dir) => {
      const b = document.createElement('button');
      b.className = 'car-btn ' + (dir < 0 ? 'prev' : 'next');
      b.innerHTML = dir < 0 ? '‹' : '›';
      b.setAttribute('aria-label', dir < 0 ? 'Scroll back' : 'More shows');
      b.onclick = () => grid.scrollBy({ left: dir * grid.clientWidth * 0.8, behavior: 'smooth' });
      wrap.appendChild(b);
      return b;
    };
    const prev = mk(-1);
    const next = mk(1);
    const update = () => {
      const max = grid.scrollWidth - grid.clientWidth;
      prev.classList.toggle('hidden', grid.scrollLeft <= 4);
      next.classList.toggle('hidden', grid.scrollLeft >= max - 4);
      wrap.classList.toggle('at-end', grid.scrollLeft >= max - 4);
    };
    grid.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    grid._updateCar = update;
    update();
  }
  ['happening', 'soon', 'foryou', 'replays'].forEach(setupCarousel);

  function renderAll() {
    fill('happening', D.happeningNow, {});
    fill('soon', D.startingSoon, { soon: true });
    fill('foryou', D.forYou, {});
    fill('replays', D.replays, { replay: true });
    $('#hn-count').textContent = D.happeningNow.filter(matches).length + ' live';
  }

  // ---- toast ----
  const toastEl = $('#toast');
  let toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }
  window.dripToast = toast;

  renderAll();
})();
