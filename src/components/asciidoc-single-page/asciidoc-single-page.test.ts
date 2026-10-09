import { describe, expect, it, vi } from 'vitest';
import './asciidoc-single-page.js';

describe('<tp-asciidoc-single-page>', () => {
  it('fixes the single-page language to AsciiDoc', async () => {
    const page = document.createElement('tp-asciidoc-single-page') as unknown as { fixedLanguage: string };
    expect(page.fixedLanguage).toBe('asciidoc');
    vi.resetModules(); await import('./asciidoc-single-page.js');
  });
});
