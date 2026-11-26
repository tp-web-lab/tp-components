(define (square n) (* n n))
(map square (list 1 2 3 4))

(let ((factor 3))
  (map (lambda (n) (* factor n)) (list 1 2 3)))
