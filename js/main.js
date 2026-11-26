/**
 * SMART MERCH — Header Navigation & Scroll Spy
 */
(function () {
  'use strict';

  const header = document.getElementById('header');
  if (!header) return;

  const burger = header.querySelector('.header__burger');
  const navLinks = header.querySelectorAll('.header__link[href^="#"]');

  function setMenuOpen(isOpen) {
    header.classList.toggle('is-open', isOpen);
    if (burger) {
      burger.setAttribute('aria-expanded', String(isOpen));
      burger.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      setMenuOpen(!header.classList.contains('is-open'));
    });
  }

  header.querySelectorAll('.header__nav a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && header.classList.contains('is-open')) {
      setMenuOpen(false);
    }
  });

  // Active nav highlight on scroll
  const sections = Array.from(navLinks)
    .map(function (link) {
      const id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const activeId = '#' + entry.target.id;
            navLinks.forEach(function (link) {
              link.classList.toggle('is-active', link.getAttribute('href') === activeId);
            });
          }
        });
      },
      { rootMargin: '-35% 0px -55% 0px' }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  // Catalog "Замовити" quick buttons -> pre-select product in form
  document.querySelectorAll('[data-select-product]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const productLabel = btn.getAttribute('data-select-product');
      const nicheValue = btn.getAttribute('data-select-niche') || '';
      document.dispatchEvent(
        new CustomEvent('smartmerch:prefill-order', {
          detail: { product: productLabel, niche: nicheValue }
        })
      );
    });
  });
})();
