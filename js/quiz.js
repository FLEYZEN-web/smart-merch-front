/**
 * SMART MERCH — Interactive 3-Step Merch Quiz
 */
(function () {
  'use strict';

  const STEPS = [
    {
      id: 'business',
      title: 'Який у вас бізнес?',
      hint: 'Ніша та ваша аудиторія',
      options: [
        { value: 'barber', label: 'Барбершоп або салон' },
        { value: 'cafe', label: 'Кафе, бар або магазин' },
        { value: 'auto', label: 'Автобізнес або сервіс' },
        { value: 'other', label: 'Інше' }
      ]
    },
    {
      id: 'goal',
      title: 'Яка ваша ціль?',
      hint: 'Нові клієнти, повторні покупки чи впізнаваність',
      options: [
        { value: 'new', label: 'Залучити нових клієнтів' },
        { value: 'repeat', label: 'Повернути клієнтів на повторний візит' },
        { value: 'awareness', label: 'Підвищити впізнаваність бренду' }
      ]
    },
    {
      id: 'budget',
      title: 'Який бюджет розглядаєте?',
      hint: 'Знайдемо доречний формат і комплектацію',
      options: [
        { value: 'low', label: 'Пілотна партія (до 50 шт.)' },
        { value: 'mid', label: 'Середня партія (50–200 шт.)' },
        { value: 'high', label: 'Масштабна кампанія (200+ шт.)' },
        { value: 'unknown', label: 'Ще не визначився' }
      ]
    }
  ];

  const RECOMMENDATIONS = {
    barber: {
      title: 'Металевий гребінець',
      text: 'Компактний аксесуар на щодень. Гравіювання та QR-код ведуть до запису або спеціальної пропозиції.'
    },
    cafe: {
      title: 'Брелок-відкривачка',
      text: 'Корисна річ завжди під рукою. NFC-мітка або QR-код відкривають пропозицію бренду одним рухом.'
    },
    auto: {
      title: 'Автомобільний ароматизатор',
      text: 'Ваш бренд у кожній поїздці. QR-код нагадує про сервіс і спрощує повторний запис.'
    },
    other: {
      title: 'Індивідуальний формат',
      text: 'Підберемо річ і цифровий сценарій під вашу нішу. Залиште заявку — підготуємо концепт.'
    }
  };

  const root = document.getElementById('quiz');
  if (!root) return;

  const $ = function (sel) {
    return root.querySelector(sel);
  };

  const preview = $('[data-quiz-preview]');
  const flow = $('[data-quiz-flow]');
  const result = $('[data-quiz-result]');
  const bar = $('[data-quiz-bar]');
  const stepEl = $('[data-quiz-step]');
  const questionEl = $('[data-quiz-question]');
  const hintEl = $('[data-quiz-hint]');
  const optionsEl = $('[data-quiz-options]');
  const backBtn = $('[data-quiz-back]');
  const resultTitle = $('[data-quiz-result-title]');
  const resultText = $('[data-quiz-result-text]');
  const ctaBtn = $('[data-quiz-cta]');
  const restartBtn = $('[data-quiz-restart]');

  let current = 0;
  let answers = {};
  let latestRec = null;

  function show(view) {
    preview.hidden = view !== 'preview';
    flow.hidden = view !== 'flow';
    result.hidden = view !== 'result';
  }

  function renderStep() {
    const step = STEPS[current];
    stepEl.textContent = 'Крок ' + (current + 1) + ' з ' + STEPS.length;
    questionEl.textContent = step.title;
    hintEl.textContent = step.hint;
    bar.style.width = ((current + 1) / STEPS.length) * 100 + '%';
    optionsEl.innerHTML = '';

    step.options.forEach(function (opt) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz__option';
      btn.textContent = opt.label;
      btn.setAttribute('aria-pressed', String(answers[step.id] === opt.value));
      btn.addEventListener('click', function () {
        answers[step.id] = opt.value;
        if (current < STEPS.length - 1) {
          current += 1;
          renderStep();
        } else {
          finish();
        }
      });
      optionsEl.appendChild(btn);
    });

    questionEl.focus({ preventScroll: true });
  }

  function finish() {
    const rec = RECOMMENDATIONS[answers.business] || RECOMMENDATIONS.other;
    latestRec = rec;
    resultTitle.textContent = rec.title;
    resultText.textContent = rec.text;
    bar.style.width = '100%';
    show('result');
    resultTitle.focus({ preventScroll: true });

    document.dispatchEvent(
      new CustomEvent('smartmerch:prefill-order', {
        detail: {
          product: rec.title + ' (рекомендація квізу)',
          niche: answers.business || 'other'
        }
      })
    );
  }

  root.querySelectorAll('[data-quiz-start]').forEach(function (el) {
    el.addEventListener('click', function () {
      const idx = parseInt(el.getAttribute('data-quiz-start'), 10);
      current = isNaN(idx) ? 0 : idx;
      show('flow');
      renderStep();
    });
  });

  if (backBtn) {
    backBtn.addEventListener('click', function () {
      if (current > 0) {
        current -= 1;
        renderStep();
      } else {
        show('preview');
      }
    });
  }

  if (ctaBtn) {
    ctaBtn.addEventListener('click', function () {
      if (latestRec) {
        document.dispatchEvent(
          new CustomEvent('smartmerch:prefill-order', {
            detail: {
              product: latestRec.title + ' (рекомендація квізу)',
              niche: answers.business || 'other'
            }
          })
        );
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', function () {
      answers = {};
      current = 0;
      show('preview');
    });
  }
})();
