/* =========================================
   BIN REVIVALS — JAVASCRIPT
   Built by RASTRICK. MADE
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL EFFECT ──────────────────────
  const navbar = document.getElementById('navbar');

  const siteHeader    = document.getElementById('siteHeader');
  const handleNavScroll = () => {
    const scrolled = window.scrollY > 60;
    navbar.classList.toggle('scrolled', scrolled);
    // Also toggle on the wrapper so .site-header.scrolled CSS fires
    if (siteHeader) siteHeader.classList.toggle('scrolled', scrolled);
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();


  // ── MOBILE BURGER MENU ────────────────────
  const burgerBtn = document.getElementById('burgerBtn');
  const navLinks  = document.getElementById('navLinks');

  burgerBtn.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burgerBtn.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burgerBtn.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      burgerBtn.classList.remove('open');
      document.body.style.overflow = '';
    }
  });


  // ── SCROLL REVEAL ─────────────────────────
  const revealEls = document.querySelectorAll(
    '.step, .feature, .pricing__card, .section-header, .about__content, .about__badge-wrap, .contact-item, .hero__content, .hero__visual, .problem-strip__text'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger siblings within the same parent
    const siblings = Array.from(el.parentNode.children).filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    if (idx === 1) el.classList.add('reveal-delay-1');
    if (idx === 2) el.classList.add('reveal-delay-2');
    if (idx === 3) el.classList.add('reveal-delay-3');
    if (idx === 4) el.classList.add('reveal-delay-4');
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));


  // ── SMOOTH SCROLL FOR ANCHOR LINKS ────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navH = navbar.offsetHeight + 12;
        const top  = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  // ── FORM SUBMISSION FEEDBACK ──────────────
  const form = document.querySelector('.book__form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      const btn  = form.querySelector('.btn--submit');
      const span = btn.querySelector('span');

      // Optimistic UI — show loading state
      btn.disabled  = true;
      span.textContent = 'Sending...';
      btn.style.opacity = '0.75';

      // Web3Forms handles the actual POST — we just reset UI after a delay
      // The form will redirect or show success based on the redirect field
      // If you remove the redirect field, handle async here instead
    });
  }


  // ── ACTIVE NAV LINK HIGHLIGHT ─────────────
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollY = window.scrollY + navbar.offsetHeight + 40;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav__links a[href="#${id}"]`);

      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          document.querySelectorAll('.nav__links a').forEach(l => l.style.color = '');
          link.style.color = 'var(--green-lime)';
        }
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

});


/* =========================================
   VIDEO SHOWCASE & GALLERY FEATURES
   Built by RASTRICK. MADE
   ========================================= */

// ── VIDEO LAZY LOAD + AUTOPLAY ─────────
function initVideoCards() {
  const cards = document.querySelectorAll('.video-card');
  if (!cards.length) return;

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      const video = card.querySelector('.video-card__video');
      if (!video) return;

      const src = card.dataset.videoSrc;
      if (!src) return;

      if (entry.isIntersecting) {
        if (!video.src) {
          video.src = src;
          video.load();
        }
        if (card.classList.contains('video-card--autoplay')) {
          video.play().catch(() => {});
        }
      } else {
        if (card.classList.contains('video-card--autoplay') && !video.paused) {
          video.pause();
        }
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(card => videoObserver.observe(card));
}

// ── STATS COUNTER ANIMATION ───────────
function initStatsCounters() {
  const counters = document.querySelectorAll('.stat-card__number[data-target]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

// ── VIEW COUNTER ANIMATION ────────────
function initViewCounters() {
  const viewEls = document.querySelectorAll('.views-count[data-target]');
  if (!viewEls.length) return;

  const viewObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!target) return;

      const duration = 1000;
      const startTime = performance.now();

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 2);
        el.textContent = Math.round(eased * target).toLocaleString();
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      viewObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  viewEls.forEach(el => viewObserver.observe(el));
}

// ── SCROLL REVEAL FOR NEW SECTIONS ─────
function initNewReveal() {
  const newEls = document.querySelectorAll(
    '.video-card, .review-card, .stat-card, .testimonial-card, .showcase-cta__inner, .video-showcase .section-header'
  );
  if (!newEls.length) return;

  newEls.forEach((el, i) => {
    if (!el.classList.contains('reveal')) {
      el.classList.add('reveal');
    }
    // Stagger within the same parent grid
    const siblings = Array.from(el.parentNode.children).filter(c => c.classList.contains('reveal'));
    const idx = siblings.indexOf(el);
    if (idx === 1) el.classList.add('reveal-delay-1');
    if (idx === 2) el.classList.add('reveal-delay-2');
    if (idx === 3) el.classList.add('reveal-delay-3');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  newEls.forEach(el => revealObserver.observe(el));
}

// ── LIGHTBOX ──────────────────────────
function initLightbox() {
  const lightbox    = document.getElementById('lightbox');
  if (!lightbox) return;

  const lbVideo     = document.getElementById('lightboxVideo');
  const lbTitle     = document.getElementById('lightboxTitle');
  const lbCategory  = document.getElementById('lightboxCategory');
  const lbClose     = document.getElementById('lightboxClose');
  const lbBackdrop  = document.getElementById('lightboxBackdrop');

  function openLightbox(src, title, categoryLabel) {
    lbVideo.src = src;
    if (lbTitle)    lbTitle.textContent    = title;
    if (lbCategory) lbCategory.textContent = categoryLabel;
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lbVideo.load();
    lbVideo.play().catch(() => {});
  }

  function closeLightbox() {
    lbVideo.pause();
    lbVideo.src = '';
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Play button clicks
  document.querySelectorAll('.video-card__play').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.video-card');
      if (!card) return;
      const src           = card.dataset.videoSrc || '';
      const title         = card.dataset.title || '';
      const categoryLabel = card.dataset.categoryLabel || '';
      openLightbox(src, title, categoryLabel);
    });
  });

  // Gallery card click (whole card opens lightbox)
  document.querySelectorAll('.video-card--gallery').forEach(card => {
    card.addEventListener('click', () => {
      const src           = card.dataset.videoSrc || '';
      const title         = card.dataset.title || '';
      const categoryLabel = card.dataset.categoryLabel || '';
      openLightbox(src, title, categoryLabel);
    });
  });

  if (lbClose)   lbClose.addEventListener('click', closeLightbox);
  if (lbBackdrop) lbBackdrop.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hasAttribute('hidden')) {
      closeLightbox();
    }
  });
}

