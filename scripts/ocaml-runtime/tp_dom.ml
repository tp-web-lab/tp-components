(** DOM of the containing interpreter page, or of the active project/cell preview. *)
open Js_of_ocaml
let document () : Dom_html.document Js.t = Js.Unsafe.get Js.Unsafe.global "tpDocument"
let window () : Dom_html.window Js.t = Js.Unsafe.get Js.Unsafe.global "tpWindow"
