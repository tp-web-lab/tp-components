:- use_module(library(plunit)).

:- begin_tests(digits).
test(solutions, all(X == [1,2,3])) :- digit(X), labeling([], [X]).
test(outside_domain, [fail]) :- digit(4).
test(type_error, [throws(error(type_error(integer, _), _))]) :- digit(no).
:- end_tests(digits).
