:- use_module(library(clpfd)).
:- use_module(library(wasm)).
:- use_module(library(dom)).

digit(X) :- X in 1..3.

show_solutions :-
  findall(X, (digit(X), labeling([], [X])), Values),
  format(atom(Text), 'Solutions: ~w', [Values]),
  Output := document.getElementById("solutions"),
  Output.textContent := #Text.

setup_dom :-
  Button := document.getElementById("solve"),
  bind(Button, click, _Event, show_solutions).
