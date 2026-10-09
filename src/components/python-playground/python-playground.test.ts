import { afterEach, expect, it, vi } from 'vitest';
import { buildPythonExecutionDocument } from './python-execution-document.js';
import { createPyodideRuntimeScript } from './python-runtime-script.js';
import { buildPythonTestDocument } from './python-test-document.js';
import { TpPythonPlayground, TpPythonProject } from './python-playground.js';

afterEach(() => document.body.replaceChildren());

it('covers Python project, runtime and playground contracts', async () => {
  const project = new TpPythonProject({ entry: '/main.py', test: '/main_test.py', libs: ['numpy'], files: [{ path: '/main.py', language: 'python', content: 'print(1)' }, { path: '/main_test.py', language: 'python', content: 'assert True' }] });
  expect(project.clone().toJSON()).toEqual(project.toJSON());
  expect(createPyodideRuntimeScript()).toContain('pyodide');
  expect((await buildPythonExecutionDocument(project, { scope: 'test' })).html).toContain('print(1)');
  await expect(buildPythonExecutionDocument(new TpPythonProject())).rejects.toThrow('entry');
  const element = new TpPythonPlayground(); document.body.append(element); await Promise.resolve();
  const api = element as unknown as Record<string, (...args: unknown[]) => unknown>;
  const empty = api.createEmptyProject?.() as TpPythonProject;
  expect(api.getPlaygroundKind?.()).toBe('python');
  expect(api.getLanguageIconName?.()).toBe('file_type_python');
  expect(api.resolveEntry?.(empty)).toBe('/main.py');
  expect(api.createNewProject?.()).toBeInstanceOf(TpPythonProject);
  expect(api.createClearProject?.()).toBeInstanceOf(TpPythonProject);
  expect(api.normalizeProject?.(project)).toBeInstanceOf(TpPythonProject);
  expect(await api.buildExecutionDocument?.(project)).toMatchObject({ html: expect.any(String) });
  expect(await api.buildTestDocument?.(project)).toMatchObject({ html: expect.any(String) });
  expect(api.getLanguageHelp?.()).toContain('Pyodide');
  expect(api.getAdditionalToolbarMenuItems?.()).toContain('Python libs');
  expect(api.createProjectFromExample?.({ id: 'sample', libs: ['numpy', 1] }, [])).toBeInstanceOf(TpPythonProject);
  vi.spyOn(element, 'run').mockResolvedValue();
  for (const action of ['python-libs-none', 'python-libs-numpy', 'python-libs-pandas', 'python-libs-matplotlib']) expect(api.handleAdditionalToolbarAction?.(action)).toBe(true);
  expect(api.handleAdditionalToolbarAction?.('unknown')).toBe(false);
  expect(api.normalizeProject?.(new TpPythonProject({ files: [{ path: '/fallback.py', language: 'python', content: '' }] }))).toMatchObject({ entry: '/fallback.py' });
  expect(api.resolveEntry?.(new TpPythonProject())).toBeNull();
  expect(api.createProjectFromExample?.({ label: 'plain' }, [])).toBeInstanceOf(TpPythonProject);
  expect(new TpPythonProject().clone().libs).toBeUndefined();
});

it('builds Python test documents from defaults and reports missing tests', async () => {
  const inferred = new TpPythonProject({
    files: [
      { path: '/index.html', language: 'html', content: '<main>Tests</main><script>remove()</script>' },
      { path: '/main.spec.py', language: 'python', content: 'import unittest' },
    ],
  });
  const document = await buildPythonTestDocument(inferred, { libs: ['numpy'] });
  expect(document.html).toContain('main.spec.py');
  expect(document.html).toContain('numpy');
  expect(document.html).toContain('<main>Tests</main>');

  await expect(
    buildPythonTestDocument(new TpPythonProject({ test: '/missing.py' })),
  ).rejects.toThrow('Test file not found');
  await expect(buildPythonTestDocument(new TpPythonProject())).rejects.toThrow(
    'No Python test file found',
  );
});
