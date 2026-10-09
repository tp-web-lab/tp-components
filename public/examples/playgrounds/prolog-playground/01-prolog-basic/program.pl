parent(john, mary).
parent(mary, alice).
parent(helen, mary).
parent(mary, robert).

grandparent(X, Z) :-
  parent(X, Y),
  parent(Y, Z).