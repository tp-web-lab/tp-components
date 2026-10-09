import { afterEach, describe, expect, it, vi } from 'vitest';
import './javascript-notebook.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-javascript-notebook>', () => {
  it('defaults to JavaScript and preserves an explicit supported language', async () => {
    const notebook = document.createElement('tp-javascript-notebook');
    document.body.append(notebook);
    expect(notebook.getAttribute('language')).toBe('javascript');
    const configured = document.createElement('tp-javascript-notebook');
    configured.setAttribute('language', 'typescript');
    document.body.append(configured);
    expect(configured.getAttribute('language')).toBe('typescript');
    vi.resetModules();
    await import('./javascript-notebook.js');
  });
});
