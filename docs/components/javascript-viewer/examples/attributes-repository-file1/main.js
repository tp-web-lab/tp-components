const app = document.querySelector('#app');

if (app instanceof HTMLElement) {
  app.textContent = 'JavaScript repository example';
}

console.log('Loaded from a JavaScript repository');
