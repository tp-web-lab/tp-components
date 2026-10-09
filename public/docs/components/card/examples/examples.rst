.. tp-restructuredtext-viewer::
   :label: tp-card
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-card::

            header
               content header

            footer
               content footer

            main
               content body

      .. example:: Image card

         .. tp-card::

            main
               .. image:: https://images.unsplash.com/photo-1559209172-0ff8f6d49ff7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80
                  :alt: Seashore

      .. example:: Icon card

         .. role:: inline-tp-icon-1(tp-icon)
            :name: logo-tp-components
            :size: 5em

         .. tp-card::

            main
               :inline-tp-icon-1:`icon`
