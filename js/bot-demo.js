/**
 * SMART MERCH — Interactive Telegram Bot Demo
 * Mirrors Figma 09 — Telegram Bot Prototype (Share Contact -> Promo Code SMART10)
 */
(function () {
  'use strict';

  const chat = document.getElementById('botChat');
  const shareBtn = document.getElementById('botShareContactBtn');
  const resetBtn = document.getElementById('botResetBtn');
  const quickBtns = document.querySelectorAll('[data-bot-quick]');

  if (!chat || !shareBtn) return;

  let contactShared = false;

  function nowTime() {
    return new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' });
  }

  function appendMessage(role, html) {
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg--' + role;
    div.innerHTML = html + '<span class="chat-msg__time">' + nowTime() + '</span>';
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function renderInitial() {
    contactShared = false;
    shareBtn.disabled = false;
    shareBtn.textContent = 'Поділитися контактом →';
    chat.innerHTML = '';

    appendMessage(
      'bot',
      'Вітаємо! 👋 Ви отримали розумну пропозицію від <strong>Вашого бренду</strong>.'
    );
    appendMessage(
      'bot',
      'Щоб отримати персональну знижку <strong>10%</strong> на наступний візит, поділіться своїм контактом кнопкою нижче.'
    );
  }

  shareBtn.addEventListener('click', function () {
    if (contactShared) return;
    contactShared = true;
    shareBtn.disabled = true;
    shareBtn.textContent = 'Контакт передано ✓';

    appendMessage('user', '📱 +380 (67) 123-45-67<br>Олена • Контакт передано');

    setTimeout(function () {
      appendMessage(
        'bot',
        'Дякуємо! Ваш бонус — <strong>10% знижки</strong>. Покажіть цей промокод під час покупки:' +
          '<div class="promo-box">' +
          '  <span class="promo-box__code">SMART10</span>' +
          '  <button type="button" class="promo-box__copy" data-copy-promo="SMART10">Скопіювати</button>' +
          '</div>'
      );
    }, 380);
  });

  chat.addEventListener('click', function (event) {
    const copyBtn = event.target.closest('[data-copy-promo]');
    if (!copyBtn) return;
    const code = copyBtn.getAttribute('data-copy-promo');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).catch(function () {});
    }
    copyBtn.textContent = 'Скопійовано ✓';
    setTimeout(function () {
      copyBtn.textContent = 'Скопіювати';
    }, 1800);
  });

  quickBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const action = btn.getAttribute('data-bot-quick');
      appendMessage('user', btn.textContent.trim());

      setTimeout(function () {
        if (action === 'catalog') {
          appendMessage(
            'bot',
            'У лінійці SMART MERCH: сталевий гребінець з QR, NFC-брелок відкривачка та графітовий автоароматизатор. Можна брендувати під ваш стиль.'
          );
        } else if (action === 'calc') {
          appendMessage(
            'bot',
            'Мінімальна пілотна партія — від 30 штук. Для точного прорахунку заповніть форму заявки поруч 👉'
          );
        }
      }, 320);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', renderInitial);
  }

  renderInitial();
})();
