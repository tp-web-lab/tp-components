import { describe, expect, it, vi } from 'vitest';
import './html-single-page.js';

describe('<tp-html-single-page>', () => {
  it('fixes the single-page language to native HTML', async () => {
    const page = document.createElement('tp-html-single-page') as unknown as { fixedLanguage: string };
    expect(page.fixedLanguage).toBe('html');
    vi.resetModules(); await import('./html-single-page.js');
  });
});
