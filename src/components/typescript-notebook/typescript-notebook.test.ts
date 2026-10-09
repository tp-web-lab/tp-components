import { afterEach, describe, expect, it, vi } from 'vitest';
import './typescript-notebook.js';

afterEach(() => document.body.replaceChildren());

describe('<tp-typescript-notebook>', () => {
  it('defaults to TypeScript and preserves an explicit supported language', async () => {
    const notebook = document.createElement('tp-typescript-notebook');
    document.body.append(notebook);
    expect(notebook.getAttribute('language')).toBe('typescript');
    const configured = document.createElement('tp-typescript-notebook');
    configured.setAttribute('language', 'prolog');
    document.body.append(configured);
    expect(configured.getAttribute('language')).toBe('prolog');
    vi.resetModules();
    await import('./typescript-notebook.js');
  });
});
