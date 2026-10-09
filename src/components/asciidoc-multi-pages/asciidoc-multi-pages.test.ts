import { describe, expect, it, vi } from 'vitest';
import './asciidoc-multi-pages.js';

describe('<tp-asciidoc-multi-pages>', () => {
  it('fixes the multi-page language to AsciiDoc', async () => {
    const page = document.createElement('tp-asciidoc-multi-pages') as unknown as { fixedLanguage: string };
    expect(page.fixedLanguage).toBe('asciidoc');
    vi.resetModules(); await import('./asciidoc-multi-pages.js');
  });
});
