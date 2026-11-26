:- use_module(library(wasm)).
:- use_module(library(dom)).

setup_dom :-
  App := document.getElementById("dom-demo"),
  List := App.querySelector(".items"),
  Details := document.getElementById("details"),
  Status := document.getElementById("status"),
  Add := document.getElementById("add-button"),
  Replace := document.getElementById("replace-button"),
  Remove := document.getElementById("remove-button"),
  Toggle := document.getElementById("toggle-button"),
  _ := App.classList.add("located"),
  Details.hidden := true,
  Status.textContent := "Ready. Native SWI-Prolog DOM access.",
  bind(Add, click, _, add_item(List, Status)),
  bind(Replace, click, _, replace_first(List, Status)),
  bind(Remove, click, _, remove_first(List, Status)),
  bind(Toggle, click, _, toggle_panel(App, Details, Status)).

add_item(List, Status) :-
  append_html(List, li([class=added], 'Item added by SWI-Prolog')),
  Status.textContent := "A new item has been appended.".

replace_first(List, Status) :-
  First := List.firstElementChild,
  ( First == null -> true
  ; Replacement := document.createElement("li"),
    Replacement.textContent := "First item replaced",
    _ := List.replaceChild(Replacement, First)
  ),
  Status.textContent := "The first item has been replaced.".

remove_first(List, Status) :-
  First := List.firstElementChild,
  ( First == null -> true ; _ := First.remove() ),
  Status.textContent := "The first item has been removed.".

toggle_panel(App, Details, Status) :-
  Hidden := Details.hidden,
  ( Hidden == true -> Details.hidden := false ; Details.hidden := true ),
  _ := App.classList.toggle("active"),
  Status.style.color := "rebeccapurple",
  Status.textContent := "Panel visibility and the demo class have been toggled.".
