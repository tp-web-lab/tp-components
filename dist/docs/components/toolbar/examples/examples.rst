.. tp-restructuredtext-viewer::
   :label: tp-toolbar
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-icon-1(tp-icon)
            :section: start
            :name: home
            :aria-label: Home

         .. role:: example-tp-icon-2(tp-icon)
            :section: start
            :name: menu
            :aria-label: Menu

         .. role:: example-tp-icon-3(tp-icon)
            :section: end
            :name: github
            :aria-label: GitHub

         .. role:: example-tp-icon-4(tp-icon)
            :section: end
            :name: settings
            :aria-label: Settings

         .. role:: example-tp-icon-5(tp-icon)
            :section: end
            :name: help
            :aria-label: Help

         .. tp-box::
            :padding: 0

            .. tp-toolbar::

               :example-tp-icon-1:`home` :example-tp-icon-2:`menu`

               .. span::
                  :section: center

                  Document

               :example-tp-icon-3:`github` :example-tp-icon-4:`settings` :example-tp-icon-5:`help`

            .. tp-box::
               :border-width: 0
               :style: min-block-size: 5rem; display: grid; place-items: center

               Document area

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-radio-list::
               :data-setting: orientation
               :label: orientation
               :label-position: top
               :orientation: horizontal
               :value: 1

               - horizontal

               - vertical

            .. tp-radio-list::
               :data-setting: placement
               :label: placement
               :label-position: top
               :orientation: horizontal
               :value: 1

               - Automatic (top / start)

               - top

               - bottom

               - start

               - end

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
            :title: toolbar attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/toolbar/examples/attributes.js
