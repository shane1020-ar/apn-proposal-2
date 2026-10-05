(function () {
  if (window.APNFX) return;
  var EASE = 'cubic-bezier(.7,0,.3,1)';
  var KEY = 'apn-nav';
  var COVER_MS = 520, REVEAL_MS = 620;
  var STYLES = { 'Circle wipe': 1, 'Green slide': 1, 'Light slide': 1, 'Fade': 1 };
  var TX = { color: '#C6DBBA', blur: 10, dim: 0.5, T1: 150, T2: 400, T4: 400 };
  var THEME = {
    dark: { bg: 'linear-gradient(180deg, #0A2E08 0%, #0E5A06 62%, #1E7A08 100%)', top: '#0A2E08', bot: '#1E7A08', dots: 'rgba(255,255,255,.06)' },
    light: { bg: 'linear-gradient(180deg, #F6FAF4 0%, #EDF3EA 55%, #E3EDDE 100%)', top: '#F6FAF4', bot: '#E3EDDE', dots: 'rgba(12,31,14,.07)' }
  };
  var state = { style: 'Circle wipe', splashEl: null, coverEl: null, busy: false };

  function css(el, o) { for (var k in o) el.style[k] = o[k]; return el; }
  function mk(tag, o, parent) { var el = document.createElement(tag); if (o) css(el, o); if (parent) parent.appendChild(el); return el; }
  function lock(on) { document.documentElement.style.overflow = on ? 'hidden' : ''; }
  function releaseHold() { var h = document.getElementById('apn-fx-hold'); if (h) h.remove(); }
  function raf2(fn) { requestAnimationFrame(function () { requestAnimationFrame(fn); }); }

  function logoWell(size, dark) {
    var w = mk('div', { position: 'relative', width: size + 'px', height: size + 'px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundImage: dark ? 'linear-gradient(180deg, rgba(255,255,255,.14), rgba(255,255,255,.06))' : 'linear-gradient(180deg, #E1E6DF 0%, #EDF0EB 100%)',
      boxShadow: dark ? 'inset 0 1px 0 rgba(255,255,255,.25), 0 0 0 1px rgba(255,255,255,.12)' : 'inset 0 3px 6px rgba(12,31,14,.16), inset 0 -2px 2px rgba(255,255,255,.9), 0 1px 0 rgba(255,255,255,.95)' });
    var img = mk('img', { width: Math.round(size * .52) + 'px', height: Math.round(size * .52) + 'px', objectFit: 'contain', filter: dark ? 'brightness(0) invert(1)' : 'none' }, w);
    img.src = 'assets/pin-logo.png'; img.alt = '';
    return w;
  }

  function splash() {
    if (state.splashEl) state.splashEl.remove();
    lock(true);
    var o = mk('div', { position: 'fixed', inset: '0', zIndex: '300', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#EFF5EC', backgroundImage: 'radial-gradient(rgba(12,31,14,.07) 1px, transparent 1px), radial-gradient(120% 90% at 50% 0%, #FFFFFF 0%, #EFF5EC 48%, #E3EDDE 100%)', backgroundSize: '18px 18px, 100% 100%',
      fontFamily: "'Poppins', system-ui, sans-serif", transition: 'transform .9s ' + EASE, willChange: 'transform', transform: 'translate3d(0,0,0)' }, document.body);
    o.setAttribute('aria-hidden', 'true');
    mk('div', { position: 'absolute', left: '-10%', right: '-10%', bottom: '-7vh', height: '14vh', borderRadius: '50%', backgroundColor: '#E3EDDE', pointerEvents: 'none' }, o);
    mk('div', { position: 'absolute', inset: '0', pointerEvents: 'none', background: 'radial-gradient(40% 40% at 50% 46%, rgba(48,192,0,.16) 0%, rgba(48,192,0,0) 70%)' }, o);
    releaseHold();
    var inner = mk('div', { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'opacity .45s ease, transform .8s ' + EASE }, o);
    var holder = mk('div', { position: 'relative', width: '132px', height: '132px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: '0', transform: 'scale(.86)', transition: 'opacity .6s ease, transform .9s cubic-bezier(.16,1,.3,1)' }, inner);
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg'); svg.setAttribute('width', '132'); svg.setAttribute('height', '132'); svg.setAttribute('viewBox', '0 0 132 132');
    css(svg, { position: 'absolute', inset: '0', transform: 'rotate(-90deg)', overflow: 'visible' });
    svg.innerHTML = '<defs><linearGradient id="apnfxG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6FE016"/><stop offset="1" stop-color="#0E7A06"/></linearGradient></defs><circle cx="66" cy="66" r="62" fill="none" stroke="rgba(14,90,6,.12)" stroke-width="2.5"/><circle data-r="1" cx="66" cy="66" r="62" fill="none" stroke="url(#apnfxG)" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="389.6" stroke-dashoffset="389.6" style="filter: drop-shadow(0 0 5px rgba(111,224,22,.55)); transition: stroke-dashoffset 1.5s cubic-bezier(.65,0,.25,1)"/>';
    holder.appendChild(svg);
    holder.appendChild(logoWell(104, false));
    var nameWrap = mk('div', { marginTop: '28px', overflow: 'hidden', height: '34px' }, inner);
    var name = mk('div', { fontSize: '24px', fontWeight: '500', letterSpacing: '-0.6px', lineHeight: '34px', color: '#0C1F0E', whiteSpace: 'nowrap', transform: 'translateY(100%)', transition: 'transform .9s cubic-bezier(.16,1,.3,1) .25s' }, nameWrap);
    name.innerHTML = 'Asia Pacific <span style="color:#1E8A00">Network</span>';
    var tagWrap = mk('div', { marginTop: '6px', overflow: 'hidden', height: '22px' }, inner);
    var tag = mk('div', { fontSize: '13px', letterSpacing: '2.4px', lineHeight: '22px', color: '#6B776A', textTransform: 'uppercase', whiteSpace: 'nowrap', transform: 'translateY(100%)', transition: 'transform .9s cubic-bezier(.16,1,.3,1) .4s' }, tagWrap);
    tag.textContent = 'Carrier-grade VoIP, worldwide';
    var bar = mk('div', { marginTop: '34px', width: '180px', height: '4px', borderRadius: '999px', overflow: 'hidden', backgroundColor: '#DCE3D9', boxShadow: 'inset 0 1px 2px rgba(12,31,14,.14)' }, inner);
    var fill = mk('div', { width: '100%', height: '100%', borderRadius: '999px', backgroundImage: 'linear-gradient(90deg, #6FD13B, #1E9A08)', transform: 'scaleX(0)', transformOrigin: '0 50%', transition: 'transform 1.5s cubic-bezier(.65,0,.25,1) .1s' }, bar);
    state.splashEl = o;
    raf2(function () {
      holder.style.opacity = '1'; holder.style.transform = 'scale(1)';
      svg.querySelector('[data-r]').style.strokeDashoffset = '0';
      name.style.transform = 'translateY(0)'; tag.style.transform = 'translateY(0)'; fill.style.transform = 'scaleX(1)';
    });
    setTimeout(function () {
      inner.style.opacity = '0'; inner.style.transform = 'translateY(-40px)';
      o.style.transform = 'translate3d(0,calc(-100% - 8vh),0)';
      lock(false);
      setTimeout(function () { if (state.splashEl === o) state.splashEl = null; o.remove(); }, 950);
    }, 1900);
  }

  function coverEl(style) {
    if (state.coverEl) state.coverEl.remove();
    var dark = style === 'Green slide', t = dark ? THEME.dark : THEME.light;
    var o = mk('div', { position: 'fixed', inset: '0', zIndex: '310', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto',
      backgroundImage: 'radial-gradient(' + t.dots + ' 1px, transparent 1px), ' + t.bg, backgroundSize: '18px 18px, 100% 100%',
      willChange: 'transform, opacity', backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }, document.body);
    o.setAttribute('aria-hidden', 'true');
    if (style !== 'Fade') {
      mk('div', { position: 'absolute', left: '-10%', right: '-10%', top: '-7vh', height: '14vh', borderRadius: '50%', backgroundColor: t.top, pointerEvents: 'none' }, o);
      mk('div', { position: 'absolute', left: '-10%', right: '-10%', bottom: '-7vh', height: '14vh', borderRadius: '50%', backgroundColor: t.bot, pointerEvents: 'none' }, o);
    }
    var w = logoWell(88, dark); css(w, { transition: 'opacity .3s ease, transform .5s cubic-bezier(.16,1,.3,1)' });
    o.appendChild(w);
    state.coverEl = o;
    return { o: o, w: w };
  }


  var txEase = function (p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var txClamp = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
  var txN = 0;
  function txEl() {
    if (state.coverEl) state.coverEl.remove();
    var id = 'apn-tx-hole-' + (++txN);
    var o = mk('div', { position: 'fixed', inset: '0', zIndex: '310', pointerEvents: 'auto' }, document.body);
    o.setAttribute('aria-hidden', 'true');
    var veil = mk('div', { position: 'absolute', inset: '0', backgroundColor: 'rgba(255,255,255,0)', backdropFilter: 'blur(0px)', webkitBackdropFilter: 'blur(0px)' }, o);
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', '100%'); svg.setAttribute('height', '100%'); svg.setAttribute('preserveAspectRatio', 'none');
    css(svg, { position: 'absolute', inset: '0', display: 'block' });
    svg.innerHTML = '<defs><mask id="' + id + '" maskUnits="userSpaceOnUse"><rect x="0" y="0" width="100%" height="100%" fill="#ffffff"></rect><circle cx="0" cy="0" r="0" fill="#000000"></circle></mask></defs><radialGradient id="' + id + '-g" cx="50%" cy="0%" r="120%" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="#DCE9D4"></stop><stop offset=".48" stop-color="#C6DBBA"></stop><stop offset="1" stop-color="#AFCB9F"></stop></radialGradient><pattern id="' + id + '-d" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(12,31,14,.1)"></circle></pattern><radialGradient id="' + id + '-c" cx="50%" cy="46%" r="40%"><stop offset="0" stop-color="rgba(48,192,0,.22)"></stop><stop offset="1" stop-color="rgba(48,192,0,0)"></stop></radialGradient><g mask="url(#' + id + ')"><rect x="0" y="0" width="100%" height="100%" fill="url(#' + id + '-g)"></rect><rect x="0" y="0" width="100%" height="100%" fill="url(#' + id + '-d)"></rect><rect x="0" y="0" width="100%" height="100%" fill="url(#' + id + '-c)"></rect></g>';
    o.appendChild(svg);
    state.coverEl = o;
    return { o: o, veil: veil, hole: svg.querySelector('circle') };
  }
  function txVeil(v, k) {
    var b = (TX.blur * k).toFixed(2) + 'px';
    v.style.backdropFilter = 'blur(' + b + ')'; v.style.webkitBackdropFilter = 'blur(' + b + ')';
    v.style.backgroundColor = 'rgba(255,255,255,' + (TX.dim * k).toFixed(3) + ')';
  }
  function circleCover(done) {
    var c = txEl(), vw = window.innerWidth, vh = window.innerHeight;
    var cx = vw * 0.5, cy = vh * -0.05, rIn = Math.sqrt(cx * cx + Math.pow(vh - cy, 2));
    c.hole.setAttribute('cx', cx); c.hole.setAttribute('cy', cy); c.hole.setAttribute('r', rIn);
    var t0 = performance.now();
    (function tick(now) {
      var el = now - t0;
      if (el < TX.T1) { txVeil(c.veil, el / TX.T1); requestAnimationFrame(tick); return; }
      txVeil(c.veil, 1);
      var p = txClamp((el - TX.T1) / TX.T2);
      c.hole.setAttribute('r', (rIn * (1 - txEase(p))).toFixed(1));
      if (p < 1) { requestAnimationFrame(tick); return; }
      c.hole.setAttribute('r', 0);
      done();
    })(t0);
  }
  function circleUncover() {
    var c = txEl(), vw = window.innerWidth, vh = window.innerHeight;
    var cx = vw * 0.5, cy = vh * 1.14, rOut = Math.sqrt(cx * cx + cy * cy);
    c.hole.setAttribute('cx', cx); c.hole.setAttribute('cy', cy); c.hole.setAttribute('r', 0);
    txVeil(c.veil, 1);
    requestAnimationFrame(releaseHold);
    var o = c.o, started = false;
    var go = function () {
      if (started) return; started = true;
      var t0 = performance.now();
      (function tick(now) {
        var p = txClamp((now - t0) / TX.T4);
        c.hole.setAttribute('r', (rOut * txEase(p)).toFixed(1));
        txVeil(c.veil, 1 - txClamp(p / 0.82));
        if (p < 1) { requestAnimationFrame(tick); return; }
        if (state.coverEl === o) state.coverEl = null; o.remove();
      })(t0);
    };
    var ready = function () {
      var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      fonts.then(function () { var n = 0; (function t() { if (++n < 4) requestAnimationFrame(t); else go(); })(); });
    };
    var waitRoot = function (tries) {
      var root = document.querySelector('x-dc, [data-dc-root]') || document.body;
      if ((root && root.querySelector('section, nav, footer')) || tries > 40) ready(); else setTimeout(function () { waitRoot(tries + 1); }, 25);
    };
    setTimeout(function () { waitRoot(0); }, 300);
    setTimeout(go, 1700);
  }

  function cover(style, done) {
    if (style === 'Circle wipe') return circleCover(done);
    var c = coverEl(style), o = c.o, w = c.w;
    if (style === 'Fade') {
      css(o, { opacity: '0', transition: 'opacity .38s ease' }); css(w, { opacity: '0', transform: 'scale(.92)' });
      raf2(function () { o.style.opacity = '1'; w.style.opacity = '1'; w.style.transform = 'scale(1)'; });
      setTimeout(done, 400);
    } else {
      css(o, { transform: 'translate3d(0,calc(100% + 8vh),0)', transition: 'transform ' + COVER_MS + 'ms ' + EASE });
      css(w, { opacity: '0', transform: 'translateY(16px)' });
      raf2(function () {
        o.style.transform = 'translate3d(0,0,0)';
        setTimeout(function () { w.style.opacity = '1'; w.style.transform = 'translateY(0)'; }, COVER_MS * .45);
      });
      setTimeout(done, COVER_MS + 20);
    }
  }

  function uncover(style) {
    if (style === 'Circle wipe') return circleUncover();
    var c = coverEl(style), o = c.o, w = c.w;
    requestAnimationFrame(releaseHold);
    var go = function () {
      if (style === 'Fade') {
        css(o, { transition: 'opacity .5s ease' });
        raf2(function () { o.style.opacity = '0'; w.style.opacity = '0'; w.style.transform = 'scale(1.05)'; });
      } else {
        css(o, { transition: 'transform ' + REVEAL_MS + 'ms ' + EASE });
        raf2(function () {
          w.style.opacity = '0'; w.style.transform = 'translateY(-16px)';
          o.style.transform = 'translate3d(0,calc(-100% - 8vh),0)';
        });
      }
      setTimeout(function () { if (state.coverEl === o) state.coverEl = null; o.remove(); }, REVEAL_MS + 80);
    };
    var img = w.querySelector('img');
    var started = false, start = function () { if (!started) { started = true; go(); } };
    var ready = function () {
      var fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
      fonts.then(function () { var n = 0; (function tick() { if (++n < 4) requestAnimationFrame(tick); else start(); })(); });
    };
    var waitRoot = function (tries) {
      var root = document.querySelector('x-dc, [data-dc-root]') || document.body;
      if ((root && root.querySelector('section, nav, footer')) || tries > 40) ready(); else setTimeout(function () { waitRoot(tries + 1); }, 25);
    };
    waitRoot(0);
    setTimeout(start, 1400);
  }

  function isInternal(a) {
    var href = a.getAttribute('href') || '';
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) return false;
    if (a.target && a.target !== '_self') return false;
    if (!/\.dc\.html(#.*)?$/i.test(decodeURIComponent(href))) return false;
    try { var u = new URL(a.href, location.href); if (u.origin !== location.origin) return false; if (u.pathname === location.pathname) return false; } catch (e) { return false; }
    return true;
  }

  var prefetched = {};
  document.addEventListener('pointerover', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !isInternal(a) || prefetched[a.href]) return;
    prefetched[a.href] = 1;
    var l = document.createElement('link'); l.rel = 'prefetch'; l.href = a.href; document.head.appendChild(l);
  }, { passive: true });

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !isInternal(a)) return;
    e.preventDefault(); e.stopPropagation();
    if (state.busy) return;
    state.busy = true;
    var url = a.href, style = state.style;
    try { sessionStorage.setItem(KEY, style); } catch (err) {}
    cover(style, function () {
      if (window.APN_ROUTER) {
        try { sessionStorage.removeItem(KEY); } catch (err) {}
        var ok = false; try { ok = window.APN_ROUTER(url); } catch (err) {}
        if (ok) { state.busy = false; setTimeout(function () { uncover(style); }, 120); return; }
      }
      location.href = url;
    });
  }, true);

  window.addEventListener('pageshow', function (e) {
    if (e.persisted) { state.busy = false; if (state.coverEl) { state.coverEl.remove(); state.coverEl = null; } }
  });

  var arrived = null;
  try { arrived = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (err) {}
  function boot() {
    if (arrived && STYLES[arrived]) uncover(arrived);
    else splash();
  }
  if (document.body) boot(); else document.addEventListener('DOMContentLoaded', boot);
  setTimeout(releaseHold, 2500);

  window.APNFX = {
    setStyle: function (s) { if (STYLES[s]) state.style = s; },
    splash: splash,
    skipSplash: function () { releaseHold(); if (state.splashEl) { state.splashEl.remove(); state.splashEl = null; lock(false); } },
    preview: function (s) { var st = STYLES[s] ? s : state.style; cover(st, function () { setTimeout(function () { uncover(st); }, 150); }); }
  };
})();


(function () {
  if (window.APNRESP) return; window.APNRESP = 1;
  var CSS = [
    '[data-apn-burger]{display:none;appearance:none;border:0;cursor:pointer;flex:0 0 auto;width:42px;height:42px;border-radius:999px;align-items:center;justify-content:center;flex-direction:column;gap:5px;padding:0;background-color:rgba(255,255,255,.72);-webkit-backdrop-filter:blur(14px) saturate(1.4);backdrop-filter:blur(14px) saturate(1.4);box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 0 0 1px rgba(12,31,14,.08),0 6px 16px -8px rgba(12,31,14,.3);}',
    '[data-apn-burger] span{display:block;width:17px;height:1.8px;border-radius:2px;background-color:#0C1F0E;transition:transform .45s cubic-bezier(.16,1,.3,1),opacity .3s ease;}',
    '[data-apn-burger][aria-expanded="true"] span:nth-child(1){transform:translateY(3.4px) rotate(45deg);}',
    '[data-apn-burger][aria-expanded="true"] span:nth-child(2){transform:translateY(-3.4px) rotate(-45deg);}',
    '[data-apn-mnav]{position:fixed;left:12px;right:12px;top:82px;z-index:99;display:none;flex-direction:column;padding:8px;border-radius:24px;background-color:rgba(255,255,255,.94);-webkit-backdrop-filter:blur(20px) saturate(1.4);backdrop-filter:blur(20px) saturate(1.4);box-shadow:inset 0 1px 0 #FFFFFF,0 0 0 1px rgba(12,31,14,.07),0 30px 60px -28px rgba(12,31,14,.4);opacity:0;transform:translateY(-10px) scale(.98);transform-origin:50% 0;pointer-events:none;transition:opacity .35s ease,transform .5s cubic-bezier(.16,1,.3,1);font-family:Poppins,sans-serif;}',
    '[data-apn-mnav].on{opacity:1;transform:none;pointer-events:auto;}',
    '[data-apn-mnav] a{display:flex;align-items:center;justify-content:space-between;min-height:50px;padding:0 16px;border-radius:16px;font-size:16px;font-weight:400;color:#1F2F20;text-decoration:none;letter-spacing:-.2px;transition:background-color .3s ease,color .3s ease;}',
    '[data-apn-mnav] a:hover,[data-apn-mnav] a:active{background-color:rgba(48,192,0,.09);color:#0E5A06;}',
    '[data-apn-mnav] a + a{box-shadow:0 -1px 0 rgba(12,31,14,.06);}',
    '[data-apn-mnav] a svg{flex:0 0 auto;color:#1E9A08;}',
    '@media (max-width: 820px){',
    ' [data-navlinks]{display:none!important;}',
    ' [data-apn-navrow]{gap:8px!important;}',
    ' [data-apn-burger]{display:inline-flex;}',
    ' [data-apn-mnav]{display:flex;}',
    '}',
    '@media (max-width: 420px){',
    ' [data-apn-navrow] > a:first-child img{height:28px!important;}',
    ' [data-apn-navrow] > a[href="#login"]{padding-left:14px!important;gap:8px!important;}',
    ' [data-apn-mnav]{top:72px;}',
    ' [data-apn-navwrap]{padding-left:10px!important;padding-right:10px!important;}',
    ' [data-apn-navrow] > a[href="#login"] [data-roll]{font-size:13.5px;}',
    '}',
    '@media (max-width: 760px){',
    ' [data-rh1]{font-size:clamp(36px,9.6vw,60px)!important;letter-spacing:-.04em!important;}',
    ' [data-rbr]{aspect-ratio:auto!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;}',
    ' [data-rbr-art]{position:relative!important;inset:auto!important;grid-column:1/-1;width:190%;margin-left:-45%;aspect-ratio:1.5/1;}',
    ' [data-rbr-art] > svg{display:none!important;}',
    ' [data-rbr-card]{position:relative!important;left:auto!important;top:auto!important;width:auto!important;min-width:0!important;}',
    ' [data-rmv-row]{flex-direction:column!important;}',
    ' [data-rmv-card]{flex:0 0 auto!important;width:100%!important;height:440px!important;}',
    ' [data-rmv-body]{min-width:0!important;opacity:1!important;transform:none!important;}',
    ' [data-rmv-cap]{opacity:0!important;}',
    '}',
    '@media (max-width: 560px){',
    ' [data-rlc-panel]{top:70px!important;}',
    '}',
    '@media (max-width: 600px){',
    ' [data-svcard]{width:min(1040px,88vw)!important;}',
    ' [data-testi-panel]{grid-template-columns:minmax(0,1fr)!important;}',
    '}',
    '@media (max-width: 480px){',
    ' h1{letter-spacing:-.035em!important;}',
    ' [data-rbr]{grid-template-columns:minmax(0,1fr);}',
    ' [data-rlc-tabs] button{padding-left:2px!important;padding-right:2px!important;font-size:11.5px!important;min-width:0!important;}',
    '}',
    '@media (max-width: 900px){',
    ' [data-testi-panel]{grid-template-columns:repeat(2,minmax(0,1fr))!important;min-height:0!important;}',
    ' [data-testi-panel] > :first-child{grid-column:1/-1;}',
    ' [data-rt-photo]{min-height:340px;}',
    ' [data-work-panel]{position:relative!important;top:auto!important;aspect-ratio:auto!important;max-height:none!important;height:auto!important;transform:none!important;opacity:1!important;filter:none!important;}',
    ' [data-work-panel] + [data-feat-anchor] + [data-work-panel],[data-feat-anchor] + [data-work-panel]{margin-top:16px!important;}',
    ' [data-rfeat]{height:auto!important;grid-template-columns:minmax(0,1fr)!important;grid-template-rows:auto!important;row-gap:24px!important;padding:26px 22px!important;}',
    ' [data-rfl]{overflow:visible!important;-webkit-mask-image:none!important;mask-image:none!important;}',
    ' [data-rfm]{max-height:none!important;}',
    '}'
  ].join('\n');
  function injectCSS() { if (document.getElementById('apn-resp')) return; var st = document.createElement('style'); st.id = 'apn-resp'; st.textContent = CSS; (document.head || document.documentElement).appendChild(st); }
  injectCSS();
  var ARROW = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="13 6 19 12 13 18"></polyline></svg>';
  var panel = null, isOpen = false;
  function curBtn() { return document.querySelector('[data-apn-burger]'); }
  function open(on) {
    isOpen = on; var btn = curBtn();
    if (btn) { btn.setAttribute('aria-expanded', on ? 'true' : 'false'); btn.setAttribute('aria-label', on ? 'Close menu' : 'Open menu'); }
    if (panel) panel.classList.toggle('on', on);
  }
  function build() {
    var links = document.querySelector('[data-navlinks]');
    if (!links) return false;
    var row = links.parentElement;
    if (!row.hasAttribute('data-apn-navrow')) row.setAttribute('data-apn-navrow', '1');
    if (row.parentElement && !row.parentElement.hasAttribute('data-apn-navwrap')) row.parentElement.setAttribute('data-apn-navwrap', '1');
    if (!panel || !panel.isConnected) {
      panel = document.querySelector('[data-apn-mnav]');
      if (!panel) { panel = document.createElement('div'); panel.setAttribute('data-apn-mnav', '1'); document.body.appendChild(panel); }
      panel.innerHTML = '';
      links.querySelectorAll('a[href]').forEach(function (a) { var c = document.createElement('a'); c.href = a.getAttribute('href'); c.innerHTML = '<span>' + a.textContent.trim() + '</span>' + ARROW; panel.appendChild(c); });
      panel.addEventListener('click', function (e) { if (e.target.closest('a')) open(false); });
    }
    if (!row.querySelector('[data-apn-burger]')) {
      var btn = document.createElement('button');
      btn.type = 'button'; btn.setAttribute('data-apn-burger', '1');
      btn.innerHTML = '<span></span><span></span>';
      btn.addEventListener('click', function (e) { e.stopPropagation(); open(!isOpen); });
      row.appendChild(btn);
      open(isOpen);
    }
    return true;
  }
  document.addEventListener('click', function (e) { if (!isOpen) return; var btn = curBtn(); if (panel && panel.contains(e.target)) return; if (btn && btn.contains(e.target)) return; open(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 820) open(false); });
  setInterval(build, 400);
  var mo = new MutationObserver(function () { build(); });
  function watch() { if (document.body) { build(); mo.observe(document.body, { childList: true, subtree: true }); } else setTimeout(watch, 50); }
  watch();
})();
