parent(ada, byron).
parent(byron, charles).

grandparent(Grandparent, Grandchild) :-
  parent(Grandparent, Parent),
  parent(Parent, Grandchild).
