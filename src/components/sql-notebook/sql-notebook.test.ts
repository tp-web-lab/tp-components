import { afterEach, describe, expect, it, vi } from 'vitest';
import './sql-notebook.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-sql-notebook>', () => {
  it('defaults to SQL and preserves an explicit supported language', async () => {
    const notebook = document.createElement('tp-sql-notebook');
    document.body.append(notebook);
    expect(notebook.getAttribute('language')).toBe('sql');
    const configured = document.createElement('tp-sql-notebook');
    configured.setAttribute('language', 'python');
    document.body.append(configured);
    expect(configured.getAttribute('language')).toBe('python');
    vi.resetModules();
    await import('./sql-notebook.js');
  });
});
