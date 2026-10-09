import { afterEach, describe, expect, it, vi } from 'vitest';
import './python-notebook.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-python-notebook>', () => {
  it('defaults to Python and preserves an explicit supported language', async () => {
    const notebook = document.createElement('tp-python-notebook');
    document.body.append(notebook);
    expect(notebook.getAttribute('language')).toBe('python');
    const configured = document.createElement('tp-python-notebook');
    configured.setAttribute('language', 'sql');
    document.body.append(configured);
    expect(configured.getAttribute('language')).toBe('sql');
    vi.resetModules();
    await import('./python-notebook.js');
  });
});
