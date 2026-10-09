import { expect, it, vi } from 'vitest';
import { TpMarkupMultiSlides } from '../markup-multi-slides/markup-multi-slides.js';
import { TpRestructuredTextMultiSlides } from './restructuredtext-multi-slides.js';

it('registers the reStructuredText slide specialization once with a fixed language', async () => {
  const element = document.createElement('tp-restructuredtext-multi-slides');
  expect(customElements.get('tp-restructuredtext-multi-slides')).toBe(TpRestructuredTextMultiSlides);
  expect(element).toBeInstanceOf(TpMarkupMultiSlides);
  expect((element as unknown as { fixedLanguage: string }).fixedLanguage).toBe('restructuredtext');
  vi.resetModules();
  await expect(import('./restructuredtext-multi-slides.js')).resolves.toBeDefined();
});
