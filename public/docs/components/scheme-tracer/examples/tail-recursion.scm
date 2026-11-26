(define (sum-iter n total)
  (if (= n 0)
      total
      (sum-iter (- n 1) (+ total n))))

(sum-iter 50 0)
