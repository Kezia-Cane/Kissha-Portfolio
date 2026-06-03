/* ============================================================
   KISSHA C. TRANGIA — PORTFOLIO INTERACTIONS
   
   Skills applied:
   - antigravity-design-expert: GSAP ScrollTrigger, staggered 0.1s
     dominoes, parallax, min 0.3s transitions, will-change, 
     prefers-reduced-motion
   - interactive-portfolio: smooth scroll, mobile nav, active states
   - frontend-design: one strong entrance sequence (hero),
     purposeful motion, no micro-motion spam
   ============================================================ */

(function () {
  'use strict';

  // ─────────────────────────────────────────────
  // Check for reduced motion preference
  // (antigravity: mandatory respect)
  // ─────────────────────────────────────────────
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─────────────────────────────────────────────
  // Navigation — Glassmorphism on scroll
  // ─────────────────────────────────────────────
  var nav = document.getElementById('nav');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', function () {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─────────────────────────────────────────────
  // Smooth scrolling for anchor links
  // ─────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = nav.offsetHeight + 8;
        var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // ─────────────────────────────────────────────
  // Active nav link highlighting
  // ─────────────────────────────────────────────
  var sections = document.querySelectorAll('section[id]');
  var navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', function () {
    var scrollPos = window.scrollY + nav.offsetHeight + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      navAnchors.forEach(function (a) {
        if (a.getAttribute('href') === '#' + id) {
          if (scrollPos >= top && scrollPos < top + height) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        }
      });
    });
  }, { passive: true });

  // ─────────────────────────────────────────────
  // IMAGE SLIDER — Auto crossfade every 2 seconds
  // Works independently of GSAP / reduced motion
  // ─────────────────────────────────────────────
  function initSlider(sliderId, intervalMs, onAdvance) {
    var wrapper = document.getElementById(sliderId);
    if (!wrapper) return;

    var slides = Array.prototype.slice.call(wrapper.querySelectorAll('.slide'));
    if (slides.length < 2) return;

    var current = 0;

    for (var i = slides.length - 1; i > 1; i--) {
      var j = Math.floor(Math.random() * (i - 1)) + 1;
      var temp = slides[i];
      slides[i] = slides[j];
      slides[j] = temp;
    }
    slides.forEach(function (slide, idx) {
      wrapper.appendChild(slide);
      slide.classList.toggle('active', idx === 0);
    });

    function advance() {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
      if (typeof onAdvance === 'function') onAdvance();
    }

    setInterval(advance, intervalMs);
  }

  // Hero slider syncs with card flip
  initSlider('heroSlider', 3000, function() { if (typeof hrcFlip === 'function') hrcFlip(); });
  // About slider: slightly offset
  
  // ─────────────────────────────────────────────
  // If reduced motion → show everything, skip GSAP
  // ─────────────────────────────────────────────
  if (prefersReducedMotion) {
    document.querySelectorAll('.gs-reveal, .gs-reveal-left, .gs-reveal-right').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('.hero-content > *, .hero-visual').forEach(function (el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return; // Exit — no GSAP animations (sliders still run above)
  }

  // ─────────────────────────────────────────────
  // GSAP Setup
  // (antigravity-design-expert: GSAP + ScrollTrigger)
  // ─────────────────────────────────────────────
  gsap.registerPlugin(ScrollTrigger);

  // Default easing (antigravity: smooth, never snap)
  var defaultEase = 'power3.out';
  var defaultDuration = 0.8;

  // ─────────────────────────────────────────────
  // HERO ENTRANCE SEQUENCE
  // (frontend-design: "One strong entrance sequence")
  // (antigravity: staggered, float from Y-axis)
  // ─────────────────────────────────────────────
  var heroTL = gsap.timeline({ delay: 0.3 });

  // Image floats in first
  heroTL.to('.hero-visual', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: defaultEase
  });

  // Then content elements stagger in
  heroTL.to('.hero-content > *', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    stagger: 0.12,  // antigravity: staggered entrances
    ease: defaultEase
  }, '-=0.5'); // Overlap slightly for fluid feel

  // Floating accent card subtle entrance
  heroTL.to('.hero-accent-card', {
    scale: 1,
    opacity: 1,
    duration: 0.6,
    ease: 'back.out(1.7)'
  }, '-=0.3');

  // ─────────────────────────────────────────────
  // PARALLAX — Hero background shapes
  // (antigravity: bg moves slower than fg)
  // ─────────────────────────────────────────────
  gsap.utils.toArray('.hero-shape').forEach(function (shape, i) {
    var speed = 80 + i * 40;
    gsap.to(shape, {
      y: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // ─────────────────────────────────────────────
  // SCROLL REVEAL — Standard vertical reveals
  // (antigravity: float into view from Y-axis)
  // ─────────────────────────────────────────────
  gsap.utils.toArray('.gs-reveal').forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: defaultDuration,
      ease: defaultEase,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Left reveals (about image, timeline items)
  gsap.utils.toArray('.gs-reveal-left').forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: defaultDuration,
      ease: defaultEase,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Right reveals
  gsap.utils.toArray('.gs-reveal-right').forEach(function (el) {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: defaultDuration,
      ease: defaultEase,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });

  // ─────────────────────────────────────────────
  // STAGGERED CARD GRIDS
  // (antigravity: "cards should drop in like dominoes, 
  //  stagger by 0.1s")
  // ─────────────────────────────────────────────
  var gridsToStagger = [
    { selector: '#servicesGrid .service-card', triggerSelector: '#servicesGrid' },
    { selector: '#toolsGrid .tool-category', triggerSelector: '#toolsGrid' },
    { selector: '#whyGrid .why-card', triggerSelector: '#whyGrid' },
    { selector: '#educationGrid .education-card', triggerSelector: '#educationGrid' },
    { selector: '#setupGrid .setup-card', triggerSelector: '#setupGrid' },
    { selector: '#contactGrid .contact-card', triggerSelector: '#contactGrid' }
  ];

  gridsToStagger.forEach(function (grid) {
    var cards = gsap.utils.toArray(grid.selector);
    if (cards.length === 0) return;

    ScrollTrigger.create({
      trigger: grid.triggerSelector,
      start: 'top 80%',
      onEnter: function () {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,  // antigravity: 0.1s domino
          ease: defaultEase,
          overwrite: true
        });
      },
      once: true
    });
  });

  // ─────────────────────────────────────────────
  // TIMELINE ITEMS — Staggered left reveals
  // ─────────────────────────────────────────────
  var timelineItems = gsap.utils.toArray('#experienceTimeline .timeline-item');
  if (timelineItems.length > 0) {
    ScrollTrigger.create({
      trigger: '#experienceTimeline',
      start: 'top 80%',
      onEnter: function () {
        gsap.to(timelineItems, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: defaultEase,
          overwrite: true
        });
      },
      once: true
    });
  }

  // ─────────────────────────────────────────────
  // Console Easter Egg
  // ─────────────────────────────────────────────
  console.log(
    '%c✨ Kissha C. Trangia — Portfolio\n%cDesigned with: interactive-portfolio, antigravity-design-expert, frontend-design, ui-skills, landing-page-generator',
    'font-size: 14px; font-weight: bold; color: #E7D7C1; background: #111; padding: 8px 16px; border-radius: 4px 4px 0 0;',
    'font-size: 11px; color: #888; background: #111; padding: 4px 16px 8px; border-radius: 0 0 4px 4px;'
  );


  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // HERO ROLE CARD â€” 3D Business Card Auto-Flip
  // Front/back face, continuous one-direction flip
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  var hrcRoles = [
    { label: 'Currently Working As', value: 'Project Manager',      sub: 'Operations & Systems' },
    { label: 'Available For',        value: 'Virtual Assistant',    sub: 'US-Based Clients' },
    { label: 'Specialized In',       value: 'Customer Success',     sub: 'Remote-Ready' },
    { label: 'Trusted For',          value: 'Executive Support',    sub: 'Summa Cum Laude' },
    { label: 'Currently Working As', value: 'Operations Manager',   sub: '5+ Years Experience' },
    { label: 'Available For',        value: 'Team Coordinator',     sub: 'US-Based Clients' },
    { label: 'Specialized In',       value: 'Social Media Manager', sub: 'Remote-Ready' },
    { label: 'Trusted For',          value: 'Admin Specialist',     sub: 'Davao City, PH' },
    { label: 'Currently Working As', value: 'Process Optimizer',    sub: 'Open to Opportunities' }
  ];

  var hrcInner      = document.getElementById('hrcInner');
  var hrcFrontLabel = document.getElementById('hrcFrontLabel');
  var hrcFrontValue = document.getElementById('hrcFrontValue');
  var hrcFrontSub   = document.getElementById('hrcFrontSub');
  var hrcBackLabel  = document.getElementById('hrcBackLabel');
  var hrcBackValue  = document.getElementById('hrcBackValue');
  var hrcBackSub    = document.getElementById('hrcBackSub');

  var hrcCurrentIdx = 0; // index shown on FRONT
  var hrcIsAnimating = false;

  // Pre-load the back face with next role
  function hrcSetBack(idx) {
    var d = hrcRoles[idx % hrcRoles.length];
    hrcBackLabel.textContent = d.label;
    hrcBackValue.textContent = d.value;
    hrcBackSub.textContent   = d.sub;
  }
  hrcSetBack(1); // back = role[1] initially

  function hrcFlip() {
    if (!hrcInner || hrcIsAnimating) return;
    hrcIsAnimating = true;

    // 1. Trigger flip animation (shows back face)
    hrcInner.classList.add('is-flipping');

    // 2. After flip completes (720ms transition)â€¦
    setTimeout(function () {
      // Advance the front to what was on the back
      hrcCurrentIdx = (hrcCurrentIdx + 1) % hrcRoles.length;
      var front = hrcRoles[hrcCurrentIdx];
      hrcFrontLabel.textContent = front.label;
      hrcFrontValue.textContent = front.value;
      hrcFrontSub.textContent   = front.sub;

      // Pre-load next role onto back
      hrcSetBack(hrcCurrentIdx + 1);

      // 3. Snap back to 0Â° without animation (transition: none)
      hrcInner.style.transition = 'none';
      hrcInner.classList.remove('is-flipping');

      // 4. Re-enable transition on next paint
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          hrcInner.style.transition = '';
          hrcIsAnimating = false;
        });
      });
    }, 720);
  }

  // Auto-flip every 2.8s (720ms flip + 2080ms pause)

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // CONTACT FORM â€” Validation + mailto submit
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  var cfForm    = document.getElementById('contactForm');
  if (cfForm) {
    var cfName    = document.getElementById('cf-name');
    var cfEmail   = document.getElementById('cf-email');
    var cfSubject = document.getElementById('cf-subject');
    var cfMsg     = document.getElementById('cf-message');
    var cfCount   = document.getElementById('cf-char-count');
    var cfBtn     = document.getElementById('cf-submit-btn');
    var cfBtnTxt  = document.getElementById('cf-btn-text');
    var cfSuccess = document.getElementById('cf-success');

    // Char counter
    cfMsg.addEventListener('input', function() {
      var len = cfMsg.value.length;
      cfCount.textContent = len;
      cfCount.style.color = len > 1800 ? '#f87171' : '';
    });

    // Validate a single field
    function cfValidate(input, fieldId, errId) {
      var field = document.getElementById(fieldId);
      var err   = document.getElementById(errId);
      if (!field || !err) return true;
      var val = input.value.trim();
      var msg = '';

      if (input.required && val === '') {
        msg = 'This field is required.';
      } else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        msg = 'Please enter a valid email address.';
      } else if (input.minLength > 0 && val.length < input.minLength && val !== '') {
        msg = 'Minimum ' + input.minLength + ' characters required.';
      } else if (input.tagName === 'SELECT' && input.required && val === '') {
        msg = 'Please select an option.';
      }

      if (msg) {
        field.classList.add('has-error');
        field.classList.remove('valid');
        err.textContent = msg;
        return false;
      } else if (val !== '') {
        field.classList.remove('has-error');
        field.classList.add('valid');
        err.textContent = '';
      }
      return !msg;
    }

    // Blur listeners
    cfName.addEventListener('blur',    function() { cfValidate(cfName,    'field-name',    'err-name'); });
    cfEmail.addEventListener('blur',   function() { cfValidate(cfEmail,   'field-email',   'err-email'); });
    cfSubject.addEventListener('blur', function() { cfValidate(cfSubject, 'field-subject', 'err-subject'); });
    cfMsg.addEventListener('blur',     function() { cfValidate(cfMsg,     'field-message', 'err-message'); });

    // Submit
    cfForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Honeypot
      var honey = cfForm.querySelector('input[name="website"]');
      if (honey && honey.value !== '') return;

      // Validate all
      var ok = true;
      if (!cfValidate(cfName,    'field-name',    'err-name'))    ok = false;
      if (!cfValidate(cfEmail,   'field-email',   'err-email'))   ok = false;
      if (!cfValidate(cfSubject, 'field-subject', 'err-subject')) ok = false;
      if (!cfValidate(cfMsg,     'field-message', 'err-message')) ok = false;

      if (!ok) {
        var firstErr = cfForm.querySelector('.has-error input, .has-error select, .has-error textarea');
        if (firstErr) firstErr.focus();
        return;
      }

      // Build mailto
      var name    = cfName.value.trim();
      var email   = cfEmail.value.trim();
      var subject = cfSubject.value;
      var message = cfMsg.value.trim();

      var body = 'Hi Kissha,\n\nName: ' + name + '\nEmail: ' + email
        + '\n\nService needed: ' + subject
        + '\n\nMessage:\n' + message
        + '\n\n---\nSent from portfolio contact form';

      var mailto = 'mailto:kisshatrangia@gmail.com'
        + '?subject=' + encodeURIComponent('[Portfolio Inquiry] ' + subject)
        + '&body='    + encodeURIComponent(body);

      cfBtn.disabled    = true;
      cfBtnTxt.textContent = 'Opening email...';
      window.location.href = mailto;

      setTimeout(function() {
        cfSuccess.removeAttribute('hidden');
        cfBtn.disabled       = false;
        cfBtnTxt.textContent = 'Send Message';
      }, 1200);
    });
  }
})();
document.addEventListener('DOMContentLoaded', function() {
  var visContainer = document.getElementById('visContainer');
  if (visContainer) {
    var visWraps = Array.prototype.slice.call(visContainer.querySelectorAll('.vis-card-wrap'));
    var visCurrentIndex = 0;
    var visTotal = visWraps.length;

    function updateVis() {
      visWraps.forEach(function(wrap, index) {
        var diff = index - visCurrentIndex;
        if (diff > visTotal / 2) diff -= visTotal;
        if (diff < -visTotal / 2) diff += visTotal;
        
        var style = {};
        if (diff === 0) {
          style = { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 };
        } else if (diff === -1) {
          style = { y: -160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: 8 };
        } else if (diff === -2) {
          style = { y: -280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: 15 };
        } else if (diff === 1) {
          style = { y: 160, scale: 0.82, opacity: 0.6, zIndex: 4, rotateX: -8 };
        } else if (diff === 2) {
          style = { y: 280, scale: 0.7, opacity: 0.3, zIndex: 3, rotateX: -15 };
        } else {
          style = { y: diff > 0 ? 400 : -400, scale: 0.6, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 };
        }
        
        wrap.style.transform = 'translateY(' + style.y + 'px) scale(' + style.scale + ') rotateX(' + style.rotateX + 'deg)';
        wrap.style.opacity = style.opacity;
        wrap.style.zIndex = style.zIndex;
        wrap.style.pointerEvents = (Math.abs(diff) <= 2) ? 'auto' : 'none';
        
        if (diff === 0) {
          wrap.classList.add('is-active');
        } else {
          wrap.classList.remove('is-active');
        }
      });
    }

    updateVis();

    function visNavigate(dir) {
      if (dir > 0) {
        visCurrentIndex = visCurrentIndex === visTotal - 1 ? 0 : visCurrentIndex + 1;
      } else {
        visCurrentIndex = visCurrentIndex === 0 ? visTotal - 1 : visCurrentIndex - 1;
      }
      updateVis();
    }

    var visLastNavTime = 0;
    var visCooldown = 400;

    visContainer.addEventListener('wheel', function(e) {
      var now = Date.now();
      if (now - visLastNavTime < visCooldown) return;
      if (Math.abs(e.deltaY) > 30) {
        visLastNavTime = now;
        visNavigate(e.deltaY > 0 ? 1 : -1);
        resetVisAutoPlay();
      }
    }, { passive: true });

    var dragStartY = 0;
    var isDragging = false;
    visContainer.addEventListener('mousedown', function(e) {
      isDragging = true;
      dragStartY = e.clientY;
    });
    window.addEventListener('mouseup', function(e) {
      if (!isDragging) return;
      isDragging = false;
      var diffY = e.clientY - dragStartY;
      if (Math.abs(diffY) > 50) {
        var now = Date.now();
        if (now - visLastNavTime < visCooldown) return;
        visLastNavTime = now;
        visNavigate(diffY < 0 ? 1 : -1);
        resetVisAutoPlay();
      }
    });
    
    visContainer.addEventListener('touchstart', function(e) {
      isDragging = true;
      dragStartY = e.touches[0].clientY;
    }, { passive: true });
    window.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      var diffY = e.changedTouches[0].clientY - dragStartY;
      if (Math.abs(diffY) > 50) {
        var now = Date.now();
        if (now - visLastNavTime < visCooldown) return;
        visLastNavTime = now;
        visNavigate(diffY < 0 ? 1 : -1);
        resetVisAutoPlay();
      }
    });

    var visAutoPlayInterval;
    function startVisAutoPlay() {
      visAutoPlayInterval = setInterval(function() {
        visNavigate(1);
      }, 3000);
    }
    function resetVisAutoPlay() {
      clearInterval(visAutoPlayInterval);
      startVisAutoPlay();
    }
    startVisAutoPlay();
  }
});