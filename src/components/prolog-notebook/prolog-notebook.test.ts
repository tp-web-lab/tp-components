import { afterEach, describe, expect, it, vi } from 'vitest';
import './prolog-notebook.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-prolog-notebook>', () => {
  it('defaults to Prolog and preserves an explicit supported language', async () => {
    const notebook = document.createElement('tp-prolog-notebook');
    document.body.append(notebook);
    expect(notebook.getAttribute('language')).toBe('prolog');
    const configured = document.createElement('tp-prolog-notebook');
    configured.setAttribute('language', 'javascript');
    document.body.append(configured);
    expect(configured.getAttribute('language')).toBe('javascript');
    vi.resetModules();
    await import('./prolog-notebook.js');
  });
});
