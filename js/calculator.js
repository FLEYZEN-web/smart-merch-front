/**
 * SMART MERCH — Potential Revenue Calculator (100 units basis)
 */
(function () {
  'use strict';

  const UNITS = 100;
  const checkInput = document.getElementById('calcCheck');
  const convInput = document.getElementById('calcConversion');
  const checkValueEl = document.getElementById('calcCheckValue');
  const convValueEl = document.getElementById('calcConversionValue');
  const revenueEl = document.getElementById('calcRevenue');
  const formulaEl = document.getElementById('calcFormula');
  const clientsEl = document.getElementById('calcClients');

  if (!checkInput || !convInput) return;

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function paintRange(input) {
    const min = Number(input.min);
    const max = Number(input.max);
    const val = Number(input.value);
    const pct = ((val - min) / (max - min)) * 100;
    input.style.background =
      'linear-gradient(to right, #c6ff36 0%, #c6ff36 ' + pct + '%, #292e29 ' + pct + '%, #292e29 100%)';
  }

  function updateCalculator() {
    const avgCheck = Number(checkInput.value);
    const conversion = Number(convInput.value);
    const clients = Math.round((UNITS * conversion) / 100);
    const revenue = clients * avgCheck;

    checkValueEl.textContent = formatNumber(avgCheck) + ' грн';
    convValueEl.textContent = conversion + '%';
    revenueEl.textContent = formatNumber(revenue) + ' грн';
    formulaEl.textContent =
      UNITS + ' × ' + conversion + '% × ' + formatNumber(avgCheck) + ' грн = ' + formatNumber(revenue) + ' грн';

    const clientWord = clients === 1 ? 'клієнт' : clients >= 2 && clients <= 4 ? 'клієнти' : 'клієнтів';
    clientsEl.innerHTML =
      'Орієнтовно <strong>' + clients + ' ' + clientWord + '</strong> зі ' + UNITS + ' розданих брелоків';

    paintRange(checkInput);
    paintRange(convInput);
  }

  checkInput.addEventListener('input', updateCalculator);
  convInput.addEventListener('input', updateCalculator);
  updateCalculator();
})();
