/**
 * SMART MERCH — Order Concept Form Validation & State Management
 */
(function () {
  'use strict';

  const form = document.getElementById('orderForm');
  const nameInput = document.getElementById('orderName');
  const nicheSelect = document.getElementById('orderNiche');
  const contactInput = document.getElementById('orderContact');
  const submitBtn = document.getElementById('orderSubmitBtn');
  const successBox = document.getElementById('orderSuccess');
  const resetBtn = document.getElementById('orderResetBtn');
  const contextPill = document.getElementById('orderContextPill');
  const contextText = document.getElementById('orderContextText');
  const contextClear = document.getElementById('orderContextClear');

  if (!form || !nameInput || !nicheSelect || !contactInput) return;

  function setFieldState(input, isValid, errorMessage) {
    const wrapper = input.closest('.form-field');
    if (!wrapper) return;
    const errorEl = wrapper.querySelector('.form-error');

    if (isValid) {
      wrapper.classList.remove('has-error');
      input.classList.remove('is-error');
      input.classList.add('is-valid');
      input.setAttribute('aria-invalid', 'false');
    } else {
      wrapper.classList.add('has-error');
      input.classList.add('is-error');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
      if (errorEl && errorMessage) {
        errorEl.textContent = errorMessage;
      }
    }
  }

  function clearFieldState(input) {
    const wrapper = input.closest('.form-field');
    if (wrapper) wrapper.classList.remove('has-error');
    input.classList.remove('is-error', 'is-valid');
    input.setAttribute('aria-invalid', 'false');
  }

  function formatUkrainianPhone(raw) {
    let digits = raw.replace(/\D/g, '');
    if (!digits) return '';
    if (digits.startsWith('0')) digits = '38' + digits;
    else if (digits.startsWith('80')) digits = '3' + digits;
    else if (!digits.startsWith('380')) digits = '380' + digits;

    digits = digits.substring(0, 12);

    let out = '+380';
    if (digits.length > 3) out += ' (' + digits.substring(3, 5);
    if (digits.length >= 5) out += ') ' + digits.substring(5, 8);
    if (digits.length >= 8) out += '-' + digits.substring(8, 10);
    if (digits.length >= 10) out += '-' + digits.substring(10, 12);
    return out;
  }

  // Format as UA phone only when user types digits or "+" (leave @username intact)
  contactInput.addEventListener('input', function () {
    const val = contactInput.value;
    if (!val.trim()) {
      clearFieldState(contactInput);
      return;
    }
    if (!val.trim().startsWith('@') && /^[+\d(\s)-]+$/.test(val)) {
      contactInput.value = formatUkrainianPhone(val);
    }
    clearFieldState(contactInput);
  });

  function validateName() {
    const val = nameInput.value.trim();
    if (val.length < 2) {
      setFieldState(nameInput, false, "Вкажіть ваше ім'я (мінімум 2 символи)");
      return false;
    }
    setFieldState(nameInput, true);
    return true;
  }

  function validateNiche() {
    if (!nicheSelect.value) {
      setFieldState(nicheSelect, false, 'Оберіть нішу вашого бізнесу');
      return false;
    }
    setFieldState(nicheSelect, true);
    return true;
  }

  function validateContact() {
    const val = contactInput.value.trim();
    if (!val) {
      setFieldState(contactInput, false, "Обов'язкове поле. Введіть телефон або @telegram");
      return false;
    }
    if (val.startsWith('@')) {
      const ok = /^@[a-zA-Z0-9_]{4,32}$/.test(val);
      if (!ok) {
        setFieldState(contactInput, false, 'Введіть коректний @username (від 4 символів)');
        return false;
      }
      setFieldState(contactInput, true);
      return true;
    }
    const digits = val.replace(/\D/g, '');
    if (digits.length !== 12) {
      setFieldState(contactInput, false, 'Введіть повний номер у форматі +380 (XX) XXX-XX-XX або @username');
      return false;
    }
    setFieldState(contactInput, true);
    return true;
  }

  nameInput.addEventListener('input', function () {
    clearFieldState(nameInput);
  });
  nicheSelect.addEventListener('change', function () {
    clearFieldState(nicheSelect);
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const okName = validateName();
    const okNiche = validateNiche();
    const okContact = validateContact();

    if (!okName || !okNiche || !okContact) {
      const firstInvalid = form.querySelector('.is-error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Loading state -> Success banner
    submitBtn.disabled = true;
    submitBtn.textContent = 'Надсилаємо...';

    setTimeout(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Надіслати →';
      form.hidden = true;
      if (successBox) {
        successBox.hidden = false;
      }
    }, 550);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      form.reset();
      clearFieldState(nameInput);
      clearFieldState(nicheSelect);
      clearFieldState(contactInput);
      if (successBox) successBox.hidden = true;
      form.hidden = false;
      nameInput.focus();
    });
  }

  // Listen for pre-fill events from Catalog cards, Product Modals, or Quiz
  document.addEventListener('smartmerch:prefill-order', function (event) {
    const detail = event.detail || {};
    if (detail.niche && nicheSelect.querySelector('option[value="' + detail.niche + '"]')) {
      nicheSelect.value = detail.niche;
      clearFieldState(nicheSelect);
    }
    if (detail.product && contextPill && contextText) {
      contextText.textContent = 'Обрано: ' + detail.product;
      contextPill.hidden = false;
    }
  });

  if (contextClear && contextPill) {
    contextClear.addEventListener('click', function () {
      contextPill.hidden = true;
    });
  }
})();
