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
    const sub = opts.replay ? `Ended show`
      : opts.soon ? `Starts in ${s.in}`
        : `★ ${s.rating} · ${s.viewers} watching`;
    el.innerHTML = `
      <div class="thumb ${s.g}">
        <img class="thumb-img" src="${s.img}" loading="lazy" alt="" onerror="this.remove()" />
        ${badge}${featured}${opts.soon ? '' : catTag}
        <span class="live-preview">▶ live preview on hover</span>
      </div>
      <div class="meta">
        <div class="st-title">${s.title}</div>
        <div class="st-row">
          <span class="st-av ${avatarGrad(s.seller)}"></span>
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
      box.innerHTML = `<div class="page-sub" style="grid-column:1/-1;padding:8px 0">No ${active} shows here right now — try another category.</div>`;
      return;
    }
    items.forEach((s) => box.appendChild(streamCard(s, opts)));
  }

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
