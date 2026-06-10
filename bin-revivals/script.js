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

// ── URGENCY MARQUEE — mobile only ─────
// Two identical copies scroll via CSS animation. Animation is paused until
// we measure the exact physical-pixel width of one copy — avoids the
// sub-pixel jump that occurs when using translateX(-50%) on high-DPR screens.
(function initUrgencyMarquee() {
  if (window.innerWidth > 640) return;
  const inner = document.querySelector('.urgency-bar__inner');
  if (!inner || inner.querySelector('.urgency-bar__track')) return;

  const originalHTML = inner.innerHTML;

  const track = document.createElement('div');
  track.className = 'urgency-bar__track';

  const copy1 = document.createElement('span');
  copy1.className = 'urgency-bar__track-content';
  copy1.innerHTML = originalHTML;

  const copy2 = document.createElement('span');
  copy2.className = 'urgency-bar__track-content';
  copy2.setAttribute('aria-hidden', 'true');
  copy2.innerHTML = originalHTML;

  track.appendChild(copy1);
  track.appendChild(copy2);
  inner.innerHTML = '';
  inner.appendChild(track);

  function start() {
    const w = copy1.getBoundingClientRect().width;
    if (!w) { requestAnimationFrame(start); return; }
    // Round to nearest physical pixel so the loop point is exact
    const dpr = window.devicePixelRatio || 1;
    const exact = Math.round(w * dpr) / dpr;
    track.style.setProperty('--mq-offset', '-' + exact + 'px');
    track.style.animationPlayState = 'running';
  }

  // Wait for web fonts to load before measuring — font affects text width
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { requestAnimationFrame(start); });
  } else {
    requestAnimationFrame(start);
  }
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
      // Other pages: position nav below urgency bar
      navFallback.style.top = urgencyH + 'px';
      // Pad the inner-page hero so its content clears the full header.
      // Same logic as index.html: urgency height + nav height + breathing room.
      const innerHero = document.querySelector('.page-hero');
      if (innerHero) {
        innerHero.style.paddingTop = (urgencyH + navFallback.offsetHeight + 24) + 'px';
      }
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

// ── TESTIMONIALS SWIPE DOTS ───────────────
(function () {
  const grid = document.getElementById('testimonialsGrid');
  const dots = document.querySelectorAll('.testimonials__dot');
  if (!grid || !dots.length) return;

  function activeDotIndex() {
    const cards = grid.querySelectorAll('.testimonial-card');
    let closest = 0, minDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.getBoundingClientRect().left - grid.getBoundingClientRect().left);
      if (dist < minDist) { minDist = dist; closest = i; }
    });
    return closest;
  }

  function updateDots() {
    const idx = activeDotIndex();
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }

  grid.addEventListener('scroll', updateDots, { passive: true });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      const cards = grid.querySelectorAll('.testimonial-card');
      if (cards[i]) cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
  });
})();

document.addEventListener('DOMContentLoaded', () => {
  // V2 IIFE functions above run immediately — this block is intentionally empty.
});


/* =========================================
   HERO VIDEO PLAYLIST
   =========================================
   Video stays invisible (opacity 0) until play
   is confirmed — prevents browser play-button
   overlay appearing on mobile before autoplay
   kicks in. Only becomes visible on .then().
   ========================================= */
(function initHeroPlaylist() {
  const PLAYLIST = [
    'Videos/Residential1.mp4',
    'Videos/Residential2.mp4',
    'Videos/Residential4.mp4',
    'Videos/Residential11.mp4',
  ];

  const slotA = document.getElementById('heroVideoA');
  const slotB = document.getElementById('heroVideoB');
  if (!slotA || !slotB) return;

  const wrap = document.querySelector('.hero__video-wrap');

  let curIdx  = 0;
  let active  = slotA;
  let standby = slotB;

  function showFallback() {
    if (wrap) wrap.style.background = 'linear-gradient(135deg, #1a4a1e 0%, #0f2e12 100%)';
    slotA.style.display = 'none';
    slotB.style.display = 'none';
  }

  function setSrc(el, src) {
    if (el.getAttribute('src') !== src) {
      el.setAttribute('src', src);
      el.load();
    }
  }

  function preloadNext() {
    setSrc(standby, PLAYLIST[(curIdx + 1) % PLAYLIST.length]);
  }

  function onEnded(e) {
    if (e.target !== active) return;

    curIdx = (curIdx + 1) % PLAYLIST.length;
    setSrc(standby, PLAYLIST[curIdx]);

    let fired = false;
    function doFade() {
      if (fired) return;
      fired = true;
      standby.currentTime = 0;
      standby.play().catch(() => {});
      standby.classList.add('hero__video--active');
      active.classList.remove('hero__video--active');
      [active, standby] = [standby, active];
      preloadNext();
    }

    if (standby.readyState >= 3) {
      doFade();
    } else {
      standby.addEventListener('canplay', doFade, { once: true });
      setTimeout(doFade, 2000);
    }
  }

  slotA.addEventListener('ended', onEnded);
  slotB.addEventListener('ended', onEnded);
  slotA.addEventListener('error', showFallback);
  slotB.addEventListener('error', showFallback);

  // Only reveal video AFTER play is confirmed — this prevents the
  // browser showing its native play-button overlay on mobile
  function startPlayback() {
    slotA.play().then(() => {
      slotA.classList.add('hero__video--active');
      preloadNext();
    }).catch(() => {
      // Autoplay blocked — retry on first touch (some iOS browsers)
      document.addEventListener('touchstart', function handler() {
        slotA.play().then(() => {
          slotA.classList.add('hero__video--active');
          preloadNext();
        }).catch(showFallback);
        document.removeEventListener('touchstart', handler);
      }, { once: true, passive: true });
    });
  }

  startPlayback();
})();
