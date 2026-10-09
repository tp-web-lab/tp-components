module.exports = async function sphinxDesignExtension(root) {
  registerStyles();

  for (const container of root.querySelectorAll('.container')) {
    container.classList.add('tp-rst-container');
  }

  for (const card of root.querySelectorAll('.sd-card')) {
    card.classList.add('tp-rst-card');
  }
};

function registerStyles() {
  if (document.getElementById('tp-rst-sphinx-design-styles')) {
    return;
  }

  const style = document.createElement('style');
  style.id = 'tp-rst-sphinx-design-styles';
  style.textContent = `
.tp-rst-grid {
  display: grid;
  gap: 1rem;
  margin-block: 1rem;
}

.tp-rst-grid-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.tp-rst-grid-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.tp-rst-grid-4 {
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.tp-rst-card {
  border: 1px solid color-mix(in srgb, CanvasText 18%, transparent);
  border-radius: 0.75rem;
  padding: 1rem;
  background: Canvas;
}

.tp-rst-card-title {
  font-weight: 700;
  margin-block-end: 0.5rem;
}

@media (max-width: 700px) {
  .tp-rst-grid-2,
  .tp-rst-grid-3,
  .tp-rst-grid-4 {
    grid-template-columns: 1fr;
  }
}
`;
  document.head.append(style);
}