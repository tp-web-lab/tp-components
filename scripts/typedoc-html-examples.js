/**
 * Enhances generated TypeDoc HTML examples with live component previews and loads the component
 * runtime.
 *
 * Browser script configured as customJs in typedoc.json. Generate the API pages, serve the
 * documentation and open a class page containing an HTML example.
 *
 * @example
 * pnpm docs:api
 * # Start the documentation server and open /api/ in a browser.
 * pnpm dev
 */

function tpTypeDocLoadComponents() {
  document.documentElement.setAttribute('data-tp-preserve-document-styles', '');

  const productionLoader = '/tp-loader.js';
  const developmentLoader = '/src/tp-loader.ts';

  import(developmentLoader)
    .catch(() => import(productionLoader));
}

function tpTypeDocEnhanceHtmlExamples() {
  const examples = document.querySelectorAll('.tsd-tag-example > pre > code');

  for (const code of examples) {
    const pre = code.parentElement;
    if (pre === null) continue;

    // TypeDoc emits code line breaks as <br> elements. Preserve them in the viewer.
    const sourceNode = code.cloneNode(true);
    for (const lineBreak of sourceNode.querySelectorAll('br')) {
      lineBreak.replaceWith(document.createTextNode('\n'));
    }
    const source = sourceNode.textContent?.trim();
    if (source === undefined || source === '') continue;
    const htmlSource = source.replace(/^(?:\s*\/\/[^\n]*\n)+/, '').trim();
    if (!htmlSource.startsWith('<')) continue;

    const viewer = document.createElement('tp-html-viewer');
    const script = document.createElement('script');
    viewer.setAttribute('lite', '');
    viewer.setAttribute('preserve-source', '');
    script.type = 'tp/html';
    script.textContent = htmlSource;
    viewer.append(script);
    pre.replaceWith(viewer);
  }
}

tpTypeDocLoadComponents();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', tpTypeDocEnhanceHtmlExamples, { once: true });
} else {
  tpTypeDocEnhanceHtmlExamples();
}
