module.exports = async function mathjaxExtension(root) {
  await loadMathJax();

  if (!window.MathJax?.typesetPromise) {
    console.warn('MathJax is not available');
    return;
  }

  await window.MathJax.typesetPromise([root]);
};

function loadMathJax() {
  return new Promise((resolve, reject) => {
    if (window.MathJax?.typesetPromise) {
      resolve();
      return;
    }

    window.MathJax = {
      loader: {
        load: ['input/tex', 'input/asciimath', 'output/svg'],
      },
      tex: {
        inlineMath: [['\\(', '\\)']],
        displayMath: [['\\[', '\\]']],
      },
      asciimath: {
        delimiters: [['`', '`']],
      },
      svg: {
        fontCache: 'global',
      },
      startup: {
        typeset: false,
        pageReady: () => {
          resolve();
          return window.MathJax.startup.defaultPageReady();
        },
      },
    };

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js';
    script.async = true;

    script.addEventListener('error', () =>
      reject(new Error('Unable to load MathJax')),
    );

    document.head.append(script);
  });
}