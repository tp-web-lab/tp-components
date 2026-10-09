import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildSqlExecutionDocument, createSqlStorageKey } from './sql-execution-document.js';
import { TpSqlPlayground, TpSqlProject } from './sql-playground.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-sql-playground>', () => {
  it('builds SQL execution documents and project variants', async () => {
    const project = new TpSqlProject({ name: 'Data set', entry: '/query.sql', setup: '/tables.sql', files: [{ path: '/tables.sql', language: 'sql', content: 'CREATE TABLE t(id);' }, { path: '/query.sql', language: 'sql', content: 'SELECT * FROM t;' }] });
    expect(createSqlStorageKey(project)).toContain('data-set');
    const execution = await buildSqlExecutionDocument(project);
    expect(execution.html).toContain('SELECT * FROM t');
    execution.cleanup?.();
    expect(project.clone().toJSON()).toEqual(project.toJSON());
    expect(project.getActiveDatabase()).toBeUndefined();
    await expect(buildSqlExecutionDocument(new TpSqlProject())).rejects.toThrow('entry');
    await expect(buildSqlExecutionDocument(new TpSqlProject({ entry: '/query.sql', setup: '/missing.sql', files: [{ path: '/query.sql', language: 'sql', content: 'SELECT 1' }] }))).rejects.toThrow('setup');
    const stored = new TpSqlProject({ name: '', entry: '/query.sql', databases: [{ id: 'one', name: 'One', type: 'sqlite', path: '/db.sqlite' }, { id: 'two', name: 'Two', type: 'sql', path: '/setup.sql', storageKey: 'custom', active: true }], files: [{ path: '/query.sql', language: 'sql', content: 'SELECT 1' }, { path: '/setup.sql', language: 'sql', content: 'CREATE TABLE t(id)' }, { path: '/index.html', language: 'html', content: '<main>SQL</main><script>remove()</script>' }] });
    expect(stored.getActiveDatabase()?.id).toBe('two');
    expect((await buildSqlExecutionDocument(stored, { scope: 'scope' })).html).not.toContain('remove()');
    expect(stored.clone().toJSON()).toEqual(stored.toJSON());
    const legacy = new TpSqlProject({ database: { id: 'legacy', name: 'Legacy', type: 'sqlite', path: '/db.sqlite' } });
    expect(legacy.getActiveDatabase()?.id).toBe('legacy');
    expect(new TpSqlProject().clone().databases).toBeUndefined();
    expect(createSqlStorageKey({})).toContain('sql-project');
  });

  it('renders and exercises the SQL language contract', async () => {
    const element = new TpSqlPlayground();
    document.body.append(element);
    await Promise.resolve();
    const api = element as unknown as Record<string, (...args: unknown[]) => unknown>;
    const empty = api.createEmptyProject?.() as TpSqlProject;
    expect(api.getPlaygroundKind?.()).toBe('sql');
    expect(api.getLanguageIconName?.()).toBe('file_type_sql');
    expect(api.resolveEntry?.(empty)).toBe('/query.sql');
    expect(api.createNewProject?.()).toBeInstanceOf(TpSqlProject);
    expect(api.createClearProject?.()).toBeInstanceOf(TpSqlProject);
    expect(api.normalizeProject?.(empty)).toBeInstanceOf(TpSqlProject);
    expect(api.normalizeProject?.(new TpSqlProject({ files: [{ path: '/fallback.sql', language: 'sql', content: '' }] }))).toMatchObject({ entry: '/fallback.sql' });
    expect(
      api.normalizeProject?.(
        new TpSqlProject({ setup: '/tables.sql', files: [] }),
      ),
    ).toMatchObject({
      database: { id: '/tables.sql', name: 'tables.sql', active: true },
      databases: [{ id: '/tables.sql', name: 'tables.sql', active: true }],
    });
    expect(
      api.normalizeProject?.(new TpSqlProject({ setup: '/', files: [] })),
    ).toMatchObject({ database: { name: 'setup' } });
    expect(api.resolveEntry?.(new TpSqlProject())).toBeNull();
    expect(api.createProjectFromExample?.({ label: 'plain' }, [])).toBeInstanceOf(TpSqlProject);
    expect(await api.buildExecutionDocument?.(empty)).toMatchObject({ html: expect.any(String) });
    expect(api.getLanguageHelp?.()).toContain('SQL');
    expect(api.getAdditionalToolbarMenuItems?.()).toContain('Reset DB');
    expect(api.createProjectFromExample?.({ id: 'sample', database: { id: 'db', name: 'DB', type: 'sql', path: '/tables.sql' } }, [])).toBeInstanceOf(TpSqlProject);
    vi.spyOn(element, 'run').mockResolvedValue();
    vi.stubGlobal('localStorage', { removeItem: vi.fn() });
    expect(api.handleAdditionalToolbarAction?.('sql-reset-db')).toBe(true);
    expect(api.handleAdditionalToolbarAction?.('unknown')).toBe(false);
    vi.unstubAllGlobals();
  });
});
