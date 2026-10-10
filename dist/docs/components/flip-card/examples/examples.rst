.. tp-restructuredtext-viewer::
   :label: tp-flip-card
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-flip-card::

            recto
               This is the content **recto...**

            verso
               ...and here is the content **verso.**

      .. example:: Attributes

         Combine the attributes on one preview. Controls start at the published defaults. Clear leaves a text field empty and removes the corresponding preview attribute; its default remains visible as a placeholder when nonempty. Some defaults intentionally show no content: use the controls to supply it. Reset defaults fills the controls with their defaults again; Reload preview restarts initialization with the current settings.

         .. tp-stack::

            .. tp-checkbox-list::
               :id: attributes-booleans
               :label: Boolean attributes
               :label-position: top
               :orientation: horizontal
               :value:

               - disabled

               - fit-content

               - flipped

            .. tp-radio-list::
               :data-setting: button-position
               :label: button-position
               :label-position: top
               :orientation: horizontal
               :value: 6

               - top start

               - top center

               - top end

               - bottom start

               - bottom center

               - bottom end

               - none

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
            :title: flip-card attribute preview
            :style: height: 24rem; display: flow-root; inline-size: auto;

         .. tp-callout::
            :id: attributes-status
            :variant: info
            :heading: Preview status

            Preparing the preview…

         .. script::
            :type: module
            :src: /docs/components/flip-card/examples/attributes.js

      .. example:: Hearts suit

         .. role:: inline-tp-icon-26(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-1(tp-icon)
            :src: /src/components/card/cards/hearts/ha.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Ace of hearts

         .. role:: inline-tp-icon-2(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-3(tp-icon)
            :src: /src/components/card/cards/hearts/h2.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Two of hearts

         .. role:: inline-tp-icon-4(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-5(tp-icon)
            :src: /src/components/card/cards/hearts/h3.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Three of hearts

         .. role:: inline-tp-icon-6(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-7(tp-icon)
            :src: /src/components/card/cards/hearts/h4.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Four of hearts

         .. role:: inline-tp-icon-8(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-9(tp-icon)
            :src: /src/components/card/cards/hearts/h5.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Five of hearts

         .. role:: inline-tp-icon-10(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-11(tp-icon)
            :src: /src/components/card/cards/hearts/h6.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Six of hearts

         .. role:: inline-tp-icon-12(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-13(tp-icon)
            :src: /src/components/card/cards/hearts/h7.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Seven of hearts

         .. role:: inline-tp-icon-14(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-15(tp-icon)
            :src: /src/components/card/cards/hearts/h8.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Eight of hearts

         .. role:: inline-tp-icon-16(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-17(tp-icon)
            :src: /src/components/card/cards/hearts/h9.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Nine of hearts

         .. role:: inline-tp-icon-18(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-19(tp-icon)
            :src: /src/components/card/cards/hearts/h10.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Ten of hearts

         .. role:: inline-tp-icon-20(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-21(tp-icon)
            :src: /src/components/card/cards/hearts/hj.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Jack of hearts

         .. role:: inline-tp-icon-22(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-23(tp-icon)
            :src: /src/components/card/cards/hearts/hq.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: Queen of hearts

         .. role:: inline-tp-icon-24(tp-icon)
            :name: logo-tp
            :size: 10em
            :role: img
            :aria-label: tp-components logo

         .. role:: inline-tp-icon-25(tp-icon)
            :src: /src/components/card/cards/hearts/hk.svg
            :size: 100%
            :style: display: block
            :role: img
            :aria-label: King of hearts

         Click any card to turn it over. You can also focus a card with Tab and press Enter or Space.

         .. tp-cluster::

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Ace of hearts

               recto
                  :inline-tp-icon-1:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-2:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Two of hearts

               recto
                  :inline-tp-icon-3:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-4:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Three of hearts

               recto
                  :inline-tp-icon-5:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-6:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Four of hearts

               recto
                  :inline-tp-icon-7:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-8:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Five of hearts

               recto
                  :inline-tp-icon-9:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-10:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Six of hearts

               recto
                  :inline-tp-icon-11:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-12:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Seven of hearts

               recto
                  :inline-tp-icon-13:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-14:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Eight of hearts

               recto
                  :inline-tp-icon-15:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-16:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Nine of hearts

               recto
                  :inline-tp-icon-17:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-18:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Ten of hearts

               recto
                  :inline-tp-icon-19:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-20:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Jack of hearts

               recto
                  :inline-tp-icon-21:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-22:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: Queen of hearts

               recto
                  :inline-tp-icon-23:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-24:`icon`

            .. tp-flip-card::
               :button-position: none
               :style: --tp-flip-card-padding: 0
               :aria-label: King of hearts

               recto
                  :inline-tp-icon-25:`icon`

               verso
                  .. tp-center::
                     :intrinsic:
                     :style: height: 100%; justify-content: center

                     :inline-tp-icon-26:`icon`
