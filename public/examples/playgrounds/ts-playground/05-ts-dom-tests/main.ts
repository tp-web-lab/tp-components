export function getTitleText(): string {
  return document.querySelector('#title')?.textContent ?? '';
}

export function setupButtons(): void {
  const button = document.querySelector('#button');
  const resetButton = document.querySelector('#reset');

  button?.addEventListener('click', () => {
    if (button) {
      button.textContent = 'Clicked';
      console.log('Button was clicked');
    }
  });

  resetButton?.addEventListener('click', () => {
    if (button) {
      button.textContent = 'Click me';
      console.clear();
    }
  });
}

// console.log(getTitleText());
// setupButtons();