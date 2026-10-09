import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { TpSqlViewer } from './sql-viewer.js';
import { TpSqlPlayground } from '../sql-playground/sql-playground.js';
import { TpSqlProject } from '../sql-playground/sql-project.js';

beforeEach(() => vi.stubGlobal('requestAnimationFrame', vi.fn(() => 0)));
afterEach(() => { document.body.replaceChildren(); vi.unstubAllGlobals(); });

it('registers the SQL viewer', async () => {
  document.createElement('tp-sql-viewer');
  expect(customElements.get('tp-sql-viewer')).toBe(TpSqlViewer);
  vi.resetModules(); await expect(import('./sql-viewer.js')).resolves.toBeDefined();
});

it('covers SQL viewer file resolution fallbacks', async () => {
  const viewer = document.createElement('tp-sql-viewer') as TpSqlViewer;
  document.body.append(viewer);
  await Promise.resolve();
  const api = viewer as unknown as {
    getProject(): { setup?: string; entry?: string; findFile(path: string): unknown };
    getViewerAdditionalFilePaths(project: { entry?: string }): readonly string[];
    resolveViewerPrimaryFile(project: { setup?: string; entry?: string; findFile(path: string): unknown }): string | null;
  };
  const project = api.getProject();
  expect(api.getViewerAdditionalFilePaths(project)).toEqual(['/query.sql']);
  expect(api.getViewerAdditionalFilePaths({})).toEqual([]);
  expect(api.resolveViewerPrimaryFile({ files: [], setup: '/tables.sql', findFile: () => ({}) } as never)).toBe('/tables.sql');
  expect(api.resolveViewerPrimaryFile({ files: [], entry: '/query.sql', findFile: () => ({}) } as never)).toBe('/query.sql');

  const baseProject = new TpSqlProject({ entry: '/query.sql', setup: '/tables.sql', files: [] });
  const createBase = vi.spyOn(TpSqlPlayground.prototype as unknown as { createInitialProject(): TpSqlProject }, 'createInitialProject')
    .mockReturnValue(baseProject);
  const missingFiles = document.createElement('tp-sql-viewer') as TpSqlViewer;
  missingFiles.innerHTML = '<script type="tp/sql">SELECT 1;</script>';
  const created = (missingFiles as unknown as { createInitialProject(): TpSqlProject }).createInitialProject();
  expect(created.findFile('/tables.sql')?.content).toBe('');
  expect(created.findFile('/query.sql')?.content).toBe('');
  createBase.mockRestore();
});
