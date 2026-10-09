/**
 * @module components/prolog-playground/execution-document-test
 * @summary Tests for Prolog playground execution document generation.
 */

import { describe, expect, it } from 'vitest';
import { buildPrologExecutionDocument } from './prolog-execution-document.js';
import { buildPrologTestDocument } from './prolog-test-document.js';
import { TpPrologProject } from './prolog-project.js';

describe('buildPrologExecutionDocument', () => {
  it('builds a Scryer Prolog document with CLPZ support', async () => {
    const document = await buildPrologExecutionDocument(
      new TpPrologProject({
        entry: '/program.pl',
        query: '/query.pl',
        files: [
          {
            path: '/program.pl',
            language: 'prolog',
            content: ':- use_module(library(clpz)).\ndigit(X) :- X in 1..9.',
          },
          {
            path: '/query.pl',
            language: 'prolog',
            content: 'digit(X).',
          },
        ],
      }),
    );

    expect(document.html).toContain('https://esm.sh/scryer');
    expect(document.html).toContain('library(clpz)');
    expect(document.html).toContain('digit(X).');
    expect(document.html).toContain('await import(scryerModuleUrl)');
    expect(document.html).toContain('scryerInitWarning');
    expect(document.html).toContain('prolog.query(createExecutableQuery(query))');
    expect(document.html).toContain('TpPlaygroundResult');
    expect(document.html).toContain('Scryer Prolog could not resolve the predicate');
  });

  it('supports a query-only project and reports an undefined predicate clearly', async () => {
    const document = await buildPrologExecutionDocument(
      new TpPrologProject({
        query: '/query.pl',
        files: [{
          path: '/query.pl',
          language: 'prolog',
          content: 'unknown_predicate(X).',
        }],
      }),
    );

    expect(document.html).toContain('Undefined predicate');
    expect(document.html).toContain('No matching definition was found');
    expect(document.html).toContain(
      'new Map([["unknown_predicate(X).","unknown_predicate"]])',
    );
  });

  it('silently accumulates program-only notebook cells for a later query', async () => {
    const scope = 'prolog-notebook-accumulation';
    const programDocument = await buildPrologExecutionDocument(
      new TpPrologProject({
        entry: '/program.pl',
        files: [{ path: '/program.pl', language: 'prolog', content: 'parent(ada, byron).' }],
      }),
      { scope, index: 0 },
    );
    const queryDocument = await buildPrologExecutionDocument(
      new TpPrologProject({
        query: '/query.pl',
        files: [{ path: '/query.pl', language: 'prolog', content: 'parent(ada, X).' }],
      }),
      { scope, index: 1 },
    );

    expect(programDocument.html).not.toContain('No Prolog query found');
    expect(programDocument.html).toContain('output.remove()');
    expect(queryDocument.html).toContain('parent(ada, byron).');
    expect(queryDocument.html).toContain('parent(ada, X).');
    expect(queryDocument.html).not.toContain('Undefined predicate "parent"');
    expect(queryDocument.html).toContain('pre[data-tp-prolog-output]');
    expect(queryDocument.html).toContain('background: transparent');
    expect(queryDocument.html).toContain('padding: 0');
    expect(queryDocument.html).not.toContain('background: #111827');
  });

  it('combines notebook facts and rules into one consultable program', async () => {
    const scope = 'prolog-notebook-grandparent';
    const programs = [
      'parent(a,b).',
      'parent(b,c).',
      'grandparent(X,Y) :- parent(X,Z), parent(Z,Y).',
    ];

    for (const [index, content] of programs.entries()) {
      await buildPrologExecutionDocument(
        new TpPrologProject({
          entry: '/program.pl',
          files: [{ path: '/program.pl', language: 'prolog', content }],
        }),
        { scope, index },
      );
    }

    const queryDocument = await buildPrologExecutionDocument(
      new TpPrologProject({
        query: '/query.pl',
        files: [{ path: '/query.pl', language: 'prolog', content: 'grandparent(X,Y).' }],
      }),
      { scope, index: 3 },
    );

    expect(queryDocument.html).toContain(
      'parent(a,b).\\n\\nparent(b,c).\\n\\ngrandparent(X,Y) :- parent(X,Z), parent(Z,Y).',
    );
    expect(queryDocument.html).toContain('/notebook-program.pl');
    expect(queryDocument.html).toContain('grandparent(X,Y).');
  });

  it('builds a Scryer Prolog test document from test directives', async () => {
    const document = await buildPrologTestDocument(
      new TpPrologProject({
        entry: '/program.pl',
        test: '/test.pl',
        files: [
          {
            path: '/program.pl',
            language: 'prolog',
            content: 'parent(john, mary).',
          },
          {
            path: '/test.pl',
            language: 'prolog',
            content: ':- test(parent_john_mary, parent(john, mary)).',
          },
        ],
      }),
    );

    expect(document.html).toContain('https://esm.sh/scryer');
    expect(document.html).toContain('await import(scryerModuleUrl)');
    expect(document.html).toContain('scryerInitWarning');
    expect(document.html).toContain('parseTestDirectives');
    expect(document.html).toContain('parent_john_mary');
    expect(document.html).toContain('Prolog tests');
  });

  it('flattens local Prolog modules before consulting sources', async () => {
    const document = await buildPrologExecutionDocument(
      new TpPrologProject({
        entry: '/program.pl',
        query: '/query.pl',
        files: [
          {
            path: '/math_utils.pl',
            language: 'prolog',
            content: `
:- module(math_utils, [square/2]).

square(X, Y) :- Y is X * X.
`.trim(),
          },
          {
            path: '/program.pl',
            language: 'prolog',
            content: `
:- use_module(math_utils).
:- use_module(library(clpz)).

score(X, Result) :- square(X, Result).
`.trim(),
          },
          {
            path: '/query.pl',
            language: 'prolog',
            content: 'score(5, X).',
          },
        ],
      }),
    );

    expect(document.html).toContain('square(X, Y)');
    expect(document.html).not.toContain('module(math_utils');
    expect(document.html).not.toContain('use_module(math_utils)');
    expect(document.html).toContain('use_module(library(clpz))');
  });

  it('injects the playground DOM module for DOM programs', async () => {
    const document = await buildPrologExecutionDocument(
      new TpPrologProject({
        entry: '/program.pl',
        query: '/query.pl',
        files: [
          {
            path: '/index.html',
            language: 'html',
            content: '<h2 id="title"></h2><button id="button"></button>',
          },
          {
            path: '/program.pl',
            language: 'prolog',
            content: `
:- use_module(library(dom)).

setup_dom :-
  get_by_id(title, Title),
  set_html(Title, 'Hello'),
  bind(Title, click, _Event, set_style(Title, color, blue)).
`.trim(),
          },
          {
            path: '/query.pl',
            language: 'prolog',
            content: 'setup_dom.',
          },
        ],
      }),
    );

    expect(document.html).toContain('tp_dom_action');
    expect(document.html).toContain('dynamic(tp_dom_action/1)');
    expect(document.html).toContain('parent_of(element(Child), element(Parent))');
    expect(document.html).toContain('create(Tag, element(Id))');
    expect(document.html).toContain('append_child(element(Parent), element(Child))');
    expect(document.html).toContain('remove_child(element(Parent), element(Child))');
    expect(document.html).toContain('replace_child(element(Parent), element(OldChild), element(NewChild))');
    expect(document.html).toContain('query_select(Selector, element(Id))');
    expect(document.html).toContain('query_select(element(Parent), Selector, element(Id))');
    expect(document.html).toContain('query_select_all(Selector, Elements)');
    expect(document.html).toContain('query_select_all(element(Parent), Selector, Elements)');
    expect(document.html).toContain('get_attr(element(Id), Attribute, Value)');
    expect(document.html).toContain('get_text(element(Id), Text)');
    expect(document.html).toContain('toggle_class(element(Id), Class)');
    expect(document.html).toContain('event_property(event(Id, _), target, element(Id))');
    expect(document.html).toContain('hide(element(Id))');
    expect(document.html).toContain('extractDomSelectors');
    expect(document.html).toContain('createDomFacts');
    expect(document.html).toContain('applyDomActions');
    expect(document.html).toContain('bindDomEvents');
    expect(document.html).not.toContain('use_module(library(dom))');
  });
});
