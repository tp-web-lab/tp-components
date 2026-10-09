import { expect, it, vi } from 'vitest';
import { TpMarkupMultiSlides } from '../markup-multi-slides/markup-multi-slides.js';
import { TpAsciidocMultiSlides } from './asciidoc-multi-slides.js';

it('registers the AsciiDoc slide specialization once with a fixed language', async () => {
  const element = document.createElement('tp-asciidoc-multi-slides');
  expect(customElements.get('tp-asciidoc-multi-slides')).toBe(TpAsciidocMultiSlides);
  expect(element).toBeInstanceOf(TpMarkupMultiSlides);
  expect((element as unknown as { fixedLanguage: string }).fixedLanguage).toBe('asciidoc');
  vi.resetModules();
  await expect(import('./asciidoc-multi-slides.js')).resolves.toBeDefined();
});
