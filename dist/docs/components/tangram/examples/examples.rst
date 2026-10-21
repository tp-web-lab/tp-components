.. tp-restructuredtext-viewer::
   :label: tp-tangram
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-tangram::

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - exact-orientation

            .. tp-radio-list::
               :data-setting: src
               :label: src
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Default

               - Square (text)

               - Diamond (JSON)

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
            :title: tangram attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /docs/components/tangram/examples/attributes.js

      .. example:: Named vertices

         .. tp-tangram::

            .. script::
               :type: tp/tangram

               # Corners of a square of side 4
               point A = (0, 0)
               point B = (4, 0)
               point C = (4, 4)
               point D = (0, 4)

               # Shared landmarks
               point O = midpoint(A, C)
               point E = midpoint(B, C)
               point F = midpoint(C, D)
               point G = midpoint(B, O)
               point H = midpoint(O, C)
               point I = midpoint(O, D)

               # The seven pieces, described by their boundary vertices
               triangle A B O
               triangle A O D
               triangle E C F
               triangle B E G
               triangle O H I
               square O G E H
               parallelogram D F H I

      .. example:: Exact orientation

         .. tp-tangram::
            :exact-orientation:
            :src: /docs/components/tangram/examples/convex-01.txt

      .. example:: Convex 01

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-01.txt

      .. example:: Convex 02

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-02.txt

      .. example:: Convex 03

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-03.txt

      .. example:: Convex 04

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-04.txt

      .. example:: Convex 05

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-05.txt

      .. example:: Convex 06

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-06.txt

      .. example:: Convex 07

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-07.txt

      .. example:: Convex 08

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-08.txt

      .. example:: Convex 09

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-09.txt

      .. example:: Convex 10

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-10.txt

      .. example:: Convex 11

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-11.txt

      .. example:: Convex 12

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-12.txt

      .. example:: Convex 13

         .. tp-tangram::
            :src: /docs/components/tangram/examples/convex-13.txt
