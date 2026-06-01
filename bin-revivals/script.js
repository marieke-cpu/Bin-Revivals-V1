/* =========================================
   BIN REVIVALS — JAVASCRIPT
   Built by RASTRICK. MADE
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL EFFECT ──────────────────────
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
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
