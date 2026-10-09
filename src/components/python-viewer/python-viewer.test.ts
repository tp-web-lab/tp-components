import { expect, it, vi } from 'vitest';
import { TpPythonViewer } from './python-viewer.js';

it('registers the compact Python viewer', async () => {
  const element = document.createElement('tp-python-viewer');
  expect(customElements.get('tp-python-viewer')).toBe(TpPythonViewer);
  expect((element as unknown as { viewerMode: boolean }).viewerMode).toBe(true);
  vi.resetModules(); await expect(import('./python-viewer.js')).resolves.toBeDefined();
});
