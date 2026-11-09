.. tp-restructuredtext-viewer::
   :label: tp-badge
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. role:: example-tp-badge-1(tp-badge)
            :variant: success
            :pulse:

         Build status: :example-tp-badge-1:`Ready`

      .. example:: With icon

         .. role:: example-tp-icon-1(tp-icon)
            :name: file_type_vite
            :library: languages

         .. tp-badge::
            :outlined:

            :example-tp-icon-1:`file_type_vite` Vite

            .. tp-divider::
               :orientation: vertical

            8.1.5

      .. example:: Status labels

         .. tp-badge::
            :variant: success

            Complete

         .. tp-badge::
            :variant: warning

            Pending
