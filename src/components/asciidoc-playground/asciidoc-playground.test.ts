import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildAsciidocExecutionDocument } from './asciidoc-execution-document.js';
import { TpAsciidocPlayground, TpAsciidocProject } from './asciidoc-playground.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-asciidoc-playground>', () => {
  it('builds execution documents and rejects a missing entry', async () => {
    const project = new TpAsciidocProject({
      name: 'docs', entry: '/index.adoc', attributes: { showtitle: true },
      extensions: [{ id: 'diagram', label: 'Diagram', url: '/extensions/diagram.js', enabled: true }, { id: 'disabled', label: 'Disabled', url: '/extensions/disabled.js', enabled: false }],
      files: [{ path: '/index.adoc', language: 'asciidoc', content: '= Title' }, { path: '/index.html', language: 'html', content: '<main>Shell</main><script>remove()</script>' }],
    });
    const document = await buildAsciidocExecutionDocument(project);
    expect(document.html).toContain('Title');
    expect(document.html).toContain('diagram');
    expect(project.clone().toJSON()).toEqual(project.toJSON());
    await expect(buildAsciidocExecutionDocument(new TpAsciidocProject())).rejects.toThrow('entry');
  });

  it('exercises the rendered playground and language contract', async () => {
    const element = new TpAsciidocPlayground();
    document.body.append(element);
    await Promise.resolve();
    const api = element as unknown as Record<string, (...args: unknown[]) => unknown>;
    const empty = api.createEmptyProject?.() as TpAsciidocProject;
    expect(api.getPlaygroundKind?.()).toBe('asciidoc');
    expect(api.getLanguageIconName?.()).toBe('file_type_asciidoc');
    expect(api.resolveEntry?.(empty)).toBe('/index.adoc');
    expect(api.createNewProject?.()).toBeInstanceOf(TpAsciidocProject);
    expect(api.createClearProject?.()).toBeInstanceOf(TpAsciidocProject);
    expect(api.normalizeProject?.(empty)).toBeInstanceOf(TpAsciidocProject);
    expect(api.normalizeProject?.(new TpAsciidocProject({ files: [{ path: '/fallback.asciidoc', language: 'asciidoc', content: '' }] }))).toMatchObject({ entry: '/fallback.asciidoc' });
    expect(api.resolveEntry?.(new TpAsciidocProject())).toBeNull();
    expect(await api.buildExecutionDocument?.(empty)).toMatchObject({ html: expect.any(String) });
    expect(api.getLanguageHelp?.()).toContain('AsciiDoc');
    expect(api.getAdditionalToolbarMenuItems?.()).toContain('Extensions');
    vi.spyOn(element, 'run').mockResolvedValue();
    expect(api.handleAdditionalToolbarAction?.('unknown')).toBe(false);
    expect(api.handleAdditionalToolbarAction?.('asciidoc-extension-missing')).toBe(false);
    expect(api.handleAdditionalToolbarAction?.('asciidoc-extension-none')).toBe(true);
    expect(api.handleAdditionalToolbarAction?.('asciidoc-extension-asciidoctor-glossary')).toBe(true);
    expect(api.createProjectFromExample?.({ id: 'sample', attributes: { toc: true }, extensions: [{ id: 'x', label: 'X', url: '/x.js' }, null] }, [])).toBeInstanceOf(TpAsciidocProject);
    expect(new TpAsciidocProject().clone().extensions).toBeUndefined();
    expect(element.querySelector('tp-code-editor')).not.toBeNull();
  });
});
