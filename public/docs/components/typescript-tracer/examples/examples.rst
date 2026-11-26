.. tp-restructuredtext-viewer::
   :label: tp-typescript-tracer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/nested-arrays.ts

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/typescript/typescript.js";
            import "/components/typescript-tracer/typescript-tracer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-typescript-tracer");
            element1.setAttribute("src", "/docs/components/typescript-tracer/examples/nested-arrays.ts");
            example.append(element1);

            document.body.append(example);

      .. example:: Subexpressions on one line

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/same-line.ts

      .. example:: Recursion

         Record factorial(5), inspect the five call frames and follow return values up to 120.

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/recursion.ts

      .. example:: Independent closures

         Follow count in the two captured makeCounter environments. The first counter returns 1 then 2; the second returns 1.

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/closures.ts

      .. example:: Class and shared instance

         Follow this.value from 3 to 4 and check that counter and alias point to the same instance. The output is 4, 4, true.

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/classes.ts

      .. example:: Inheritance and super

         Follow StepCounter extending Counter, the super(value) constructor call and the overridden increment method calling super.increment(). Inspect the same instance through both classes; the output is 5, 7, true.

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/inheritance.ts

      .. example:: Caught exception

         Follow the exception from divide into catch, then continue through finally. The error event uses the danger color and execution continues.

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/caught-exception.ts

      .. example:: Uncaught exception

         Inspect the TypeError and its call stack. Recording ends at the error; previous steps remain available.

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/uncaught-exception.ts

      .. example:: Loop and local variables

         Step through the loop to inspect n and the growing squares array. The final output contains 1, 4, 9 and 16.

         .. tp-typescript-tracer::
            :src: /docs/components/typescript-tracer/examples/loops.ts

      .. example:: Replay a saved trace

         .. tp-typescript-tracer::
            :trace: /docs/components/typescript-tracer/examples/nested-arrays.trace.json
