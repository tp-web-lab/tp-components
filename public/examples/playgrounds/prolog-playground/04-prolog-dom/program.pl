:- use_module(library(wasm)).
:- use_module(library(dom)).

setup_dom :-
  Title := document.getElementById("title"),
  Button := document.getElementById("button"),
  Output := document.getElementById("output"),
  Output.textContent := "Waiting for click...",
  bind(Button, click, _Event, (
    Title.textContent := "Clicked from Prolog!",
    Title.style.color := "blue",
    Output.textContent := "Button clicked from SWI-Prolog"
  )).
