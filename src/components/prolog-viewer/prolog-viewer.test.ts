import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { TpPrologViewer } from './prolog-viewer.js';

beforeEach(() => vi.stubGlobal('requestAnimationFrame', vi.fn(() => 0)));
afterEach(() => { document.body.replaceChildren(); vi.unstubAllGlobals(); });

it('registers the Prolog viewer', async () => {
  document.createElement('tp-prolog-viewer');
  expect(customElements.get('tp-prolog-viewer')).toBe(TpPrologViewer);
  vi.resetModules(); await expect(import('./prolog-viewer.js')).resolves.toBeDefined();
});

it('covers named project files and viewer file resolution fallbacks', async () => {
  const viewer = document.createElement('tp-prolog-viewer') as TpPrologViewer;
  viewer.innerHTML = `
    <script type="tp/prolog" filename="">ignored.</script>
    <script type="tp/prolog" filename="/program.pl">fact(a).</script>
    <script type="tp/prolog" filename="query.pl">fact(X).</script>`;
  document.body.append(viewer);
  await Promise.resolve();
  const api = viewer as unknown as {
    getProject(): { entry?: string; query?: string; files: unknown[]; findFile(path: string): unknown };
    getViewerAdditionalFilePaths(project: { query?: string }): readonly string[];
    resolveViewerPrimaryFile(project: { entry?: string; query?: string; findFile(path: string): unknown }): string | null;
  };
  const project = api.getProject();
  expect(project.files).toHaveLength(2);
  expect(api.getViewerAdditionalFilePaths(project)).toEqual(['/query.pl']);
  expect(api.getViewerAdditionalFilePaths({})).toEqual([]);
  expect(api.resolveViewerPrimaryFile({ files: [], query: '/query.pl', findFile: () => ({}) } as never)).toBe('/query.pl');
  expect(api.resolveViewerPrimaryFile({ files: [], query: '/missing.pl', findFile: () => undefined } as never)).toBeNull();

  const mixed = document.createElement('tp-prolog-viewer') as TpPrologViewer;
  mixed.innerHTML = '<script type="tp/prolog" filename="program.pl">fact(a).</script><script type="tp/prolog">fact(X).</script>';
  document.body.append(mixed);
  await Promise.resolve();
});
