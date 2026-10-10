export function getTitleText() {
  return document.querySelector('#title')?.textContent ?? '';
}

export function setupButton() {
  const button = document.querySelector('#button');

  button?.addEventListener('click', () => {
    button.textContent = 'Clicked';
  });
}