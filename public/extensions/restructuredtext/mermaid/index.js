module.exports = async function mermaidExtension(root) {
  await loadScript(
    'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js',
  );

  if (!window.mermaid) {
    console.warn('Mermaid is not available');
    return;
  }

  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
  });

  const blocks = Array.from(root.querySelectorAll('pre code.language-mermaid'));

  for (const [index, block] of blocks.entries()) {
    const source = block.textContent ?? '';

    const container = document.createElement('div');
    container.className = 'mermaid';
    container.id = `tp-mermaid-${String(index + 1)}`;
    container.textContent = source;

    const pre = block.closest('pre');

    if (pre instanceof HTMLElement) {
      pre.replaceWith(container);
    }
  }

  await window.mermaid.run({
    nodes: root.querySelectorAll('.mermaid'),
  });
};

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');

    script.src = url;
    script.async = false;

    script.addEventListener('load', () => resolve());
    script.addEventListener('error', () =>
      reject(new Error(`Unable to load script: ${url}`)),
    );

    document.head.append(script);
  });
}