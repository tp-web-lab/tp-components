:- use_module(library(plunit)).

:- begin_tests(double).
test(positive) :- double(3, 6).
test(zero) :- double(0, 0).
test(negative) :- double(-2, -4).
:- end_tests(double).