// ── GALLERY FILTER TABS ───────────────
function initGalleryFilters() {
  const filterTabs  = document.querySelectorAll('.filter-tab');
  const videoCards  = document.querySelectorAll('.video-card--gallery');
  if (!filterTabs.length || !videoCards.length) return;

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      videoCards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('video-card--hidden', !show);
      });
    });
  });
}

// ── LOAD MORE ─────────────────────────
function initLoadMore() {
  const btn  = document.getElementById('loadMoreBtn');
  const pool = document.querySelectorAll('.video-card--gallery.load-more-hidden');
  if (!btn) return;

  if (!pool.length) { btn.style.display = 'none'; return; }

  btn.addEventListener('click', () => {
    pool.forEach(card => card.classList.remove('load-more-hidden'));
    btn.style.display = 'none';
  });
}

// ── BOOT ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initVideoCards();
  initStatsCounters();
  initViewCounters();
  initNewReveal();
  initLightbox();
  initGalleryFilters();
  initLoadMore();
});


/* =========================================
   V2 — CONVERSION & UX FEATURES
   ========================================= */

// ── URGENCY BAR DISMISS ───────────────
(function initUrgencyBar() {
  const bar   = document.getElementById('urgencyBar');
  const close = document.getElementById('urgencyClose');
  if (!bar || !close) return;

  const dismissed = sessionStorage.getItem('urgencyDismissed');
  if (dismissed) {
    bar.classList.add('hidden');
    document.body.classList.add('urgency-hidden');
  }

  close.addEventListener('click', () => {
    bar.classList.add('hidden');
    document.body.classList.add('urgency-hidden');
    sessionStorage.setItem('urgencyDismissed', '1');
  });
})();

