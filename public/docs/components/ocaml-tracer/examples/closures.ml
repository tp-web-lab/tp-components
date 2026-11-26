let make_counter () =
  let count = ref 0 in
  fun () -> incr count; !count;;
let counter = make_counter ();;
Printf.printf "%d\n" (counter ());;
Printf.printf "%d\n" (counter ());;
