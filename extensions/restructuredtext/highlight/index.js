module.exports = async function highlightjsExtension(root) {
  await loadStylesheet(
    'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/styles/github.min.css',
  );

  await loadScript(
    'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.11.1/build/highlight.min.js',
  );

  if (!window.hljs) {
    console.warn('highlight.js is not available');
    return;
  }

  for (const block of root.querySelectorAll('pre code')) {
    window.hljs.highlightElement(block);
  }
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

function loadStylesheet(url) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;

    link.addEventListener('load', () => resolve());
    link.addEventListener('error', () =>
      reject(new Error(`Unable to load stylesheet: ${url}`)),
    );

    document.head.append(link);
  });
}