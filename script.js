/* ============================================
   MOJO Portfolio — Interactions & Animations
   ============================================ */

// ---------- Vanta.js Topology Background ----------
let vantaEffect = null;

function initVanta() {
  // 手机端跳过 Vanta（省电 + 流畅）
  if (window.innerWidth < 768) {
    console.log('[Vanta] Skipped on mobile');
    document.getElementById('vanta-bg').style.display = 'none';
    return;
  }

  console.log('[Vanta] Checking availability...');
  console.log('[Vanta] p5 available:', typeof p5 !== 'undefined');
  console.log('[Vanta] VANTA available:', typeof VANTA !== 'undefined');
  console.log('[Vanta] Element:', document.getElementById('vanta-bg'));

  if (typeof VANTA === 'undefined' || typeof p5 === 'undefined') {
    console.warn('[Vanta] Library not loaded yet, retrying in 500ms...');
    setTimeout(initVanta, 500);
    return;
  }

  var el = document.getElementById('vanta-bg');
  if (!el) {
    console.error('[Vanta] #vanta-bg element not found!');
    return;
  }

  console.log('[Vanta] Starting topology effect...');
  try {
    vantaEffect = VANTA.TOPOLOGY({
      el: '#vanta-bg',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.20,
      scaleMobile: 1.10,
      color: 0xc75b3a,
      backgroundColor: 0x050508
    });
    console.log('[Vanta] Effect created successfully!');
  } catch (err) {
    console.error('[Vanta] Error creating effect:', err);
  }
}

// Try immediately; if scripts haven't loaded, retry
initVanta();

// Resize handling
window.addEventListener('resize', function () {
  if (vantaEffect) vantaEffect.resize();
});

// ---------- Custom Cursor ----------
var cursor = document.getElementById('cursor');
if (cursor) {
  var mouseX = 0, mouseY = 0;
  var cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  var hoverTargets = document.querySelectorAll('a, button, .bento-card, .float-dot, .skill-tag');
  hoverTargets.forEach(function (el) {
    el.addEventListener('mouseenter', function () { cursor.classList.add('hover'); });
    el.addEventListener('mouseleave', function () { cursor.classList.remove('hover'); });
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}


// ---------- Scroll Animations (Intersection Observer) ----------
var observerOptions = {
  root: null,
  rootMargin: '0px 0px -120px 0px',
  threshold: 0.15
};

var observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

function setupScrollAnimations() {
  // Section labels
  document.querySelectorAll('.section-label').forEach(function (el) {
    el.classList.add('animate');
    observer.observe(el);
  });

  // Namecard
  var namecard = document.querySelector('.namecard');
  if (namecard) {
    namecard.classList.add('animate');
    observer.observe(namecard);
  }

  // Bento cards
  document.querySelectorAll('.bento-card').forEach(function (el) {
    el.classList.add('animate');
    observer.observe(el);
  });

  // Quest axis cards
  document.querySelectorAll('.axis-card').forEach(function (el, i) {
    el.classList.add('animate');
    el.style.transitionDelay = (i * 0.2) + 's';
    observer.observe(el);
  });

  // Skills overview
  var skillsOverview = document.querySelector('.skills-overview');
  if (skillsOverview) {
    skillsOverview.classList.add('animate');
    observer.observe(skillsOverview);
  }

  // Awards
  document.querySelectorAll('.award').forEach(function (el, i) {
    el.classList.add('animate');
    el.style.transitionDelay = (i * 0.05) + 's';
    observer.observe(el);
  });

  // Contact email
  var contactEl = document.querySelector('.contact-email');
  if (contactEl) {
    contactEl.classList.add('animate');
    observer.observe(contactEl);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupScrollAnimations);
} else {
  setupScrollAnimations();
}


// ---------- Floating Nav + Hero Parallax ----------
var heroContent = document.querySelector('.hero-content');
var heroEl = document.getElementById('hero');
var floatNav = document.getElementById('float-nav');
var floatDots = document.querySelectorAll('.float-dot');
var sections = document.querySelectorAll('section, footer');
var sectionIds = [];

// Collect section IDs
sections.forEach(function (sec) {
  if (sec.id) sectionIds.push(sec.id);
});

window.addEventListener('scroll', function () {
  var scrollY = window.scrollY;
  var heroHeight = heroEl ? heroEl.offsetHeight : window.innerHeight;

  // --- Floating Nav visibility ---
  if (floatNav) {
    if (scrollY > heroHeight * 0.5) {
      floatNav.classList.add('visible');
    } else {
      floatNav.classList.remove('visible');
    }
  }

  // --- Active dot ---
  var current = sectionIds[0] || 'hero';
  sections.forEach(function (sec) {
    if (!sec.id) return;
    var top = sec.offsetTop;
    var height = sec.offsetHeight;
    if (scrollY >= top - height * 0.4) {
      current = sec.id;
    }
  });

  floatDots.forEach(function (dot) {
    dot.classList.remove('active');
    if (dot.getAttribute('data-section') === current) {
      dot.classList.add('active');
    }
  });

  // --- Hero parallax ---
  if (!heroContent || !heroEl) return;
  var fadeStart = heroHeight * 0.35;

  if (scrollY < fadeStart) {
    heroContent.style.opacity = 1;
    heroContent.style.transform = 'translateY(' + (scrollY * 0.2) + 'px)';
  } else if (scrollY < heroHeight) {
    var progress = (scrollY - fadeStart) / (heroHeight - fadeStart);
    heroContent.style.opacity = Math.max(1 - progress * 1.3, 0).toFixed(2);
    heroContent.style.transform = 'translateY(' + (scrollY * 0.3) + 'px)';
  }
});


// ---------- Bento Card Click ----------
document.querySelectorAll('.bento-card').forEach(function (card) {
  card.addEventListener('click', function () {
    var project = card.dataset.project;
    var title = (card.querySelector('.card-title') || {}).textContent || '';
    console.log('Project ' + project + ': ' + title);
  });
});
