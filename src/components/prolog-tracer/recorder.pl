:- module(tp_resolution, [run/2, export/1]).
:- dynamic event/1, source_position/2.
:- multifile user:prolog_trace_interception/4.
user:prolog_trace_interception(Port, Frame, _, Action) :-
    nb_current(tp_resolution_active, true),
    (nb_getval(tp_resolution_count, N), N >= 2000 ->
        nb_setval(tp_resolution_limited, true), nb_setval(tp_resolution_active, false), Action = abort
    ; tp_resolution:capture(Port, Frame), Action = continue).

below(Frame, Root) :-
    prolog_frame_attribute(Frame, parent, Parent),
    (Parent =:= Root ; below(Parent, Root)), !.

capture(Port, Frame) :-
    (nb_current(tp_resolution_root, _) -> true ; nb_setval(tp_resolution_root, Frame)),
    nb_getval(tp_resolution_root, Root),
    (Frame =\= Root, below(Frame, Root) -> capture_event(Port, Frame); true).

capture_event(Port, Frame) :-
    nb_getval(tp_resolution_count, N), N1 is N+1,
    nb_setval(tp_resolution_count, N1),
    prolog_frame_attribute(Frame, goal, Goal),
    prolog_frame_attribute(Frame, level, Level),
    (prolog_frame_attribute(Frame, parent, Parent) -> true ; Parent = 0),
    (prolog_frame_attribute(Frame, clause, Clause), clause_property(Clause, line_count(Line0)) -> Line=Line0 ; Line=0),
    catch(source_line(Port, Frame, SourceLine), _, SourceLine=0),
    nb_getval(tp_resolution_names, Names),
    term_string(Port, P, [quoted(true)]),
    term_string(Goal, G, [quoted(true), max_depth(20), variable_names(Names)]),
    assertz(event(_{port:P, frame:Frame, parent:Parent, level:Level, goal:G, line:Line, sourceLine:SourceLine})).

% Keep the original reader positions; the VM provides the subgoal path for its PC.
prepare(Source) :-
    retractall(source_position(_, _)), nb_setval(tp_resolution_source, Source),
    setup_call_cleanup(open_string(Source, In), read_positions(In), close(In)).
read_positions(In) :-
    read_term(In, Term, [subterm_positions(Position), module(user)]),
    (Term == end_of_file -> true
    ; position_start(Position, From), line_at(From, Line),
      assertz(source_position(Line, Position)), read_positions(In)).
position_start(From-_, From) :- !.
position_start(Position, From) :- arg(1, Position, From).
line_at(Offset, Line) :-
    nb_getval(tp_resolution_source, Source), sub_string(Source, 0, Offset, _, Prefix),
    split_string(Prefix, "\n", "", Lines), length(Lines, Line).
subposition([], Position, Position).
subposition(Path, parentheses_term_position(_, _, Position), Result) :- !,
    subposition(Path, Position, Result).
subposition([N|Rest], term_position(_, _, _, _, Args), Result) :-
    nth1(N, Args, Position), subposition(Rest, Position, Result).
source_clause(Clause, Line) :-
    clause_property(Clause, file('/program.pl')), clause_property(Clause, line_count(Line)).
pc_line(Clause, PC, Line) :-
    source_clause(Clause, Start), source_position(Start, Position),
    '$clause_term_position'(Clause, PC, Path), subposition(Path, Position, Sub),
    position_start(Sub, Offset), line_at(Offset, Line).
source_line(unify, Frame, Line) :-
    prolog_frame_attribute(Frame, clause, Clause), source_clause(Clause, Line), !.
source_line(redo(PC), Frame, Line) :-
    PC > 0, prolog_frame_attribute(Frame, clause, Clause), pc_line(Clause, PC, Line), !.
source_line(_, Frame, Line) :-
    prolog_frame_attribute(Frame, parent, Parent),
    prolog_frame_attribute(Frame, pc, PC), prolog_frame_attribute(Parent, clause, Clause),
    pc_line(Clause, PC, Line), !.
source_line(_, Frame, Line) :-
    prolog_frame_attribute(Frame, clause, Clause), source_clause(Clause, Line), !.
source_line(_, _, 0).

run(Query, Json) :-
    retractall(event(_)), nb_setval(tp_resolution_count, 0),
    read_term_from_atom(Query, Goal, [variable_names(Names), module(user)]),
    nb_linkval(tp_resolution_names, Names), nb_setval(tp_resolution_limited, false),
    set_prolog_flag(last_call_optimisation, false),
    leash(-all), visible(+all),
    catch((nb_setval(tp_resolution_active, true), trace,
           (user:call(Goal), notrace,
            term_string(Names, Answer, [quoted(true)]),
            assertz(event(_{port:"solution",goal:Answer,frame:0,parent:0,level:0})),
            trace, fail ; notrace)),
          Error, (notrace, term_string(Error, Message), assertz(event(_{port:"exception",goal:Message,frame:0,parent:0,level:0})))),
    notrace, nb_setval(tp_resolution_active, false),
    export(Json).

export(Json) :-
    findall(E, event(E), Events), nb_getval(tp_resolution_limited, Limited),
    atom_json_dict(Json, _{events:Events,limited:Limited}, []).
