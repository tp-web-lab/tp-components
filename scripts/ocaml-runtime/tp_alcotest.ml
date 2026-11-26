open Js_of_ocaml
include Alcotest
let report suite name status details =
 ignore (Js.Unsafe.fun_call (Js.Unsafe.get Js.Unsafe.global "tpAlcotestResult")
  (Array.map (fun s -> Js.Unsafe.inject (Js.string s)) [|suite; name; status; details|]))
let run name groups =
 let groups = List.map (fun (group, cases) ->
  group, List.map (fun (label, speed, test) ->
   label, speed, (fun () ->
    try test (); report group label "passed" ""
    with Alcotest_engine.V1.Core.Skip as ex -> report group label "skipped" "Skipped by test"; raise ex
    | ex -> report group label "failed" (Printexc.to_string ex); raise ex)) cases) groups in
 try Alcotest.run ~argv:[|"tp-tests"|] ~and_exit:false ~verbose:true name groups
 with Alcotest.Test_error -> ()
