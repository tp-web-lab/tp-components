:- use_module(library(dom)).

setup_dom :-
  get_by_id('dom-demo', App),
  get_by_id(items, List),
  get_by_id('first-item', FirstItem),
  get_by_id(details, Details),
  get_by_id(title, Title),
  get_by_id(status, Status),
  get_by_id('add-button', AddButton),
  get_by_id('replace-button', ReplaceButton),
  get_by_id('remove-button', RemoveButton),
  get_by_id('toggle-button', ToggleButton),

  maybe_locate_demo(App),
  maybe_count_items(App),
  maybe_title_text(Title, TitleText),
  set_attr(Status, 'data-title', TitleText),
  set_html(Status, 'Ready. The initial list was found with query_select_all/3.'),
  hide(Details),

  bind(AddButton, click, AddEvent, add_item(AddEvent, List, Status)),
  bind(ReplaceButton, click, ReplaceEvent, replace_first_item(ReplaceEvent, List, FirstItem, Status)),
  bind(RemoveButton, click, RemoveEvent, remove_first_item(RemoveEvent, List, FirstItem, Status)),
  bind(ToggleButton, click, ToggleEvent, toggle_panel(ToggleEvent, App, Details, Status)).

maybe_locate_demo(_App) :-
  query_select('#dom-demo', SelectedApp),
  !,
  add_class(SelectedApp, located).
maybe_locate_demo(_App).

maybe_count_items(App) :-
  query_select(App, '.items', SelectedList),
  !,
  query_select_all(SelectedList, 'li', _Items).
maybe_count_items(_App).

maybe_title_text(Title, TitleText) :-
  get_text(Title, TitleText),
  !.
maybe_title_text(_Title, 'Advanced Prolog DOM').

add_item(Event, List, Status) :-
  prevent_default(Event),
  event_property(Event, target, Target),
  add_class(Target, handled),
  create(li, Item),
  set_text(Item, 'Item added with create/2 and append_child/2'),
  add_class(Item, added),
  append_child(List, Item),
  set_html(Status, 'A new item has been appended.').

replace_first_item(Event, List, FirstItem, Status) :-
  prevent_default(Event),
  create(li, Replacement),
  set_text(Replacement, 'First item replaced with replace_child/3'),
  add_class(Replacement, replacement),
  replace_child(List, FirstItem, Replacement),
  set_html(Status, 'The first item has been replaced.').

remove_first_item(Event, List, FirstItem, Status) :-
  prevent_default(Event),
  remove_child(List, FirstItem),
  set_html(Status, 'The first item has been removed.').

toggle_panel(Event, App, Details, Status) :-
  prevent_default(Event),
  toggle_class(App, active),
  toggle(Details),
  set_style(Status, color, 'rebeccapurple'),
  set_html(Status, 'The panel visibility and the demo class have been toggled.').
