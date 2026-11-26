let shared = [|1; 2; 3|];;
let alias = shared;;
let count = ref 0;;
shared.(1) <- 9;;
incr count;;
Printf.printf "%d %d\n" alias.(1) !count;;
