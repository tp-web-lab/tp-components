import { afterEach, expect, it, vi } from 'vitest';
import { buildMarkdownExecutionDocument } from './markdown-execution-document.js';
import { TpMarkdownPlayground, TpMarkdownProject } from './markdown-playground.js';

afterEach(() => document.body.replaceChildren());

it('covers Markdown project and playground contracts', async () => {
  const project = new TpMarkdownProject({ entry: '/index.md', extensions: [{ id: 'math', label: 'Math', url: '/extensions/math.js', enabled: true }], files: [{ path: '/index.md', language: 'markdown', content: '# Title' }] });
  expect(project.clone().toJSON()).toEqual(project.toJSON());
  expect((await buildMarkdownExecutionDocument(project)).html).toContain('Title');
  await expect(buildMarkdownExecutionDocument(new TpMarkdownProject())).rejects.toThrow('entry');
  const element = new TpMarkdownPlayground(); document.body.append(element); await Promise.resolve();
  const api = element as unknown as Record<string, (...args: unknown[]) => unknown>;
  const empty = api.createEmptyProject?.() as TpMarkdownProject;
  expect(api.getPlaygroundKind?.()).toBe('markdown');
  expect(api.getLanguageIconName?.()).toBe('file_type_markdown');
  expect(api.resolveEntry?.(empty)).toBe('/index.md');
  expect(api.createNewProject?.()).toBeInstanceOf(TpMarkdownProject);
  expect(api.createClearProject?.()).toBeInstanceOf(TpMarkdownProject);
  expect(api.normalizeProject?.(empty)).toBeInstanceOf(TpMarkdownProject);
  expect(await api.buildExecutionDocument?.(empty)).toMatchObject({ html: expect.any(String) });
  expect(api.getLanguageHelp?.()).toContain('Markdown');
  expect(api.getAdditionalToolbarMenuItems?.()).toContain('Extensions');
  expect(api.createProjectFromExample?.({ id: 'sample', extensions: [{ id: 'math', label: 'Math', url: '/math.js' }, false] }, [])).toBeInstanceOf(TpMarkdownProject);
  vi.spyOn(element, 'run').mockResolvedValue();
  expect(api.handleAdditionalToolbarAction?.('unknown')).toBe(false);
  expect(api.handleAdditionalToolbarAction?.('markup-extension-markdown-math')).toBe(true);
  expect(api.normalizeProject?.(new TpMarkdownProject({ files: [{ path: '/fallback.markdown', language: 'markdown', content: '' }] }))).toMatchObject({ entry: '/fallback.markdown' });
  expect(api.resolveEntry?.(new TpMarkdownProject())).toBeNull();
});
