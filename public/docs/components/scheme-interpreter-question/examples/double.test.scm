(test-equal "Positive number" 6 (double 3))
(test-equal "Zero" 0 (double 0))
(test-assert "Negative number" (= -4 (double -2)))
