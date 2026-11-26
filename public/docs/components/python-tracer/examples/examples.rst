.. tp-restructuredtext-viewer::
   :label: tp-python-tracer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/students.py

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/python/python.js";
            import "/components/python-tracer/python-tracer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-python-tracer");
            element1.setAttribute("src", "/docs/components/python-tracer/examples/students.py");
            example.append(element1);

            document.body.append(example);

      .. example:: Subexpressions on one line

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/same-line.py

      .. example:: Inline Python

         .. tp-python-tracer::

            .. script::
               :type: tp/python

               def factorial(n):
                   if n <= 1:
                       return 1
                   return n * factorial(n - 1)

               print(factorial(5))

      .. example:: Replay a saved trace

         .. tp-python-tracer::
            :trace: /docs/components/python-tracer/examples/students.trace.json

      .. example:: Save and reload

         Choose Save trace, name the JSON file, then choose Load trace to reopen it. Navigate to Last to see Ada 92.5 without running Python again.

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/students.py
            :trace: /docs/components/python-tracer/examples/students.trace.json

      .. example:: Class and shared instance

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/counter.py

      .. example:: Inheritance and super

         Follow StepCounter inheriting from Counter, super().__init__(value) and the overridden increment method calling super().increment(). Inspect self referring to the same instance in both classes; the output is 5, 7, True.

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/inheritance.py

      .. example:: References between instances

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/linked-nodes.py

      .. example:: Caught exception

         Record execution, then step through the exception and its handler. Output continues with caught and done.

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/caught-exception.py

      .. example:: Uncaught exception

         Record execution and follow the exception from fail to the caller. The final event displays ValueError: test error; earlier steps remain available.

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/uncaught-exception.py

      .. example:: Closure with nonlocal

         Record execution and follow count from 0 to 1 to 2 in the retained make_counter frame. The two calls share the same captured variable and print 1 then 2.

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/closure-nonlocal.py

      .. example:: Nested lists and shared references

         Record execution and inspect the three arrows from rows: the first and third point to the same shared list. Step through append(5) to see both references reflect the change, while the middle list stays unchanged.

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/nested-lists.py

      .. example:: Nested calls and a separate query

         Record execution, then choose Start at query to skip the warmup calculation and reach fact(4), whose result is 24. Use Next to enter a nested call: Step over completes that call without visiting its body, while Step out returns from the active function to its caller. Use Previous to revisit the skipped steps; First also restores access to initialization. All steps remain available after saving and reloading the trace.

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/nested-calls.py
            :query: print(fact(4))

      .. example:: Constant expressions and intermediate values

         Record execution and use Next to follow the highlighted operations and their Expression value: 8, 8, 16, 48, 3, 9, then 57. Previous revisits each calculation; Save trace and Load trace preserve the intermediate values without running Python again.

         .. tp-python-tracer::
            :src: /docs/components/python-tracer/examples/constant-expressions.py
