function tpTypeDocLoadComponents() {
  document.documentElement.setAttribute('data-tp-preserve-document-styles', '');

  const productionLoader = '/tp-components/tp-loader.js';
  const developmentLoader = '/tp-components/tp-loader.js';

  import(developmentLoader)
    .catch(() => import(productionLoader));
}

function tpTypeDocEnhanceHtmlExamples() {
  const examples = document.querySelectorAll('.tsd-tag-example > pre > code');

  for (const code of examples) {
    const pre = code.parentElement;
    if (pre === null) continue;

    const source = code.textContent?.trim();
    if (source === undefined || source === '') continue;
    const htmlSource = source.replace(/^(?:\s*\/\/[^\n]*\n)+/, '').trim();
    if (!htmlSource.startsWith('<')) continue;

    const viewer = document.createElement('tp-html-viewer');
    const template = document.createElement('template');
    viewer.setAttribute('lite', '');
    template.innerHTML = htmlSource;
    viewer.append(template);
    pre.replaceWith(viewer);
  }
}

tpTypeDocLoadComponents();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tpTypeDocEnhanceHtmlExamples, { once: true });
} else {
  tpTypeDocEnhanceHtmlExamples();
}
