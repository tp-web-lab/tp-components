import { expect, it, vi } from 'vitest';
import { TpJavascriptViewer } from './javascript-viewer.js';

it('registers the compact JavaScript viewer', async () => {
  const element = document.createElement('tp-javascript-viewer');
  expect(customElements.get('tp-javascript-viewer')).toBe(TpJavascriptViewer);
  expect((element as unknown as { viewerMode: boolean }).viewerMode).toBe(true);
  vi.resetModules(); await expect(import('./javascript-viewer.js')).resolves.toBeDefined();
});
