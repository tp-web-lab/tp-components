/**
 * Trace example loading on production Lighthouse fixtures in a fresh Chromium
 * context per page. Keep normal caching within a visit; record CDP transfer
 * bytes, initiator stacks and frame identities rather than estimating savings.
 *
 * Start a production preview separately, then run:
 * node scripts/trace-example-loading.mjs http://127.0.0.1:4176 config/example-loading-latest.json
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '@playwright/test';

const baseUrl = process.argv[2] ?? 'http://127.0.0.1:4176';
const output = path.resolve(process.argv[3] ?? 'config/example-loading-latest.json');
const viewport = { width: 412, height: 823 };
const browser = await chromium.launch();
const report = {
  generatedAt: new Date().toISOString(),
  browser: browser.version(),
  method: 'Production fixtures, fresh context per page, normal cache within each visit, no CPU/network throttling. Phases wait up to 20 seconds for a 1-second quiet period in the observed CDP network stream; incomplete requests and idle timeouts are retained. Transfer bytes are CDP encodedDataLength; they are not predicted savings or Lighthouse scores.',
  baseUrl, viewport, pages: [],
};

async function snapshot(page) {
  const elements = await page.evaluate(() => {
    const describe = (element) => {
      const rect = element.getBoundingClientRect();
      return {
        tag: element.localName, src: element.getAttribute('src'),
        documentTop: Math.round(rect.top + scrollY), viewportTop: Math.round(rect.top),
        height: Math.round(rect.height), hidden: Boolean(element.closest('[hidden]')),
        inViewport: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight,
        ready: element.hasAttribute('data-tp-viewer-ready'),
        editors: element.querySelectorAll('tp-code-editor').length,
        nativeFrames: element.querySelectorAll('iframe').length,
      };
    };
    return {
      scrollY, viewportHeight: innerHeight,
      viewers: [...document.querySelectorAll('tp-html-viewer,tp-markdown-viewer,tp-asciidoc-viewer,tp-restructuredtext-viewer')].map(describe),
      inclusions: [...document.querySelectorAll('tp-asciidoc[src],tp-restructuredtext[src],tp-include[src]')].map(describe),
      editors: [...document.querySelectorAll('tp-code-editor')].map(describe),
      embeddedDocuments: [...document.querySelectorAll('tp-iframe')].map(describe),
    };
  });
  // Read same-origin frame DOM from the parent: a hidden, navigated-away frame
  // may have no execution context on which Playwright can evaluate JavaScript.
  const frames = await page.evaluate(() => {
    const result = [];
    const visit = (doc, depth) => {
      if (depth > 10) return;
      for (const iframe of doc.querySelectorAll('iframe')) {
        const host = {
          viewer: iframe.closest('tp-html-viewer,tp-markdown-viewer,tp-asciidoc-viewer,tp-iframe')?.localName ?? null,
          src: iframe.getAttribute('src'), srcdoc: iframe.hasAttribute('srcdoc'),
        };
        try {
          const child = iframe.contentDocument;
          result.push({ depth, host, url: child?.URL ?? null, title: child?.title ?? null,
            editors: child?.querySelectorAll('tp-code-editor').length ?? 0,
            documentPages: child?.querySelectorAll('tp-markup-single-page').length ?? 0 });
          if (child) visit(child, depth + 1);
        } catch (error) {
          result.push({ depth, host, unavailable: String(error) });
        }
      }
    };
    visit(document, 0);
    return result;
  });
  return { ...elements, frames };
}

try {
  for (const name of ['code-editor', 'markup-multi-pages']) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.setDefaultNavigationTimeout(30000);
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Page.enable');
    let phase = 'initial';
    const requests = [];
    const pending = new Map();
    const inFlight = new Set();
    let lastNetworkActivity = Date.now();
    const frameEvents = [];
    cdp.on('Page.frameNavigated', ({ frame }) => frameEvents.push({ phase, id: frame.id, parentId: frame.parentId, url: frame.url }));
    cdp.on('Network.requestWillBeSent', (event) => {
      lastNetworkActivity = Date.now();
      inFlight.add(event.requestId);
      const stack = [];
      for (let current = event.initiator.stack; current; current = current.parent) {
        stack.push(...current.callFrames.map(({ functionName, url, lineNumber, columnNumber }) => ({ functionName, url, lineNumber, columnNumber })));
      }
      const entry = {
        phase, url: event.request.url, frameId: event.frameId,
        resourceType: event.type, initiatorType: event.initiator.type,
        initiatorUrl: event.initiator.url ?? stack[0]?.url ?? null,
        initiatorStack: stack, wallTime: event.wallTime,
      };
      requests.push(entry);
      pending.set(event.requestId, entry);
    });
    cdp.on('Network.responseReceived', ({ requestId, response }) => {
      Object.assign(pending.get(requestId) ?? {}, {
        status: response.status, mimeType: response.mimeType,
        fromDiskCache: response.fromDiskCache ?? false,
        fromServiceWorker: response.fromServiceWorker ?? false,
      });
    });
    cdp.on('Network.loadingFinished', ({ requestId, encodedDataLength }) => {
      lastNetworkActivity = Date.now();
      inFlight.delete(requestId);
      Object.assign(pending.get(requestId) ?? {}, { transferBytes: encodedDataLength, completed: true });
    });
    cdp.on('Network.loadingFailed', ({ requestId, errorText }) => {
      lastNetworkActivity = Date.now();
      inFlight.delete(requestId);
      Object.assign(pending.get(requestId) ?? {}, { error: errorText });
    });
    const result = { name, url: new URL(`/lighthouse/single-page-${name}.html`, baseUrl).href, phases: [], requests, frameEvents };
    const settle = async () => {
      console.log(`${name}: settling ${phase}`);
      const deadline = Date.now() + 20000;
      while ((inFlight.size > 0 || Date.now() - lastNetworkActivity < 1000) && Date.now() < deadline) {
        await page.waitForTimeout(100);
      }
      const networkIdle = inFlight.size === 0 && Date.now() - lastNetworkActivity >= 1000;
      const current = requests.filter((entry) => entry.phase === phase);
      result.phases.push({
        name: phase, networkIdle, requestCount: current.length,
        unfinishedRequests: current.filter((entry) => !entry.completed && !entry.error).map((entry) => entry.url),
        transferBytes: current.reduce((sum, entry) => sum + (entry.transferBytes ?? 0), 0),
        snapshot: await snapshot(page),
      });
    };
    try {
      await page.goto(result.url);
      await page.locator('tp-markup-single-page h1').first().waitFor();
      await settle();
      const viewer = page.locator('tp-html-viewer').first();
      phase = 'scroll-to-examples';
      console.log(`${name}: ${phase}`);
      await page.locator('tp-include[src*="examples/examples.html"]').first().scrollIntoViewIfNeeded();
      await viewer.waitFor();
      await viewer.scrollIntoViewIfNeeded();
      await settle();
      phase = 'show-code';
      console.log(`${name}: ${phase}`);
      await viewer.getByRole('button', { name: 'Show code', exact: true }).click();
      await viewer.locator('tp-code-editor .cm-content').waitFor({ state: 'visible' });
      await settle();
      phase = 'select-asciidoc';
      console.log(`${name}: ${phase}`);
      await viewer.locator('xpath=ancestor::tp-tabs[1]').locator(':scope > [data-tp-tablist] > [role="tab"]').nth(1).click();
      await page.locator('tp-asciidoc-viewer[data-tp-viewer-ready]').first().waitFor();
      await settle();
      report.pages.push(result);
      console.log(`${name}: ${result.phases.map((item) => `${item.name}=${item.requestCount} requests/${item.transferBytes} bytes`).join(', ')}`);
    } finally {
      await context.close();
    }
  }
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Saved ${output}`);
} finally {
  await browser.close();
}
