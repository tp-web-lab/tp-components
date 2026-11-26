(define shared (list 'a 'b))
(define first (cons shared shared))
(define second (list (list 'a 'b) (list 'a 'b)))
(set-car! shared 'changed)
first
second
(eq? (car first) (cdr first))
