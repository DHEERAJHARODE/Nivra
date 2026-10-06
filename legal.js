/* ═══════════════════════════════════════════════════════════════
   legal.js — shared behaviour for the policy pages

   Deliberately small: these are documents, not an application.
   Navbar scroll state, the mobile menu, and the footer year.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Navbar scroll state ──────────────────────────────────────
  // Coalesced into one class update per animation frame rather than
  // running on every scroll event.
  var navbar = document.getElementById('navbar');
  if (navbar) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
    }, { passive: true });
  }

  // ── Mobile menu ──────────────────────────────────────────────
  var btn = document.getElementById('menuToggleBtn');
  var links = document.querySelector('.nav-links');
  var overlay = document.getElementById('sidebarOverlay');

  function openMenu() {
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('is-active');
    links.classList.add('is-open');
    if (overlay) overlay.classList.add('is-visible');
    document.body.classList.add('menu-open');
  }

  function closeMenu() {
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('is-active');
    links.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-visible');
    document.body.classList.remove('menu-open');
  }

  if (btn && links) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (links.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    if (overlay) overlay.addEventListener('click', closeMenu);

    // Escape closes the menu, matching the product modal on the homepage
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) closeMenu();
    });

    // Every nav link here leaves the page, so close on the way out
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 800) closeMenu();
    });
  }

  // ── Footer year, so it does not silently go stale each January ──
  var year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();

  // ── Highlight the current section in the contents list ────────
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var a = byId[entry.target.id];
        if (!a) return;
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) {
            l.style.opacity = '';
            l.style.color = '';
          });
          a.style.opacity = '1';
          a.style.color = 'var(--terracotta)';
        }
      });
    }, { rootMargin: '-100px 0px -70% 0px' });

    document.querySelectorAll('.doc section[id]').forEach(function (s) {
      observer.observe(s);
    });
  }
})();
