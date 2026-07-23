/* ============================================================
   DORA MOTION — shared page animation system
   Load with: <script src="js/dora-motion.js" defer></script>
   Features: page fade in/out, navbar glass + shrink, scroll
   reveals, parallax drift clusters, scroll-linked section
   gradients, single-line "traced" SVG overlays, scroll-top dot.
============================================================ */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var docEl = document.documentElement;
  docEl.classList.add('dm-js');

  /* ---------- 1. Page load fade-in ---------- */
  function onReady(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }
  onReady(function () {
    var ready = function () { docEl.classList.add('dm-ready'); };
    requestAnimationFrame(function () { requestAnimationFrame(ready); });
    setTimeout(ready, 250); // fallback: rAF is throttled in hidden/background tabs
  });
  // restore state when returning via bfcache
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) docEl.classList.add('dm-ready');
    docEl.classList.remove('dm-leaving');
  });

  /* ---------- 2. Page exit fade-to-white ---------- */
  document.addEventListener('click', function (e) {
    if (reduceMotion) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || a.target === '_blank' ||
        /^(https?:|mailto:|tel:|javascript:)/i.test(href) && a.host !== location.host) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    docEl.classList.add('dm-leaving');
    setTimeout(function () { location.href = a.href; }, 420);
  }, true);

  /* ---------- 3. Navbar: glass, shadow, shrink, tuck ---------- */
  var nav = document.getElementById('navbar') || document.querySelector('header');
  var lastY = 0;
  function navTick(y) {
    if (!nav) return;
    nav.classList.toggle('dm-nav-scrolled', y > 30);
    // tuck away when scrolling down fast, reappear on any up-scroll
    if (y > 260 && y > lastY + 4) nav.classList.add('dm-nav-tucked');
    else if (y < lastY - 2 || y < 120) nav.classList.remove('dm-nav-tucked');
    lastY = y;
  }

  /* ---------- 4. Scroll reveal ---------- */
  var revealables = [];
  onReady(function () {
    // every direct section gets a reveal; explicit [data-reveal] too
    document.querySelectorAll('section, [data-reveal]').forEach(function (el) {
      if (!el.hasAttribute('data-no-reveal') && !el.classList.contains('fade-up')) el.classList.add('dm-reveal');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('dm-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    document.querySelectorAll('.dm-reveal').forEach(function (el) { io.observe(el); });

    // legacy draw hooks (PNG line art) — reveal only, never double-animate .fade-up
    document.querySelectorAll('[data-draw], .line-art-img').forEach(function (el) {
      if (!el.classList.contains('fade-up')) { el.classList.add('dm-reveal'); io.observe(el); }
    });
  });

  /* ---------- 5. Parallax drift ---------- */
  /* data-drift="up|down|left|right"  data-speed="0.2" (optional)
     Default speed scales inversely with element area: big = slow. */
  var drifters = [];
  onReady(function () {
    document.querySelectorAll('[data-drift]').forEach(function (el) {
      var dir = el.getAttribute('data-drift') || 'up';
      var speed = parseFloat(el.getAttribute('data-speed'));
      if (isNaN(speed)) {
        var r = el.getBoundingClientRect();
        var area = Math.max(r.width * r.height, 1);
        speed = Math.max(0.05, Math.min(0.34, 26000 / area)); // bigger → slower
      }
      el.classList.add('dm-drift');
      drifters.push({ el: el, dir: dir, speed: speed });
    });
  });
  function driftTick() {
    if (reduceMotion) return;
    var vh = window.innerHeight;
    drifters.forEach(function (d) {
      var r = d.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var p = (r.top + r.height / 2 - vh / 2) * d.speed; // centred progress
      var x = 0, y = 0;
      if (d.dir === 'up') y = p; else if (d.dir === 'down') y = -p;
      else if (d.dir === 'left') x = p; else if (d.dir === 'right') x = -p;
      d.el.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
    });
  }

  /* ---------- 5b. Soft section edges ---------- */
  /* Each section fades in from whatever colour sat above it, so the
     boundary between two background colours is a blend, not a hard line. */
  onReady(function () {
    document.querySelectorAll('main > section').forEach(function (sec) {
      var prev = sec.previousElementSibling;
      if (!prev || prev.tagName !== 'SECTION') return;
      // a section's own bg may be transparent (pattern image) — walk its
      // overlay children for the colour actually painted at the boundary.
      var c = getComputedStyle(prev).backgroundColor;
      if (!c || c === 'transparent' || /rgba\(0, 0, 0, 0\)/.test(c)) return;
      sec.style.setProperty('--dm-prev', c);
      sec.classList.add('dm-soft-top');
    });
  });

  /* ---------- 6. Scroll-strengthening section gradients ---------- */
  /* .dm-gradient-top fades FROM the previous section colour; the fade
     strengthens as the section enters the viewport (via --dm-grad). */
  var gradients = [];
  onReady(function () {
    document.querySelectorAll('.dm-gradient-top, .dm-gradient-bottom').forEach(function (el) {
      gradients.push(el);
    });
  });
  function gradTick() {
    var vh = window.innerHeight;
    gradients.forEach(function (el) {
      var r = el.getBoundingClientRect();
      var p = 1 - Math.min(Math.max(r.top / (vh * 0.85), 0), 1); // 0→1 as it enters
      el.style.setProperty('--dm-grad', p.toFixed(3));
    });
  }

  /* ---------- 7. Single-line traced overlays over photos ---------- */
  /* Add data-trace="lotus|wave|care|heart|sun|leaf" to any positioned
     image wrapper (or img — it will be wrapped). Variant styling comes
     from the section's data-trace-style: gold-fine | white-bold | dark-soft
     | gold-bold | white-fine (default gold-fine). */
  var TRACES = {
    lotus: 'M40,240 C90,205 120,150 200,145 C280,150 310,205 360,240 M200,145 C185,95 190,60 200,35 C210,60 215,95 200,145 M120,205 C130,140 160,90 200,35 M280,205 C270,140 240,90 200,35',
    wave: 'M10,190 C60,150 110,230 160,190 C210,150 260,230 310,190 C340,168 370,175 390,160 M60,120 C90,105 120,120 150,108',
    care: 'M60,250 C60,180 120,150 170,165 C200,60 300,80 300,160 C300,220 240,260 200,268 C160,260 60,260 60,250 M170,165 C190,150 220,148 240,160',
    heart: 'M200,260 C120,205 60,160 70,105 C78,60 140,50 200,110 C260,50 322,60 330,105 C340,160 280,205 200,260',
    sun: 'M40,230 L360,230 M200,230 C200,160 145,120 200,60 C255,120 200,160 200,230 M110,180 C140,150 170,140 200,140 C230,140 260,150 290,180',
    leaf: 'M80,260 C110,150 190,60 330,45 C320,170 240,250 120,262 C105,263 88,262 80,260 M92,252 C170,200 250,130 320,55'
  };
  onReady(function () {
    document.querySelectorAll('[data-trace]').forEach(function (host) {
      var kind = host.getAttribute('data-trace');
      var d = TRACES[kind] || TRACES.lotus;
      var styleName = host.getAttribute('data-trace-style') ||
        (host.closest('[data-trace-style]') || host).getAttribute('data-trace-style') || 'gold-fine';
      var svgNS = 'http://www.w3.org/2000/svg';
      var svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 400 300');
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      svg.setAttribute('class', 'dm-trace dm-trace--' + styleName);
      svg.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      svg.appendChild(path);
      if (host.tagName === 'IMG') {
        var wrap = document.createElement('span');
        wrap.className = 'dm-trace-wrap';
        host.parentNode.insertBefore(wrap, host);
        wrap.appendChild(host);
        wrap.appendChild(svg);
      } else {
        host.classList.add('dm-trace-wrap');
        host.appendChild(svg);
      }
      // prep dash for draw animation
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            svg.classList.add('dm-trace-drawn');
            io.disconnect();
          }
        });
      }, { threshold: 0.35 });
      io.observe(svg.parentNode);
    });

    /* generic draw-on-scroll for inline svgs / imgs flagged data-draw-svg */
    document.querySelectorAll('svg.dm-draw path').forEach(function (path) {
      var len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });
    var dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('dm-drawn'); dio.unobserve(en.target); }
      });
    }, { threshold: 0.3 });
    document.querySelectorAll('svg.dm-draw').forEach(function (s) { dio.observe(s); });
  });

  /* ---------- 8. Scroll-to-top dot ---------- */
  var topDot;
  onReady(function () {
    topDot = document.createElement('button');
    topDot.className = 'dm-top-dot';
    topDot.setAttribute('aria-label', 'Scroll back to top');
    topDot.innerHTML = '<span></span>';
    topDot.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
    document.body.appendChild(topDot);
  });

  /* ---------- reveal/trace geometry fallback (IO may be throttled) ---------- */
  function revealTick() {
    var vh = window.innerHeight;
    document.querySelectorAll('.dm-reveal:not(.dm-in)').forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('dm-in');
    });
    document.querySelectorAll('.dm-trace:not(.dm-trace-drawn)').forEach(function (svg) {
      var host = svg.parentNode;
      var r = host.getBoundingClientRect();
      if (r.top < vh * 0.75 && r.bottom > 0) svg.classList.add('dm-trace-drawn');
    });
    document.querySelectorAll('svg.dm-draw:not(.dm-drawn)').forEach(function (s) {
      var r = s.getBoundingClientRect();
      if (r.top < vh * 0.85 && r.bottom > 0) s.classList.add('dm-drawn');
    });
  }

  /* ---------- master scroll loop ---------- */
  var ticking = false;
  function tick() {
    var y = window.scrollY || 0;
    navTick(y);
    driftTick();
    gradTick();
    revealTick();
    if (topDot) topDot.classList.toggle('dm-top-visible', y > 600);
    ticking = false;
  }
  function onScroll() {
    if (ticking) return;
    ticking = true;
    setTimeout(tick, 16); // timer-based: keeps working when rAF is throttled
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onReady(function () { tick(); setTimeout(tick, 400); setTimeout(tick, 1200); });
})();
