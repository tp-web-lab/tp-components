.. tp-restructuredtext-viewer::
   :label: tp-slider
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::
            :style: max-inline-size: 28rem

            .. tp-slider::
               :scrollbar:
               :item-width: 10rem
               :gap: 1rem

               .. tp-box::

                  First

               .. tp-box::

                  Second

               .. tp-box::

                  Third

               .. tp-box::

                  Fourth

      .. example:: Image gallery

         .. role:: example-img-1(img)
            :src: /docs/medias/images/canoe.svg
            :alt: A red canoe on blue water
            :width: 160
            :height: 160

         .. role:: example-img-2(img)
            :src: /docs/medias/images/basketball.svg
            :alt: An orange basketball
            :width: 160
            :height: 160

         .. role:: example-img-3(img)
            :src: /docs/medias/images/walking-shoe.svg
            :alt: A walking shoe
            :width: 160
            :height: 160

         .. role:: example-img-4(img)
            :src: /docs/medias/images/lightsaber.svg
            :alt: A lightsaber
            :width: 160
            :height: 160

         Browse the illustrations by scrolling horizontally. Press Tab to focus the gallery, then use Left/Right Arrow, Home or End.

         .. tp-box::
            :style: max-inline-size: 32rem

            .. tp-slider::
               :scrollbar:
               :item-width: 14rem
               :gap: 1rem
               :aria-label: Illustration gallery

               .. tp-box::

                  .. tp-stack::
                     :style: --stack-gap: 0.5rem

                     :example-img-1:`…`

                     Canoe

               .. tp-box::

                  .. tp-stack::
                     :style: --stack-gap: 0.5rem

                     :example-img-2:`…`

                     Basketball

               .. tp-box::

                  .. tp-stack::
                     :style: --stack-gap: 0.5rem

                     :example-img-3:`…`

                     Walking shoe

               .. tp-box::

                  .. tp-stack::
                     :style: --stack-gap: 0.5rem

                     :example-img-4:`…`

                     Lightsaber
