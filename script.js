/**
 * MD GOLAM SUBHANI — Portfolio JavaScript
 * Handles: Theme, Navigation, Scroll, Animations, Contact Form
 */

'use strict';

/* ─── DOM ELEMENT REFERENCES ─────────────────────────────────── */
const html            = document.documentElement;
const navbar          = document.getElementById('navbar');
const navLinks        = document.getElementById('navLinks');
const hamburger       = document.getElementById('hamburger');
const themeToggle     = document.getElementById('themeToggle');
const themeIcon       = document.getElementById('themeIcon');
const scrollProgress  = document.getElementById('scrollProgress');
const backToTop       = document.getElementById('backToTop');
const contactForm     = document.getElementById('contactForm');
const allNavLinks     = document.querySelectorAll('.nav-link');
const revealElements  = document.querySelectorAll('.reveal');
const profileImg      = document.getElementById('profile-photo');

/* ─── THEME ──────────────────────────────────────────────────── */
(function initTheme() {
  const saved = localStorage.getItem('mgs-theme') || 'dark';
  applyTheme(saved);
})();

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  localStorage.setItem('mgs-theme', theme);
}

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ─── MOBILE NAVIGATION ──────────────────────────────────────── */
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu when a nav link is clicked
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

// Keyboard close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }
});

/* ─── SCROLL EVENTS ──────────────────────────────────────────── */
let ticking = false;

function onScroll() {
  if (!ticking) {
    requestAnimationFrame(handleScrollEffects);
    ticking = true;
  }
}

function handleScrollEffects() {
  const scrollY      = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPct    = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

  // Scroll progress bar
  scrollProgress.style.width = scrollPct + '%';

  // Navbar background
  navbar.classList.toggle('scrolled', scrollY > 20);

  // Back-to-top button
  if (scrollY > 400) {
    backToTop.hidden = false;
  } else {
    backToTop.hidden = true;
  }

  // Active section highlighting
  updateActiveNavLink();

  ticking = false;
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ─── ACTIVE SECTION DETECTION ───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');

function updateActiveNavLink() {
  const scrollY = window.scrollY + 120; // offset for navbar
  let current   = '';

  sections.forEach(section => {
    const sectionTop    = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
    if (href === current) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

/* ─── BACK TO TOP ────────────────────────────────────────────── */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── SCROLL REVEAL ANIMATIONS ───────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Once revealed, no need to keep observing
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ─── CONTACT FORM ───────────────────────────────────────────── */
contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nameInput    = document.getElementById('contactName');
  const emailInput   = document.getElementById('contactEmail');
  const messageInput = document.getElementById('contactMessage');

  const name    = nameInput.value.trim();
  const email   = emailInput.value.trim();
  const message = messageInput.value.trim();

  // Basic validation
  let isValid = true;
  clearErrors();

  if (!name) {
    showError(nameInput, 'Please enter your name.');
    isValid = false;
  }

  if (!email || !isValidEmail(email)) {
    showError(emailInput, 'Please enter a valid email address.');
    isValid = false;
  }

  if (!message) {
    showError(messageInput, 'Please enter a message.');
    isValid = false;
  }

  if (!isValid) return;

  // Open mailto with form data
  const subject = encodeURIComponent('Portfolio Contact from ' + name);
  const body    = encodeURIComponent(
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n\n' +
    'Message:\n' + message
  );
  const mailto  = 'mailto:md.subhani.sot2026@pwioi.com?subject=' + subject + '&body=' + body;

  window.location.href = mailto;
});

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
  input.style.borderColor = '#f85149';
  input.style.boxShadow   = '0 0 0 3px rgba(248, 81, 73, 0.12)';

  const errorEl      = document.createElement('span');
  errorEl.className  = 'form-error';
  errorEl.textContent = message;
  errorEl.style.cssText = 'display:block; margin-top:0.35rem; font-size:0.75rem; color:#f85149; font-family:var(--font-mono);';
  errorEl.setAttribute('role', 'alert');

  const parent = input.parentElement;
  const existing = parent.querySelector('.form-error');
  if (!existing) parent.appendChild(errorEl);
}

function clearErrors() {
  const inputs = contactForm.querySelectorAll('.form-input');
  inputs.forEach(input => {
    input.style.borderColor = '';
    input.style.boxShadow   = '';
    const parent = input.parentElement;
    const error  = parent.querySelector('.form-error');
    if (error) error.remove();
  });
}

// Clear error state on input
contactForm.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('input', () => {
    input.style.borderColor = '';
    input.style.boxShadow   = '';
    const parent = input.parentElement;
    const error  = parent.querySelector('.form-error');
    if (error) error.remove();
  });
});

/* ─── PROFILE IMAGE FALLBACK ─────────────────────────────────── */
if (profileImg) {
  profileImg.addEventListener('error', () => {
    profileImg.classList.add('error');
    // Show fallback SVG when image fails
    const fallback = profileImg.nextElementSibling;
    if (fallback && fallback.classList.contains('profile-img-fallback')) {
      fallback.style.display = 'flex';
      profileImg.style.display = 'none';
    }
  });
}

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href   = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(html).getPropertyValue('--nav-height') || '68', 10);
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── INITIAL TRIGGER ────────────────────────────────────────── */
// Trigger once on page load for elements already in view
handleScrollEffects();
