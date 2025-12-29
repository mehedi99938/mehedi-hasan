(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth scroll (fallback for browsers not honoring CSS scroll-behavior or when clicking links)
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute('href');
    if (!href || href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const top = target.getBoundingClientRect().top + window.pageYOffset - 86;
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  // Button / card hover glow tracking
  const glowEls = document.querySelectorAll('[data-glow]');
  glowEls.forEach((el) => {
    el.addEventListener('pointermove', (ev) => {
      const rect = el.getBoundingClientRect();
      const x = ((ev.clientX - rect.left) / rect.width) * 100;
      const y = ((ev.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--gx', x + '%');
      el.style.setProperty('--gy', y + '%');
    });

    el.addEventListener('pointerenter', () => {
      el.classList.add('glow-on');
      if (el.classList.contains('service-card') || el.classList.contains('stat-card') || el.classList.contains('project-card') || el.classList.contains('price-card') || el.classList.contains('blog-card')) {
        el.classList.add('lift');
      }
    });

    el.addEventListener('pointerleave', () => {
      el.classList.remove('glow-on');
      el.classList.remove('lift');
    });
  });

  // Animated counters
  const counters = Array.from(document.querySelectorAll('.counter'));
  const animateCounter = (el) => {
    const target = Number(el.getAttribute('data-target') || '0');
    const duration = 1100;
    const start = performance.now();

    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = String(target);
    };

    requestAnimationFrame(step);
  };

  // Progress bars
  const bars = Array.from(document.querySelectorAll('.progress-bar[data-progress]'));
  const animateBar = (bar) => {
    const v = bar.getAttribute('data-progress');
    if (!v) return;
    bar.style.width = v + '%';
  };

  // Intersection observers
  const once = new WeakSet();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (once.has(el)) return;
        once.add(el);

        if (el.classList.contains('counter')) animateCounter(el);
        if (el.classList.contains('progress-bar')) animateBar(el);
      });
    },
    { threshold: 0.35 }
  );

  counters.forEach((c) => io.observe(c));
  bars.forEach((b) => io.observe(b));

  // Testimonials slider
  const testimonials = [
    {
      quote: 'The UI is premium and fast. The glow style looks exactly like a modern cyber brand — and the code is clean.',
      name: 'Ayesha Rahman',
      role: 'Founder, Aurora Studio'
    },
    {
      quote: 'Great communication, reliable delivery, and a backend that scales. Our API response times improved immediately.',
      name: 'Tanvir Ahmed',
      role: 'Product Lead, Nova SaaS'
    },
    {
      quote: 'The design system is consistent across pages and devices. Everything feels intentional and polished.',
      name: 'Sarah Khan',
      role: 'Design Manager, PixelWorks'
    }
  ];

  const quoteEl = document.getElementById('testiQuote');
  const nameEl = document.getElementById('testiName');
  const roleEl = document.getElementById('testiRole');
  const cardEl = document.getElementById('testiCard');

  let idx = 0;
  let timer = null;

  const renderTestimonial = (i) => {
    const t = testimonials[i];
    if (!t || !quoteEl || !nameEl || !roleEl) return;

    if (cardEl && !prefersReduced) {
      cardEl.style.opacity = '0.0';
      cardEl.style.transform = 'translateY(6px)';
      setTimeout(() => {
        quoteEl.textContent = t.quote;
        nameEl.textContent = t.name;
        roleEl.textContent = t.role;
        cardEl.style.opacity = '1';
        cardEl.style.transform = 'translateY(0)';
      }, 120);
    } else {
      quoteEl.textContent = t.quote;
      nameEl.textContent = t.name;
      roleEl.textContent = t.role;
    }
  };

  const next = () => {
    idx = (idx + 1) % testimonials.length;
    renderTestimonial(idx);
  };

  const prev = () => {
    idx = (idx - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(idx);
  };

  const startAuto = () => {
    if (prefersReduced) return;
    stopAuto();
    timer = window.setInterval(next, 5500);
  };

  const stopAuto = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { prev(); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { next(); startAuto(); });

  renderTestimonial(idx);
  startAuto();

  // Bootstrap validation styling
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach((form) => {
    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
      }
      form.classList.add('was-validated');
    }, false);
  });
})();
