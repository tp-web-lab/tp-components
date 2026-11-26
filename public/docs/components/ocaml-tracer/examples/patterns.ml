let rec sum = function
  | [] -> 0
  | head :: tail -> head + sum tail;;
let values = [1; 2; 3];;
Printf.printf "%d\n" (sum values);;
