// Preserve a visitor's first choice even if they click while the app downloads.
window.contactFirstInput = { need: '', advance: false };
document.addEventListener('click', function (event) {
  const main = document.querySelector('main.tl-main');
  if (!main || main._x_dataStack) return;
  const first = event.target.closest('[data-tl-step="1"]');
  if (!first) return;
  const option = event.target.closest('.tl-option');
  if (option) {
    window.contactFirstInput.need = option.querySelector('span').textContent.trim();
    first.querySelectorAll('.tl-option').forEach(function (button) {
      button.classList.toggle('is-active', button === option);
      button.setAttribute('aria-checked', String(button === option));
    });
  } else if (event.target.closest('.tl-actions button') && window.contactFirstInput.need) {
    window.contactFirstInput.advance = true;
  }
});
