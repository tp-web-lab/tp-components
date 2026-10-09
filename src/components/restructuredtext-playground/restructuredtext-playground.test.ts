import { afterEach, expect, it, vi } from 'vitest';
import { buildRestructuredTextExecutionDocument } from './restructuredtext-execution-document.js';
import { TpRestructuredTextPlayground, TpRestructuredTextProject } from './restructuredtext-playground.js';

afterEach(() => document.body.replaceChildren());

it('covers reStructuredText project and playground contracts', async () => {
  const project = new TpRestructuredTextProject({ entry: '/index.rst', libs: ['numpy'], extensions: [{ id: 'mathjax', label: 'MathJax', url: '/extensions/mathjax.js', enabled: true }], files: [{ path: '/index.rst', language: 'restructuredtext', content: 'Title\n=====' }, { path: '/index.html', language: 'html', content: '<main>Shell</main><script>remove()</script>' }] });
  expect(project.clone().toJSON()).toEqual(project.toJSON());
  expect((await buildRestructuredTextExecutionDocument(project)).html).toContain('Title');
  await expect(buildRestructuredTextExecutionDocument(new TpRestructuredTextProject())).rejects.toThrow('entry');
  const element = new TpRestructuredTextPlayground(); document.body.append(element); await Promise.resolve();
  const api = element as unknown as Record<string, (...args: unknown[]) => unknown>;
  const empty = api.createEmptyProject?.() as TpRestructuredTextProject;
  expect(api.getPlaygroundKind?.()).toBe('restructuredtext');
  expect(api.getLanguageIconName?.()).toBe('file_type_restructuredtext');
  expect(api.resolveEntry?.(empty)).toBe('/index.rst');
  expect(api.createNewProject?.()).toBeInstanceOf(TpRestructuredTextProject);
  expect(api.createClearProject?.()).toBeInstanceOf(TpRestructuredTextProject);
  expect(api.normalizeProject?.(project)).toBeInstanceOf(TpRestructuredTextProject);
  expect(await api.buildExecutionDocument?.(project)).toMatchObject({ html: expect.any(String) });
  expect(api.getLanguageHelp?.()).toContain('docutils');
  expect(api.getAdditionalToolbarMenuItems?.()).toContain('Extensions');
  expect(api.createProjectFromExample?.({ id: 'sample', libs: ['numpy', 1], extensions: [{ id: 'math', label: 'Math', url: '/math.js' }, null] }, [])).toBeInstanceOf(TpRestructuredTextProject);
  vi.spyOn(element, 'run').mockResolvedValue();
  expect(api.handleAdditionalToolbarAction?.('unknown')).toBe(false);
  expect(api.handleAdditionalToolbarAction?.('markup-extension-restructuredtext-math')).toBe(true);
  expect(api.normalizeProject?.(new TpRestructuredTextProject({ files: [{ path: '/fallback.rest', language: 'restructuredtext', content: '' }] }))).toMatchObject({ entry: '/fallback.rest' });
  expect(api.resolveEntry?.(new TpRestructuredTextProject())).toBeNull();
  api.afterProjectLoaded?.();
  await Promise.resolve();
});
