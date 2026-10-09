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

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: preset
               :label: preset
               :label-position: top
               :orientation: horizontal
               :value: 3

               - fractal-tree

               - barnsley-fern

               - koch-curve

               - dragon-curve

               - hilbert-curve

               - peano-curve

               - levy-c-curve

               - gosper-curve

               - pythagoras-tree

               - sierpinski-triangle

               - sierpinski-carpet

               - sierpinski-arrowhead

               - sierpinski-gasket

               - sierpinski-tetrahedron

            .. tp-radio-list::
               :data-setting: src
               :label: src
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - file1

               - file2

               - file-unknown

            .. tp-cluster::

               .. tp-textfield::
                  :data-setting: angle
                  :label: angle
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: interval
                  :label: interval
                  :value: 1000
                  :placeholder: 1000
                  :clearable:

               .. tp-textfield::
                  :data-setting: iterations
                  :label: iterations
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: label
                  :label: label
                  :value: L-system
                  :placeholder: L-system
                  :clearable:

               .. tp-textfield::
                  :data-setting: step
                  :label: step
                  :value:
                  :placeholder:
                  :clearable:

            .. tp-button-group::

               .. tp-button::
                  :id: attributes-reset
                  :type: button

                  Reset defaults

               .. tp-button::
                  :id: attributes-reload
                  :type: button

                  Reload preview

         .. tp-divider::

         .. h3::

            Preview

         .. tp-iframe::
            :id: attributes-frame
            :title: lsystem attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /tp-components/docs/components/lsystem/examples/attributes.js

      .. example:: Branching tree

         .. tp-lsystem::
            :src: /tp-components/docs/components/lsystem/examples/tree.lsys
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
