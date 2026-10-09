.. tp-restructuredtext-viewer::
   :label: tp-graph-sequential-circuit
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-graph-sequential-circuit::
            :id: sequential-counter
            :grid:
            :grid-size: 20
            :message: Hubs distribute CLK, Q0, and Q1 along separate orthogonal lanes.
            :src: /tp-components/docs/components/graph-sequential-circuit/examples/two-bit-counter.json
