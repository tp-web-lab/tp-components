import { afterEach, expect, it } from 'vitest';
import { TpPrologPlayground, TpPrologProject } from './prolog-playground.js';

afterEach(() => document.body.replaceChildren());

it('covers Prolog project and playground contracts', async () => {
  const project = new TpPrologProject({ entry: '/program.pl', query: '/query.pl', test: '/program.test.pl', files: [{ path: '/program.pl', language: 'prolog', content: 'fact(a).' }, { path: '/query.pl', language: 'prolog', content: 'fact(X).' }, { path: '/program.test.pl', language: 'prolog', content: ':- begin_tests(x). :- end_tests(x).' }] });
  expect(project.clone().toJSON()).toEqual(project.toJSON());
  const element = new TpPrologPlayground(); document.body.append(element); await Promise.resolve();
  const api = element as unknown as Record<string, (...args: unknown[]) => unknown>;
  const empty = api.createEmptyProject?.() as TpPrologProject;
  expect(api.getPlaygroundKind?.()).toBe('prolog');
  expect(api.getLanguageIconName?.()).toBe('file_type_prolog');
  expect(api.resolveEntry?.(empty)).toBe('/program.pl');
  expect(api.createNewProject?.()).toBeInstanceOf(TpPrologProject);
  expect(api.createClearProject?.()).toBeInstanceOf(TpPrologProject);
  expect(api.normalizeProject?.(project)).toBeInstanceOf(TpPrologProject);
  expect(await api.buildExecutionDocument?.(project)).toMatchObject({ html: expect.any(String) });
  expect(await api.buildTestDocument?.(project)).toMatchObject({ html: expect.any(String) });
  expect(api.getLanguageHelp?.()).toContain('Scryer');
  expect(api.createProjectFromExample?.({ id: 'sample', query: '/ask.pl' }, [])).toBeInstanceOf(TpPrologProject);
  expect(api.createProjectFromRepository?.({ id: 'repo' }, [])).toBeInstanceOf(TpPrologProject);
  expect(api.normalizeProject?.(new TpPrologProject({ query: '/query.pl', files: [{ path: '/program.pl', language: 'prolog', content: '' }, { path: '/query.pl', language: 'prolog', content: '' }] }))).toMatchObject({ entry: '/program.pl' });
  expect(api.resolveEntry?.(new TpPrologProject())).toBeNull();
});
