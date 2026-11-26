.. tp-restructuredtext-viewer::
   :label: tp-prolog-tracer
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-prolog-tracer::
            :src: /docs/components/prolog-tracer/examples/family.pl
            :query: ancestor(ann, Who).

      .. example:: Javascript API

         .. script::
            :type: module

            import "/components/prolog/prolog.js";
            import "/components/prolog-tracer/prolog-tracer.js";

            const example = document.createDocumentFragment();

            const element1 = document.createElement("tp-prolog-tracer");
            element1.setAttribute("src", "/docs/components/prolog-tracer/examples/family.pl");
            element1.setAttribute("query", "ancestor(ann, Who).");
            example.append(element1);

            document.body.append(example);

      .. example:: Recursion

         .. tp-prolog-tracer::
            :src: /docs/components/prolog-tracer/examples/recursion.pl
            :query: factorial(4, F).

      .. example:: Failure

         .. tp-prolog-tracer::
            :src: /docs/components/prolog-tracer/examples/failure.pl
            :query: share(Drink).

      .. example:: Cut

         .. tp-prolog-tracer::
            :src: /docs/components/prolog-tracer/examples/cut.pl
            :query: choose(Color).

      .. example:: Exception

         .. tp-prolog-tracer::
            :src: /docs/components/prolog-tracer/examples/exception.pl
            :query: divide(X).

      .. example:: Replay a saved trace

         .. tp-prolog-tracer::
            :trace: /docs/components/prolog-tracer/examples/family.trace.json
