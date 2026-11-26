:- use_module(library(plunit)).

:- begin_tests(family).
test(parent_john_mary) :- parent(john, mary).
test(parent_mary_alice) :- parent(mary, alice).
test(parent_helen_mary) :- parent(helen, mary).
test(grandparent_john_alice) :- grandparent(john, alice).
test(grandparent_helen_alice) :- grandparent(helen, alice).
test(grandparent_helen_robert) :- grandparent(helen, robert).
test(no_parent_alice_john, [fail]) :- parent(alice, john).
test(no_grandparent_robert_john, [fail]) :- grandparent(robert, john).
test(grandparent_john_all, set(X == [robert, alice])) :- grandparent(john, X).
:- end_tests(family).
