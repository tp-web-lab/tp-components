likes(ann, tea).
likes(bob, coffee).
share(X) :- likes(ann, X), likes(bob, X).
