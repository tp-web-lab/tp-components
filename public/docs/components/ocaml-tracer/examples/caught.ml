let divide x y = x / y;;
let answer = try divide 10 0 with Division_by_zero -> 42;;
Printf.printf "%d\n" answer;;
