.. tp-restructuredtext-viewer::
   :label: tp-map
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-map::
            :lat: 48.3904
            :lon: -4.4861
            :zoom: 13
            :title: Brest, Brittany, France
            :marker:

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - elevation-profile

               - fit-content

               - fit-markers

               - marker

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
                  :data-setting: lat
                  :label: lat
                  :value: 48.8566
                  :placeholder: 48.8566
                  :clearable:

               .. tp-textfield::
                  :data-setting: lon
                  :label: lon
                  :value: 2.3522
                  :placeholder: 2.3522
                  :clearable:

               .. tp-textfield::
                  :data-setting: title
                  :label: title
                  :value:
                  :placeholder:
                  :clearable:

               .. tp-textfield::
                  :data-setting: zoom
                  :label: zoom
                  :value: 13
                  :placeholder: 13
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
            :title: map attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         File-loading attributes offer only Default, file1, file2 and file-unknown. The two local fixtures preserve verified example formats (they may contain the same content); file-unknown deliberately exercises error handling. No arbitrary path can be entered.

         .. script::
            :type: module
            :src: /tp-components/docs/components/map/examples/attributes.js

      .. example:: Multiple markers

         .. tp-map::
            :title: Cities in Brittany
            :fit-markers:

            Brest
               48.3904, -4.4861

            Rennes
               48.1173, -1.6778

      .. example:: GPX track

         This illustrative Brest track has two separate recording segments. The gap is intentional; this synthetic route is not a navigation guide.

         .. tp-map::
            :title: Illustrative Brest track
            :src: /tp-components/docs/components/map/examples/brest-track.gpx
            :fit-content:

            Additional meeting point
               48.3920, -4.4840

      .. example:: GPX route

         This GPX file contains a recorded track in northeastern Ouessant with three recording segments. The profile plots elevation in metres against cumulative distance in kilometres, without joining recording gaps. The map does not provide navigation guidance.

         .. tp-map::
            :title: Northeastern Ouessant track
            :src: /tp-components/docs/components/map/examples/ouessant-route.gpx
            :fit-content:
            :elevation-profile:
