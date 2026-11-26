parent(ann, bob).
parent(ann, cat).
parent(bob, dan).

ancestor(X, Y) :-
    parent(X, Y).

ancestor(X, Y) :-
    parent(X, Z),
    ancestor(Z, Y).
