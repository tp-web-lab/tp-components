import { describe, expect, it, vi } from 'vitest';
import './html-multi-pages.js';

describe('<tp-html-multi-pages>', () => {
  it('fixes the multi-page language to native HTML', async () => {
    const page = document.createElement('tp-html-multi-pages') as unknown as { fixedLanguage: string };
    expect(page.fixedLanguage).toBe('html');
    vi.resetModules(); await import('./html-multi-pages.js');
  });
});
