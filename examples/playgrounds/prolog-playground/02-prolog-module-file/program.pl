:- use_module(math_utils).

score(X, Result) :-
  square(X, Square),
  double(Square, Result).