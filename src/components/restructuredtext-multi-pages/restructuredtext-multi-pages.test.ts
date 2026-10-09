import { describe, expect, it, vi } from 'vitest';
import './restructuredtext-multi-pages.js';

describe('<tp-restructuredtext-multi-pages>', () => {
  it('fixes the multi-page language to reStructuredText', async () => {
    const page = document.createElement('tp-restructuredtext-multi-pages') as unknown as { fixedLanguage: string };
    expect(page.fixedLanguage).toBe('restructuredtext');
    vi.resetModules(); await import('./restructuredtext-multi-pages.js');
  });
});
