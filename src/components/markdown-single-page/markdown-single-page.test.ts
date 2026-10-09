import { describe, expect, it, vi } from 'vitest';
import './markdown-single-page.js';

describe('<tp-markdown-single-page>', () => {
  it('fixes the single-page language to Markdown', async () => {
    const page = document.createElement('tp-markdown-single-page') as unknown as { fixedLanguage: string };
    expect(page.fixedLanguage).toBe('markdown');
    vi.resetModules(); await import('./markdown-single-page.js');
  });
});
