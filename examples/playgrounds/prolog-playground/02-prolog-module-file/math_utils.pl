:- module(math_utils, [square/2, double/2]).

square(X, Y) :-
  Y is X * X.

double(X, Y) :-
  Y is X * 2.
