:- use_module(library(dom)).

setup_dom :-
  get_by_id(title, Title),
  get_by_id(button, Button),
  get_by_id(output, Output),

  set_html(Output, 'Waiting for click...'),

  bind(Button, click, _Event, (
    set_html(Title, 'Clicked from Prolog!'),
    set_style(Title, color, blue),
    set_html(Output, 'Button clicked 🎉')
  )).