/** Run against Vite: Docutils requires the browser's Pyodide runtime. */
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.TP_EXAMPLES_URL ?? "http://127.0.0.1:4173";
const browser = await chromium.launch();
try {
 const page = await browser.newPage();
 await page.route("**/__pivot_checks", r => r.fulfill({contentType:"text/html", body:"<!doctype html><body></body>"}));
 await page.goto(`${base}/__pivot_checks`);
 const results = await page.evaluate(async () => {
  const { markupToHtml, htmlToMarkup } = await import("/src/utilities/markup-conversion.ts");
  const fixtures = [
   ["generated code and link classes", ".. code-block:: javascript\n\n   const n = 1;\n\n`Link <https://example.test/>`_", "pre > code.language-javascript", ".code,.literal-block,.reference,.external"],
   ["authored native classes", ".. code-block:: javascript\n   :class: literal-block\n\n   const n = 1;", "pre.literal-block > code.language-javascript", null],
   ["authored raw HTML", '.. raw:: html\n\n   <section class="sect1"><p class="title" style="color:red">Author</p><pre class="highlight code literal-block"><code data-lang="javascript">literal</code></pre><a class="reference external" href="#authored">Link</a></section>', "section.sect1 > pre.highlight.code.literal-block > code[data-lang=javascript]", null],
  ];
  const results = [];
  for (const [name, source, required, forbidden] of fixtures) {
   const html = await markupToHtml(source, "restructuredtext", document.baseURI);
   const root = new DOMParser().parseFromString(html, "text/html");
   results.push({name, html, passed: !!root.querySelector(required) && (!forbidden || !root.querySelector(forbidden)) && !html.includes("data-tp-pivot-authored")});
  }
  const source = '<p id="part">Read the <strong>guide</strong>.</p><p><a href="#part">Back</a></p>';
  const rst = htmlToMarkup(source, "restructuredtext");
  const html = await markupToHtml(rst, "restructuredtext", document.baseURI);
  const root = new DOMParser().parseFromString(html, "text/html");
  const back = htmlToMarkup(html, "restructuredtext");
  results.push({name:"native paragraph anchor round trip", html: `${rst}\n${html}\n${back}`, passed: rst.includes(".. _part:") && !rst.includes(".. p::") && root.querySelector("p#part strong")?.textContent === "guide" && !!root.querySelector('a[href="#part"]') && back.includes(".. _part:") && !back.includes(".. p::")});
  return results;
 });
 for(const result of results) assert.ok(result.passed, `${result.name}: ${result.html}`);
 console.log(`${results.length} reStructuredText pivot checks passed.`);
} finally { await browser.close(); }
