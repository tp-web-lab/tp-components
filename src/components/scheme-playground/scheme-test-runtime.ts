import srfi64 from "./vendor/srfi-64.scm?raw";

/** SRFI-64 reference implementation, with a browser reporter (no log files). */
export const schemeTestRuntime = `${srfi64}
(define-syntax test-error
 (syntax-rules ()
  ((_ name type expression)
   (let ((runner (test-runner-get)))
    (test-result-alist! runner (list (cons 'test-name name)))
    (%test-error runner type expression)))
  ((_ type expression) (test-error "Expected error" type expression))
  ((_ expression) (test-error "Expected error" #t expression))))
(define tp-test-runner (test-runner-null))
(test-runner-current tp-test-runner)
(test-runner-factory (lambda () tp-test-runner))
(test-runner-on-test-end! tp-test-runner
 (lambda (runner)
  (tp-test-result
   (format "~a" (test-runner-group-path runner))
   (test-runner-test-name runner)
   (symbol->string (test-result-kind runner))
   (format "~s" (test-result-alist runner)))))
(test-runner-on-bad-count! tp-test-runner
 (lambda (runner actual expected) (error "Incorrect SRFI-64 test count" actual expected)))
(test-runner-on-bad-end-name! tp-test-runner
 (lambda (runner begin end) (error "Incorrect SRFI-64 group name" begin end)))
`;
