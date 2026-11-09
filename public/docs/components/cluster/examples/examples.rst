.. tp-restructuredtext-viewer::
   :label: tp-cluster
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-box::

            .. tp-cluster::
               :justify: center
               :gap: 0.5rem

               .. tp-button::

                  Alpha

               .. tp-button::

                  Beta

               .. tp-button::

                  Gamma

      .. example:: Space between

         .. tp-box::

            .. tp-cluster::
               :justify: space-between

               .. tp-badge::

                  Start

               .. tp-badge::

                  End

      .. example:: Wrapping items

         .. tp-box::
            :style: max-inline-size: 16rem

            .. tp-cluster::
               :gap: 0.5rem

               .. tp-button::

                  One

               .. tp-button::

                  Two

               .. tp-button::

                  Three

               .. tp-button::

                  Four
