import { afterEach, describe, expect, it, vi } from 'vitest';
import { TpTypescriptPlayground, TpTypescriptProject } from './typescript-playground.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-typescript-playground>', () => {
  it('covers project data and executable TypeScript documents', async () => {
    const project = new TpTypescriptProject({ name: 'ts', entry: '/main.ts', test: '/main.test.ts', importmap: { imports: {} }, files: [{ path: '/main.ts', language: 'typescript', content: 'export const n: number = 1;' }, { path: '/main.test.ts', language: 'typescript', content: 'console.assert(true);' }] });
    expect(project.clone().toJSON()).toEqual(project.toJSON());
    const element = new TpTypescriptPlayground();
    document.body.append(element);
    await Promise.resolve();
    const api = element as unknown as Record<string, (...args: unknown[]) => unknown>;
    const empty = api.createEmptyProject?.() as TpTypescriptProject;
    expect(api.getPlaygroundKind?.()).toBe('typescript');
    expect(api.getLanguageIconName?.()).toBe('file_type_typescript');
    expect(api.resolveEntry?.(empty)).toBe('/main.ts');
    expect(api.createNewProject?.()).toBeInstanceOf(TpTypescriptProject);
    expect(api.createClearProject?.()).toBeInstanceOf(TpTypescriptProject);
    expect(api.normalizeProject?.(project)).toBeInstanceOf(TpTypescriptProject);
    const execution = await api.buildExecutionDocument?.(project) as { html: string; cleanup?: () => void };
    expect(execution).toMatchObject({ html: expect.any(String) });
    execution.cleanup?.();
    expect(await api.buildTestDocument?.(project)).toMatchObject({ html: expect.any(String) });
    expect(api.getLanguageHelp?.()).toContain('TypeScript');
    expect(api.getAdditionalToolbarMenuItems?.()).toContain('Import map');
    expect(api.createProjectFromExample?.({ id: 'sample', importmap: { imports: {} } }, [])).toBeInstanceOf(TpTypescriptProject);
    vi.spyOn(element, 'run').mockResolvedValue();
    for (const action of ['typescript-importmap-lit', 'typescript-importmap-shoelace', 'typescript-importmap-none']) expect(api.handleAdditionalToolbarAction?.(action)).toBe(true);
    expect(api.handleAdditionalToolbarAction?.('unknown')).toBe(false);
    expect(api.normalizeProject?.(new TpTypescriptProject({ files: [{ path: '/fallback.ts', language: 'typescript', content: '' }] }))).toMatchObject({ entry: '/fallback.ts' });
    expect(api.resolveEntry?.(new TpTypescriptProject())).toBeNull();
    await expect(api.buildExecutionDocument?.(new TpTypescriptProject())).rejects.toThrow('entry');
    element.setAttribute('execution-scope', 'notebook');
    expect((await api.buildExecutionDocument?.(project) as { html: string }).html).toContain('notebook');
  });
});
