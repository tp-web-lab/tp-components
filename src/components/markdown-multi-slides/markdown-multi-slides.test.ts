import { expect, it, vi } from 'vitest';
import { TpMarkupMultiSlides } from '../markup-multi-slides/markup-multi-slides.js';
import { TpMarkdownMultiSlides } from './markdown-multi-slides.js';

it('registers the Markdown slide specialization once with a fixed language', async () => {
  const element = document.createElement('tp-markdown-multi-slides');
  expect(customElements.get('tp-markdown-multi-slides')).toBe(TpMarkdownMultiSlides);
  expect(element).toBeInstanceOf(TpMarkupMultiSlides);
  expect((element as unknown as { fixedLanguage: string }).fixedLanguage).toBe('markdown');
  vi.resetModules();
  await expect(import('./markdown-multi-slides.js')).resolves.toBeDefined();
});
