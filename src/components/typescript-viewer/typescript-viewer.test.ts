import { expect, it, vi } from 'vitest';
import { TpTypescriptViewer } from './typescript-viewer.js';

it('registers the compact TypeScript viewer', async () => {
  const element = document.createElement('tp-typescript-viewer');
  expect(customElements.get('tp-typescript-viewer')).toBe(TpTypescriptViewer);
  expect((element as unknown as { viewerMode: boolean }).viewerMode).toBe(true);
  vi.resetModules(); await expect(import('./typescript-viewer.js')).resolves.toBeDefined();
});
