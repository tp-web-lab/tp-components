import { describe, expect, it, vi } from 'vitest';
import './restructuredtext-single-page.js';

describe('<tp-restructuredtext-single-page>', () => {
  it('fixes the single-page language to reStructuredText', async () => {
    const page = document.createElement('tp-restructuredtext-single-page') as unknown as { fixedLanguage: string };
    expect(page.fixedLanguage).toBe('restructuredtext');
    vi.resetModules(); await import('./restructuredtext-single-page.js');
  });
});
