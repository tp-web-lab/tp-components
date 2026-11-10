import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser = await chromium.launch();
try {
  const page = await browser.newPage({viewport:{width:1200,height:900}});
  const diagnostics = [];
  page.on('pageerror', error => diagnostics.push(error.message));
  page.on('console', message => {
    if (['warning','error'].includes(message.type())) diagnostics.push(message.text());
  });
  await page.goto(`${process.env.TP_RST_DOC_TEST_URL ?? 'http://127.0.0.1:4173'}/#/components/restructuredtext-viewer/index.md`);
  const intro = page.locator('.tp-component-doc-example > tp-restructuredtext-viewer');
  await intro.waitFor();
  const preview = intro.frameLocator('iframe').first();
  await preview.getByRole('heading',{name:'Live reStructuredText'}).waitFor({timeout:60000});
  assert.equal(await preview.locator('li').count(),2);
  assert.equal(await page.locator('#component-viewer').count(),1);
  assert.equal(await page.locator('#usage').count(),1);
  for (const label of ['tp-asciidoc','tp-latex','tp-markdown','tp-restructuredtext','HTML']) {
    await page.getByRole('tab',{name:new RegExp(`(?:^| )${label}$`)}).last().click();
    await page.waitForTimeout(700);
  }
  assert.deepEqual(diagnostics,[]);
  console.log('Passed: intact RST heading and list, separate documentation sections, five example tabs and no browser/parser diagnostics.');
} finally {await browser.close();}
