.. tp-restructuredtext-viewer::
   :label: tp-scheme-tracer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/recursion.scm

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/scheme/scheme.js";
            import "/components/scheme-tracer/scheme-tracer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-scheme-tracer");
            element1.setAttribute("src", "/docs/components/scheme-tracer/examples/recursion.scm");
            example.append(element1);

            document.body.append(example);

      .. example:: Subexpressions on one line

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/same-line.scm

      .. example:: Tail recursion

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/tail-recursion.scm

      .. example:: Independent closures

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/closures.scm

      .. example:: Shared pairs and mutation

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/shared-pairs.scm

      .. example:: Cyclic pair

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/cyclic-pair.scm

      .. example:: Vectors and aliases

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/vectors.scm

      .. example:: Higher-order procedures

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/higher-order.scm

      .. example:: Error and call stack

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/error.scm

      .. example:: Replay a saved trace

         .. tp-scheme-tracer::
            :trace: /docs/components/scheme-tracer/examples/recursion.trace.json

      .. example:: Nested calls and a separate query

         Record execution, then choose Start at query to skip the warmup calculation and reach fact(4), whose result is 24. Use Next to enter a nested call: Step over completes that call without visiting its body, while Step out returns from the active function to its caller. Use Previous to revisit the skipped steps; First also restores access to initialization. All steps remain available after saving and reloading the trace.

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/nested-calls.scm
            :query: (display (fact 4))

      .. example:: Constant expressions and intermediate values

         Record execution and use Next to follow the highlighted operations and their Expression value until the result is 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running the program again.

         .. tp-scheme-tracer::
            :src: /docs/components/scheme-tracer/examples/constant-expressions.scm
