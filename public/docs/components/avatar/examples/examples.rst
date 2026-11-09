.. tp-restructuredtext-viewer::
   :label: tp-avatar
   :allow-script:

   .. script::
      :type: tp/restructuredtext

      .. example:: Basic usage

         .. tp-cluster::

            .. tp-avatar::
               :src: /docs/medias/logos/logo-tp.svg
               :label: tp-components

            .. tp-avatar::
               :initials: AL
               :label: Ada Lovelace

            .. tp-avatar::
               :icon: user
               :shape: square
               :label: Guest

      .. example:: Initials fallback

         .. tp-avatar::
            :initials: AL
            :label: Ada Lovelace
