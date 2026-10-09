/**
 * @module components/prolog-playground/prolog-source
 * @summary Source helpers for in-memory Prolog playground projects.
 */

import type { TpFile } from '../filesystem/filesystem.types.js';

/** DOM helper module injected by the Prolog playground runtime. */
export const PROLOG_DOM_MODULE_SOURCE = `
:- dynamic(tp_dom_action/1).
:- dynamic(tp_dom_binding/4).
:- dynamic(tp_dom_created_counter/1).
:- dynamic(tp_dom_parent/2).
:- dynamic(tp_dom_sibling/2).
:- dynamic(tp_dom_attr/3).
:- dynamic(tp_dom_html/2).
:- dynamic(tp_dom_text/2).
:- dynamic(tp_dom_style/3).
:- dynamic(tp_dom_class/2).
:- dynamic(tp_dom_query_selector/2).
:- dynamic(tp_dom_query_selector/3).
:- dynamic(tp_dom_known_element/1).

tp_dom_created_counter(0).

get_by_id(Id, element(Id)).

parent_of(element(Child), element(Parent)) :-
  tp_dom_parent(Child, Parent).

sibling(element(Left), element(Right)) :-
  nonvar(Left),
  var(Right),
  tp_dom_sibling(Left, Right).
sibling(element(Left), element(Right)) :-
  var(Left),
  nonvar(Right),
  tp_dom_sibling(Left, Right).
sibling(element(Left), element(Right)) :-
  nonvar(Left),
  nonvar(Right),
  (
    tp_dom_sibling(Left, Right)
    ;
    tp_dom_sibling(Right, Left)
  ).

tp_dom_next_id(Id) :-
  (
    retract(tp_dom_created_counter(N))
    ->
    true
    ;
    N = 0
  ),
  N1 is N + 1,
  assertz(tp_dom_created_counter(N1)),
  number_chars(N1, Chars),
  atom_chars(NAtom, Chars),
  atom_concat('__tp_dom_created_', NAtom, Id).

create(Tag, element(Id)) :-
  tp_dom_next_id(Id),
  assertz(tp_dom_known_element(Id)),
  assertz(tp_dom_action(create(Id, Tag))).

append_child(element(Parent), element(Child)) :-
  \\+ tp_dom_parent(Child, _),
  assertz(tp_dom_parent(Child, Parent)),
  assertz(tp_dom_action(append_child(Parent, Child))).

insert_after(element(Reference), element(Child)) :-
  \\+ tp_dom_parent(Child, _),
  tp_dom_parent(Reference, Parent),
  assertz(tp_dom_parent(Child, Parent)),
  assertz(tp_dom_action(insert_after(Reference, Child))).

insert_before(element(Reference), element(Child)) :-
  \\+ tp_dom_parent(Child, _),
  tp_dom_parent(Reference, Parent),
  assertz(tp_dom_parent(Child, Parent)),
  assertz(tp_dom_action(insert_before(Reference, Child))).

remove_child(element(Parent), element(Child)) :-
  retractall(tp_dom_parent(Child, _)),
  assertz(tp_dom_action(remove_child(Parent, Child))).

replace_child(element(Parent), element(OldChild), element(NewChild)) :-
  retractall(tp_dom_parent(OldChild, _)),
  retractall(tp_dom_parent(NewChild, _)),
  assertz(tp_dom_parent(NewChild, Parent)),
  assertz(tp_dom_action(replace_child(Parent, OldChild, NewChild))).

query_select(Selector, element(Id)) :-
  tp_dom_query_selector(Selector, Id),
  !.

query_select(element(Parent), Selector, element(Id)) :-
  tp_dom_query_selector(Parent, Selector, Id),
  !.

query_select_all(Selector, Elements) :-
  findall(element(Id), tp_dom_query_selector(Selector, Id), Elements).

query_select_all(element(Parent), Selector, Elements) :-
  findall(element(Id), tp_dom_query_selector(Parent, Selector, Id), Elements).

get_attr(element(Id), Attribute, Value) :-
  tp_dom_attr(Id, Attribute, Value).

set_attr(element(Id), Attribute, Value) :-
  retractall(tp_dom_attr(Id, Attribute, _)),
  assertz(tp_dom_attr(Id, Attribute, Value)),
  assertz(tp_dom_action(set_attr(Id, Attribute, Value))).

get_html(element(Id), Html) :-
  tp_dom_html(Id, Html).

get_text(element(Id), Text) :-
  tp_dom_text(Id, Text).

set_html(element(Id), Html) :-
  retractall(tp_dom_html(Id, _)),
  assertz(tp_dom_html(Id, Html)),
  assertz(tp_dom_action(set_html(Id, Html))).

set_text(element(Id), Text) :-
  retractall(tp_dom_text(Id, _)),
  assertz(tp_dom_text(Id, Text)),
  assertz(tp_dom_action(set_text(Id, Text))).

get_style(element(Id), Property, Value) :-
  tp_dom_style(Id, Property, Value).

set_style(element(Id), Property, Value) :-
  retractall(tp_dom_style(Id, Property, _)),
  assertz(tp_dom_style(Id, Property, Value)),
  assertz(tp_dom_action(set_style(Id, Property, Value))).

add_class(element(Id), Class) :-
  (
    tp_dom_class(Id, Class)
    ->
    true
    ;
    assertz(tp_dom_class(Id, Class))
  ),
  assertz(tp_dom_action(add_class(Id, Class))).

remove_class(element(Id), Class) :-
  retractall(tp_dom_class(Id, Class)),
  assertz(tp_dom_action(remove_class(Id, Class))).

toggle_class(element(Id), Class) :-
  (
    tp_dom_class(Id, Class)
    ->
    retractall(tp_dom_class(Id, Class))
    ;
    assertz(tp_dom_class(Id, Class))
  ),
  assertz(tp_dom_action(toggle_class(Id, Class))).

has_class(element(Id), Class) :-
  tp_dom_class(Id, Class).

bind(element(Id), Event, EventTerm, Goal) :-
  EventTerm = event(Id, Event),
  assertz(tp_dom_binding(Id, Event, EventTerm, Goal)).

unbind(element(Id), Event) :-
  retractall(tp_dom_binding(Id, Event, _, _)),
  assertz(tp_dom_action(unbind(Id, Event))).

unbind(element(Id), Event, Goal) :-
  retractall(tp_dom_binding(Id, Event, _, Goal)),
  assertz(tp_dom_action(unbind(Id, Event, Goal))).

event_property(event(_, Event), type, Event).
event_property(event(Id, _), target, element(Id)).

prevent_default(Event) :-
  assertz(tp_dom_action(prevent_default(Event))).

hide(element(Id)) :-
  set_style(element(Id), display, none),
  assertz(tp_dom_action(hide(Id))).

show(element(Id)) :-
  retractall(tp_dom_style(Id, display, _)),
  assertz(tp_dom_action(show(Id))).

toggle(element(Id)) :-
  assertz(tp_dom_action(toggle(Id))).

tp_dom_collect_actions(Actions) :-
  findall(Action, retract(tp_dom_action(Action)), Actions).

tp_dom_collect_bindings(Bindings) :-
  findall(
    binding(Id, Event, EventTerm, Goal),
    tp_dom_binding(Id, Event, EventTerm, Goal),
    Bindings
  ).
`.trim();

