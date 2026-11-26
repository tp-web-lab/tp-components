import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const browser = await chromium.launch();
try {
 const page = await browser.newPage();
 await page.route("**/__math_layout", route => route.fulfill({contentType:"text/html",body:'<!doctype html><body><main style="width:100%;max-width:900px;margin:auto"></main></body>'}));
 await page.goto(`${process.env.TP_TEST_BASE_URL ?? "http://127.0.0.1:4173"}/__math_layout`);
 await page.evaluate(async () => {
  await import("/src/components/math/math.ts");
  const sources = [String.raw`\begin{equation}x^2+1\tag{1.1}\end{equation}`,String.raw`\begin{align}x&=1\tag{2.1}\\y&=2\tag{2.2}\end{align}`,"x^2+1"];
  for (const value of sources) {
   const math=document.createElement("tp-math");
   math.setAttribute("displaystyle","");math.setAttribute("value",value);
   document.querySelector("main").append(math);
  }
 });
 await page.waitForFunction(()=>document.querySelectorAll('tp-math mjx-container').length===3,{},{timeout:90000});
 for(const width of [1280,760,420,1280]) {
  await page.setViewportSize({width,height:800});
  const geometry=await page.locator('tp-math').evaluateAll(nodes=>nodes.map(node=>{
   const host=node.getBoundingClientRect();const container=node.querySelector('mjx-container');const box=container.getBoundingClientRect();
   const svg=container.querySelector('svg');
   const nested=[...svg.querySelectorAll('svg')].map(el=>el.getBoundingClientRect());
   return {host:host.width,width:box.width,center:Math.abs((box.left+box.right-host.left-host.right)/2),full:container.getAttribute('width')==='full',right:nested.length?Math.max(...nested.map(rect=>rect.right))-host.right:null};
  }));
  for(const row of geometry.slice(0,2)){assert.equal(row.full,true);assert.ok(Math.abs(row.width-row.host)<1);assert.ok(Math.abs(row.right)<4,JSON.stringify(row));}
  assert.equal(geometry[2].full,false);assert.ok(geometry[2].width<geometry[2].host);assert.ok(geometry[2].center<1);
  console.log(width,geometry);
 }
 assert.equal(await page.locator('[data-mml-node="merror"]').count(),0);
} finally { await browser.close(); }
