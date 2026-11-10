import assert from 'node:assert/strict';
import {chromium} from '@playwright/test';
const browser=await chromium.launch();
try {
 const page=await browser.newPage();
 await page.goto(`${process.env.TP_CONTROL_TEST_URL ?? 'http://127.0.0.1:4197'}/#/components/control/index.md`);
 await page.locator('.tp-component-doc-example tp-control').waitFor();
 await page.evaluate(()=>{const scope=document.createElement('section');scope.dataset.brandInheritanceTest='';scope.innerHTML='<tp-control value="color,theme"></tp-control>';document.querySelector('.tp-markup-multi-pages-root').append(scope);});
 const control=page.locator('[data-brand-inheritance-test] tp-control');
 await control.locator(':scope > tp-icon-button button').click();
 const dropdown=control.locator(':scope > tp-dropdown');
 const accents=[];
 for(const preset of ['tp-red','tp-blue','tp-orange']) {
  await page.evaluate(preset=>{
   const globalColor=[...document.querySelectorAll('tp-color')].find(e=>!e.closest('tp-control')&&!e.hasAttribute('anchor'));
   if(!globalColor)throw new Error('Missing page color controller');
   globalColor.setAttribute('preset',preset);
  },preset);
  assert.equal(await control.locator('tp-color').getAttribute('preset'),preset);
  const state=await dropdown.evaluate(e=>{
   const root=document.querySelector('.tp-markup-multi-pages-root');
   const input=e.querySelector('input');
   const probe=document.createElement('span');probe.style.color='var(--tp-brand-seed)';root.append(probe);
   const result={menu:getComputedStyle(e).getPropertyValue('--tp-brand-seed').trim(),page:getComputedStyle(root).getPropertyValue('--tp-brand-seed').trim(),accent:getComputedStyle(input).accentColor,expected:getComputedStyle(probe).color};probe.remove();return result;
  });
  assert.equal(state.menu,state.page);
  assert.equal(state.accent,state.expected);
  accents.push(state.accent);
 }
 assert.equal(new Set(accents).size,3);
 console.log('Passed: menu checkboxes and embedded color controller follow red, blue and orange page brands.');
}finally{await browser.close();}