function getBasenameWithoutExtension(path: string): string {
  return path
    .split('/')
    .filter(Boolean)
    .at(-1)
    ?.replace(/\.pl$/i, '') ?? path;
}

/** Returns the module name declared by a Prolog file, when present. */
export function getDeclaredPrologModuleName(source: string): string | null {
  const match = source.match(/:-\s*module\s*\(\s*([a-z][\w]*)\s*,/i);
  return match?.[1] ?? null;
}

/** Returns the local module names represented by project files. */
export function getLocalPrologModuleNames(files: readonly TpFile[]): Set<string> {
  return new Set(
    files.map(
      (file) =>
        getDeclaredPrologModuleName(file.content) ??
        getBasenameWithoutExtension(file.path),
    ),
  );
}

/** Returns whether a source imports the playground DOM module. */
export function usesPrologDomModule(source: string): boolean {
  return /:-\s*use_module\s*\(\s*library\s*\(\s*dom\s*\)\s*\)\s*\./i.test(
    source,
  );
}

/**
 * Adapts local Prolog modules for the iframe runtime.
 *
 * Scryer can consult strings, but it cannot resolve arbitrary project files
 * from `use_module/1` inside the browser iframe. Local project modules are
 * therefore flattened into the user module while built-in libraries are kept.
 */
export function flattenLocalPrologModules(
  source: string,
  localModules: ReadonlySet<string>,
): string {
  return source
    .replace(/:-\s*use_module\s*\(\s*library\s*\(\s*dom\s*\)\s*\)\s*\.\s*/gi, '')
    .replace(/:-\s*module\s*\([^)]*\)\s*\.\s*/gi, '')
    .replace(
      /:-\s*use_module\s*\(\s*([a-z][\w]*)\s*\)\s*\.\s*/gi,
      (match: string, moduleName: string) =>
        localModules.has(moduleName) ? '' : match,
    );
}
