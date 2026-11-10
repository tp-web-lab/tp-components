import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const base = process.env.TP_DEV_TEST_URL ?? 'http://127.0.0.1:4197';
try {
  const page = await browser.newPage({viewport: {width: 1200, height: 900}});
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (['warning', 'error'].includes(message.type())) errors.push(message.text());
  });
  for (const path of ['/', '/#/components/word-cloud/index.md']) {
    await page.goto(`${base}${path}`);
    await page.waitForTimeout(3000);
    if (path.includes('word-cloud')) await page.locator('tp-component-viewer [data-component-content]').waitFor({state: 'attached'});
  }
  await page.evaluate(async () => {
    await customElements.whenDefined('tp-textfield');
    const host = document.createElement('div');
    host.id = 'resize-regression';
    host.style.width = '500px';
    const field = document.createElement('tp-textfield');
    field.multiline = true;
    field.value = 'Short';
    host.append(field);
    document.body.append(host);
  });
  const textarea = page.locator('#resize-regression textarea');
  await textarea.scrollIntoViewIfNeeded();
  const short = (await textarea.boundingBox()).height;
  await textarea.fill('A sentence that wraps across the available width. '.repeat(20));
  await page.waitForFunction(h => document.querySelector('#resize-regression textarea').getBoundingClientRect().height > h + 50, short);
  const wide = (await textarea.boundingBox()).height;
  await page.locator('#resize-regression').evaluate(el => { el.style.width = '180px'; });
  await page.waitForFunction(h => document.querySelector('#resize-regression textarea').getBoundingClientRect().height > h + 50, wide);
  await textarea.fill('Short');
  await page.waitForFunction(h => document.querySelector('#resize-regression textarea').getBoundingClientRect().height <= h + 2, short);
  await page.locator('#resize-regression').evaluate(el => el.remove());
  await page.waitForTimeout(500);
  assert.deepEqual(errors, [], 'No browser errors or warnings during startup, viewer loading and textarea resizing');
  console.log('Passed: clean startup and word-cloud page, textarea growth, wrapping and shrink without ResizeObserver errors.');
} finally {
  await browser.close();
}
