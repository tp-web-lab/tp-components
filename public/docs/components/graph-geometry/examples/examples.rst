.. tp-restructuredtext-viewer::
   :label: tp-graph-geometry
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-graph-geometry::

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - grid

               - readonly

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
            :title: graph-geometry attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/graph-geometry/examples/attributes.js

      .. example:: Attached points

         .. tp-graph-geometry::

            .. script::
               :type: tp/geometry

               point O = (0, 0)
               point A = (6, 0)
               circle c = circle(O, 5)
               point P = on(c, angle=60deg)
               line d = line(O, A)
               point Q = on(d, t=0.5)

      .. example:: Arc only

         .. tp-graph-geometry::

            .. script::
               :type: tp/geometry

               point O = (0, 0)
               circle c = circle(O, 5) hidden
               arc a = arc(c, start=20deg, end=140deg)

      .. example:: From a file

         .. tp-graph-geometry::
            :src: /docs/components/graph-geometry/examples/circle.geometry
