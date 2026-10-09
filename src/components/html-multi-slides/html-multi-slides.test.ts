import { expect, it, vi } from 'vitest';
import { TpMarkupMultiSlides } from '../markup-multi-slides/markup-multi-slides.js';
import { TpHtmlMultiSlides } from './html-multi-slides.js';

it('registers the HTML slide specialization once with a fixed language', async () => {
  const element = document.createElement('tp-html-multi-slides');
  expect(customElements.get('tp-html-multi-slides')).toBe(TpHtmlMultiSlides);
  expect(element).toBeInstanceOf(TpMarkupMultiSlides);
  expect((element as unknown as { fixedLanguage: string }).fixedLanguage).toBe('html');
  vi.resetModules();
  await expect(import('./html-multi-slides.js')).resolves.toBeDefined();
});
