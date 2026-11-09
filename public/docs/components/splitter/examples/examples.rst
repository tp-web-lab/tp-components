.. tp-restructuredtext-viewer::
   :label: tp-splitter
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-splitter::
            :position: 40%

            start
               .. tp-box::

                  Drag the divider to resize this panel.

            end
               .. tp-box::

                  This panel uses the remaining space.

      .. example:: Nested splitters

         Drag the outer divider left or right, then drag the inner divider up or down. Focus either divider to resize its panels with the arrow keys.

         .. tp-splitter::
            :axis: horizontal
            :position: 30%
            :style: height: 20rem

            start
               .. tp-box::

                  .. h3::

                     Navigation

                  This panel is resized by the outer divider.

            end
               .. tp-splitter::
                  :axis: vertical
                  :position: 55%
                  :style: height: 100%

                  start
                     .. tp-box::

                        .. h3::

                           Editor

                        The inner divider changes the height of this panel.

                  end
                     .. tp-box::

                        .. h3::

                           Preview

                        This panel uses the remaining height.
