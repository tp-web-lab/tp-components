import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { chromium, firefox, webkit } from "@playwright/test";

const runtimes = { chromium, firefox, webkit };
const name = process.env.TP_TEST_BROWSER || "chromium";
const browser = await runtimes[name].launch();
try {
 const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
 page.setDefaultTimeout(20000);
 const errors=[];
 page.on("pageerror", error=>errors.push(error.message));
 await page.route("**/__diff_editor_test", route=>route.fulfill({contentType:"text/html",body:"<!doctype html><body>"}));
 await page.goto(`${process.env.TP_TEST_BASE_URL || "http://127.0.0.1:4173"}/__diff_editor_test`);
 await page.evaluate(async()=>{await import("/src/components/diff-code-editor/diff-code-editor.ts");});
 await page.evaluate(html=>{document.body.innerHTML=html;},readFileSync("public/docs/components/diff-code-editor/examples/introduction.html","utf8"));
 await page.waitForFunction(()=>document.querySelector("tp-diff-code-editor")?.differenceCount===2);
 assert.equal(await page.locator('[data-diff-action="reset"] svg').count(),1);
 assert.equal(await page.locator('tp-code-editor[toolbar]').count(),2);
 assert.deepEqual(await page.locator('[data-tp-code-editor-language-badge]').evaluateAll(nodes=>nodes.map(node=>node.nextElementSibling.textContent)),["before.js","after.js"]);
 for(const width of [1280,480,900]) {
  await page.setViewportSize({width,height:800});
  await page.waitForFunction(()=>{
   const content=[...document.querySelectorAll('.cm-content')];
   return Math.abs(content[0].getBoundingClientRect().top-content[1].getBoundingClientRect().top)<2;
  });
 }
 await page.locator('.cm-content').first().click();
 await page.keyboard.press('F1');
 await page.waitForFunction(()=>{
  const content=[...document.querySelectorAll('.cm-content')];
  return Math.abs(content[0].getBoundingClientRect().top-content[1].getBoundingClientRect().top)<2;
 });
 await page.keyboard.press('F1');
 console.log("Toolbars aligned");
 const small=await page.locator('tp-diff-code-editor').evaluate(el=>el.getBoundingClientRect().height);
 await page.locator('tp-diff-code-editor').evaluate(el=>el.setValue('left',Array.from({length:80},(_,i)=>`line ${i}`).join('\n')));
 await page.waitForFunction(height=>document.querySelector('tp-diff-code-editor').getBoundingClientRect().height>height+500,small);
 console.log("Growth passed");
 await page.locator('[data-diff-action="reset"] button').click();
 await page.waitForFunction(height=>document.querySelector('tp-diff-code-editor').getBoundingClientRect().height<height+10,small);
 await page.locator('[data-diff-action="copy-left"] button').click();
 await page.locator('[data-diff-action="copy-left"] button').click();
 await page.waitForFunction(()=>document.querySelector('tp-diff-code-editor').differenceCount===0);
 for(const mode of ['dark','light']) {
  await page.locator('tp-theme').evaluateAll((nodes,mode)=>nodes.forEach(node=>node.setAttribute('mode',mode)),mode);
  await page.screenshot({path:`/tmp/diff-editor-${name}-${mode}.png`});
 }
 await page.locator('tp-diff-code-editor').evaluate(el=>{
  const code=Array.from({length:160},(_,i)=>`line ${i}`).join('\n');
  el.setValue('left',code);el.setValue('right',code.replace('line 40','added line\nline 40'));
  el.style.setProperty('--tp-diff-max-height','320px');
 });
 await page.waitForFunction(()=>{
  const viewport=document.querySelector('.cm-mergeView');
  return viewport.clientHeight===320 && viewport.scrollHeight>1000;
 });
 for(const side of [0,1]) {
  await page.locator('.cm-content').nth(side).hover({position:{x:60,y:100}});
  const before=await page.locator('.cm-mergeView').evaluate(el=>el.scrollTop);
  await page.mouse.wheel(0,300);
  await page.waitForFunction(before=>document.querySelector('.cm-mergeView').scrollTop>before,before);
  const aligned=await page.locator('.cm-content').evaluateAll(nodes=>Math.abs(nodes[0].getBoundingClientRect().top-nodes[1].getBoundingClientRect().top)<2);
  assert.ok(aligned,'Both sources share the same vertical scroll offset');
 }
 console.log('Bounded shared scrolling passed from both sources');
 assert.deepEqual(errors,[]);
 console.log(`${name}: toolbars, filenames, reset icon, merging, resize, growth/shrink and themes passed.`);
} finally { await browser.close(); }
