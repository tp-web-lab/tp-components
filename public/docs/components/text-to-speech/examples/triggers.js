document.addEventListener('tp-text-to-speech-start', (event) => {
  if (!event.target.matches?.('[data-trigger-demo]')) return;
  event.target.dataset.triggerCount = '0';
  event.target.nextElementSibling.textContent = 'No trigger yet.';
});
document.addEventListener('tp-text-to-speech-trigger', (event) => {
  if (!event.target.matches?.('[data-trigger-demo]')) return;
  const count = Number(event.target.dataset.triggerCount ?? 0) + 1;
  event.target.dataset.triggerCount = String(count);
  event.target.nextElementSibling.textContent = event.detail.name + ': ' + count;
});
