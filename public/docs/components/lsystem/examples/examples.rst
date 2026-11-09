.. tp-restructuredtext-viewer::
   :label: tp-lsystem
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-lsystem::
            :label: Koch curve

            .. script::
               :type: tp/lsystem

               axiom: F
               iterations: 3
               angle: 60
               rule: F => F+F--F+F

      .. example:: Branching tree

         .. tp-lsystem::
            :src: /docs/components/lsystem/examples/tree.lsys
            :label: Branching tree

      .. example:: Preset gallery

         .. tp-grid::
            :min-width: 16rem

            .. tp-lsystem::
               :preset: barnsley-fern
               :label: Barnsley fern

            .. tp-lsystem::
               :preset: dragon-curve
               :label: Dragon curve

            .. tp-lsystem::
               :preset: sierpinski-triangle
               :label: Sierpinski triangle