// ── STICKY MOBILE CTA ─────────────────
(function initStickyCta() {
  const cta = document.getElementById('stickyMobileCta');
  if (!cta) return;

  const heroHeight = () => {
    const hero = document.getElementById('home');
    return hero ? hero.offsetHeight * 0.6 : 400;
  };

  const toggle = () => {
    if (window.innerWidth > 640) return;
    if (window.scrollY > heroHeight()) {
      cta.classList.add('visible');
    } else {
      cta.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  window.addEventListener('resize', toggle, { passive: true });
  toggle();
})();

// ── FLOATING QUOTE BUTTON ─────────────
(function initFloatingCta() {
  const btn = document.getElementById('floatingCta');
  if (!btn) return;

  const toggle = () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
})();

// ── HERO VIDEO FALLBACK ───────────────
(function initHeroVideo() {
  const video = document.querySelector('.hero__video');
  if (!video) return;

  video.addEventListener('error', () => {
    const wrap = video.closest('.hero__video-wrap');
    if (wrap) {
      wrap.style.background = 'linear-gradient(135deg, #1a4a1e 0%, #0f2e12 100%)';
    }
  });

  video.addEventListener('canplay', () => {
    video.style.opacity = '0.45';
  });
})();

// ── FAQ ACCORDION ─────────────────────
(function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn    = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = null;
      });

      // Open clicked if it was closed
      if (!isOpen && answer) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

// ── HERO STATS COUNTER (inline) ───────
(function initHeroStats() {
  const counters = document.querySelectorAll('.hero__stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el       = entry.target;
      const target   = parseInt(el.dataset.target, 10);
      const suffix   = el.dataset.suffix || '';
      const duration = 1400;
      const t0       = performance.now();

      const tick = (now) => {
        const p = Math.min((now - t0) / duration, 1);
        el.textContent = Math.round((1 - Math.pow(1-p, 3)) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

// ── SITE HEADER OFFSET ────────────────
// The site-header is the single fixed wrapper for nav + trust bar.
// We only need to push it below the urgency bar, then pad the hero.
(function initHeaderStack() {
  const urgencyBar = document.getElementById('urgencyBar');
  const siteHeader = document.getElementById('siteHeader');
  const hero       = document.getElementById('home');

  // Fallback for pages that have no siteHeader (gallery, service-areas, location pages)
  const navFallback = !siteHeader ? document.getElementById('navbar') : null;

  function update() {
    const urgencyH = (urgencyBar && !urgencyBar.classList.contains('hidden'))
                     ? urgencyBar.offsetHeight : 0;

    if (siteHeader) {
      // index.html: move entire header below urgency bar
      siteHeader.style.top = urgencyH + 'px';
      // Pad hero to start exactly below the full header height
      if (hero) {
        hero.style.paddingTop = (urgencyH + siteHeader.offsetHeight) + 'px';
      }
    } else if (navFallback) {
      // Other pages: just position the standalone nav
      navFallback.style.top = urgencyH + 'px';
    }
  }

  update();

  const closeBtn = document.getElementById('urgencyClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      setTimeout(update, 20);
      setTimeout(update, 360);
    });
  }

  window.addEventListener('resize', update, { passive: true });
  if (document.fonts) document.fonts.ready.then(update);
})();

document.addEventListener('DOMContentLoaded', () => {
  // V2 IIFE functions above run immediately — this block is intentionally empty.
});


/* =========================================
   HERO BEFORE-AND-AFTER PLAYLIST
   =========================================
   Each video plays from START TO FINISH before
   crossfading to the next. Uses the video's
   'ended' event — no timers, no interruptions.
   After the last video the playlist loops back.
   ========================================= */
(function initHeroPlaylist() {
  const PLAYLIST = [
    'Videos/Residential4.mov',    // 25 MB
    'Videos/Residential5.mov',    // 64 MB — preloaded well in advance
    'Videos/Residential10.MOV',   // 18 MB
  ];

  const slotA = document.getElementById('heroVideoA');
  const slotB = document.getElementById('heroVideoB');

  // Nothing to do if the required elements aren't present
  if (!slotA || !slotB) return;

  let curIdx  = 0;          // index of the currently playing video
  let active  = slotA;      // slot currently visible
  let standby = slotB;      // slot buffering the next video

  // --- helpers -----------------------------------------------------------

  function setSrc(el, src) {
    // Only call load() if the source actually changes
    if (el.getAttribute('src') !== src) {
      el.setAttribute('src', src);
      el.load();
    }
  }

  // Load the video AFTER the current one into the standby slot
  function preloadNext() {
    const nextSrc = PLAYLIST[(curIdx + 1) % PLAYLIST.length];
    setSrc(standby, nextSrc);
  }

  // --- crossfade ---------------------------------------------------------

  function transition() {
    curIdx = (curIdx + 1) % PLAYLIST.length;
    const nextSrc = PLAYLIST[curIdx];

    // Ensure standby has the right content
    setSrc(standby, nextSrc);

    let fired = false;

    function doFade() {
      if (fired) return;
      fired = true;

      // Start the new video from frame 0
      standby.currentTime = 0;
      standby.play().catch(() => {});

      // Simultaneous opacity swap → crossfade
      standby.classList.add('hero__video--active');
      active.classList.remove('hero__video--active');

      // Swap logical references
      [active, standby] = [standby, active];

      // Start buffering the video after next
      // (wait for current fade to complete first)
      setTimeout(preloadNext, 800);
    }

    // Ideal path: standby already has enough data
    if (standby.readyState >= 3) {
      doFade();
    } else {
      // Otherwise wait for canplay, with a 2.5 s safety fallback
      standby.addEventListener('canplay', doFade, { once: true });
      setTimeout(doFade, 2500);
    }
  }

  // --- event wiring ------------------------------------------------------

  // Only the ACTIVE slot's 'ended' should trigger a transition
  function onEnded(e) {
    if (e.target !== active) return;
    transition();
  }

  slotA.addEventListener('ended', onEnded);
  slotB.addEventListener('ended', onEnded);

  // --- boot --------------------------------------------------------------

  // slotA already has src="Videos/Residential4.mov" from HTML and is
  // autoplaying — just make sure the active class is set and preload slot B
  slotA.classList.add('hero__video--active');
  slotA.play().catch(() => {});   // no-op if autoplay already started

  // Begin buffering Residential5.mov into slotB immediately so it is
  // ready well before Residential4 finishes
  setTimeout(preloadNext, 800);
})();
