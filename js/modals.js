/**
 * SMART MERCH — Accessible Product Detail Modal
 */
(function () {
  'use strict';

  const PRODUCTS_DATA = {
    comb: {
      id: 'comb',
      niche: 'barber',
      category: 'Для барбершопів і салонів',
      title: 'Металевий гребінець',
      price: '850 ₴',
      isAvailable: true,
      stockText: 'В наявності',
      imageSrc: 'images/product-comb.jpg',
      imageAlt: 'Металевий гребінець із лазерним QR-гравіюванням',
      description:
        'Компактний кишеньковий гребінець із матової нержавіючої сталі 316L. На руків’ї нанесено стійке лазерне гравіювання вашого логотипу та QR-код, який веде клієнта прямо до онлайн-запису або спеціальної пропозиції у Telegram-боті.',
      specs: [
        'Сталь 316L',
        'Лазерне QR-гравіювання',
        '110 × 30 × 2 мм',
        'Вага 45 г',
        'Фірмовий чохол'
      ]
    },
    opener: {
      id: 'opener',
      niche: 'cafe',
      category: 'Для кафе, барів і магазинів',
      title: 'Брелок-відкривачка',
      price: '620 ₴',
      isAvailable: true,
      stockText: 'В наявності',
      imageSrc: 'images/product-opener.jpg',
      imageAlt: 'Сталевий NFC-брелок відкривачка',
      description:
        'Корисна річ завжди на зв’язці ключів. Корпус зі шліфованої сталі оснащено вбудованим NFC-чіпом NTAG213 із фірмовою салатовою міткою. Один дотик до смартфона без застосунків і підзарядки відкриває пропозицію вашого бренду.',
      specs: [
        'Шліфована сталь',
        'NFC NTAG213 + QR',
        'iOS та Android',
        'Без підзарядки',
        'Посилене кільце'
      ]
    },
    freshener: {
      id: 'freshener',
      niche: 'auto',
      category: 'Для автобізнесу та сервісів',
      title: 'Автомобільний ароматизатор',
      price: '390 ₴',
      isAvailable: false,
      stockText: 'Обмежена серія',
      imageSrc: 'images/product-freshener.jpg',
      imageAlt: 'Мінімалістичний графітовий автомобільний ароматизатор із QR-кодом',
      description:
        'Підвісний дифузор із пресованої графітової повсті з ароматом кедра та бергамоту. Ваш бренд залишається перед очима водія в кожній поїздці, а QR-код на корпусі спрощує повторний запис на сервіс або мийку.',
      specs: [
        'Графітова повсть',
        'Black Cedar & Bergamot',
        'До 45 днів аромату',
        'Стійкий QR-код',
        'Індивідуальне пакування'
      ]
    }
  };

  const pageShell = document.getElementById('pageShell');
  const modalOverlay = document.getElementById('productModal');
  const modalWindow = document.getElementById('modalWindow');
  const closeBtn = document.getElementById('modalCloseBtn');
  const actionCloseBtn = document.getElementById('modalActionCloseBtn');
  const orderBtn = document.getElementById('modalOrderBtn');

  const modalRubric = document.getElementById('modalRubric');
  const modalTitle = document.getElementById('modalTitle');
  const modalPrice = document.getElementById('modalPrice');
  const modalStock = document.getElementById('modalStock');
  const modalDescription = document.getElementById('modalDescription');
  const modalTags = document.getElementById('modalTags');
  const modalImg = document.getElementById('modalImg');
  const modalBadge = document.getElementById('modalMediaBadge');

  if (!modalOverlay || !modalWindow) return;

  let previousActive = null;
  let currentProduct = null;
  let mouseDownOnBackdrop = false;

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  function populateModal(product) {
    currentProduct = product;
    modalRubric.textContent = product.category;
    modalTitle.textContent = product.title;
    modalPrice.textContent = product.price;
    modalDescription.textContent = product.description;

    modalStock.textContent = product.stockText;
    modalStock.className =
      'modal-stock-status ' +
      (product.isAvailable ? 'modal-stock-status--available' : 'modal-stock-status--limited');

    modalBadge.textContent = product.stockText;
    modalImg.src = product.imageSrc;
    modalImg.alt = product.imageAlt;

    modalTags.innerHTML = '';
    product.specs.forEach(function (spec) {
      const span = document.createElement('span');
      span.className = 'modal-tag';
      span.textContent = spec;
      modalTags.appendChild(span);
    });
  }

  function openModal(productId) {
    const product = PRODUCTS_DATA[productId];
    if (!product) return;

    previousActive = document.activeElement;
    populateModal(product);

    const scrollbarWidth = getScrollbarWidth();
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }
    document.body.classList.add('modal-open');

    if (pageShell) {
      pageShell.inert = true;
      pageShell.setAttribute('aria-hidden', 'true');
    }

    modalOverlay.classList.add('is-active');
    modalOverlay.setAttribute('aria-hidden', 'false');

    requestAnimationFrame(function () {
      if (closeBtn) closeBtn.focus();
    });
  }

  function closeModal(skipFocusRestore) {
    if (!modalOverlay.classList.contains('is-active')) return;

    if (pageShell) {
      pageShell.inert = false;
      pageShell.removeAttribute('aria-hidden');
    }

    if (!skipFocusRestore && previousActive && typeof previousActive.focus === 'function') {
      previousActive.focus();
    }

    modalOverlay.setAttribute('aria-hidden', 'true');
    modalOverlay.classList.remove('is-active');
    document.body.classList.remove('modal-open');
    document.body.style.paddingRight = '';
  }

  document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      openModal(trigger.getAttribute('data-modal-open'));
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      closeModal(false);
    });
  }

  if (actionCloseBtn) {
    actionCloseBtn.addEventListener('click', function () {
      closeModal(false);
    });
  }

  modalOverlay.addEventListener('mousedown', function (event) {
    mouseDownOnBackdrop = event.target === modalOverlay;
  });

  modalOverlay.addEventListener('mouseup', function (event) {
    if (mouseDownOnBackdrop && event.target === modalOverlay) {
      closeModal(false);
    }
    mouseDownOnBackdrop = false;
  });

  if (orderBtn) {
    orderBtn.addEventListener('click', function () {
      const selected = currentProduct;
      closeModal(true);
      if (selected) {
        document.dispatchEvent(
          new CustomEvent('smartmerch:prefill-order', {
            detail: { product: selected.title, niche: selected.niche }
          })
        );
      }
      const contacts = document.getElementById('contacts');
      if (contacts) {
        contacts.scrollIntoView({ behavior: 'smooth' });
        setTimeout(function () {
          const nameInput = document.getElementById('orderName');
          if (nameInput) nameInput.focus();
        }, 450);
      }
    });
  }

  document.addEventListener('keydown', function (event) {
    if (!modalOverlay.classList.contains('is-active')) return;

    if (event.key === 'Escape') {
      closeModal(false);
      return;
    }

    if (event.key === 'Tab') {
      const focusable = Array.from(
        modalWindow.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter(function (el) {
        return el.offsetParent !== null;
      });

      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === first || !modalWindow.contains(document.activeElement)) {
          event.preventDefault();
          last.focus();
        }
      } else if (document.activeElement === last || !modalWindow.contains(document.activeElement)) {
        event.preventDefault();
        first.focus();
      }
    }
  });
})();
