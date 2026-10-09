:- test(parent_john_mary, parent(john, mary)).
:- test(parent_mary_alice, parent(mary, alice)).
:- test(parent_helen_mary, parent(helen, mary)).

:- test(grandparent_john_alice, grandparent(john, alice)).
:- test(grandparent_helen_alice, grandparent(helen, alice)).
:- test(grandparent_helen_robert, grandparent(helen, robert)).

:- test(no_parent_alice_john, \+ parent(alice, john)).
:- test(no_grandparent_robert_john, \+ grandparent(robert, john)).
:- test(grandparent_john_all, grandparent(john, X), [
  "X = robert",
  "X = alice"
]).
