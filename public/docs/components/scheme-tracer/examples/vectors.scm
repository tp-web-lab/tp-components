(define values (vector 10 20 30))
(define alias values)
(vector-set! values 1 99)
alias
(eq? values alias)
