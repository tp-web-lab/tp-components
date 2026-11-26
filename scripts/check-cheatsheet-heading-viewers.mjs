import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

// Exercise real viewer iframes: comparing font properties alone misses the
// collapsed margins introduced by semantic section wrappers.
const origin = process.env.TP_DOCS_URL || 'http://127.0.0.1:4326';
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(origin);
  await page.evaluate(async () => {
    await import('/@tp/tp-components/components/markup-converter/markup-converter.js');
    document.body.replaceChildren();
    const converter = document.createElement('tp-markup-converter');
    converter.setAttribute('src', '/docs/markup-cheatsheet-examples/section-titles.html');
    document.body.append(converter);
    await converter.getMarkup();
  });
  for (const width of [1100, 420]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ['light', 'dark']) {
      await page.evaluate(theme => {
        document.documentElement.classList.remove('tp-light', 'tp-dark');
        document.documentElement.classList.add(`tp-${theme}`);
      }, theme);
      let reference;
      for (const [index, language] of ['html', 'asciidoc', 'latex', 'markdown', 'restructuredtext'].entries()) {
        await page.locator('[data-converter-formats] > [role="tablist"] [role="tab"]').nth(index).click();
        await page.waitForFunction(language => {
          const doc = document.querySelector(`tp-${language}-viewer iframe`)?.contentDocument;
          return doc?.querySelector('h3') && doc.querySelector('#tp-base-styles');
        }, language, { timeout: 60000 });
        const iframe = page.locator(`tp-${language}-viewer iframe`);
        const measure = () => iframe.evaluate(frame => {
          const doc = frame.contentDocument;
          const elements = [...doc.querySelectorAll('h1,h2,h3,p')];
          const top = elements[0].getBoundingClientRect().top;
          return elements.map(element => {
            const style = frame.contentWindow.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return {
              text: element.textContent,
              y: rect.top - top,
              height: rect.height,
              styles: Object.fromEntries(['font-size', 'font-weight', 'line-height', 'color', 'border-bottom-width', 'margin-top', 'margin-bottom'].map(name => [name, style.getPropertyValue(name)])),
            };
          });
        });
        // Wait for iframe theme propagation and font/layout stabilization.
        if (reference) {
          await page.waitForTimeout(250);
          assert.deepEqual(await measure(), reference, `${language}, ${theme}, ${width}px`);
        } else {
          await page.waitForTimeout(250);
          reference = await measure();
        }
      }
      console.log(`Heading levels: five matching viewers (${theme}, ${width}px)`);
    }
  }
} finally {
  await browser.close();
}
