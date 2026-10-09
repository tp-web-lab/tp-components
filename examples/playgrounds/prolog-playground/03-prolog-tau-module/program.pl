:- use_module(library(lists)).

contains_twice(X, List) :-
  append(_, [X|Rest], List),
  member(X, Rest).