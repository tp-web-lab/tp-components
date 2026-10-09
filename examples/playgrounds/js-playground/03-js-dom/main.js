const button = document.getElementById('btn');
const output = document.getElementById('output');

button.addEventListener('click', () => {
  output.textContent = `Clicked at ${new Date().toLocaleTimeString()}`;
  console.log('clicked');
});

